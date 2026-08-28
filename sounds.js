// ==========================================
// نظام إدارة الأصوات (نسخة التشخيص والإصلاح)
// ==========================================

const bgMusic = document.getElementById('bg-music');
const ayanokojiVoice = document.getElementById('ayanokoji-voice');
const voiceIndicator = document.getElementById('voice-indicator');
let audioContext = null;

// 1. فحص وجود الملف وإعداد الصوت
if (bgMusic) {
    bgMusic.volume = 0.28; // 28%
    console.log("✅ تم العثور على عنصر الموسيقى في HTML.");
} else {
    console.error("❌ خطأ فادح: لم يتم العثور على <audio id='bg-music'> في index.html");
}

if (ayanokojiVoice) {
    ayanokojiVoice.volume = 0.20; // 20%
}

function initAudioContext() {
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {}
    }
}

// 2. دالة التشغيل القسلية مع تقرير الأخطاء
function forcePlayMusic() {
    if (!bgMusic) return;
    
    console.log("🔄 جاري محاولة تشغيل الموسيقى...");
    
    bgMusic.play().then(() => {
        console.log("🎉 نجاح! موسيقى الخلفية تعمل الآن.");
    }).catch(error => {
        console.error("⛔ فشل تشغيل الموسيقى. التفاصيل:", error);
        console.error("💡 الحل: تأكد أن اسم الملف في GitHub هو 'bg-music.mp3' بحروف صغيرة تماماً (لا يوجد B كبيرة).");
    });
}

// 3. ربط التشغيل بكل أنواع النقر الممكنة لضمان العمل
document.addEventListener('click', function() {
    initAudioContext();
    forcePlayMusic();
}, { once: true });

document.addEventListener('touchstart', function() {
    initAudioContext();
    forcePlayMusic();
}, { once: true });

// محاولة إضافية عند تحميل الصفحة (قد تنجح في بعض المتصفحات)
window.addEventListener('load', () => {
    setTimeout(forcePlayMusic, 1500);
});

// ==========================================
// باقي وظائف الصوت (حركة القطع وأياناتكوجي)
// ==========================================

function playMoveSound() {
    initAudioContext();
    if (!audioContext) return;
    const now = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start(now);
    osc.stop(now + 0.08);
}

function playAyanokojiVoice() {
    if (ayanokojiVoice) {
        ayanokojiVoice.currentTime = 0;
        if (voiceIndicator) voiceIndicator.classList.add('active');
        ayanokojiVoice.play().catch(() => {
            if (voiceIndicator) voiceIndicator.classList.remove('active');
        });
        ayanokojiVoice.onended = () => {
            if (voiceIndicator) voiceIndicator.classList.remove('active');
        };
    }
}

function resetAyanokojiVoice() {
    if (ayanokojiVoice) {
        ayanokojiVoice.pause();
        ayanokojiVoice.currentTime = 0;
    }
    if (voiceIndicator) voiceIndicator.classList.remove('active');
}

window.playMoveSound = playMoveSound;
window.playAyanokojiVoice = playAyanokojiVoice;
window.resetAyanokojiVoice = resetAyanokojiVoice;
