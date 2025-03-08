class BulletModel {
    constructor(type) {
        this.type = type; // 'player' または 'enemy'
        this.speed = type === 'player' ? 300 : 150;
        this.damage = type === 'player' ? 1 : 1;
        this.isSinusoidal = false;
        this.sinAngle = 0;
    }
    
    // 弾の動きを更新
    updateMovement() {
        if (this.isSinusoidal) {
            this.sinAngle += 0.1;
            return {
                x: Math.sin(this.sinAngle) * 100,
                y: this.baseVelocityY || 150
            };
        }
        return null; // 通常の動きはPhysicsシステムが処理
    }
}