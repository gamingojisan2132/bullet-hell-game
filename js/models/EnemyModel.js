class EnemyModel {
    constructor(level) {
        this.bulletPatterns = [
            this.circlePattern,
            this.targetPlayerPattern,
            this.triplePattern,
            this.sinusoidalPattern
        ];
        this.baseHealth = 3;
        this.health = this.baseHealth + level;
        this.bulletPattern = Phaser.Math.Between(0, this.bulletPatterns.length - 1);
        this.bulletDelay = Math.max(500, 1000 - level * 50);
    }
    
    takeDamage(amount = 1) {
        this.health -= amount;
        return this.health <= 0;
    }
    
    // 弾幕パターン: 円形
    circlePattern(scene, enemy, enemyBullets) {
        for (let i = 0; i < 8; i++) {
            let angle = (i * Math.PI * 2) / 8;
            let bullet = enemyBullets.get();
            if (bullet) {
                bullet.setScale(0.5);
                bullet.setActive(true);
                bullet.setVisible(true);
                bullet.setPosition(enemy.x, enemy.y);
                
                const speed = 150;
                bullet.setVelocity(
                    Math.cos(angle) * speed,
                    Math.sin(angle) * speed
                );
            }
        }
    }
    
    // 弾幕パターン: 自機狙い
    targetPlayerPattern(scene, enemy, enemyBullets) {
        let angleToPlayer = Phaser.Math.Angle.Between(
            enemy.x, enemy.y,
            scene.player.x, scene.player.y
        );
        
        let bullet = enemyBullets.get();
        if (bullet) {
            bullet.setScale(0.5);
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.setPosition(enemy.x, enemy.y);
            
            const speed = 200;
            bullet.setVelocity(
                Math.cos(angleToPlayer) * speed,
                Math.sin(angleToPlayer) * speed
            );
        }
    }
    
    // 弾幕パターン: 3連弾
    triplePattern(scene, enemy, enemyBullets) {
        for (let i = -1; i <= 1; i++) {
            let bullet = enemyBullets.get();
            if (bullet) {
                bullet.setScale(0.5);
                bullet.setActive(true);
                bullet.setVisible(true);
                bullet.setPosition(enemy.x, enemy.y);
                
                const speed = 180;
                bullet.setVelocity(i * 50, speed);
            }
        }
    }
    
    // 弾幕パターン: 蛇行弾
    sinusoidalPattern(scene, enemy, enemyBullets) {
        let bullet = enemyBullets.get();
        if (bullet) {
            bullet.setScale(0.5);
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.setPosition(enemy.x, enemy.y);
            bullet.sinAngle = 0;
            
            bullet.isSinusoidal = true;
            bullet.baseVelocityY = 150;
            bullet.setVelocity(0, 150);
        }
    }
}