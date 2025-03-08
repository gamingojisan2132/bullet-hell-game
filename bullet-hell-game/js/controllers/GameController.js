// GameController.js
class GameController {
    constructor(scene) {
        this.scene = scene;
        
        // 各コンポーネントの初期化
        this.gameModel = new GameModel();
        this.playerModel = new PlayerModel();
        this.gameView = new GameView(scene);
        
        // 各種初期化
        this.initPhysicsGroups();
        this.initPlayer();
        this.initEnemies();
        this.initInputs();
        this.initCollisions();
        
        // 敵の弾発射タイマー
        this.enemyBulletTimer = scene.time.addEvent({
            delay: 1000,
            callback: this.fireEnemyBullets,
            callbackScope: this,
            loop: true
        });
        
        // UIの初期更新
        this.gameView.updateUI(this.gameModel);
    }
    
    // 物理グループの初期化
    initPhysicsGroups() {
        // 自機の弾グループ
        this.bullets = this.scene.physics.add.group({
            defaultKey: 'bullet',
            maxSize: 30
        });
        
        // 敵の弾グループ
        this.enemyBullets = this.scene.physics.add.group({
            defaultKey: 'enemyBullet',
            maxSize: 500
        });
        
        // ボムグループ
        this.bombs = this.scene.physics.add.group();
        
        // 敵グループ
        this.enemies = [];
    }
    
    // プレイヤーの初期化
    initPlayer() {
        this.scene.player = this.scene.physics.add.sprite(240, 550, 'player');
        this.scene.player.setCollideWorldBounds(true);
        this.scene.player.setScale(0.5);
    }
    
    // 敵の初期化
    initEnemies() {
        for (let i = 0; i < 5; i++) {
            const enemy = this.scene.physics.add.sprite(100 + i * 70, 100, 'enemy');
            enemy.setScale(0.6);
            
            // 敵のモデルを作成し関連付け
            try {
                enemy.model = new EnemyModel(this.gameModel.level);
                console.log("Enemy model created successfully:", enemy.model);
            } catch (e) {
                console.error("Error creating enemy model:", e);
            }
            
            // 敵の動きを設定
            this.scene.tweens.add({
                targets: enemy,
                x: enemy.x + Phaser.Math.Between(-100, 100),
                y: enemy.y + Phaser.Math.Between(50, 100),
                duration: 2000,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });
            
            this.enemies.push(enemy);
        }
    }
    
    // 入力の初期化
    initInputs() {
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.fireKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.bombKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        
        // クリックでリスタート
        this.scene.input.on('pointerdown', () => {
            if (this.gameModel.isGameOver) {
                this.restartGame();
            }
        });
    }
    
    // 衝突判定の初期化
    initCollisions() {
        // 弾と敵の衝突
        this.scene.physics.add.overlap(
            this.bullets, 
            this.enemies, 
            this.bulletHitEnemy, 
            null, 
            this
        );
        
        // プレイヤーと敵の弾の衝突
        this.scene.physics.add.overlap(
            this.scene.player, 
            this.enemyBullets, 
            this.enemyBulletHitPlayer, 
            null, 
            this
        );
    }
    
    // 敵の弾発射
    fireEnemyBullets() {
        if (this.gameModel.isGameOver) return;
        
        this.enemies.forEach(enemy => {
            if (!enemy.active) return;
            
            // 対応する弾幕パターンを呼び出す
            const patternFunction = enemy.model.bulletPatterns[enemy.model.bulletPattern];
            patternFunction.call(enemy.model, this.scene, enemy, this.enemyBullets);
        });
    }
    
