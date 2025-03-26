/**
 * File chính để khởi tạo game
 */
document.addEventListener('DOMContentLoaded', function() {
    // Lấy phần tử canvas
    const canvas = document.getElementById('gameCanvas');
    
    // Đảm bảo canvas responsive
    function resizeCanvas() {
        const container = document.getElementById('gameContainer');
        const aspectRatio = 800 / 600;
        
        const containerWidth = container.clientWidth;
        canvas.style.width = containerWidth + 'px';
        canvas.style.height = (containerWidth / aspectRatio) + 'px';
    }
    
    // Khởi tạo kích thước ban đầu
    resizeCanvas();
    
    // Xử lý thay đổi kích thước cửa sổ
    window.addEventListener('resize', resizeCanvas);
    
    // Tải tài nguyên game
    assetManager.setLoadCallback(() => {
        // Khởi tạo game khi tài nguyên đã tải xong
        const game = new Game(canvas);
        
        // Đảm bảo hình ảnh được tạo từ canvas khi không có file hình ảnh thực
        if (!assetManager.getImage('dino')) {
            // Tạo hình ảnh khủng long từ canvas
            createDinoImage();
        }
        
        if (!assetManager.getImage('enemy1')) {
            // Tạo hình ảnh kẻ địch từ canvas
            createEnemyImages();
        }
        
        if (!assetManager.getImage('egg')) {
            // Tạo hình ảnh trứng từ canvas
            createEggImage();
        }
        
        if (!assetManager.getImage('powerup')) {
            // Tạo hình ảnh vật phẩm từ canvas
            createPowerupImage();
        }
        
        if (!assetManager.getImage('background')) {
            // Tạo hình ảnh nền từ canvas
            createBackgroundImage();
        }
        
        // Tạo âm thanh thay thế nếu không có file âm thanh
        createPlaceholderSounds();
    });
    
    // Tải tài nguyên
    assetManager.loadAllAssets();
});

/**
 * Tạo hình ảnh khủng long từ canvas khi không có file
 */
