var game = new Chess();
var selectedSquare = null;

var board = Chessboard('board-container', {
    draggable: true,
    position: 'start',
    pieceTheme: 'img/chesspieces/wikipedia/{piece}.png',
    
    onDragStart: function(source, piece) {
        if (game.game_over()) return false;
        if (piece.search(/^b/) !== -1) return false;
        removeMoveIndicators();
        selectedSquare = null;
        return true;
    },
    
    onDrop: function(source, target) {
        var move = game.move({
            from: source,
            to: target,
            promotion: 'q'
        });
        
        if (move === null) return 'snapback';
        
        removeMoveIndicators();
        selectedSquare = null;
        
        if (!game.game_over()) {
            setTimeout(makeAyanokojiMove, 300);
        }
    },
    
    onSnapEnd: function() {
        board.position(game.fen());
    }
});

// ====== النقر على المربعات: اختيار قطعة + تحريك بالنقر على نقاط الحركة ======
$(document).on('click', '.square-55d63', function(e) {
    // تجاهل النقر أثناء السحب
    if (board.dragging && board.dragging()) return;
    
    var square = $(this).data('square');
    if (!square) return;
    
    var piece = game.get(square);
    
    // 1. إذا نقرنا على نقطة حركة (مؤشر موجود) → حرّك القطعة المحددة
    if (selectedSquare && $(this).is('.move-normal, .move-capture, .move-castle')) {
        var move = game.move({
            from: selectedSquare,
            to: square,
            promotion: 'q'
        });
        
        if (move !== null) {
            board.position(game.fen());
            removeMoveIndicators();
            selectedSquare = null;
            
            if (!game.game_over()) {
                setTimeout(makeAyanokojiMove, 300);
            }
            return;
        }
    }
    
    // 2. إذا نقرنا على قطعة بيضاء → حددها واعرض حركاتها
    if (piece && piece.color === 'w') {
        if (selectedSquare === square) {
            // إلغاء التحديد عند النقر على نفس القطعة
            selectedSquare = null;
            removeMoveIndicators();
        } else {
            selectedSquare = square;
            showPossibleMoves(square);
        }
        return;
    }
    
    // 3. النقر في أي مكان آخر → إلغاء التحديد
    selectedSquare = null;
    removeMoveIndicators();
});

function showPossibleMoves(square) {
    removeMoveIndicators();
    var moves = game.moves({ square: square, verbose: true });
    if (moves.length === 0) return;
    
    for (var i = 0; i < moves.length; i++) {
        var move = moves[i];
        var $targetSquare = $('.square-' + move.to);
        
        if (move.flags.indexOf('k') !== -1 || move.flags.indexOf('q') !== -1) {
            $targetSquare.addClass('move-castle');
        } else if (move.flags.indexOf('c') !== -1 || move.flags.indexOf('e') !== -1) {
            $targetSquare.addClass('move-capture');
        } else {
            $targetSquare.addClass('move-normal');
        }
    }
}

function removeMoveIndicators() {
    $('.square-55d63').removeClass('move-normal move-capture move-castle in-check in-checkmate');
}

// ====== دور أيانوكوجي ======
function makeAyanokojiMove() {
    var bestMove = getBestMove(game, 4000); // 4 ثوانٍ كحد أقصى
    
    if (bestMove) {
        game.move(bestMove);
        board.position(game.fen());
        updateCheckStatus();
    }
}

function updateCheckStatus() {
    removeMoveIndicators();
    if (game.in_checkmate()) {
        var kingSquare = getKingSquare(game.turn());
        if (kingSquare) $('.square-' + kingSquare).addClass('in-checkmate');
    } else if (game.in_check()) {
        var kingSquare = getKingSquare(game.turn());
        if (kingSquare) $('.square-' + kingSquare).addClass('in-check');
    }
}

function getKingSquare(color) {
    var boardPosition = game.board();
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            var piece = boardPosition[i][j];
            if (piece && piece.type === 'k' && piece.color === color) {
                return String.fromCharCode(97 + j) + (8 - i);
            }
        }
    }
    return null;
}

$(window).resize(function() {
    board.resize();
});
