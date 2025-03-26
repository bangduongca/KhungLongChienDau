/**
 * Lớp kẻ địch
 */
class Enemy {
    constructor(x, y, type, canvasWidth) {
        this.x = x;
        this.y = y;
        this.type = type; // 1, 2, 3 tương ứng với các loại kẻ địch khác nhau
        this.canvasWidth = canvasWidth;
        
        // Kích thước kẻ địch
        this.width = 50;
        this.height = 50;
        
        // Các thuộc tính theo loại kẻ địch
        switch (this.type) {
            case 1: // Kẻ địch đơn giản, di chuyển thẳng
                this.speed = 1 + Math.random() * 0.5;
                this.health = 1;
                this.score = 10;
                this.shootChance = 0.005; // Xác suất bắn mỗi frame
                break;
            case 2: // Kẻ địch nhanh, di chuyển zic-zac
                this.speed = 2 + Math.random() * 0.5;
                this.health = 2;
                this.score = 20;
                this.shootChance = 0.01;
                this.moveDirection = Math.random() > 0.5 ? 1 : -1;
                this.moveCounter = 0;
                break;
            case 3: // Kẻ địch mạnh, di chuyển phức tạp
                this.speed = 0.7 + Math.random() * 0.3;
                this.health = 3;
                this.score = 30;
                this.shootChance = 0.02;
                this.movePattern = Math.floor(Math.random() * 3); // 0: đi thẳng, 1: đi zic-zac, 2: đi hình sin
                this.moveCounter = 0;
                this.startX = x;
                break;
        }
        
        // Trạng thái
        this.active = true;
        this.hitCooldown = 0;
        this.hitCooldownMax = 10;
    }
    
    // Cập nhật vị trí
    update() {
        // Di chuyển xuống dưới
        this.y += this.speed;
        
        // Di chuyển theo mẫu khác nhau tùy theo loại kẻ địch
        if (this.type === 2) {
            // Kẻ địch loại 2 di chuyển zic-zac
            this.moveCounter++;
            if (this.moveCounter >= 30) {
                this.moveDirection *= -1;
                this.moveCounter = 0;
            }
            this.x += this.moveDirection;
            
            // Giới hạn không đi ra ngoài màn hình
            if (this.x < 0) {
                this.x = 0;
                this.moveDirection *= -1;
            } else if (this.x + this.width > this.canvasWidth) {
                this.x = this.canvasWidth - this.width;
                this.moveDirection *= -1;
            }
        } else if (this.type === 3) {
            // Kẻ địch loại 3 di chuyển phức tạp
            this.moveCounter++;
            
            if (this.movePattern === 1) {
                // Zic-zac
                if (this.moveCounter % 60 < 30) {
                    this.x += 1;
                } else {
                    this.x -= 1;
                }
            } else if (this.movePattern === 2) {
                // Hình sin
                this.x = this.startX + Math.sin(this.moveCounter / 20) * 80;
            }
            
            // Giới hạn không đi ra ngoài màn hình
            if (this.x < 0) {
                this.x = 0;
            } else if (this.x + this.width > this.canvasWidth) {
                this.x = this.canvasWidth - this.width;
            }
        }
        
        // Giảm thời gian hiệu ứng khi bị thương
        if (this.hitCooldown > 0) {
            this.hitCooldown--;
        }
        
        // Kiểm tra xem có nên bắn không
        if (Math.random() < this.shootChance) {
            return {
                x: this.x + this.width / 2 - 7,
                y: this.y + this.height,
                speed: 3 + Math.random() * 2
            };
        }
        
        return null;
    }
    
