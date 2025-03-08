// GameView.js
class GameView {
    constructor(scene) {
        this.scene = scene;
        
        // UIの背景パネル - 半透明の黒い背景
        this.uiPanel = scene.add.rectangle(80, 70, 140, 110, 0x000000, 0.5)
            .setOrigin(0.5, 0.5);
        
        // スコアとアイコン
        this.scoreIcon = scene.add.text(20, 16, '💎', { fontSize: '20px' });
        this.scoreText = scene.add.text(50, 16, 'スコア: 0', { fontSize: '18px', fill: '#fff' });
        
        // 残機とアイコン
        this.livesIcon = scene.add.text(20, 40, '🚀', { fontSize: '20px' });
        this.livesText = scene.add.text(50, 40, '残機: 3', { fontSize: '18px', fill: '#fff' });
        
        // ボムとアイコン
        this.bombIcon = scene.add.text(20, 64, '💣', { fontSize: '20px' });
        this.bombText = scene.add.text(50, 64, 'ボム: 3', { fontSize: '18px', fill: '#fff' });
        
        // レベルとアイコン
        this.levelIcon = scene.add.text(20, 88, '⭐', { fontSize: '20px' });
        this.levelText = scene.add.text(50, 88, 'レベル: 1', { fontSize: '18px', fill: '#fff' });
        
        // ゲームオーバーテキスト（非表示）
        this.gameOverText = scene.add.text(240, 320, 'GAME OVER', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5).setVisible(false);
        
        // 背景
        this.backgroundImage = scene.add.tileSprite(240, 320, 480, 640, 'background');
        
        // 既存のUI要素を非表示にする
        this.scoreText.setVisible(false);
        this.scoreIcon.setVisible(false);
        this.livesText.setVisible(false);
        this.livesIcon.setVisible(false);
        this.bombText.setVisible(false);
        this.bombIcon.setVisible(false);
        this.levelText.setVisible(false);
        this.levelIcon.setVisible(false);
        this.uiPanel.setVisible(false);
        
        // 新しいHUDを作成
        this.createHUD();
    }

