// ==========================================
// ملف إدارة شاشات البداية والنهاية (كامل)
// ==========================================

// المتغيرات العامة
let playerColor = 'w';
let gameStarted = false;

// ألوان البيدق في شاشة البداية
const pawnColors = [
    'rgba(200, 200, 200, 0.6)',   // رمادي
    'rgba(255, 255, 255, 0.4)',   // أبيض شفاف
    'rgba(0, 0, 0, 0.6)',         // أسود
    'rgba(255, 255, 255, 0.8)'    // أبيض ساطع
];

// SVG للبيدق
const pawnSVG = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="COLOR" stroke="STROKE" stroke-width="1.5"/></svg>';

// تغيير لون البيدق عشوائياً كل 3 ثوانٍ
function changePawnColor() {
    const randomColor = pawnColors[Math.floor(Math.random() * pawnColors.length)];
    const strokeColor = randomColor.includes('0, 0, 0') ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)';
    
    const svg = pawnSVG.replace(/COLOR/g, randomColor).replace(/STROKE/g, strokeColor);
    $('#start-pawn').css('background-image', `url('${svg}')`);
}

// بدء تغيير الألوان فوراً
setInterval(changePawnColor, 3000);
changePawnColor();

// النقر على شاشة البداية
$('#start-screen').on('click', function() {
    if (!gameStarted) {
        $(this).fadeOut(300, function() {
            $('#color-selection').fadeIn(300);
        });
    }
});

// اختيار اللون الأبيض
$('#white-option').on('click', function() {
    startGame('w');
});

// اختيار اللون الأسود
$('#black-option').on('click', function() {
    startGame('b');
});

// بدء اللعبة
function startGame(color) {
    playerColor = color;
    gameStarted = true;
    
    $('#color-selection').fadeOut(300, function() {
        $('#board-container').fadeIn(300);
        $('#ayanokoji-profile').fadeIn(300);
        
        // إعادة ضبط اللعبة وتوجيه الرقعة
        if (typeof game !== 'undefined' && typeof board !== 'undefined') {
            game.reset();
            
            // ✅ توجيه الرقعة: إذا اختار 'w' تكون البيضاء في الأسفل، وإذا اختار 'b' تكون السوداء في الأسفل
            board.orientation(color === 'w' ? 'white' : 'black');
            
            board.start();
            
            if (typeof removeMoveIndicators === 'function') {
                removeMoveIndicators();
            }
        }
        
        // إذا كان اللاعب يلعب بالأسود، أيانوكوجي (الأبيض) يبدأ اللعب أولاً
        if (playerColor === 'b') {
            setTimeout(function() {
                if (typeof game !== 'undefined' && !game.game_over()) {
                    makeAyanokojiMove();
                }
            }, 1000);
        }
    });
}

// إظهار شاشة النهاية
function showEndScreen(result) {
    const $endScreen = $('#end-screen');
    const $endTitle = $('#end-title');
    const $endQuote = $('#end-quote');
    
    $endScreen.removeClass('win draw loss');
    
    const quotes = {
        win: {
            title: 'لقد ترك أيانوكوجي تفوز هذه المرة',
            quote: 'كل الناس محض أدوات، لا تهم الطريقة، لا يهم من يجب التضحية به، في هذا العالم الفوز هو كل شيء، طالما أفوز في النهاية'
        },
        draw: {
            title: 'لقد تعادلت مع أيانوكوجي في هذا الدور',
            quote: 'هل البشر متساوون؟ قال رجل عظيم ذات مرة: "السماء لا تضع شخصاً فوق آخر أو أسفل الآخر"'
        },
        loss: {
            title: 'لقد خسرت',
            quote: 'لا تيأس إذا رجعت خطوة للوراء، فلا تنس أن السهم يحتاج أن ترجعه للوراء لينطلق بقوة إلى الأمام'
        }
    };
    
    const data = quotes[result];
    $endTitle.text(data.title);
    $endQuote.text(data.quote);
    $endScreen.addClass(result);
    
    $endScreen.fadeIn(400);
}

// النقر على شاشة النهاية للعودة للبداية
$('#end-screen').on('click', function() {
    $(this).fadeOut(300, function() {
        $('#start-screen').fadeIn(300);
        $('#board-container').hide();
        $('#ayanokoji-profile').hide();
        gameStarted = false;
        
        if (typeof game !== 'undefined' && typeof board !== 'undefined') {
            game.reset();
            board.start();
            if (typeof removeMoveIndicators === 'function') removeMoveIndicators();
        }
    });
});
