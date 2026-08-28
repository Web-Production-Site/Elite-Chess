// ==========================================
// نظام إدارة الأصوات
// ==========================================

let audioContext = null;
let bgMusicStarted = false;

// عناصر الصوت
const bgMusic = document.getElementById('bg-music');
const ayanokojiVoice = document.getElementById('ayanokoji-voice');
const voiceIndicator = document.getElementById('voice-indicator');

// ✅ ضبط مستويات الصوت
if (bgMusic) bgMusic.volume = 0.45;       // 45% لموسيقى الخلفية
if (ayanokojiVoice) ayanokojiVoice.volume = 0.20; // 20% لصوت أيانوكوجي

// ==========================================
// تهيئة AudioContext (لصوت الحركة)
// ==========================================
function initAudioContext() {
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API غير مدعوم');
        }
    }
}

// ==========================================
// تشغيل موسيقى الخلفية
// ==========================================
function startBgMusic() {
    if (bgMusicStarted || !bgMusic) return;
    
    bgMusic.play().then(() => {
        bgMusicStarted = true;
        console.log('تم تشغيل موسيقى الخلفية');
    }).catch(err => {
        console.log('انتظار تفاعل المستخدم لتشغيل الموسيقى:', err);
    });
}

function stopBgMusic() {
    if (bgMusic) {
        bgMusic.pause();
        bgMusic.currentTime = 0;
        bgMusicStarted = false;
    }
}

// ==========================================
// صوت حركة القطعة - 20%
// ==========================================
function playMoveSound() {
    initAudioContext();
    if (!audioContext) return;
    
    const now = audioContext.currentTime;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(200, now);
    oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.05);
    
    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start(now);
    oscillator.stop(now + 0.08);
}

// ==========================================
// صوت أيانوكوجي مع المؤشر البصري
// ==========================================
function playAyanokojiVoice() {
    if (ayanokojiVoice) {
        ayanokojiVoice.currentTime = 0;
        
        // ✅ إظهار الخطوط المتحركة تحت الصورة
        if (voiceIndicator) voiceIndicator.classList.add('active');
        
        ayanokojiVoice.play().then(() => {
            console.log('بدأ صوت أيانوكوجي');
        }).catch(err => {
            console.log('تعذر تشغيل صوت أيانوكوجي:', err);
            if (voiceIndicator) voiceIndicator.classList.remove('active');
        });
        
        // ✅ إخفاء الخطوط عند انتهاء الصوت
        ayanokojiVoice.onended = function() {
            if (voiceIndicator) voiceIndicator.classList.remove('active');
            console.log('انتهى صوت أيانوكوجي');
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

// تشغيل الموسيقى عند أول تفاعل
document.addEventListener('click', function() {
    initAudioContext();
    startBgMusic();
}, { once: true });

document.addEventListener('touchstart', function() {
    initAudioContext();
    startBgMusic();
}, { once: true });

// تصدير الدوال
window.startBgMusic = startBgMusic;
window.stopBgMusic = stopBgMusic;
window.playMoveSound = playMoveSound;
window.playAyanokojiVoice = playAyanokojiVoice;
window.resetAyanokojiVoice = resetAyanokojiVoice;
