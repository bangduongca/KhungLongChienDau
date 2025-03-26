/**
 * Lớp quản lý đạn và trứng trong game
 */
class Projectile {
    constructor(x, y, speed, type = 'egg') {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.type = type; // 'egg', 'enemy', 'powerup'
        
        // Kích thước đạn
        this.width = 20;
        this.height = 20;
        
        if (type === 'egg') {
            this.width = 20;
            this.height = 25;
        } else if (type === 'enemy') {
            this.width = 15;
            this.height = 15;
        } else if (type === 'powerup') {
            this.width = 30;
            this.height = 30;
        }
        
        // Trạng thái
        this.active = true;
    }
    
    // Cập nhật vị trí
    update() {
        if (this.type === 'egg') {
            // Trứng bay lên
            this.y -= this.speed;
        } else {
            // Đạn địch bay xuống
            this.y += this.speed;
        }
    }
    
    // Vẽ đạn
    draw(ctx) {
        if (this.type === 'egg' && assetManager.getImage('egg')) {
            ctx.drawImage(assetManager.getImage('egg'), this.x, this.y, this.width, this.height);
        } else if (this.type === 'powerup' && assetManager.getImage('powerup')) {
            ctx.drawImage(assetManager.getImage('powerup'), this.x, this.y, this.width, this.height);
        } else {
            // Vẽ đạn bằng hình dạng đơn giản
            if (this.type === 'egg') {
                ctx.fillStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.ellipse(this.x + this.width/2, this.y + this.height/2, this.width/2, this.height/2, 0, 0, Math.PI * 2);
                ctx.fill();
            } else if (this.type === 'enemy') {
                ctx.fillStyle = '#FF4444';
                ctx.beginPath();
                ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);
                ctx.fill();
            } else if (this.type === 'powerup') {
                ctx.fillStyle = '#FFFF00';
                ctx.beginPath();
                ctx.rect(this.x, this.y, this.width, this.height);
                ctx.fill();
                
                // Vẽ biểu tượng "+" ở giữa
                ctx.fillStyle = '#000000';
                ctx.fillRect(this.x + this.width/4, this.y + this.height/2 - 2, this.width/2, 4);
                ctx.fillRect(this.x + this.width/2 - 2, this.y + this.height/4, 4, this.height/2);
            }
        }
    }
    
    // Kiểm tra xem đạn có nằm trong canvas không
    isOffScreen(canvasHeight) {
        if (this.type === 'egg') {
            return this.y + this.height < 0;
        } else {
            return this.y > canvasHeight;
        }
    }
}

/**
 * Lớp quản lý tất cả đạn/trứng trong game
 */
class ProjectileManager {
    constructor() {
        this.projectiles = [];
    }
    
    // Thêm đạn mới
    add(x, y, speed, type) {
        this.projectiles.push(new Projectile(x, y, speed, type));
    }
    
    // Cập nhật tất cả đạn
    update(canvasHeight) {
        // Cập nhật vị trí từng đạn
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            
            projectile.update();
            
            // Xóa đạn đã ra khỏi màn hình
            if (projectile.isOffScreen(canvasHeight) || !projectile.active) {
                this.projectiles.splice(i, 1);
            }
        }
    }
    
    // Vẽ tất cả đạn
    draw(ctx) {
        this.projectiles.forEach(projectile => {
            projectile.draw(ctx);
        });
    }
    
    // Xóa tất cả đạn
    clear() {
        this.projectiles = [];
    }
    
    // Lấy danh sách đạn hiện tại
    getProjectiles() {
        return this.projectiles;
    }
    
    // Kiểm tra va chạm với một đối tượng
    checkCollision(obj) {
        const collidedProjectiles = [];
        
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            
            if (checkCollision(obj, projectile)) {
                collidedProjectiles.push(projectile);
                projectile.active = false;
            }
        }
        
        return collidedProjectiles;
    }
}