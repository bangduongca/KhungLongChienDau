/**
 * Lớp quản lý giao diện người dùng
 */
class UI {
    constructor() {
        // Các phần tử DOM
        this.startScreen = document.getElementById('startScreen');
        this.tutorialScreen = document.getElementById('tutorialScreen');
        this.pauseScreen = document.getElementById('pauseScreen');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.scoreDisplay = document.getElementById('scoreDisplay');
        this.eggDisplay = document.getElementById('eggDisplay');
        this.finalScore = document.getElementById('finalScore');
        this.highScore = document.getElementById('highScore');
        this.healthFill = document.querySelector('.health-fill');
        this.levelIndicator = document.getElementById('levelIndicator');
        this.levelTransition = document.getElementById('levelTransition');
        
        // Nút và điều khiển
        this.startBtn = document.getElementById('startBtn');
        this.tutorialBtn = document.getElementById('tutorialBtn');
        this.backBtn = document.getElementById('backBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resumeBtn = document.getElementById('resumeBtn');
        this.quitBtn = document.getElementById('quitBtn');
        this.restartBtn = document.getElementById('restartBtn');
        this.homeBtn = document.getElementById('homeBtn');
        this.leftBtn = document.getElementById('leftBtn');
        this.rightBtn = document.getElementById('rightBtn');
        this.shootBtn = document.getElementById('shootBtn');
        
        // Điểm cao nhất từ localStorage
        this.highScoreValue = localStorage.getItem('dinoEggShooterHighScore') || 0;
    }
    
    // Khởi tạo các event listener
    init(onStart, onPause, onResume, onRestart, onHome, onLeftDown, onLeftUp, onRightDown, onRightUp, onShoot) {
        // Nút bắt đầu
        this.startBtn.addEventListener('click', () => {
            this.hideAllScreens();
            onStart();
			
			  // Cho phép phát nhạc sau khi người dùng tương tác
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        });
        
        // Nút hướng dẫn
        this.tutorialBtn.addEventListener('click', () => {
            this.showScreen(this.tutorialScreen);
        });
        
        // Nút quay lại từ màn hình hướng dẫn
        this.backBtn.addEventListener('click', () => {
            this.showScreen(this.startScreen);
        });
        
        // Nút tạm dừng
        this.pauseBtn.addEventListener('click', () => {
            this.showScreen(this.pauseScreen);
            onPause();
        });
        
        // Nút tiếp tục
        this.resumeBtn.addEventListener('click', () => {
            this.hideAllScreens();
            onResume();
        });
        
        // Nút thoát khi đang tạm dừng
        this.quitBtn.addEventListener('click', () => {
            this.showScreen(this.startScreen);
            onHome();
        });
        
        // Nút chơi lại khi game over
        this.restartBtn.addEventListener('click', () => {
            this.hideAllScreens();
            onRestart();
        });
        
        // Nút về trang chủ khi game over
        this.homeBtn.addEventListener('click', () => {
            this.showScreen(this.startScreen);
            onHome();
        });
        
        // Điều khiển di chuyển trên điện thoại
        this.leftBtn.addEventListener('touchstart', onLeftDown);
        this.leftBtn.addEventListener('touchend', onLeftUp);
        this.rightBtn.addEventListener('touchstart', onRightDown);
        this.rightBtn.addEventListener('touchend', onRightUp);
        this.shootBtn.addEventListener('touchstart', onShoot);
        
        // Thêm sự kiện nhấn chuột cho nút điều khiển (để hỗ trợ trên desktop)
        this.leftBtn.addEventListener('mousedown', onLeftDown);
        this.leftBtn.addEventListener('mouseup', onLeftUp);
        this.leftBtn.addEventListener('mouseleave', onLeftUp);
        this.rightBtn.addEventListener('mousedown', onRightDown);
        this.rightBtn.addEventListener('mouseup', onRightUp);
        this.rightBtn.addEventListener('mouseleave', onRightUp);
        this.shootBtn.addEventListener('mousedown', onShoot);
        
        // Hiển thị điểm cao nhất trong localStorage
        this.updateHighScore(this.highScoreValue);
    }
    
    // Hiển thị một màn hình và ẩn các màn hình khác
    showScreen(screen) {
        this.hideAllScreens();
        screen.classList.add('active');
    }
    
    // Ẩn tất cả các màn hình
    hideAllScreens() {
        this.startScreen.classList.remove('active');
        this.tutorialScreen.classList.remove('active');
        this.pauseScreen.classList.remove('active');
        this.gameOverScreen.classList.remove('active');
    }
    
    // Cập nhật điểm số hiển thị
    updateScore(score) {
        this.scoreDisplay.textContent = `Điểm: ${score}`;
    }
    
    // Cập nhật số lượng trứng hiển thị
    updateEggs(eggs) {
        this.eggDisplay.textContent = `Trứng: ${eggs}`;
    }
    
    // Cập nhật thanh máu
    updateHealth(health, maxHealth) {
        const percentage = (health / maxHealth) * 100;
        this.healthFill.style.width = `${percentage}%`;
        
        // Thay đổi màu sắc dựa vào lượng máu còn lại
        if (percentage > 50) {
            this.healthFill.style.backgroundColor = '#4caf50';
        } else if (percentage > 20) {
            this.healthFill.style.backgroundColor = '#ffc107';
        } else {
            this.healthFill.style.backgroundColor = '#f44336';
        }
    }
    
    // Cập nhật level hiển thị
    updateLevel(level) {
        this.levelIndicator.textContent = `Cấp ${level}`;
    }
    
    // Hiển thị hiệu ứng chuyển level
    showLevelTransition(level) {
        this.levelTransition.textContent = `Cấp ${level}`;
        this.levelTransition.classList.add('show');
        
        // Tự động ẩn sau 2 giây
        setTimeout(() => {
            this.levelTransition.classList.remove('show');
        }, 2000);
    }
    
    // Hiển thị màn hình kết thúc game
    showGameOver(score) {
        // Cập nhật điểm số cuối cùng
        this.finalScore.textContent = `Điểm số: ${score}`;
        
        // Kiểm tra và cập nhật điểm cao nhất
        if (score > this.highScoreValue) {
            this.highScoreValue = score;
            localStorage.setItem('dinoEggShooterHighScore', score);
        }
        
        this.updateHighScore(this.highScoreValue);
        this.showScreen(this.gameOverScreen);
    }
    
    // Cập nhật điểm cao nhất
    updateHighScore(highScore) {
        this.highScore.textContent = `Điểm cao nhất: ${highScore}`;
    }
}