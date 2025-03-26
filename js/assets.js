/**
 * Quản lý tài nguyên của game (hình ảnh, âm thanh)
 */
class AssetManager {
    constructor() {
        this.images = {};
        this.sounds = {};
        this.totalAssets = 0;
        this.loadedAssets = 0;
        this.onLoadComplete = null;
    }

    // Đặt callback khi tải tài nguyên hoàn tất
    setLoadCallback(callback) {
        this.onLoadComplete = callback;
    }

    // Tạo và tải hình ảnh từ Canvas
    createCanvasImage(name, drawFunc, width, height) {
        this.totalAssets++;
        
        // Tạo canvas tạm thời
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const ctx = tempCanvas.getContext('2d');
        
        // Vẽ hình ảnh trên canvas
        drawFunc(ctx);
        
        // Chuyển đổi canvas thành hình ảnh
        const img = new Image();
        img.onload = () => {
            this.loadedAssets++;
            this.checkLoadComplete();
        };
        img.src = tempCanvas.toDataURL();
        this.images[name] = img;
    }

    // Tạo và tải âm thanh từ Base64
    createBase64Sound(name, base64Data) {
        this.totalAssets++;
        
        const sound = new Audio();
        sound.oncanplaythrough = () => {
            this.loadedAssets++;
            this.checkLoadComplete();
        };
        sound.onerror = () => {
            console.error(`Không thể tải âm thanh: ${name}`);
            this.loadedAssets++;
            this.checkLoadComplete();
        };
        sound.src = base64Data;
        this.sounds[name] = sound;
    }

    // Tải một hình ảnh từ URL
    loadImage(name, src) {
        this.totalAssets++;
        
        const img = new Image();
        img.onload = () => {
            this.loadedAssets++;
            this.checkLoadComplete();
        };
        img.onerror = () => {
            console.error(`Không thể tải hình ảnh: ${src}`);
            this.loadedAssets++;
            this.checkLoadComplete();
        };
        img.src = src;
        this.images[name] = img;
    }

    // Tải một file âm thanh từ URL
    loadSound(name, src) {
        this.totalAssets++;
        
        const sound = new Audio();
        sound.oncanplaythrough = () => {
            this.loadedAssets++;
            this.checkLoadComplete();
        };
        sound.onerror = () => {
            console.error(`Không thể tải âm thanh: ${src}`);
            this.loadedAssets++;
            this.checkLoadComplete();
        };
        sound.src = src;
        this.sounds[name] = sound;
    }

    // Kiểm tra xem đã tải xong tất cả tài nguyên chưa
    checkLoadComplete() {
        if (this.loadedAssets === this.totalAssets && this.onLoadComplete) {
            this.onLoadComplete();
        }
    }

    // Phát âm thanh
    playSound(name, volume = 1.0) {
        if (this.sounds[name]) {
            const soundClone = this.sounds[name].cloneNode();
            soundClone.volume = volume;
            soundClone.play();
        }
    }

    // Lấy hình ảnh
    getImage(name) {
        return this.images[name];
    }

