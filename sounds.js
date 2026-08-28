let audioContext = null;
let bgMusicStarted = false;

const bgMusic = document.getElementById('bg-music');
const ayanokojiVoice = document.getElementById('ayanokoji-voice');
const voiceIndicator = document.getElementById('voice-indicator');

// ✅ ضبط مستويات الصوت
if (bgMusic) bgMusic.volume = 0.28;           // 28% لموسيقى الخلفية
if (ayanokojiVoice) ayanokojiVoice.volume = 0.20; // 20% لصوت أيانوكوجي

function initAudioContext() {
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {}
    }
}

// ==========================================
// تشغيل موسيقى الخلفية (ملف MP3 خارجي)
// ==========================================
function startBgMusic() {
    if (bgMusicStarted || !bgMusic) return;
    
    bgMusic.play().then(() => {
        bgMusicStarted = true;
        console.log('تم تشغيل موسيقى الخلفية');
    }).catch(err => {
        console.log('انتظار تفاعل المستخدم:', err);
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
// صوت حركة القطعة (20%)
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
        
        if (voiceIndicator) voiceIndicator.classList.add('active');
        
        ayanokojiVoice.play().catch(err => {
            if (voiceIndicator) voiceIndicator.classList.remove('active');
        });
        
        ayanokojiVoice.onended = function() {
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

// تشغيل الموسيقى عند أول تفاعل
document.addEventListener('click', function() {
    initAudioContext();
    startBgMusic();
}, { once: true });

document.addEventListener('touchstart', function() {
    initAudioContext();
    startBgMusic();
}, { once: true });

window.startBgMusic = startBgMusic;
window.stopBgMusic = stopBgMusic;
window.playMoveSound = playMoveSound;
window.playAyanokojiVoice = playAyanokojiVoice;
window.resetAyanokojiVoice = resetAyanokojiVoice;
