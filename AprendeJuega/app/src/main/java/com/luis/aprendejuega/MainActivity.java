package com.luis.aprendejuega;

import android.Manifest;
import android.app.Activity;
import android.content.ContentValues;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.speech.tts.TextToSpeech;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.webkit.WebViewAssetLoader;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Locale;

/**
 * Aprende y Juega: la app completa vive en assets/ (HTML + JavaScript) y se muestra en un WebView.
 * Esta clase solo agrega lo que el WebView no trae: guardar archivos, leer en voz alta (español e inglés),
 * reconocer la voz del niño para Teacher Owl y pedir el permiso del micrófono.
 */
public class MainActivity extends Activity {

    private static final String HOST = "appassets.androidplatform.net";
    private static final int REQ_MIC = 7;
    private static final int REQ_MIC_VOZ = 8;

    private WebView web;
    private TextToSpeech tts;
    private boolean ttsListo = false;
    private PermissionRequest pendingMic;
    private SpeechRecognizer reconocedor;
    private String idiomaPendiente;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        web = new WebView(this);
        setContentView(web);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(false);

        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
                .setDomain(HOST)
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return loader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri u = request.getUrl();
                if (HOST.equals(u.getHost())) return false;
                try {
                    startActivity(new Intent(Intent.ACTION_VIEW, u));
                } catch (Exception ignored) {
                }
                return true;
            }
        });

        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(final PermissionRequest request) {
                runOnUiThread(() -> {
                    if (checkSelfPermission(Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED) {
                        request.grant(new String[]{PermissionRequest.RESOURCE_AUDIO_CAPTURE});
                    } else {
                        pendingMic = request;
                        requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, REQ_MIC);
                    }
                });
            }

            // Los enlaces con target="_blank" llegan aquí: abrirlos en el navegador del teléfono
            @Override
            public boolean onCreateWindow(WebView view, boolean isDialog, boolean isUserGesture, android.os.Message resultMsg) {
                WebView.HitTestResult r = view.getHitTestResult();
                String url = r != null ? r.getExtra() : null;
                if (url != null) {
                    try {
                        startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
                    } catch (Exception ignored) {
                    }
                }
                return false;
            }
        });
        s.setSupportMultipleWindows(true);

        tts = new TextToSpeech(this, status -> {
            if (status == TextToSpeech.SUCCESS) {
                ttsListo = true;
                ponerIdioma("es-CO");
                tts.setSpeechRate(0.95f);
            }
        });

        web.addJavascriptInterface(new Bridge(), "Android");
        web.loadUrl("https://" + HOST + "/assets/index.html");
    }

    private void ponerIdioma(String tag) {
        if (tts == null || !ttsListo) return;
        Locale l = Locale.forLanguageTag(tag);
        int r = tts.setLanguage(l);
        if (r < 0) tts.setLanguage(new Locale(l.getLanguage()));
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        boolean ok = grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED;
        if (requestCode == REQ_MIC && pendingMic != null) {
            if (ok) pendingMic.grant(new String[]{PermissionRequest.RESOURCE_AUDIO_CAPTURE});
            else pendingMic.deny();
            pendingMic = null;
        } else if (requestCode == REQ_MIC_VOZ) {
            if (ok && idiomaPendiente != null) escuchar(idiomaPendiente);
            else enviarError("Necesito permiso del micrófono para escucharte");
            idiomaPendiente = null;
        }
    }

    // ---------- Reconocimiento de voz para Teacher Owl ----------

    private void escuchar(String idioma) {
        if (checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            idiomaPendiente = idioma;
            requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, REQ_MIC_VOZ);
            return;
        }
        if (!SpeechRecognizer.isRecognitionAvailable(this)) {
            enviarError("Tu teléfono no tiene reconocimiento de voz");
            return;
        }
        if (tts != null) tts.stop();
        if (reconocedor != null) reconocedor.destroy();
        reconocedor = SpeechRecognizer.createSpeechRecognizer(this);
        reconocedor.setRecognitionListener(new RecognitionListener() {
            @Override public void onReadyForSpeech(Bundle params) { }
            @Override public void onBeginningOfSpeech() { }
            @Override public void onRmsChanged(float rmsdB) { }
            @Override public void onBufferReceived(byte[] buffer) { }
            @Override public void onEndOfSpeech() { }
            @Override public void onPartialResults(Bundle partialResults) { }
            @Override public void onEvent(int eventType, Bundle params) { }

            @Override
            public void onError(int error) {
                String msg;
                switch (error) {
                    case SpeechRecognizer.ERROR_NO_MATCH:
                    case SpeechRecognizer.ERROR_SPEECH_TIMEOUT:
                        msg = "No te escuché bien";
                        break;
                    case SpeechRecognizer.ERROR_NETWORK:
                    case SpeechRecognizer.ERROR_NETWORK_TIMEOUT:
                        msg = "Se necesita internet para escucharte";
                        break;
                    case SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS:
                        msg = "Falta el permiso del micrófono";
                        break;
                    default:
                        msg = "No te escuché bien";
                }
                enviarError(msg);
            }

            @Override
            public void onResults(Bundle results) {
                ArrayList<String> lista = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                JSONArray arr = new JSONArray();
                if (lista != null) for (String x : lista) arr.put(x);
                String js = "window.onVozResultado && window.onVozResultado(" + JSONObject.quote(arr.toString()) + ")";
                web.evaluateJavascript(js, null);
            }
        });
        Intent i = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        i.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        i.putExtra(RecognizerIntent.EXTRA_LANGUAGE, idioma);
        i.putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, idioma);
        i.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 5);
        i.putExtra(RecognizerIntent.EXTRA_CALLING_PACKAGE, getPackageName());
        reconocedor.startListening(i);
    }

    private void enviarError(String msg) {
        web.evaluateJavascript("window.onVozError && window.onVozError(" + JSONObject.quote(msg) + ")", null);
    }

    @Override
    public void onBackPressed() {
        web.evaluateJavascript("window.onAndroidBack ? window.onAndroidBack() : false", value -> {
            if (!"true".equals(value)) MainActivity.super.onBackPressed();
        });
    }

    @Override
    protected void onDestroy() {
        if (reconocedor != null) reconocedor.destroy();
        if (tts != null) tts.shutdown();
        web.destroy();
        super.onDestroy();
    }

    /** Funciones que la página puede llamar como Android.saveFile(...), Android.speak(...), Android.listen(...). */
    private class Bridge {

        @JavascriptInterface
        public String saveFile(String base64, String name, String mime) {
            try {
                byte[] bytes = Base64.decode(base64, Base64.DEFAULT);
                boolean image = mime.startsWith("image/");
                if (Build.VERSION.SDK_INT >= 29) {
                    ContentValues v = new ContentValues();
                    v.put(MediaStore.MediaColumns.DISPLAY_NAME, name);
                    v.put(MediaStore.MediaColumns.MIME_TYPE, mime);
                    v.put(MediaStore.MediaColumns.RELATIVE_PATH, (image ? Environment.DIRECTORY_PICTURES : Environment.DIRECTORY_MUSIC) + "/AprendeYJuega");
                    Uri collection = image ? MediaStore.Images.Media.EXTERNAL_CONTENT_URI : MediaStore.Audio.Media.EXTERNAL_CONTENT_URI;
                    Uri uri = getContentResolver().insert(collection, v);
                    if (uri == null) return "No se pudo guardar";
                    try (OutputStream os = getContentResolver().openOutputStream(uri)) {
                        os.write(bytes);
                    }
                    return (image ? "Guardado en Galería › Pictures/AprendeYJuega" : "Guardado en Música › AprendeYJuega") + ": " + name;
                } else {
                    File dir = getExternalFilesDir(image ? Environment.DIRECTORY_PICTURES : Environment.DIRECTORY_MUSIC);
                    File f = new File(dir, name);
                    try (FileOutputStream os = new FileOutputStream(f)) {
                        os.write(bytes);
                    }
                    return "Guardado: " + f.getAbsolutePath();
                }
            } catch (Exception e) {
                return "No se pudo guardar: " + e.getMessage();
            }
        }

        @JavascriptInterface
        public void speak(String text) {
            hablar(text, "es-CO", 0.95f);
        }

        /** Lee en otro idioma, por ejemplo "en-US" para Teacher Owl. velocidad: 0.6 lento, 0.9 normal. */
        @JavascriptInterface
        public void speakLang(String text, String idioma, float velocidad) {
            hablar(text, idioma, velocidad);
        }

        @JavascriptInterface
        public void stopSpeak() {
            if (tts != null) tts.stop();
        }

        @JavascriptInterface
        public boolean canListen() {
            return SpeechRecognizer.isRecognitionAvailable(MainActivity.this);
        }

        @JavascriptInterface
        public void listen(String idioma) {
            runOnUiThread(() -> escuchar(idioma));
        }

        private void hablar(String text, String idioma, float velocidad) {
            if (tts == null || text == null) return;
            tts.stop();
            ponerIdioma(idioma);
            tts.setSpeechRate(velocidad);
            // TextToSpeech tiene un límite por frase; se divide por oraciones
            String[] parts = text.split("(?<=[.!?])\\s+");
            for (int i = 0; i < parts.length; i++) {
                tts.speak(parts[i], i == 0 ? TextToSpeech.QUEUE_FLUSH : TextToSpeech.QUEUE_ADD, null, "p" + i);
            }
        }
    }
}
