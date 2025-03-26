/**
 * Lớp quản lý nhân vật khủng long
 */
class Player {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        
        // Kích thước khủng long
        this.width = 80;
        this.height = 100;
        
        // Vị trí khủng long
        this.x = canvasWidth / 2 - this.width / 2;
        this.y = canvasHeight - this.height - 20;
        
        // Tốc độ di chuyển
        this.speed = 5;
        this.maxSpeed = 8;
        
        // Các trạng thái chuyển động
        this.moveLeft = false;
        this.moveRight = false;
        
        // Trạng thái nhân vật
        this.health = 100;
        this.maxHealth = 100;
        this.eggs = 30;
        this.maxEggs = 50;
        
        // Đếm thời gian bắn
        this.shootCooldown = 0;
        this.shootCooldownMax = 20; // Frames giữa các lần bắn
        
        // Đếm thời gian phục hồi khi bị thương
        this.hitCooldown = 0;
        this.hitCooldownMax = 60; // Frames miễn nhiễm sau khi bị thương
        
        // Hiệu ứng nhấp nháy khi bị thương
        this.blinking = false;
    }
    
    // Cập nhật vị trí khủng long
    update() {
        // Di chuyển trái phải
        if (this.moveLeft) {
            this.x -= this.speed;
        }
        if (this.moveRight) {
            this.x += this.speed;
        }
        
        // Giới hạn không cho khủng long đi ra ngoài màn hình
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x + this.width > this.canvasWidth) {
            this.x = this.canvasWidth - this.width;
        }
        
        // Giảm thời gian hồi chiêu
        if (this.shootCooldown > 0) {
            this.shootCooldown--;
        }
        
        // Giảm thời gian miễn nhiễm khi bị thương
        if (this.hitCooldown > 0) {
            this.hitCooldown--;
            this.blinking = (Math.floor(this.hitCooldown / 5) % 2 === 0);
        } else {
            this.blinking = false;
        }
		
		    // Thêm mới: Tự động hồi trứng theo thời gian
		if (Math.random() < 0.005 && this.eggs < this.maxEggs) {
        this.eggs++;
    }
    }
    
    // Vẽ khủng long
    draw(ctx) {
        if (this.blinking && Math.floor(Date.now() / 100) % 2 === 0) {
            return; // Không vẽ trong frame này để tạo hiệu ứng nhấp nháy
        }
        
        // Vẽ khủng long (sử dụng hình ảnh nếu có)
        if (assetManager.getImage('dino')) {
            ctx.drawImage(assetManager.getImage('dino'), this.x, this.y, this.width, this.height);
        } else {
            // Vẽ khủng long tạm thời bằng hình đơn giản
            ctx.fillStyle = 'green';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Vẽ mắt
            ctx.fillStyle = 'white';
            ctx.fillRect(this.x + this.width - 25, this.y + 20, 15, 15);
            ctx.fillStyle = 'black';
            ctx.fillRect(this.x + this.width - 20, this.y + 25, 5, 5);
        }
    }
    
    // Bắn trứng
    shoot() {
        if (this.shootCooldown <= 0 && this.eggs > 0) {
            this.eggs--;
            this.shootCooldown = this.shootCooldownMax;
            
            // Phát âm thanh bắn
            assetManager.playSound('shoot', 0.5);
            
            // Tạo và trả về vị trí tạo trứng
            return {
                x: this.x + this.width / 2 - 10,
                y: this.y - 10
            };
        }
        return null;
    }
    
    // Nhận sát thương
    takeDamage(amount) {
        if (this.hitCooldown <= 0) {
            this.health -= amount;
            this.hitCooldown = this.hitCooldownMax;
            
            // Phát âm thanh bị thương
            assetManager.playSound('hit', 0.7);
            
            // Kiểm tra xem còn sống không
            if (this.health <= 0) {
                this.health = 0;
                return true; // Đã chết
            }
        }
        return false; // Vẫn còn sống
    }
    
    // Thu thập trứng
    collectEggs(amount) {
        this.eggs = Math.min(this.eggs + amount, this.maxEggs);
        assetManager.playSound('collect', 0.5);
    }
    
    // Hồi phục máu
    heal(amount) {
        this.health = Math.min(this.health + amount, this.maxHealth);
        assetManager.playSound('collect', 0.5);
    }
    
    // Lấy thông tin hiện tại
    getInfo() {
        return {
            health: this.health,
            eggs: this.eggs
        };
    }
    
    // Đặt lại trạng thái khi chơi lại
    reset() {
        this.health = this.maxHealth;
        this.eggs = 30;
        this.x = this.canvasWidth / 2 - this.width / 2;
        this.shootCooldown = 0;
        this.hitCooldown = 0;
        this.blinking = false;
    }
}