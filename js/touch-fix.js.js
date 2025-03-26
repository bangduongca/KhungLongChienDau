// touch-fix.js
document.addEventListener('DOMContentLoaded', function() {
    // Đợi trang tải xong
    setTimeout(fixTouchEvents, 1000);
});

function fixTouchEvents() {
    // Lấy các nút điều khiển
    const startBtn = document.getElementById('startBtn');
    const tutorialBtn = document.getElementById('tutorialBtn');
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');
    const shootBtn = document.getElementById('shootBtn');
    
    // Thêm sự kiện touch cho nút bắt đầu chơi
    if (startBtn) {
        startBtn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            console.log("Bắt đầu chơi được nhấn");
            // Kích hoạt click event
            startBtn.click();
        });
    }
    
    // Thêm sự kiện touch cho nút hướng dẫn
    if (tutorialBtn) {
        tutorialBtn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            console.log("Hướng dẫn được nhấn");
            tutorialBtn.click();
        });
    }
    
    // Thêm sự kiện touch cho nút di chuyển trái
    if (leftBtn) {
        leftBtn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            console.log("Nút trái được nhấn");
            // Thực hiện hành động
            var event = new Event('gameaction');
            event.action = 'moveleft';
            document.dispatchEvent(event);
        });
    }
    
    // Tương tự cho các nút khác
    if (rightBtn) {
        rightBtn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            console.log("Nút phải được nhấn");
            var event = new Event('gameaction');
            event.action = 'moveright';
            document.dispatchEvent(event);
        });
    }
    
    if (shootBtn) {
        shootBtn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            console.log("Nút bắn được nhấn");
            var event = new Event('gameaction');
            event.action = 'shoot';
            document.dispatchEvent(event);
        });
    }
    
    // Thêm hàm lắng nghe các sự kiện game
    document.addEventListener('gameaction', function(e) {
        console.log('Game action: ' + e.action);
        // Gọi hàm xử lý tương ứng trong game
        if (window.gameInstance) {
            if (e.action === 'moveleft') {
                window.gameInstance.player.moveLeft = true;
            } else if (e.action === 'moveright') {
                window.gameInstance.player.moveRight = true;
            } else if (e.action === 'shoot') {
                window.gameInstance.shootEgg();
            }
        }
    });
    
    // Đảm bảo tất cả các phần tử có thể tương tác
    document.querySelectorAll('button, .btn, .mobile-btn').forEach(function(el) {
        el.style.pointerEvents = 'auto';
        el.style.cursor = 'pointer';
        el.style.zIndex = '9999';
    });
    
    // Fix container
    const uiContainer = document.querySelector('.ui-container');
    if (uiContainer) {
        uiContainer.style.pointerEvents = 'auto';
    }
}