function createDinoImage() {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 80;
    tempCanvas.height = 100;
    const ctx = tempCanvas.getContext('2d');
    
    // Vẽ thân khủng long (màu xanh lá)
    ctx.fillStyle = '#4CAF50';
    ctx.beginPath();
    ctx.ellipse(40, 60, 25, 40, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Vẽ đầu khủng long
    ctx.fillStyle = '#4CAF50';
    ctx.beginPath();
    ctx.ellipse(40, 30, 20, 25, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Vẽ mắt
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(50, 25, 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(53, 25, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Vẽ miệng
    ctx.fillStyle = '#E53935';
    ctx.beginPath();
    ctx.ellipse(40, 40, 15, 5, 0, 0, Math.PI);
    ctx.fill();
    
    // Vẽ chân
    ctx.fillStyle = '#388E3C';
    ctx.beginPath();
    ctx.ellipse(30, 95, 8, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(50, 95, 8, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Lưu hình ảnh vào tài nguyên
    const img = new Image();
    img.src = tempCanvas.toDataURL();
    assetManager.images['dino'] = img;
}

/**
 * Tạo hình ảnh kẻ địch từ canvas khi không có file
 */
function createEnemyImages() {
    // Tạo kẻ địch loại 1
    const enemy1Canvas = document.createElement('canvas');
    enemy1Canvas.width = 50;
    enemy1Canvas.height = 50;
    const ctx1 = enemy1Canvas.getContext('2d');
    
    ctx1.fillStyle = '#FF6347';
    ctx1.fillRect(0, 0, 50, 50);
    
    ctx1.fillStyle = 'black';
    ctx1.beginPath();
    ctx1.arc(15, 20, 5, 0, Math.PI * 2);
    ctx1.arc(35, 20, 5, 0, Math.PI * 2);
    ctx1.fill();
    
    ctx1.fillStyle = 'white';
    ctx1.beginPath();
    ctx1.moveTo(10, 35);
    ctx1.lineTo(40, 35);
    ctx1.lineTo(25, 45);
    ctx1.closePath();
    ctx1.fill();
    
    // Lưu hình ảnh kẻ địch 1
    const img1 = new Image();
    img1.src = enemy1Canvas.toDataURL();
    assetManager.images['enemy1'] = img1;
    
    // Tạo kẻ địch loại 2
    const enemy2Canvas = document.createElement('canvas');
    enemy2Canvas.width = 50;
    enemy2Canvas.height = 50;
    const ctx2 = enemy2Canvas.getContext('2d');
    
    ctx2.fillStyle = '#FF4500';
    ctx2.fillRect(0, 0, 50, 50);
    
    ctx2.fillStyle = '#FFFF00';
    ctx2.beginPath();
    ctx2.arc(25, 25, 10, 0, Math.PI * 2);
    ctx2.fill();
    
    ctx2.fillStyle = 'black';
    ctx2.beginPath();
    ctx2.arc(20, 20, 3, 0, Math.PI * 2);
    ctx2.arc(30, 20, 3, 0, Math.PI * 2);
    ctx2.fill();
    
    ctx2.strokeStyle = 'black';
    ctx2.lineWidth = 2;
    ctx2.beginPath();
    ctx2.arc(25, 30, 5, 0, Math.PI);
    ctx2.stroke();
    
    // Lưu hình ảnh kẻ địch 2
    const img2 = new Image();
    img2.src = enemy2Canvas.toDataURL();
    assetManager.images['enemy2'] = img2;
    
    // Tạo kẻ địch loại 3
    const enemy3Canvas = document.createElement('canvas');
    enemy3Canvas.width = 50;
    enemy3Canvas.height = 50;
    const ctx3 = enemy3Canvas.getContext('2d');
    
    ctx3.fillStyle = '#B22222';
    ctx3.fillRect(0, 0, 50, 50);
    
    ctx3.fillStyle = '#FFFF00';
    ctx3.beginPath();
    ctx3.arc(25, 25, 15, 0, Math.PI * 2);
    ctx3.fill();
    
    ctx3.fillStyle = '#FF0000';
    ctx3.beginPath();
    ctx3.arc(25, 25, 8, 0, Math.PI * 2);
    ctx3.fill();
    
    ctx3.fillStyle = 'black';
    ctx3.beginPath();
    ctx3.arc(18, 18, 3, 0, Math.PI * 2);
    ctx3.arc(32, 18, 3, 0, Math.PI * 2);
    ctx3.fill();
    
    ctx3.strokeStyle = 'black';
    ctx3.lineWidth = 2;
    ctx3.beginPath();
    ctx3.arc(25, 30, 5, Math.PI, Math.PI * 2);
    ctx3.stroke();
    
    // Lưu hình ảnh kẻ địch 3
    const img3 = new Image();
    img3.src = enemy3Canvas.toDataURL();
    assetManager.images['enemy3'] = img3;
}

/**
 * Tạo hình ảnh trứng từ canvas khi không có file
 */
function createEggImage() {
    const eggCanvas = document.createElement('canvas');
    eggCanvas.width = 20;
    eggCanvas.height = 25;
    const ctx = eggCanvas.getContext('2d');
    
    // Vẽ trứng màu trắng
    const gradient = ctx.createLinearGradient(0, 0, 20, 0);
    gradient.addColorStop(0, '#F5F5F5');
    gradient.addColorStop(0.5, '#FFFFFF');
    gradient.addColorStop(1, '#EEEEEE');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(10, 12, 9, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Tạo hiệu ứng bóng
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.beginPath();
    ctx.ellipse(10, 15, 7, 9, 0, 0, Math.PI);
    ctx.fill();
    
    // Tạo hiệu ứng sáng
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.ellipse(8, 8, 3, 4, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Lưu hình ảnh trứng
    const img = new Image();
    img.src = eggCanvas.toDataURL();
    assetManager.images['egg'] = img;
}

/**
 * Tạo hình ảnh vật phẩm từ canvas khi không có file
 */
function createPowerupImage() {
    const powerupCanvas = document.createElement('canvas');
    powerupCanvas.width = 30;
    powerupCanvas.height = 30;
    const ctx = powerupCanvas.getContext('2d');
    
    // Vẽ nền hộp vật phẩm
    ctx.fillStyle = '#FFEB3B';
    ctx.fillRect(0, 0, 30, 30);
    
    // Vẽ đường viền
    ctx.strokeStyle = '#FBC02D';
    ctx.lineWidth = 3;
    ctx.strokeRect(2, 2, 26, 26);
    
    // Vẽ dấu ? ở giữa
    ctx.fillStyle = '#3F51B5';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', 15, 15);
    
    // Tạo hiệu ứng ánh sáng
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.moveTo(5, 5);
    ctx.lineTo(10, 5);
    ctx.lineTo(5, 10);
    ctx.closePath();
    ctx.fill();
    
    // Lưu hình ảnh vật phẩm
    const img = new Image();
    img.src = powerupCanvas.toDataURL();
    assetManager.images['powerup'] = img;
}

/**
 * Tạo hình ảnh nền từ canvas khi không có file
 */
function createBackgroundImage() {
    const bgCanvas = document.createElement('canvas');
    bgCanvas.width = 800;
    bgCanvas.height = 600;
    const ctx = bgCanvas.getContext('2d');
    
    // Vẽ gradient nền trời
    const skyGradient = ctx.createLinearGradient(0, 0, 0, 600);
    skyGradient.addColorStop(0, '#87CEEB');
    skyGradient.addColorStop(1, '#E0F7FA');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, 800, 600);
    
    // Vẽ mặt trời
    ctx.fillStyle = '#FFEB3B';
    ctx.beginPath();
    ctx.arc(700, 100, 50, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#FDD835';
    ctx.lineWidth = 3;
    for (let i = 0; i < 12; i++) {
        const angle = i * Math.PI / 6;
        ctx.beginPath();
        ctx.moveTo(700 + Math.cos(angle) * 60, 100 + Math.sin(angle) * 60);
        ctx.lineTo(700 + Math.cos(angle) * 80, 100 + Math.sin(angle) * 80);
        ctx.stroke();
    }
    
    // Vẽ các đám mây
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    drawCloud(ctx, 150, 80, 80);
    drawCloud(ctx, 400, 60, 100);
    drawCloud(ctx, 650, 180, 70);
    drawCloud(ctx, 250, 150, 60);
    
    // Vẽ đồi
    ctx.fillStyle = '#81C784';
    ctx.beginPath();
    ctx.moveTo(0, 600);
    ctx.quadraticCurveTo(200, 500, 400, 580);
    ctx.quadraticCurveTo(600, 520, 800, 600);
    ctx.fill();
    
    // Lưu hình ảnh nền
    const img = new Image();
    img.src = bgCanvas.toDataURL();
    assetManager.images['background'] = img;
}

/**
 * Vẽ đám mây
 */
function drawCloud(ctx, x, y, size) {
    ctx.beginPath();
    ctx.arc(x, y, size / 3, 0, Math.PI * 2);
    ctx.arc(x + size / 3, y - size / 6, size / 3, 0, Math.PI * 2);
    ctx.arc(x + size / 2, y + size / 6, size / 4, 0, Math.PI * 2);
    ctx.arc(x - size / 6, y, size / 4, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

/**
 * Tạo các âm thanh từ các tone đơn giản khi không có file âm thanh
 */
function createPlaceholderSounds() {
    // Tạo âm thanh bắn
    if (!assetManager.sounds['shoot']) {
        const shootSound = new Audio();
        shootSound.src = 'data:audio/wav;base64,UklGRh4BAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEhsbHRoREAkKCQgEAwEAAAAAAAAAAAAAAAADBA0QPEZdd46ksL3Dy8vGvbGkk31cRTsOBQEAAAAAAAAAAQQJDxIYGRwbGhcTDgoGAgAAAAAAAAAAAQUQITZQbIabq7fBx8rJw7uviZpnTzUfDAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADCAsRFBoeICAfHBkWEAwJBQIAAAAAAAEDCREbIyowODxBQ0RDQTw3MCkfFw4GAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';
        assetManager.sounds['shoot'] = shootSound;
    }
    
    // Tạo âm thanh bị thương
    if (!assetManager.sounds['hit']) {
        const hitSound = new Audio();
        hitSound.src = 'data:audio/wav;base64,UklGRpYBAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YXIBAAAAAAAACBUmO01jfJSsw9rw//fkz7WXeVk5IQsDAQMHDxQaICQrLjIvKCEXCgMAAAAAAQIEChYpRGN/nLfV8P//8tfAoIJfOwwDAQMGEiIyQVJjcn+HjIuGd2ZSPCYSBwEAAAACECpPhbLg///50rOTa0EjCwUEBxMmPFJqgJiuvcbHwbGci3VgSjYjEgkEAgAABCBDbZq+4/r+9eHJsJZ4WzwnFhUSGCQzRlpthJGgq7S4t7ColYR0YU49KBkMBQIBAQQPITZIWmh1foGFhoSBeW9jVUY5KR4TCAEAAAADDRsoNz1DSU5RU1NST0lCOjAoHhMJAgAAAgcRGiInKy0wMjMzMi8sJyIbEwoDAQABAwcMDxMWGRscHR0cGhcUEAwIBQMBAAEBAwUJCw0QERMTFBQTEhAPDQoIBQQCAgECAgQEBgcICQoKCgoJCQgHBgUEAgIBAQECAgMEBAUFBgYGBgYFBQQEAwMCAQEBAQEBAQICAgICAgICAgIBAQEBAQEBAQEBAQEBAQEB';
        assetManager.sounds['hit'] = hitSound;
    }
    
    // Tạo âm thanh thu thập vật phẩm
    if (!assetManager.sounds['collect']) {
        const collectSound = new Audio();
        collectSound.src = 'data:audio/wav;base64,UklGRmQBAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YUABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADBAYJDQ8VGyAtO0hVY3F/i5CRjoqDem9gUkQzJRcLAwAAAQULEhccIiMjIyEeGRMLCAUDAgAAAAAAAAAAAAECBAcKDhIXHSMpLzQ3OTs6OTYyLSggGRELBQIAAAAAAAAAAAAAAAAAAAAAAAABAgQGCQwPERQWFxgYGBcVEg8NCAYEAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';
        assetManager.sounds['collect'] = collectSound;
    }
    
    // Tạo âm thanh lên level
    if (!assetManager.sounds['levelup']) {
        const levelupSound = new Audio();
        levelupSound.src = 'data:audio/wav;base64,UklGRsQBAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YaABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAECAwQEBQUFBQUFBAQDAgIBAAAAAAAAAAAAAAACAwUGCAkLDAsLCgkHBQQCAgAAAAAAAAAAAAEDBAYICgwOEBESEhIREA4NCwkHBQMCAAAAAAAAAgMFBwkLDQ8REhQVFRUVFBMREA4MCggGBAMBAAAAAgMFBwkLDQ8REhQVFhcXFxcWFRQTERAODAoIBgQCAQAAAQMEBggKDA4PERITFBUVFhYVFRQTERAPDQsJBwUEAgEAAAEDBAYHCQsNDxAREhMUFBQUFBMSERAODQsJBwYEAwEAAQIDBAYHCQsMDQ8QERERERERERAPDg0MCggHBQQCAgABAgMEBQcICQsMDQ0ODw8PDw8ODg0MCwoJBwYFBAMCAQEBAgMEBQYHCAkKCwsMDAwMDAwLCwoKCQgHBgUEAwICAQEBAgMEBAUGBwgICQoKCgoKCgoJCQgIBwYGBQQEAwICAQEBAQICAwQEBQUGBgcHBwcHBwcHBgYGBQUFBAQDAwICAQEBAQEBAgICAwMEBAQEBAQEBAQEBAQEAwMDAwMCAgICAQEBAQEBAQEBAQICAgICAgICAgICAgICAgICAgEBAQEBAQEBAQEBAQEB';
        assetManager.sounds['levelup'] = levelupSound;
    }
    
    // Tạo âm thanh kết thúc game
    if (!assetManager.sounds['gameover']) {
        const gameoverSound = new Audio();
        gameoverSound.src = 'data:audio/wav;base64,UklGRrwCAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YZgCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACBUmO01jfJWsw9nx//fkz7WXeVk5IQsDAQMHDxQaHyQrLzIvKCEXCgMAAAAAAQIFChYpRGN/nLfV8P//8tfAoIJfOwwDAQMGEiIyQVJjcn+HjIuGd2ZSPCYSBwEAAAACECpPhbLg///50rOTa0EjCwUEBxMmO1JqgJmvvcbHwbGci3VfSjYjEgkEAwAABCBDa5q+4/r+9eHJsJZ4WzwnFhUSGCQzRlpthJGgq7S5t7ColYR0YU49KBkMBQIBAQQPITZIWmh1foGFhoSBeW9jVUY6KR4TCAIAAAADDRsoNz1DSU5RU1NST0lCOjAoHhMJAgAAAgcRGiInKy0wMjMzMi8sJyIbEwoDAQABAwcMDxMWGRscHR0cGhcUEAwIBQMBAAEBAwUICw0QERMTFBQTEhEPDQoIBgQCAgECAgQEBgcICQoKCgoJCQgHBgUEAgIBAQECAgMEBAUFBgYGBgYFBQQEAwMCAQEBAQEBAQICAgICAgICAgIBAQEBAQEBAQEBAQEBAQEBAAALISs7SVt0jqW92ezv3cmslnlZOiQOBQEAAAAAAAAAAwQNCRQ1THGQqcPf+f/42MKnjnJQNB4MBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABxQfLDhGU2d5hJGaoaOhm5KJfGtcRzYmFAgCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
        assetManager.sounds['gameover'] = gameoverSound;
    }
}

