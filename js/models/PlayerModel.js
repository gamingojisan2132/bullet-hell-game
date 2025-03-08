class PlayerModel {
    constructor() {
        this.lastFired = 0;
        this.fireRate = 100; // 発射間隔（ms）
        this.isInvulnerable = false;
        this.speed = 160;
        this.bombCooldown = false;
    }
    
    canFireBullet(time) {
        return time > this.lastFired;
    }
    
    updateFireTime(time) {
        this.lastFired = time + this.fireRate;
    }
    
    improveFireRate() {
        this.fireRate = Math.max(50, this.fireRate - 5);
    }
}