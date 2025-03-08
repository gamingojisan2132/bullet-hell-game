// GameScene.js
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    
    create() {
        // ゲームコントローラーを作成
        this.gameController = new GameController(this);
        
        // シーンにコントローラーの参照を設定する（オーバーライドしない）
        this.gameController.scene.gameController = this.gameController;
        
        // フェードイン効果（オプション）
        this.cameras.main.fadeIn(500, 0, 0, 0);
    }
    
    update(time, delta) {
        // ゲームコントローラーの更新メソッドを呼び出す
        if (this.gameController) {
            this.gameController.update(time);
        }
    }
}