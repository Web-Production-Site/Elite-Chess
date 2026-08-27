// ==========================================
// نظام إدارة الأصوات - بدون موسيقى خلفية
// ==========================================

let audioContext = null;

// عناصر الصوت
const ayanokojiVoice = document.getElementById('ayanokoji-voice');
if (ayanokojiVoice) ayanokojiVoice.volume = 1.0;

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
    
    // 1. النقرة الخشبية (مخففة)
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(180, now);
    oscillator.frequency.exponentialRampToValueAtTime(80, now + 0.08);
    
    // ✅ تخفيض الصوت إلى 0.15 (كان 0.4)
    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start(now);
    oscillator.stop(now + 0.1);
    
    // 2. ضوضاء خفيفة (مخففة)
    const bufferSize = audioContext.sampleRate * 0.05;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    
    const noise = audioContext.createBufferSource();
    noise.buffer = noiseBuffer;
    
    const noiseGain = audioContext.createGain();
    const noiseFilter = audioContext.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 800;
    
    // ✅ تخفيض الصوت إلى 0.1 (كان 0.25)
    noiseGain.gain.setValueAtTime(0.1, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audioContext.destination);
    
    noise.start(now);
    noise.stop(now + 0.05);
    
    // 3. رنين خفيف جداً (مخفف)
    const ringOsc = audioContext.createOscillator();
    const ringGain = audioContext.createGain();
    
    ringOsc.type = 'sine';
    ringOsc.frequency.setValueAtTime(400, now + 0.02);
    ringOsc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
    
    // ✅ تخفيض الصوت إلى 0.04 (كان 0.08)
    ringGain.gain.setValueAtTime(0.04, now + 0.02);
    ringGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    
    ringOsc.connect(ringGain);
    ringGain.connect(audioContext.destination);
    
    ringOsc.start(now + 0.02);
    ringOsc.stop(now + 0.15);
}

// ==========================================
// صوت أيانوكوجي (يحتاج ملف صوتي حقيقي)
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
