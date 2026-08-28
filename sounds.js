// ==========================================
// نظام إدارة الأصوات (موسيقى رقمية هادئة + توازن صوتي مثالي)
// ==========================================

let audioContext = null;
let bgMusicStarted = false;
let bgMusicNodes = [];

const ayanokojiVoice = document.getElementById('ayanokoji-voice');
const voiceIndicator = document.getElementById('voice-indicator');

// ✅ ضبط مستويات الصوت (تم التعديل ليكون صوت أيانوكوجي أوضح)
if (ayanokojiVoice) ayanokojiVoice.volume = 0.35; // رفعنا الصوت إلى 35% ليكون واضحاً وفخماً

function initAudioContext() {
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)());
        } catch (e) {}
    }
}

// ==========================================
// 🎵 موسيقى خلفية رقمية هادئة (12% فقط)
// ==========================================
function startBgMusic() {
    if (bgMusicStarted || !audioContext) return;
    
    // Gain رئيسي - 12% فقط (خافت جداً لكي لا يغطي على صوت أيانوكوجي)
    const masterGain = audioContext.createGain();
    masterGain.gain.value = 0.12; 
    masterGain.connect(audioContext.destination);
    
    // فلتر تمرير منخفض (يجعل الصوت دافئاً وهادئاً جداً)
    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    filter.Q.value = 0.7;
    filter.connect(masterGain);
    
    // نغمة 1: C2 (65.41 Hz) - عميقة
    const osc1 = audioContext.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 65.41;
    const gain1 = audioContext.createGain();
    gain1.gain.value = 0.5;
    osc1.connect(gain1); gain1.connect(filter); osc1.start();
    bgMusicNodes.push(osc1);
    
    // نغمة 2: G2 (98 Hz) - خامسة
    const osc2 = audioContext.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 98;
    const gain2 = audioContext.createGain();
    gain2.gain.value = 0.4;
    osc2.connect(gain2); gain2.connect(filter); osc2.start();
    bgMusicNodes.push(osc2);
    
    // نغمة 3: E3 (164.81 Hz) - ثالثة
    const osc3 = audioContext.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.value = 164.81;
    const gain3 = audioContext.createGain();
    gain3.gain.value = 0.2;
    osc3.connect(gain3); gain3.connect(filter); osc3.start();
    bgMusicNodes.push(osc3);
    
    // تغيير بطيء جداً (كل 30 ثانية) لإعطاء شعور بالحياة
    const now = audioContext.currentTime;
    osc3.frequency.setValueAtTime(164.81, now);
    osc3.frequency.linearRampToValueAtTime(196, now + 30);
    osc3.frequency.linearRampToValueAtTime(164.81, now + 60);
    
    bgMusicStarted = true;
    console.log('🎵 تم تشغيل الموسيقى الخلفية (مستوى منخفض 12%)');
}

function stopBgMusic() {
    if (bgMusicNodes.length > 0) {
        bgMusicNodes.forEach(node => { try { node.stop(); } catch(e) {} });
        bgMusicNodes = [];
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
