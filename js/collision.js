/**
 * Hàm kiểm tra va chạm giữa hai đối tượng
 * @param {Object} obj1 - Đối tượng thứ nhất với các thuộc tính x, y, width, height
 * @param {Object} obj2 - Đối tượng thứ hai với các thuộc tính x, y, width, height
 * @returns {boolean} - true nếu có va chạm, false nếu không
 */
function checkCollision(obj1, obj2) {
    return (
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
    );
}

/**
 * Hàm kiểm tra va chạm giữa hai hình tròn
 * @param {Object} circle1 - Hình tròn thứ nhất với các thuộc tính x, y, radius
 * @param {Object} circle2 - Hình tròn thứ hai với các thuộc tính x, y, radius
 * @returns {boolean} - true nếu có va chạm, false nếu không
 */
function checkCircleCollision(circle1, circle2) {
    const dx = circle1.x - circle2.x;
    const dy = circle1.y - circle2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    return distance < circle1.radius + circle2.radius;
}

/**
 * Hàm kiểm tra va chạm giữa một hình chữ nhật và một hình tròn
 * @param {Object} rect - Hình chữ nhật với các thuộc tính x, y, width, height
 * @param {Object} circle - Hình tròn với các thuộc tính x, y, radius
 * @returns {boolean} - true nếu có va chạm, false nếu không
 */
function checkRectCircleCollision(rect, circle) {
    // Tìm điểm gần nhất trên hình chữ nhật với tâm hình tròn
    const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
    
    // Tính khoảng cách từ điểm gần nhất đến tâm hình tròn
    const dx = closestX - circle.x;
    const dy = closestY - circle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    return distance < circle.radius;
}