    // Phương thức tải tất cả tài nguyên cần thiết
    loadAllAssets() {
		 // Thêm nhạc nền
		this.loadSound('bgMusic', 'assets/sounds/background-music.mp3');
        // Tạo hình ảnh khủng long
        this.createCanvasImage('dino', (ctx) => {
            // Vẽ thân khủng long
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
        }, 80, 100);
        
        // Tạo hình ảnh trứng
        this.createCanvasImage('egg', (ctx) => {
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
        }, 20, 25);
        
        // Tạo hình ảnh kẻ địch loại 1
        this.createCanvasImage('enemy1', (ctx) => {
            ctx.fillStyle = '#FF6347';
            ctx.fillRect(0, 0, 50, 50);
            
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(15, 20, 5, 0, Math.PI * 2);
            ctx.arc(35, 20, 5, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.moveTo(10, 35);
            ctx.lineTo(40, 35);
            ctx.lineTo(25, 45);
            ctx.closePath();
            ctx.fill();
        }, 50, 50);
        
        // Tạo hình ảnh kẻ địch loại 2
        this.createCanvasImage('enemy2', (ctx) => {
            ctx.fillStyle = '#FF4500';
            ctx.fillRect(0, 0, 50, 50);
            
            ctx.fillStyle = '#FFFF00';
            ctx.beginPath();
            ctx.arc(25, 25, 10, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(20, 20, 3, 0, Math.PI * 2);
            ctx.arc(30, 20, 3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(25, 30, 5, 0, Math.PI);
            ctx.stroke();
        }, 50, 50);
        
        // Tạo hình ảnh kẻ địch loại 3
        this.createCanvasImage('enemy3', (ctx) => {
            ctx.fillStyle = '#B22222';
            ctx.fillRect(0, 0, 50, 50);
            
            ctx.fillStyle = '#FFFF00';
            ctx.beginPath();
            ctx.arc(25, 25, 15, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#FF0000';
            ctx.beginPath();
            ctx.arc(25, 25, 8, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(18, 18, 3, 0, Math.PI * 2);
            ctx.arc(32, 18, 3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(25, 30, 5, Math.PI, Math.PI * 2);
            ctx.stroke();
        }, 50, 50);
        
        // Tạo hình ảnh vật phẩm
        this.createCanvasImage('powerup', (ctx) => {
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
        }, 30, 30);
        
        // Tạo hình ảnh nền
        this.createCanvasImage('background', (ctx) => {
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
            // Hàm vẽ đám mây
            const drawCloud = (x, y, size) => {
                ctx.beginPath();
                ctx.arc(x, y, size / 3, 0, Math.PI * 2);
                ctx.arc(x + size / 3, y - size / 6, size / 3, 0, Math.PI * 2);
                ctx.arc(x + size / 2, y + size / 6, size / 4, 0, Math.PI * 2);
                ctx.arc(x - size / 6, y, size / 4, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            };
            
            drawCloud(150, 80, 80);
            drawCloud(400, 60, 100);
            drawCloud(650, 180, 70);
            drawCloud(250, 150, 60);
            
            // Vẽ đồi
            ctx.fillStyle = '#81C784';
            ctx.beginPath();
            ctx.moveTo(0, 600);
            ctx.quadraticCurveTo(200, 500, 400, 580);
            ctx.quadraticCurveTo(600, 520, 800, 600);
            ctx.fill();
        }, 800, 600);
        
        // Tạo âm thanh bắn
        this.createBase64Sound('shoot', 'data:audio/wav;base64,UklGRh4BAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEhsbHRoREAkKCQgEAwEAAAAAAAAAAAAAAAADBA0QPEZdd46ksL3Dy8vGvbGkk31cRTsOBQEAAAAAAAAAAQQJDxIYGRwbGhcTDgoGAgAAAAAAAAAAAQUQITZQbIabq7fBx8rJw7uviZpnTzUfDAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADCAsRFBoeICAfHBkWEAwJBQIAAAAAAAEDCREbIyowODxBQ0RDQTw3MCkfFw4GAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=');
        
        // Tạo âm thanh bị thương
        this.createBase64Sound('hit', 'data:audio/wav;base64,UklGRpYBAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YXIBAAAAAAAACBUmO01jfJSsw9rw//fkz7WXeVk5IQsDAQMHDxQaICQrLjIvKCEXCgMAAAAAAQIEChYpRGN/nLfV8P//8tfAoIJfOwwDAQMGEiIyQVJjcn+HjIuGd2ZSPCYSBwEAAAACECpPhbLg///50rOTa0EjCwUEBxMmPFJqgJiuvcbHwbGci3VgSjYjEgkEAgAABCBDbZq+4/r+9eHJsJZ4WzwnFhUSGCQzRlpthJGgq7S4t7ColYR0YU49KBkMBQIBAQQPITZIWmh1foGFhoSBeW9jVUY5KR4TCAEAAAADDRsoNz1DSU5RU1NST0lCOjAoHhMJAgAAAgcRGiInKy0wMjMzMi8sJyIbEwoDAQABAwcMDxMWGRscHR0cGhcUEAwIBQMBAAEBAwUJCw0QERMTFBQTEhAPDQoIBQQCAgECAgQEBgcICQoKCgoJCQgHBgUEAgIBAQECAgMEBAUFBgYGBgYFBQQEAwMCAQEBAQEBAQICAgICAgICAgIBAQEBAQEBAQEBAQEBAQEB');
        
        // Tạo âm thanh thu thập vật phẩm
        this.createBase64Sound('collect', 'data:audio/wav;base64,UklGRmQBAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YUABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADBAYJDQ8VGyAtO0hVY3F/i5CRjoqDem9gUkQzJRcLAwAAAQULEhccIiMjIyEeGRMLCAUDAgAAAAAAAAAAAAECBAcKDhIXHSMpLzQ3OTs6OTYyLSggGRELBQIAAAAAAAAAAAAAAAAAAAAAAAABAgQGCQwPERQWFxgYGBcVEg8NCAYEAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=');
        
        // Tạo âm thanh lên level
        this.createBase64Sound('levelup', 'data:audio/wav;base64,UklGRsQBAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YaABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAECAwQEBQUFBQUFBAQDAgIBAAAAAAAAAAAAAAACAwUGCAkLDAsLCgkHBQQCAgAAAAAAAAAAAAEDBAYICgwOEBESEhIREA4NCwkHBQMCAAAAAAAAAgMFBwkLDQ8REhQVFRUVFBMREA4MCggGBAMBAAAAAgMFBwkLDQ8REhQVFhcXFxcWFRQTERAODAoIBgQCAQAAAQMEBggKDA4PERITFBUVFhYVFRQTERAPDQsJBwUEAgEAAAEDBAYHCQsNDxAREhMUFBQUFBMSERAODQsJBwYEAwEAAQIDBAYHCQsMDQ8QERERERERERAPDg0MCggHBQQCAgABAgMEBQcICQsMDQ0ODw8PDw8ODg0MCwoJBwYFBAMCAQEBAgMEBQYHCAkKCwsMDAwMDAwLCwoKCQgHBgUEAwICAQEBAgMEBAUGBwgICQoKCgoKCgoJCQgIBwYGBQQEAwMCAgIBAQEBAQICAwQEBQUGBgcHBwcHBwcHBgYGBQUFBAQDAwICAQEBAQEBAQEBAgICAgICAgICAgICAgICAgICAgEBAQEBAQEBAQEBAQEB');
        
        // Tạo âm thanh kết thúc game
        this.createBase64Sound('gameover', 'data:audio/wav;base64,UklGRrwCAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YZgCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACBUmO01jfJWsw9nx//fkz7WXeVk5IQsDAQMHDxQaHyQrLzIvKCEXCgMAAAAAAQIFChYpRGN/nLfV8P//8tfAoIJfOwwDAQMGEiIyQVJjcn+HjIuGd2ZSPCYSBwEAAAACECpPhbLg///50rOTa0EjCwUEBxMmO1JqgJmvvcbHwbGci3VfSjYjEgkEAwAABCBDa5q+4/r+9eHJsJZ4WzwnFhUSGCQzRlpthJGgq7S5t7ColYR0YU49KBkMBQIBAQQPITZIWmh1foGFhoSBeW9jVUY6KR4TCAIAAAADDRsoNz1DSU5RU1NST0lCOjAoHhMJAgAAAgcRGiInKy0wMjMzMi8sJyIbEwoDAQABAwcMDxMWGRscHR0cGhcUEAwIBQMBAAEBAwUICw0QERMTFBQTEhEPDQoIBgQCAgECAgQEBgcICQoKCgoJCQgHBgUEAgIBAQECAgMEBAUFBgYGBgYFBQQEAwMCAQEBAQEBAQICAgICAgICAgIBAQEBAQEBAQEBAQEBAQEBAAALISs7SVt0jqW92ezv3cmslnlZOiQOBQEAAAAAAAAAAwQNCRQ1THGQqcPf+f/42MKnjnJQNB4MBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABxQfLDhGU2d5hJGaoaOhm5KJfGtcRzYmFAgCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    }
}

// Tạo một instance toàn cục
const assetManager = new AssetManager();