    // Vẽ kẻ địch
    draw(ctx) {
        // Hiệu ứng nhấp nháy khi bị thương
        if (this.hitCooldown > 0 && this.hitCooldown % 2 === 0) {
            return;
        }
        
        // Vẽ hình ảnh kẻ địch nếu có
        const enemyImage = assetManager.getImage(`enemy${this.type}`);
        if (enemyImage) {
            ctx.drawImage(enemyImage, this.x, this.y, this.width, this.height);
        } else {
            // Vẽ hình dạng đơn giản nếu không có hình ảnh
            ctx.fillStyle = this.type === 1 ? '#FF6347' : this.type === 2 ? '#FF4500' : '#B22222';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Thêm chi tiết để phân biệt các loại kẻ địch
            if (this.type === 2) {
                ctx.fillStyle = '#FFFF00';
                ctx.beginPath();
                ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 10, 0, Math.PI * 2);
                ctx.fill();
            } else if (this.type === 3) {
                ctx.fillStyle = '#FFFF00';
                ctx.beginPath();
                ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 15, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#FF0000';
                ctx.beginPath();
                ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 8, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
    
    // Nhận sát thương
    takeDamage(damage) {
        this.health -= damage;
        this.hitCooldown = this.hitCooldownMax;
        
        if (this.health <= 0) {
            this.active = false;
            return true; // Đã bị tiêu diệt
        }
        return false; // Vẫn còn sống
    }
    
    // Kiểm tra xem kẻ địch có ra khỏi màn hình không
    isOffScreen(canvasHeight) {
        return this.y > canvasHeight;
    }
}

/**
 * Lớp quản lý tất cả kẻ địch trong game
 */
class EnemyManager {
    constructor(canvasWidth, canvasHeight) {
        this.enemies = [];
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.spawnCooldown = 0;
        this.spawnRate = 100; // Thời gian giữa các lần sinh kẻ địch (frames)
        this.currentLevel = 1;
    }
    
    // Cập nhật level và độ khó
    updateLevel(level) {
        this.currentLevel = level;
        
        // Tăng tốc độ sinh kẻ địch theo level
        this.spawnRate = Math.max(30, 120 - (level - 1) * 10);
    }
    
    // Sinh ngẫu nhiên kẻ địch
    spawnEnemy() {
        if (this.spawnCooldown <= 0) {
            // Đặt lại thời gian chờ
            this.spawnCooldown = this.spawnRate;
            
            // Xác định loại kẻ địch dựa vào level
            let enemyType;
            const rand = Math.random();
            
            if (this.currentLevel <= 3) {
                // Level 1-3: Chủ yếu loại 1
                enemyType = rand < 0.8 ? 1 : 2;
            } else if (this.currentLevel <= 6) {
                // Level 4-6: Chủ yếu loại 1 và 2
                enemyType = rand < 0.5 ? 1 : (rand < 0.9 ? 2 : 3);
            } else {
                // Level 7-10: Tất cả các loại
                enemyType = rand < 0.3 ? 1 : (rand < 0.7 ? 2 : 3);
            }
            
            // Tạo vị trí ngẫu nhiên
            const x = Math.random() * (this.canvasWidth - 50);
            
            // Tạo kẻ địch mới
            this.enemies.push(new Enemy(x, -50, enemyType, this.canvasWidth));
            
            // Tăng số lượng kẻ địch theo level
            const extraEnemies = Math.floor((this.currentLevel - 1) / 3);
            if (extraEnemies > 0 && Math.random() < 0.3) {
                for (let i = 0; i < Math.min(extraEnemies, 3); i++) {
                    const extraX = Math.random() * (this.canvasWidth - 50);
                    this.enemies.push(new Enemy(extraX, -50 - i * 60, Math.max(1, Math.floor(Math.random() * enemyType) + 1), this.canvasWidth));
                }
            }
        }
    }
    
    // Cập nhật tất cả kẻ địch
    update() {
        // Giảm thời gian chờ
        this.spawnCooldown--;
        
        // Sinh kẻ địch mới nếu cần
        this.spawnEnemy();
        
        const projectileInfos = [];
        
        // Cập nhật vị trí từng kẻ địch
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            // Cập nhật vị trí kẻ địch
            const projectileInfo = enemy.update();
            if (projectileInfo) {
                projectileInfos.push(projectileInfo);
            }
            
            // Xóa kẻ địch đã ra khỏi màn hình hoặc đã bị tiêu diệt
            if (enemy.isOffScreen(this.canvasHeight) || !enemy.active) {
                this.enemies.splice(i, 1);
            }
        }
        
        return projectileInfos;
    }
    
    // Vẽ tất cả kẻ địch
    draw(ctx) {
        this.enemies.forEach(enemy => {
            enemy.draw(ctx);
        });
    }
    
    // Xóa tất cả kẻ địch
    clear() {
        this.enemies = [];
        this.spawnCooldown = this.spawnRate;
    }
    
    // Lấy danh sách kẻ địch hiện tại
    getEnemies() {
        return this.enemies;
    }
    
    // Kiểm tra va chạm với người chơi
    checkPlayerCollision(player) {
        for (let i = 0; i < this.enemies.length; i++) {
            const enemy = this.enemies[i];
            
            if (checkCollision(player, enemy)) {
                return enemy;
            }
        }
        
        return null;
    }
}