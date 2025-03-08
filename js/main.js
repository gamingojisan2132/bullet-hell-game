// ゲームを初期化
const game = new Phaser.Game(config);

// ゲームの状態を保存するための変数
let gameState = {
    score: 0,
    highScore: localStorage.getItem('highScore') || 0,
    musicOn: true,
    soundOn: true
};

// ブラウザのリサイズイベントの処理
window.addEventListener('resize', () => {
    // ゲームのサイズを調整（オプション）
    // game.scale.resize(window.innerWidth, window.innerHeight);
});

// デバッグ用の情報
console.log('ゲームが初期化されました');
console.log('Phaserのバージョン:', Phaser.VERSION);