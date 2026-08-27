// ==========================================
// نظام إدارة الأصوات - مع موسيقى خلفية رقمية
// ==========================================

// المتغيرات
let bgMusicStarted = false;
let ayanokojiVoicePlayed = false;
let audioContext = null;
let bgMusicOscillators = [];
let bgMusicGain = null;

// عناصر الصوت (صوت أيانوكوجي فقط - يحتاج ملف)
const ayanokojiVoice = document.getElementById('ayanokoji-voice');

// ضبط مستوى الصوت
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
    
    // 1. النقرة الأساسية (خشبية)
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(180, now);
    oscillator.frequency.exponentialRampToValueAtTime(80, now + 0.08);
    
    gainNode.gain.setValueAtTime(0.4, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start(now);
    oscillator.stop(now + 0.1);
    
    // 2. ضوضاء بيضاء خفيفة
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
    
    noiseGain.gain.setValueAtTime(0.25, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audioContext.destination);
    
    noise.start(now);
    noise.stop(now + 0.05);
    
    // 3. رنين خفيف
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
// موسيقى خلفية رقمية هادئة للتركيز
// ==========================================
function startBgMusic() {
    if (bgMusicStarted) return;
    
    initAudioContext();
    if (!audioContext) return;
    
    // إنشاء gain رئيسي للموسيقى (مستوى منخفض جداً)
    bgMusicGain = audioContext.createGain();
    bgMusicGain.gain.value = 0.06; // 6% فقط - هادئ جداً
    bgMusicGain.connect(audioContext.destination);
    
    // إنشاء فلتر تمرير منخفض لجعل الصوت دافئاً
    const masterFilter = audioContext.createBiquadFilter();
    masterFilter.type = 'lowpass';
    masterFilter.frequency.value = 500; // تردد منخفض فقط
    masterFilter.Q.value = 1;
    masterFilter.connect(bgMusicGain);
    
    // النغمة الأولى: C2 (65.41 Hz) - عميقة جداً
    const osc1 = audioContext.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 65.41;
    
    const gain1 = audioContext.createGain();
    gain1.gain.value = 0.5;
    
    osc1.connect(gain1);
    gain1.connect(masterFilter);
    osc1.start();
    bgMusicOscillators.push(osc1);
    
    // النغمة الثانية: G2 (98.00 Hz) - خامسة
    const osc2 = audioContext.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 98.00;
    
    const gain2 = audioContext.createGain();
    gain2.gain.value = 0.3;
    
    osc2.connect(gain2);
    gain2.connect(masterFilter);
    osc2.start();
    bgMusicOscillators.push(osc2);
    
    // النغمة الثالثة: C3 (130.81 Hz) - أوكتاف أعلى
    const osc3 = audioContext.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.value = 130.81;
    
    const gain3 = audioContext.createGain();
    gain3.gain.value = 0.15;
    
    osc3.connect(gain3);
    gain3.connect(masterFilter);
    osc3.start();
    bgMusicOscillators.push(osc3);
    
    // تغيير بطيء جداً في التردد (drone effect)
    const now = audioContext.currentTime;
    osc1.frequency.setValueAtTime(65.41, now);
    osc1.frequency.linearRampToValueAtTime(65.41, now + 30); // ثابت
    
    osc2.frequency.setValueAtTime(98.00, now);
    osc2.frequency.linearRampToValueAtTime(98.00, now + 30); // ثابت
    
    // النغمة الثالثة تتغير ببطء شديد
    osc3.frequency.setValueAtTime(130.81, now);
    osc3.frequency.linearRampToValueAtTime(146.83, now + 15); // D3
    osc3.frequency.linearRampToValueAtTime(130.81, now + 30); // العودة لـ C3
    
    bgMusicStarted = true;
    console.log('تم تشغيل الموسيقى الخلفية');
}

function stopBgMusic() {
    if (bgMusicGain) {
        // fade out
        bgMusicGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);
        
        setTimeout(() => {
            bgMusicOscillators.forEach(osc => {
                try { osc.stop(); } catch(e) {}
            });
            bgMusicOscillators = [];
            bgMusicStarted = false;
        }, 1000);
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
