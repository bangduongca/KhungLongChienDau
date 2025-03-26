/**
 * Lớp vật phẩm tăng sức mạnh
 */
class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.speed = 2;
        this.type = type; // 'health', 'egg', 'speed', 'shield'
        this.active = true;
    }
    
    // Cập nhật vị trí
    update() {
        this.y += this.speed;
    }
    
    // Vẽ vật phẩm
    draw(ctx) {
        // Sử dụng hình ảnh nếu có
        if (assetManager.getImage('powerup')) {
            ctx.drawImage(assetManager.getImage('powerup'), this.x, this.y, this.width, this.height);
        } else {
            // Vẽ hình dạng đơn giản nếu không có hình ảnh
            ctx.fillStyle = '#FFFF00';
            ctx.beginPath();
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.fill();
            
            // Thêm biểu tượng tùy theo loại vật phẩm
            ctx.fillStyle = '#000000';
            
            if (this.type === 'health') {
                // Dấu cộng cho vật phẩm máu
                ctx.fillRect(this.x + this.width/4, this.y + this.height/2 - 2, this.width/2, 4);
                ctx.fillRect(this.x + this.width/2 - 2, this.y + this.height/4, 4, this.height/2);
            } else if (this.type === 'egg') {
                // Hình tròn cho vật phẩm trứng
                ctx.beginPath();
                ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/4, 0, Math.PI * 2);
                ctx.fill();
            } else if (this.type === 'speed') {
                // Mũi tên cho vật phẩm tốc độ
                ctx.beginPath();
                ctx.moveTo(this.x + this.width/4, this.y + this.height/4);
                ctx.lineTo(this.x + 3*this.width/4, this.y + this.height/2);
                ctx.lineTo(this.x + this.width/4, this.y + 3*this.height/4);
                ctx.fill();
            } else if (this.type === 'shield') {
                // Hình vuông cho vật phẩm khiên
                ctx.fillRect(this.x + this.width/4, this.y + this.height/4, this.width/2, this.height/2);
            }
        }
    }
    
    // Kiểm tra xem vật phẩm có ra khỏi màn hình không
    isOffScreen(canvasHeight) {
        return this.y > canvasHeight;
    }
    
    // Áp dụng hiệu ứng vật phẩm cho người chơi
    applyEffect(player) {
        assetManager.playSound('collect', 0.5);
        
        switch(this.type) {
            case 'health':
                // Hồi 20% máu
                player.heal(player.maxHealth * 0.2);
                break;
            case 'egg':
                // Thêm 5 trứng
                player.collectEggs(10);
                break;
            case 'speed':
                // Tăng tốc độ người chơi trong 5 giây
                const originalSpeed = player.speed;
                player.speed = player.maxSpeed;
                setTimeout(() => {
                    player.speed = originalSpeed;
                }, 5000);
                break;
            case 'shield':
                // Tạo khiên bảo vệ trong 8 giây
                player.hitCooldown = 8 * 60; // 8 giây * 60 frames/giây
                break;
        }
    }
}

/**
 * Lớp quản lý tất cả vật phẩm trong game
 */
class PowerUpManager {
    constructor(canvasWidth, canvasHeight) {
        this.powerups = [];
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.spawnChance = 0.005; // Xác suất sinh vật phẩm khi tiêu diệt kẻ địch
        this.types = ['health', 'egg', 'speed', 'shield'];
    }
    
    // Cập nhật vị trí tất cả vật phẩm
    update() {
        for (let i = this.powerups.length - 1; i >= 0; i--) {
            const powerup = this.powerups[i];
            
            powerup.update();
            
            // Xóa vật phẩm đã ra khỏi màn hình hoặc đã được thu thập
            if (powerup.isOffScreen(this.canvasHeight) || !powerup.active) {
                this.powerups.splice(i, 1);
            }
        }
    }
    
    // Vẽ tất cả vật phẩm
    draw(ctx) {
        this.powerups.forEach(powerup => {
            powerup.draw(ctx);
        });
    }
    
    // Sinh vật phẩm khi tiêu diệt kẻ địch
    spawnPowerUp(x, y, enemyType) {
        // Tăng xác suất sinh vật phẩm theo loại kẻ địch
        const typeBonus = (enemyType - 1) * 0.01;
        
        if (Math.random() < this.spawnChance + typeBonus) {
            // Chọn ngẫu nhiên loại vật phẩm
            const typeIndex = Math.floor(Math.random() * this.types.length);
            const type = this.types[typeIndex];
            
            this.powerups.push(new PowerUp(x, y, type));
        }
    }
    
    // Xóa tất cả vật phẩm
    clear() {
        this.powerups = [];
    }
    
    // Kiểm tra va chạm với người chơi
    checkPlayerCollision(player) {
        for (let i = this.powerups.length - 1; i >= 0; i--) {
            const powerup = this.powerups[i];
            
            if (checkCollision(player, powerup)) {
                powerup.applyEffect(player);
                powerup.active = false;
                this.powerups.splice(i, 1);
            }
        }
    }
}