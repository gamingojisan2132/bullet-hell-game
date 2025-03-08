class GameModel {
    constructor() {
        this.score = 0;
        this.lives = 3;
        this.bombCount = 3;
        this.level = 1;
        this.isGameOver = false;
        this.backgroundVelocity = 1;
    }
    
    resetGame() {
        this.score = 0;
        this.lives = 3;
        this.bombCount = 3;
        this.level = 1;
        this.isGameOver = false;
        this.backgroundVelocity = 1;
    }
}