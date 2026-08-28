let audioContext = null;

const ayanokojiVoice = document.getElementById('ayanokoji-voice');
const voiceIndicator = document.getElementById('voice-indicator');

// ✅ صوت أيانوكوجي 20%
if (ayanokojiVoice) ayanokojiVoice.volume = 0.20;

function initAudioContext() {
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {}
    }
}

// ✅ صوت حركة القطعة (20%)
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

// ✅ صوت أيانوكوجي مع المؤشر البصري
function playAyanokojiVoice() {
    if (ayanokojiVoice) {
        ayanokojiVoice.currentTime = 0;
        
        // إظهار الخطوط المتحركة
        if (voiceIndicator) voiceIndicator.classList.add('active');
        
        ayanokojiVoice.play().catch(err => {
            if (voiceIndicator) voiceIndicator.classList.remove('active');
        });
        
        // إخفاء الخطوط عند الانتهاء
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

document.addEventListener('click', function() { initAudioContext(); }, { once: true });
document.addEventListener('touchstart', function() { initAudioContext(); }, { once: true });

window.playMoveSound = playMoveSound;
window.playAyanokojiVoice = playAyanokojiVoice;
window.resetAyanokojiVoice = resetAyanokojiVoice;
