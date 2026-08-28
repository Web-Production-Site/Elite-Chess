// ==========================================
// نظام إدارة الأصوات (النسخة المحصّنة النهائية)
// ==========================================

const bgMusic = document.getElementById('bg-music');
const ayanokojiVoice = document.getElementById('ayanokoji-voice');
const voiceIndicator = document.getElementById('voice-indicator');
let audioContext = null;

if (bgMusic) {
    bgMusic.volume = 0.28; // 28%
    console.log("✅ تم العثور على عنصر الموسيقى.");
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

// دالة التشغيل المحصّنة
function forcePlayMusic() {
    if (!bgMusic) return;
    
    console.log("🔄 جاري فرض تشغيل الموسيقى...");
    
    // إعادة تحميل الملف للتأكد من أنه ليس عالقاً في الذاكرة
    bgMusic.load(); 
    
    bgMusic.play().then(() => {
        console.log("🎉 نجاح! الموسيقى تعمل الآن.");
    }).catch(error => {
        console.error("⛔ فشل التشغيل. السبب:", error.name);
        if (error.name === 'NotAllowedError') {
            console.log("💡 المتصفح ينتظر نقرة أخرى. انقر في أي مكان.");
        } else if (error.name === 'NotSupportedError' || error.message.includes('404')) {
            console.error("❌ الملف غير موجود أو صيغته خاطئة. تأكد أن الاسم هو bg-music.mp3 بحروف صغيرة تماماً.");
        }
    });
}

// ربط التشغيل بكل أنواع النقر الممكنة
document.addEventListener('click', function() {
    initAudioContext();
    forcePlayMusic();
}, { once: true });

document.addEventListener('touchstart', function() {
    initAudioContext();
    forcePlayMusic();
}, { once: true });

// ==========================================
// باقي وظائف الصوت
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
