// ==========================================
// نظام إدارة الأصوات
// ==========================================

// المتغيرات
let bgMusicStarted = false;
let ayanokojiVoicePlayed = false;

// عناصر الصوت
const bgMusic = document.getElementById('bg-music');
const moveSound = document.getElementById('move-sound');
const ayanokojiVoice = document.getElementById('ayanokoji-voice');

// ضبط مستوى الصوت
if (bgMusic) bgMusic.volume = 0.15; // 15% - صوت منخفض للخلفية
if (moveSound) moveSound.volume = 0.6; // 60% - صوت واضح للحركة
if (ayanokojiVoice) ayanokojiVoice.volume = 1.0; // 100% - صوت واضح لأيانوكوجي

// تشغيل موسيقى الخلفية
function startBgMusic() {
    if (!bgMusicStarted && bgMusic) {
        bgMusic.play().then(() => {
            bgMusicStarted = true;
        }).catch(err => {
            console.log('تعذر تشغيل الموسيقى تلقائياً:', err);
        });
    }
}

// إيقاف موسيقى الخلفية
function stopBgMusic() {
    if (bgMusic) {
        bgMusic.pause();
        bgMusic.currentTime = 0;
        bgMusicStarted = false;
    }
}

// تشغيل صوت الحركة
function playMoveSound() {
    if (moveSound) {
        moveSound.currentTime = 0; // إعادة من البداية
        moveSound.play().catch(err => {
            console.log('تعذر تشغيل صوت الحركة:', err);
        });
    }
}

// تشغيل صوت أيانوكوجي (مرة واحدة فقط في المباراة)
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

// إعادة ضبط صوت أيانوكوجي للمباراة الجديدة
function resetAyanokojiVoice() {
    ayanokojiVoicePlayed = false;
    if (ayanokojiVoice) {
        ayanokojiVoice.pause();
        ayanokojiVoice.currentTime = 0;
    }
}

// تشغيل جميع الأصوات عند أول تفاعل من المستخدم
document.addEventListener('click', function() {
    startBgMusic();
}, { once: true });

document.addEventListener('touchstart', function() {
    startBgMusic();
}, { once: true });

// تصدير الدوال للاستخدام في الملفات الأخرى
window.startBgMusic = startBgMusic;
window.stopBgMusic = stopBgMusic;
window.playMoveSound = playMoveSound;
window.playAyanokojiVoice = playAyanokojiVoice;
window.resetAyanokojiVoice = resetAyanokojiVoice;