    // HUD作成メソッド
    createHUD() {
        // トップパネル（スコアとレベル表示用）
        this.topPanel = this.scene.add.rectangle(240, 30, 460, 50, 0x000000, 0.7)
            .setOrigin(0.5);
        
        // スコア表示
        this.hudScoreLabel = this.scene.add.text(80, 30, "SCORE", {
            fontSize: '14px',
            fill: '#aaaaaa'
        }).setOrigin(0.5);
        
        this.hudScore = this.scene.add.text(170, 30, "0", {
            fontSize: '24px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // レベル表示
        this.hudLevelLabel = this.scene.add.text(320, 30, "LEVEL", {
            fontSize: '14px',
            fill: '#aaaaaa'
        }).setOrigin(0.5);
        
        this.hudLevel = this.scene.add.text(380, 30, "1", {
            fontSize: '24px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // 下部パネル（残機とボム表示用）
        this.bottomPanel = this.scene.add.rectangle(240, 610, 460, 50, 0x000000, 0.7)
            .setOrigin(0.5);
        
        // 残機表示
        this.hudLivesLabel = this.scene.add.text(80, 610, "LIVES", {
            fontSize: '14px',
            fill: '#aaaaaa'
        }).setOrigin(0.5);
        
        // 残機アイコンを配置（最大5つ）
        this.livesIcons = [];
        for (let i = 0; i < 5; i++) {
            const icon = this.scene.add.text(130 + i * 25, 610, '❤️', {
                fontSize: '18px'
            }).setOrigin(0.5);
            this.livesIcons.push(icon);
        }
        
        // ボム表示
        this.hudBombLabel = this.scene.add.text(320, 610, "BOMB", {
            fontSize: '14px',
            fill: '#aaaaaa'
        }).setOrigin(0.5);
        
        // ボムアイコンを配置（最大3つ）
        this.bombIcons = [];
        for (let i = 0; i < 3; i++) {
            const icon = this.scene.add.text(370 + i * 25, 610, '💣', {
                fontSize: '18px'
            }).setOrigin(0.5);
            this.bombIcons.push(icon);
        }
    }

    // HUD更新メソッド
    updateHUD(gameModel) {
        console.log("HUD更新: スコア =", gameModel.score);
        
        // スコア表示更新
        this.hudScore.setText(gameModel.score.toString().padStart(8, '0'));
        
        // レベル表示更新
        this.hudLevel.setText(gameModel.level.toString());
        
        // 残機アイコン更新
        for (let i = 0; i < this.livesIcons.length; i++) {
            if (i < gameModel.lives) {
                this.livesIcons[i].setText('❤️');
                this.livesIcons[i].setTint(0xffffff);
            } else {
                this.livesIcons[i].setText('🖤');
                this.livesIcons[i].setTint(0x888888);
            }
        }
        
        // ボムアイコン更新
        for (let i = 0; i < this.bombIcons.length; i++) {
            if (i < gameModel.bombCount) {
                this.bombIcons[i].setAlpha(1);
            } else {
                this.bombIcons[i].setAlpha(0.3);
            }
            
            // ボムのクールダウン表示
            if (i < gameModel.bombCount && this.scene.gameController && 
                this.scene.gameController.playerModel && 
                this.scene.gameController.playerModel.bombCooldown) {
                this.bombIcons[i].setTint(0x888888);
            } else if (i < gameModel.bombCount) {
                this.bombIcons[i].setTint(0xffffff);
            }
        }
    }
    
    // UIの更新
    updateUI(gameModel) {
        // 古いUIの更新（非表示だが一応更新）
        this.scoreText.setText('スコア: ' + gameModel.score);
        
        // 残機を視覚的に表示（ハートアイコンの数で）
        let livesStr = '';
        for (let i = 0; i < gameModel.lives; i++) {
            livesStr += '❤️ ';
        }
        // 失った残機もグレーのハートで表示（最大5機とする）
        for (let i = gameModel.lives; i < 5; i++) {
            livesStr += '🖤 ';
        }
        this.livesText.setText(livesStr);
        
        // ボムを視覚的に表示
        let bombStr = '';
        for (let i = 0; i < gameModel.bombCount; i++) {
            bombStr += '💣 ';
        }
        this.bombText.setText(bombStr);
        
        // レベル表示
        this.levelText.setText('Lv.' + gameModel.level);
        
        // HUD更新
        this.updateHUD(gameModel);
    }
    
    // 背景のスクロール更新
    updateBackground(velocity) {
        this.backgroundImage.tilePositionY -= velocity;
    }
    
    // レベルアップ表示
    showLevelUp() {
        const levelUpText = this.scene.add.text(240, 320, 'LEVEL UP!', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: levelUpText,
            alpha: 0,
            y: 280,
            duration: 1000,
            onComplete: function() {
                levelUpText.destroy();
            }
        });
    }
    
    // スコアポップアップ表示（新機能）
    showScorePopup(x, y, amount) {
        console.log("スコアポップアップ表示:", x, y, amount);
        
        // スコア増加ポップアップテキスト
        const scoreText = this.scene.add.text(x, y, '+' + amount, {
            fontSize: '20px',
            fill: '#ffff00',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // アニメーション
        this.scene.tweens.add({
            targets: scoreText,
            y: y - 50,
            alpha: 0,
            scale: 1.5,
            duration: 1000,
            ease: 'Power2',
            onComplete: function() {
                scoreText.destroy();
            }
        });
    }
    
    // ゲームオーバー表示
    showGameOver() {
        this.gameOverText.setVisible(true);
        
        // 既存のリトライボタンがあれば削除
        if (this.retryButton) {
            this.retryButton.destroy();
        }
        
        // リトライボタンを追加
        this.retryButton = this.scene.add.text(240, 360, 'リトライ', {
            fontSize: '24px',
            fill: '#ffffff',
            backgroundColor: '#e74c3c',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);
        
        // 重要: ボタンをインタラクティブにする
        this.retryButton.setInteractive({ useHandCursor: true });
        
        // ホバーエフェクト
        this.retryButton.on('pointerover', () => {
            this.retryButton.setBackgroundColor('#e95b4e');
            this.retryButton.setScale(1.1);
        });
        
        this.retryButton.on('pointerout', () => {
            this.retryButton.setBackgroundColor('#e74c3c');
            this.retryButton.setScale(1.0);
        });
        
        // クリック時の処理
        this.retryButton.on('pointerdown', () => {
            console.log('リトライボタンがクリックされました');
            this.handleRetry();
        });
        
        // スペースキーでのリトライ
        if (this.spaceKey) {
            this.spaceKey.destroy();
        }
        this.spaceKey = this.scene.input.keyboard.addKey('SPACE');
        this.spaceKey.on('down', () => {
            console.log('スペースキーが押されました');
            this.handleRetry();
        });
        
        // ヘルプテキスト
        if (this.helpText) {
            this.helpText.destroy();
        }
        this.helpText = this.scene.add.text(240, 400, 'SPACEキーでもリトライできます', {
            fontSize: '16px',
            fill: '#ffffff'
        }).setOrigin(0.5);
    }
    
    // リトライ処理を共通メソッドとして分離
    handleRetry() {
        console.log('handleRetry メソッドが呼び出されました');
        
        // ボタンの見た目を変更して押された感を出す
        if (this.retryButton) {
            this.retryButton.setBackgroundColor('#c0392b');
            this.retryButton.setScale(0.95);
        }
        
        // 少し遅延させて押された感を表現
        this.scene.time.delayedCall(100, () => {
            console.log('リトライ処理を実行します');
            // シーンを直接リスタート（より確実な方法）
            this.scene.scene.restart();
        });
    }
    
    // 爆発エフェクト表示
    createExplosion(x, y, scale = 0.5) {
        const explosion = this.scene.add.sprite(x, y, 'explosion');
        explosion.setScale(scale);
        this.scene.tweens.add({
            targets: explosion,
            alpha: 0,
            scale: scale * 2,
            duration: 500,
            onComplete: function() {
                explosion.destroy();
            }
        });
    }
    
    // 落ちる星のエフェクト表示
    createFallingStar(x, y) {
        const star = this.scene.add.text(x, y, '★', {
            fontSize: Phaser.Math.Between(16, 32) + 'px',
            fill: '#ffff00'
        });
        
        this.scene.tweens.add({
            targets: star,
            y: '+=' + Phaser.Math.Between(100, 200),
            alpha: 0,
            duration: Phaser.Math.Between(500, 1500),
            onComplete: function() {
                star.destroy();
            }
        });
    }
    
    // ヒットエフェクト（一時的な色変更）
    flashSprite(sprite, color = 0xff0000, duration = 100) {
        sprite.setTint(color);
        this.scene.time.delayedCall(duration, () => {
            if (sprite.active) sprite.clearTint();
        });
    }
    
    // リソースのクリーンアップ
    cleanup() {
        if (this.retryButton) {
            this.retryButton.destroy();
            this.retryButton = null;
        }
        
        if (this.spaceKey) {
            this.spaceKey.destroy();
            this.spaceKey = null;
        }
        
        if (this.helpText) {
            this.helpText.destroy();
            this.helpText = null;
        }
    }
 }