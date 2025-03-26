/**
 * Lớp quản lý logic game
 */
class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Cài đặt kích thước canvas
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        // Khởi tạo các thành phần game
        this.player = new Player(this.canvas.width, this.canvas.height);
        this.projectileManager = new ProjectileManager();
        this.enemyManager = new EnemyManager(this.canvas.width, this.canvas.height);
        this.powerUpManager = new PowerUpManager(this.canvas.width, this.canvas.height);
        
        // Khởi tạo giao diện người dùng
        this.ui = new UI();
        
        // Khởi tạo quản lý level
        this.levelManager = new LevelManager((level) => {
            this.ui.showLevelTransition(level);
            this.ui.updateLevel(level);
            this.enemyManager.updateLevel(level);
            
            // Phát âm thanh lên level
            assetManager.playSound('levelup', 0.7);
        });
        
        // Trạng thái game
        this.isRunning = false;
        this.score = 0;
        this.gameLoopId = null;
        
        // Khởi tạo sự kiện điều khiển
        this.setupEventListeners();
        
        // Khởi tạo hàm xử lý trong UI
        this.initUIHandlers();
		    // Thêm thuộc tính để theo dõi nhạc nền
		this.backgroundMusic = null;
		this.isMusicPlaying = false;
		
		// Thêm nút bật/tắt nhạc
		this.setupMusicControl();
		    // Thêm vào đây
		window.gameInstance = this;
		
    }
    
	  // Thêm phương thức mới setupMusicControl
    setupMusicControl() {
        const musicBtn = document.createElement('button');
        musicBtn.innerHTML = '🔊';
        musicBtn.className = 'btn music-btn';
        musicBtn.title = 'Bật/Tắt nhạc';
        
        // Thêm vào giao diện
        const container = document.querySelector('.ui-container');
        container.appendChild(musicBtn);
        
        // Xử lý sự kiện click
        musicBtn.addEventListener('click', () => {
            if (this.isMusicPlaying) {
                this.stopMusic();
                musicBtn.innerHTML = '🔇';
            } else {
                this.playMusic();
                musicBtn.innerHTML = '🔊';
            }
        });
    }
    
    // Thêm phương thức phát nhạc
    playMusic() {
        if (assetManager.sounds['bgMusic']) {
            if (!this.backgroundMusic) {
                this.backgroundMusic = assetManager.sounds['bgMusic'];
                this.backgroundMusic.loop = true;
                this.backgroundMusic.volume = 0.3;
            }
            this.backgroundMusic.play().catch(error => {
                console.log("Không thể phát nhạc: ", error);
            });
            this.isMusicPlaying = true;
        }
    }
    
    // Thêm phương thức dừng nhạc
    stopMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
            this.isMusicPlaying = false;
        }
    }
	
    // Thiết lập các event listener
    setupEventListeners() {
        // Sự kiện bàn phím
        window.addEventListener('keydown', (e) => {
            if (!this.isRunning) return;
            
            switch (e.key) {
                case 'ArrowLeft':
                    this.player.moveLeft = true;
                    break;
                case 'ArrowRight':
                    this.player.moveRight = true;
                    break;
                case 'ArrowUp':
                case ' ': // Phím Space
                    this.shootEgg();
                    break;
                case 'Escape':
                    this.pauseGame();
                    break;
            }
        });
        
        window.addEventListener('keyup', (e) => {
            if (!this.isRunning) return;
            
            switch (e.key) {
                case 'ArrowLeft':
                    this.player.moveLeft = false;
                    break;
                case 'ArrowRight':
                    this.player.moveRight = false;
                    break;
            }
        });
		    // Thêm xử lý cho touch events
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');
    const shootBtn = document.getElementById('shootBtn');
    
					if (leftBtn) {
				['touchstart', 'mousedown'].forEach(eventType => {
					leftBtn.addEventListener(eventType, (e) => {
						e.preventDefault();
						this.player.moveLeft = true;
					});
				});
				
				['touchend', 'touchcancel', 'mouseup', 'mouseleave'].forEach(eventType => {
					leftBtn.addEventListener(eventType, (e) => {
						e.preventDefault();
						this.player.moveLeft = false;
					});
				});
			}

			if (rightBtn) {
				['touchstart', 'mousedown'].forEach(eventType => {
					rightBtn.addEventListener(eventType, (e) => {
						e.preventDefault();
						this.player.moveRight = true;
					});
				});
				
				['touchend', 'touchcancel', 'mouseup', 'mouseleave'].forEach(eventType => {
					rightBtn.addEventListener(eventType, (e) => {
						e.preventDefault();
						this.player.moveRight = false;
					});
				});
			}

			if (shootBtn) {
				['touchstart', 'mousedown'].forEach(eventType => {
					shootBtn.addEventListener(eventType, (e) => {
						e.preventDefault();
						this.shootEgg();
					});
				});
			}
    }
    
    // Khởi tạo các hàm xử lý trong UI
    initUIHandlers() {
        this.ui.init(
            // onStart
            () => this.startGame(),
            
            // onPause
            () => this.pauseGame(),
            
            // onResume
            () => this.resumeGame(),
            
            // onRestart
            () => this.restartGame(),
            
            // onHome
            () => this.goToHome(),
            
            // onLeftDown
            () => { if (this.isRunning) this.player.moveLeft = true; },
            
            // onLeftUp
            () => { if (this.isRunning) this.player.moveLeft = false; },
            
            // onRightDown
            () => { if (this.isRunning) this.player.moveRight = true; },
            
            // onRightUp
            () => { if (this.isRunning) this.player.moveRight = false; },
            
            // onShoot
            () => { if (this.isRunning) this.shootEgg(); }
        );
    }
    
    // Bắt đầu game
    startGame() {
		
        // Đặt lại trạng thái
        this.resetGame();
        
        // Bắt đầu game loop
        this.isRunning = true;
        this.gameLoop();
		// Hiển thị gợi ý nhấn nút âm thanh
		this.showAudioHint();
    }
    
    // Tạm dừng game
    pauseGame() {
        this.isRunning = false;
        if (this.gameLoopId) {
            cancelAnimationFrame(this.gameLoopId);
            this.gameLoopId = null;
        }
    }
    
    // Tiếp tục game
    resumeGame() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.gameLoop();
        }
    }
    
    // Chơi lại game
    restartGame() {
        this.resetGame();
        this.isRunning = true;
        this.gameLoop();
    }
    
    // Trở về trang chủ
    goToHome() {
        this.pauseGame();
        this.resetGame();
    }
    
    // Đặt lại game
    resetGame() {
        this.score = 0;
        this.player.reset();
        this.projectileManager.clear();
        this.enemyManager.clear();
        this.powerUpManager.clear();
        this.levelManager.reset();
        
        // Cập nhật giao diện
        this.ui.updateScore(this.score);
        this.ui.updateEggs(this.player.eggs);
        this.ui.updateHealth(this.player.health, this.player.maxHealth);
        this.ui.updateLevel(this.levelManager.getCurrentLevel());
    }
    
    // Bắn trứng
    shootEgg() {
        const eggPos = this.player.shoot();
        if (eggPos) {
            this.projectileManager.add(eggPos.x, eggPos.y, 8, 'egg');
            this.ui.updateEggs(this.player.eggs);
        }
    }
    
    // Vòng lặp game chính
    gameLoop() {
        if (!this.isRunning) return;
        
        // Cập nhật người chơi
        this.player.update();
        
        // Cập nhật đạn
        this.projectileManager.update(this.canvas.height);
        
        // Cập nhật kẻ địch và sinh kẻ địch mới
        const enemyProjectiles = this.enemyManager.update();
        
        // Thêm đạn của kẻ địch
        enemyProjectiles.forEach(proj => {
            this.projectileManager.add(proj.x, proj.y, proj.speed, 'enemy');
        });
        
        // Cập nhật vật phẩm
        this.powerUpManager.update();
        
        // Kiểm tra va chạm giữa trứng và kẻ địch
        const enemies = this.enemyManager.getEnemies();
        const projectiles = this.projectileManager.getProjectiles().filter(p => p.type === 'egg');
        
        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
            
            for (let j = 0; j < projectiles.length; j++) {
                const projectile = projectiles[j];
                
                if (projectile.active && checkCollision(enemy, projectile)) {
                    projectile.active = false;
                    
                    // Kẻ địch nhận sát thương
                    const isDestroyed = enemy.takeDamage(1);
                    
                    if (isDestroyed) {
                        // Cộng điểm khi tiêu diệt kẻ địch
                        this.score += enemy.score;
                        this.ui.updateScore(this.score);
                        
                        // Kiểm tra lên level
                        if (this.levelManager.checkLevelUp(this.score)) {
                            // Đã lên level, đã gọi callback ở constructor
                        }
                        
                        // Có thể sinh vật phẩm khi tiêu diệt kẻ địch
                        this.powerUpManager.spawnPowerUp(enemy.x, enemy.y, enemy.type);
                    }
                }
            }
        }
        
        // Kiểm tra va chạm giữa đạn địch và người chơi
        const enemyProjectiles2 = this.projectileManager.getProjectiles().filter(p => p.type === 'enemy');
        
        for (const proj of enemyProjectiles2) {
            if (proj.active && checkCollision(this.player, proj)) {
                proj.active = false;
                
                // Người chơi nhận sát thương
                const isDead = this.player.takeDamage(10);
                this.ui.updateHealth(this.player.health, this.player.maxHealth);
                
                if (isDead) {
                    this.gameOver();
                    return;
                }
            }
        }
        
        // Kiểm tra va chạm giữa người chơi và kẻ địch
        const collidedEnemy = this.enemyManager.checkPlayerCollision(this.player);
        if (collidedEnemy) {
            // Người chơi nhận sát thương khi va chạm với kẻ địch
            const isDead = this.player.takeDamage(20);
            this.ui.updateHealth(this.player.health, this.player.maxHealth);
            
            // Kẻ địch cũng bị tiêu diệt khi va chạm
            collidedEnemy.active = false;
            
            if (isDead) {
                this.gameOver();
                return;
            }
        }
        
        // Kiểm tra va chạm giữa người chơi và vật phẩm
        this.powerUpManager.checkPlayerCollision(this.player);
        this.ui.updateEggs(this.player.eggs);
        this.ui.updateHealth(this.player.health, this.player.maxHealth);
        
        // Vẽ tất cả các đối tượng
        this.render();
        
        // Tiếp tục vòng lặp
        this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
    }
    
    // Vẽ tất cả các đối tượng
    render() {
        // Xóa màn hình
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Vẽ nền
        if (assetManager.getImage('background')) {
            this.ctx.drawImage(assetManager.getImage('background'), 0, 0, this.canvas.width, this.canvas.height);
        } else {
            // Vẽ nền đơn giản nếu không có hình
            this.ctx.fillStyle = '#98f5ab';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        
        // Vẽ người chơi
        this.player.draw(this.ctx);
        
        // Vẽ kẻ địch
        this.enemyManager.draw(this.ctx);
        
        // Vẽ đạn
        this.projectileManager.draw(this.ctx);
        
        // Vẽ vật phẩm
        this.powerUpManager.draw(this.ctx);
    }
    
    // Kết thúc game
    gameOver() {
        this.isRunning = false;
        
        // Phát âm thanh kết thúc
        assetManager.playSound('gameover', 0.7);
        
        // Hiển thị màn hình kết thúc
        this.ui.showGameOver(this.score);
    }
	
	
}
