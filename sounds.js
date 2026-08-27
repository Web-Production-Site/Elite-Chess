// ==========================================
// نظام إدارة الأصوات - صوت حركة خفيف جداً
// ==========================================

let audioContext = null;

// عناصر الصوت
const ayanokojiVoice = document.getElementById('ayanokoji-voice');
if (ayanokojiVoice) ayanokojiVoice.volume = 0.19; // 19%

// ==========================================
// تهيئة AudioContext
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
// صوت حركة القطعة - خفيف جداً
// ==========================================
function playMoveSound() {
    initAudioContext();
    if (!audioContext) return;
    
    const now = audioContext.currentTime;
    
    // 1. النقرة الخشبية (خفيفة جداً)
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine'; // تغيير إلى sine ليكون أنعم
    oscillator.frequency.setValueAtTime(200, now);
    oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.05);
    
    // ✅ تخفيض شديد
    gainNode.gain.setValueAtTime(0.02, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start(now);
    oscillator.stop(now + 0.08);
}

// ==========================================
// صوت أيانوكوجي
// ==========================================
function playAyanokojiVoice() {
    if (ayanokojiVoice) {
        ayanokojiVoice.currentTime = 0;
        ayanokojiVoice.play().catch(err => {
            console.log('تعذر تشغيل صوت أيانوكوجي:', err);
        });
    }
}

function resetAyanokojiVoice() {
    if (ayanokojiVoice) {
        ayanokojiVoice.pause();
        ayanokojiVoice.currentTime = 0;
    }
}

// تهيئة AudioContext عند أول تفاعل
document.addEventListener('click', function() {
    initAudioContext();
}, { once: true });

document.addEventListener('touchstart', function() {
    initAudioContext();
}, { once: true });

// تصدير الدوال
window.playMoveSound = playMoveSound;
window.playAyanokojiVoice = playAyanokojiVoice;
window.resetAyanokojiVoice = resetAyanokojiVoice;
