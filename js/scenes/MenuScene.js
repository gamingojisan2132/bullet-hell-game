class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }
    
    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 背景
        this.add.tileSprite(width / 2, height / 2, width, height, 'background');
        
        // タイトル
        const title = this.add.text(width / 2, height / 4, '弾幕シューティングゲーム', {
            font: '32px Arial',
            fill: '#ffffff'
        });
        title.setOrigin(0.5);
        
        // スタートボタン
        const startButton = this.add.text(width / 2, height / 2, 'ゲームスタート', {
            font: '24px Arial',
            fill: '#ffffff',
            padding: { x: 20, y: 10 },
            backgroundColor: '#1a6dd1'
        });
        startButton.setOrigin(0.5);
        startButton.setInteractive();
        
        // ホバーエフェクト
        startButton.on('pointerover', () => {
            startButton.setBackgroundColor('#3a8df1');
        });
        
        startButton.on('pointerout', () => {
            startButton.setBackgroundColor('#1a6dd1');
        });
        
        // クリックでゲーム開始
        startButton.on('pointerdown', () => {
            this.startGame();
        });
        
        // ヘルプテキスト
        this.add.text(width / 2, height / 2 + 50, 'SPACEキーでもスタートできます', {
            font: '16px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        // スペースキーの設定
        this.input.keyboard.on('keydown-SPACE', () => {
            this.startGame();
        });
        
        // 操作説明
        const controls = [
            '【操作方法】',
            '矢印キー: 移動',
            'SPACE: ショット',
            'Z: ボム',
            'SHIFT: 低速移動（判定が小さくなります）'
        ];
        
        let y = height / 2 + 80;
        controls.forEach(text => {
            this.add.text(width / 2, y, text, {
                font: '18px Arial',
                fill: '#ffffff'
            }).setOrigin(0.5);
            y += 30;
        });
        
        // バージョン表示
        this.add.text(width - 10, height - 10, 'v1.0.0', {
            font: '12px Arial',
            fill: '#ffffff'
        }).setOrigin(1);
    }
    
    startGame() {
        this.scene.start('GameScene');
    }
}