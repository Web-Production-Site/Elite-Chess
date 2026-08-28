// ==========================================
// نظام إدارة الأصوات - مع فيديو خلفية ومؤشر صوتي
// ==========================================

let audioContext = null;
let bgVideoStarted = false;

// عناصر الصوت
const ayanokojiVoice = document.getElementById('ayanokoji-voice');
const bgAudioVideo = document.getElementById('bg-audio-video');
const voiceIndicator = document.getElementById('voice-indicator');

// ✅ ضبط مستويات الصوت
if (ayanokojiVoice) ayanokojiVoice.volume = 0.18; // 18%
if (bgAudioVideo) bgAudioVideo.volume = 0.2; // 20%

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
// تشغيل فيديو الخلفية كصوت
// ==========================================
function startBgMusic() {
    if (bgVideoStarted || !bgAudioVideo) return;
    
    bgAudioVideo.play().then(() => {
        bgVideoStarted = true;
        console.log('تم تشغيل صوت الخلفية من الفيديو');
    }).catch(err => {
        console.log('تعذر تشغيل فيديو الخلفية:', err);
    });
}

function stopBgMusic() {
    if (bgAudioVideo) {
        bgAudioVideo.pause();
        bgVideoStarted = false;
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
// ✅ صوت أيانوكوجي مع مؤشر بصري
// ==========================================
function playAyanokojiVoice() {
    if (ayanokojiVoice) {
        ayanokojiVoice.currentTime = 0;
        
        // ✅ إظهار مؤشر الصوت المتحرك
        if (voiceIndicator) voiceIndicator.classList.add('active');
        
        ayanokojiVoice.play().then(() => {
            console.log('بدأ صوت أيانوكوجي');
        }).catch(err => {
            console.log('تعذر تشغيل صوت أيانوكوجي:', err);
            // إخفاء المؤشر إذا فشل التشغيل
            if (voiceIndicator) voiceIndicator.classList.remove('active');
        });
        
        // ✅ إخفاء المؤشر عند انتهاء الصوت
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
    // ✅ إخفاء المؤشر عند إعادة التعيين
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
