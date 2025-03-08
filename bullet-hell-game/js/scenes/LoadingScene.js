class LoadingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoadingScene' });
    }
    
    preload() {
        // ロード画面のUI
        this.createLoadingBar();
        
        // 画像の読み込み
        this.load.image('player', 'assets/images/player.png');
        this.load.image('enemy', 'assets/images/enemy.png');
        this.load.image('bullet', 'assets/images/bullet.png');
        this.load.image('enemyBullet', 'assets/images/enemybullet.png');
        this.load.image('explosion', 'assets/images/explosion.png');
        this.load.image('background', 'assets/images/background.png');
        this.load.image('bomb', 'assets/images/bomb.png');
        
        // 音楽・効果音の読み込み（将来的に追加）
        // this.load.audio('shoot', 'assets/audio/sfx/shoot.mp3');
        // this.load.audio('explosion', 'assets/audio/sfx/explosion.mp3');
        // this.load.audio('bgm', 'assets/audio/music/game_music.mp3');
    }
    
    create() {
        // アニメーションの設定など
        
        // メニューシーンへ遷移
        this.scene.start('MenuScene');
    }
    
    createLoadingBar() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);
        
        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'ロード中...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);
        
        const percentText = this.make.text({
            x: width / 2,
            y: height / 2,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);
        
        // 進捗イベント
        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
        });
        
        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });
    }
}