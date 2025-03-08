class ParticleManager {
    constructor(scene) {
        this.scene = scene;
        this.emitters = {};
    }
    
    // 爆発エフェクト
    createExplosion(x, y, scale = 1) {
        const particles = this.scene.add.particles('explosion');
        
        const emitter = particles.createEmitter({
            x: x,
            y: y,
            speed: { min: 50, max: 200 },
            angle: { min: 0, max: 360 },
            scale: { start: scale * 0.5, end: 0 },
            blendMode: 'ADD',
            lifespan: 500,
            gravityY: 0
        });
        
        // 一時的なエミッター
        emitter.explode(16);
        
        // 少し遅れて削除
        this.scene.time.delayedCall(1000, () => {
            particles.destroy();
        });
    }
    
    // エンジンの炎エフェクト（プレイヤー船の後ろ）
    createPlayerEngine(player) {
        const particles = this.scene.add.particles('flame');
        
        const emitter = particles.createEmitter({
            speed: 20,
            scale: { start: 0.2, end: 0 },
            blendMode: 'ADD',
            lifespan: 300
        });
        
        // プレイヤーの位置に追従
        emitter.startFollow(player, 0, 20);
        
        this.emitters['playerEngine'] = {
            particles: particles,
            emitter: emitter
        };
        
        return emitter;
    }
    
    // すべてのエミッターを削除
    destroyAll() {
        Object.values(this.emitters).forEach(entry => {
            entry.particles.destroy();
        });
        this.emitters = {};
    }
}