    // 弾が敵に当たった時の処理
    bulletHitEnemy(bullet, enemy) {
        bullet.setActive(false);
        bullet.setVisible(false);
        
        // 敵のヒットエフェクト
        this.gameView.flashSprite(enemy);
        
        // モデルが存在するかチェック
        if (!enemy.model) {
            console.error("Enemy model is undefined!");
            return;
        }
        
        // 敵にダメージを与え、倒したかチェック
        if (enemy.model.takeDamage()) {
            // 爆発エフェクト
            this.gameView.createExplosion(enemy.x, enemy.y);
            
            // スコア加算
            const scoreValue = 100 * this.gameModel.level;
            this.gameModel.score += scoreValue;

            // スコアをコンソールに出力して確認
            console.log("スコア加算:", scoreValue, "現在のスコア:", this.gameModel.score);

            // スコアポップアップ表示
            this.gameView.showScorePopup(enemy.x, enemy.y, scoreValue);
            
            // 敵を非アクティブに
            enemy.setActive(false);
            enemy.setVisible(false);
            
            // 確率でボムをドロップ
            if (Phaser.Math.Between(1, 10) > 7) {
                this.dropBomb(enemy.x, enemy.y);
            }
        }
        
            // UIの更新 - これが確実に実行されていることを確認
                this.gameView.updateUI(this.gameModel);
        
        // 敵が全滅したらレベルアップ
        if (this.enemies.every(enemy => !enemy.active)) {
            this.levelUp();
        }
    }
    
    // 敵の弾がプレイヤーに当たった時の処理
    enemyBulletHitPlayer(player, bullet) {
        // 無敵状態ならダメージを受けない
        if (this.playerModel.isInvulnerable) return;
        
        bullet.setActive(false);
        bullet.setVisible(false);
        
        // 残機を減らす
        this.gameModel.lives--;
        
        // 無敵時間を設定
        this.playerModel.isInvulnerable = true;
        player.setAlpha(0.5);
        this.scene.time.delayedCall(1000, () => {
            this.playerModel.isInvulnerable = false;
            player.setAlpha(1);
        });
        
        // UIの更新
        this.gameView.updateUI(this.gameModel);
        
        // ゲームオーバー判定
        if (this.gameModel.lives <= 0) {
            this.gameOver();
        }
    }
    
    // ボムを拾った時の処理
    collectBomb(player, bomb) {
        bomb.destroy();
        
        this.gameModel.bombCount++;
        this.gameView.updateUI(this.gameModel);
    }
    
    // ボムをドロップする
    dropBomb(x, y) {
        const bomb = this.bombs.create(x, y, 'bomb');
        bomb.setScale(0.5);
        bomb.setVelocityY(100);
        
        this.scene.physics.add.overlap(
            this.scene.player, 
            bomb, 
            this.collectBomb, 
            null, 
            this
        );
    }
    
