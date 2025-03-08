class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }
    
    preload() {
        // ロゴや最小限のアセットを読み込む
        this.load.image('logo', 'assets/images/ui/logo.png');
        this.load.image('loading-bar', 'assets/images/ui/loading-bar.png');
    }
    
    create() {
        // ロード画面へ遷移
        this.scene.start('LoadingScene');
    }
}