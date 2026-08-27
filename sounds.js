// ==========================================
// نظام إدارة الأصوات - مع صوت رقمي مصنوع
// ==========================================

// المتغيرات
let bgMusicStarted = false;
let ayanokojiVoicePlayed = false;
let audioContext = null;

// عناصر الصوت (موسيقى الخلفية وصوت أيانوكوجي فقط - يحتاجان ملفات)
const bgMusic = document.getElementById('bg-music');
const ayanokojiVoice = document.getElementById('ayanokoji-voice');

// ضبط مستوى الصوت
if (bgMusic) bgMusic.volume = 0.15; // 15% - صوت منخفض للخلفية
if (ayanokojiVoice) ayanokojiVoice.volume = 1.0; // 100% - صوت واضح لأيانوكوجي

// ==========================================
// صنع صوت حركة القطعة رقمياً (Wooden Click)
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

function playMoveSound() {
    initAudioContext();
    if (!audioContext) return;
    
    const now = audioContext.currentTime;
    
    // 1. النقرة الأساسية (خشبية) - تردد منخفض قصير
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'square'; // موجة مربعة تعطي صوتاً خشناً
    oscillator.frequency.setValueAtTime(180, now); // تردد منخفض (خشبي)
    oscillator.frequency.exponentialRampToValueAtTime(80, now + 0.08); // ينخفض بسرعة
    
    gainNode.gain.setValueAtTime(0.4, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1); // يضمحل بسرعة
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start(now);
    oscillator.stop(now + 0.1);
    
    // 2. ضوضاء بيضاء خفيفة (إحساس بالخشونة والاحتكاك)
    const bufferSize = audioContext.sampleRate * 0.05; // 50 ميلي ثانية
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
    noiseFilter.frequency.value = 800; // فلتر منخفض لإعطاء دفء للصوت
    
    noiseGain.gain.setValueAtTime(0.25, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audioContext.destination);
    
    noise.start(now);
    noise.stop(now + 0.05);
    
    // 3. رنين خفيف جداً (صدى الرقعة)
    const ringOsc = audioContext.createOscillator();
    const ringGain = audioContext.createGain();
    
    ringOsc.type = 'sine';
    ringOsc.frequency.setValueAtTime(400, now + 0.02);
    ringOsc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
    
    ringGain.gain.setValueAtTime(0.08, now + 0.02);
    ringGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    
    ringOsc.connect(ringGain);
    ringGain.connect(audioContext.destination);
    
    ringOsc.start(now + 0.02);
    ringOsc.stop(now + 0.15);
}

// ==========================================
// موسيقى الخلفية
// ==========================================
function startBgMusic() {
    if (!bgMusicStarted && bgMusic) {
        bgMusic.play().then(() => {
            bgMusicStarted = true;
        }).catch(err => {
            console.log('تعذر تشغيل الموسيقى تلقائياً:', err);
        });
    }
}

function stopBgMusic() {
    if (bgMusic) {
        bgMusic.pause();
        bgMusic.currentTime = 0;
        bgMusicStarted = false;
    }
}

// ==========================================
// صوت أيانوكوجي (يحتاج ملف صوتي حقيقي)
// ==========================================
function playAyanokojiVoice() {
    if (!ayanokojiVoicePlayed && ayanokojiVoice) {
        ayanokojiVoice.currentTime = 0;
        ayanokojiVoice.play().then(() => {
            ayanokojiVoicePlayed = true;
        }).catch(err => {
            console.log('تعذر تشغيل صوت أيانوكوجي:', err);
        });
    }
}

function resetAyanokojiVoice() {
    ayanokojiVoicePlayed = false;
    if (ayanokojiVoice) {
        ayanokojiVoice.pause();
        ayanokojiVoice.currentTime = 0;
    }
}

// تشغيل موسيقى الخلفية عند أول تفاعل
document.addEventListener('click', function() {
    initAudioContext(); // تهيئة الصوت الرقمي
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