    // ボム発動
    activateBomb() {
        // ボムがない、またはクールダウン中なら使えない
        if (this.gameModel.bombCount <= 0 || this.playerModel.bombCooldown) return;
        
        this.gameModel.bombCount--;
        this.playerModel.bombCooldown = true;
        
        // 画面上の敵の弾をすべて消す
        this.enemyBullets.getChildren().forEach(bullet => {
            // 弾が消える爆発エフェクト
            this.gameView.createExplosion(bullet.x, bullet.y, 0.3);
            
            bullet.setActive(false);
            bullet.setVisible(false);
        });
        
        // 敵にダメージ
        this.enemies.forEach(enemy => {
            if (enemy.active && enemy.model) {
                // 敵のヒットエフェクト
                this.gameView.flashSprite(enemy, 0xff0000, 200);
                
                // ダメージと撃破判定
                if (enemy.model.takeDamage(2)) {
                    this.gameView.createExplosion(enemy.x, enemy.y);
                    
                    // スコア加算
                    const scoreValue = 100 * this.gameModel.level;
                    this.gameModel.score += scoreValue;
                    
                    // スコアポップアップ表示
                    this.gameView.showScorePopup(enemy.x, enemy.y, scoreValue);
                    
                    // 敵を非アクティブに
                    enemy.setActive(false);
                    enemy.setVisible(false);
                }
            }
        });
        
        // 画面全体の爆発エフェクト
        const flash = this.scene.add.rectangle(240, 320, 480, 640, 0xffffff);
        flash.setAlpha(0.8);
        this.scene.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 500,
            onComplete: function() {
                flash.destroy();
            }
        });
        
        // UIの更新
        this.gameView.updateUI(this.gameModel);
        
        // ボムのクールダウン
        this.scene.time.delayedCall(2000, () => {
            this.playerModel.bombCooldown = false;
        });
    }
    
    // レベルアップ処理
    levelUp() {
        this.gameModel.levelUp();
        this.gameView.showLevelUp();
        this.gameView.updateUI(this.gameModel);
        
        // 次のレベルの敵を生成
        this.scene.time.delayedCall(1000, () => {
            // 前のレベルの敵をクリア
            this.enemies = this.enemies.filter(enemy => enemy.active);
            
            // 新しい敵を追加
            this.initEnemies();
            
            // 弾の発射間隔を短く
            this.playerModel.improveFireRate();
            
            // 敵の弾発射頻度を上げる
            this.enemyBulletTimer.delay = Math.max(500, 1000 - this.gameModel.level * 50);
        });
    }
    
    // ゲームオーバー処理
    gameOver() {
        this.gameModel.isGameOver = true;
        
        this.scene.physics.pause();
        
        this.scene.player.setTint(0xff0000);
        this.gameView.createExplosion(this.scene.player.x, this.scene.player.y, 1);
        this.gameView.showGameOver();
    }
    
    // ゲームのリスタート
    restartGame() {
        // ゲームビューのクリーンアップ
        if (this.gameView) {
            this.gameView.cleanup();
        }
        
        // ゲームの状態をリセット
        this.gameModel.resetGame();
        
        // シーンを再起動
        this.scene.scene.restart();
    }
    
    // プレイヤーの入力を処理
    handlePlayerInput(time) {
        if (this.gameModel.isGameOver) return;
        
        const player = this.scene.player;
        let speedMultiplier = 1;
        
        // シフトキーで低速移動
        if (this.cursors.shift.isDown) {
            speedMultiplier = 0.5;
            player.setScale(0.3);
        } else {
            player.setScale(0.5);
        }
        
        // 移動
        if (this.cursors.left.isDown) {
            player.setVelocityX(-this.playerModel.speed * speedMultiplier);
        } else if (this.cursors.right.isDown) {
            player.setVelocityX(this.playerModel.speed * speedMultiplier);
        } else {
            player.setVelocityX(0);
        }
        
        if (this.cursors.up.isDown) {
            player.setVelocityY(-this.playerModel.speed * speedMultiplier);
        } else if (this.cursors.down.isDown) {
            player.setVelocityY(this.playerModel.speed * speedMultiplier);
        } else {
            player.setVelocityY(0);
        }
        
        // 弾の発射
        if (this.fireKey.isDown && this.playerModel.canFireBullet(time)) {
            this.fireBullet();
            this.playerModel.updateFireTime(time);
        }
        
        // ボムの使用
        if (this.bombKey.isDown) {
            this.activateBomb();
        }
    }
    
    // 自機の弾発射
    fireBullet() {
        const player = this.scene.player;
        let bullet = this.bullets.get();
        if (bullet) {
            bullet.setScale(0.5);
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.setPosition(player.x, player.y - 20);
            bullet.setVelocityY(-300);
        }
    }
    
    // ゲームの更新処理
    update(time) {
        if (this.gameModel.isGameOver) return;
        
        // 背景スクロール
        this.gameView.updateBackground(this.gameModel.backgroundVelocity);
        
        // プレイヤー入力処理
        this.handlePlayerInput(time);
        
        // 画面外に出た弾を削除
        this.cleanupBullets();
        
        // 蛇行弾の処理
        this.updateSinusoidalBullets();
    }
    
    // 画面外の弾を削除
    cleanupBullets() {
        this.bullets.getChildren().forEach(bullet => {
            if (bullet.y < -10) {
                bullet.setActive(false);
                bullet.setVisible(false);
            }
        });
        
        this.enemyBullets.getChildren().forEach(bullet => {
            if (bullet.y > 650 || bullet.y < -10 || bullet.x < -10 || bullet.x > 490) {
                bullet.setActive(false);
                bullet.setVisible(false);
            }
        });
    }
    
    // 蛇行弾の動きを更新
    updateSinusoidalBullets() {
        this.enemyBullets.getChildren().forEach(bullet => {
            if (bullet.active && bullet.isSinusoidal) {
                bullet.sinAngle = (bullet.sinAngle || 0) + 0.1;
                bullet.setVelocityX(Math.sin(bullet.sinAngle) * 100);
                bullet.setVelocityY(bullet.baseVelocityY);
            }
        });
    }
}