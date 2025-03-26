/**
 * Lớp quản lý level và độ khó
 */
class LevelManager {
    constructor(onLevelUp) {
        this.currentLevel = 1;
        this.maxLevel = 10;
        this.scoreThresholds = [
            0,      // Level 1
            500,    // Level 2
            1200,   // Level 3
            2000,   // Level 4
            3000,   // Level 5
            4500,   // Level 6
            6000,   // Level 7
            8000,   // Level 8
            10000,  // Level 9
            15000   // Level 10
        ];
        this.onLevelUp = onLevelUp || function() {};
    }
    
    // Lấy level hiện tại
    getCurrentLevel() {
        return this.currentLevel;
    }
    
    // Kiểm tra và cập nhật level dựa vào điểm số
    checkLevelUp(score) {
        if (this.currentLevel >= this.maxLevel) {
            return false; // Đã đạt level tối đa
        }
        
        if (score >= this.scoreThresholds[this.currentLevel]) {
            this.currentLevel++;
            this.onLevelUp(this.currentLevel);
            return true;
        }
        
        return false;
    }
    
    // Điểm số cần đạt cho level tiếp theo
    getNextLevelScore() {
        if (this.currentLevel >= this.maxLevel) {
            return null; // Đã đạt level tối đa
        }
        
        return this.scoreThresholds[this.currentLevel];
    }
    
    // Lấy thông tin điểm số hiện tại và tiếp theo
    getLevelProgress(score) {
        if (this.currentLevel >= this.maxLevel) {
            return 100; // Đã đạt level tối đa
        }
        
        const currentThreshold = this.scoreThresholds[this.currentLevel - 1];
        const nextThreshold = this.scoreThresholds[this.currentLevel];
        
        return Math.min(100, Math.floor((score - currentThreshold) / (nextThreshold - currentThreshold) * 100));
    }
    
    // Đặt lại về level 1
    reset() {
        this.currentLevel = 1;
    }
}