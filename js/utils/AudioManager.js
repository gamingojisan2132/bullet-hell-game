class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.sounds = {};
        this.music = null;
        this.isMuted = false;
    }
    
    // 効果音を再生
    playSound(key, volume = 1) {
        if (this.isMuted) return;
        
        if (!this.sounds[key]) {
            this.sounds[key] = this.scene.sound.add(key);
        }
        
        this.sounds[key].play({ volume: volume });
    }
    
    // BGMを再生
    playMusic(key, volume = 0.5, loop = true) {
        if (this.music) {
            this.music.stop();
        }
        
        this.music = this.scene.sound.add(key);
        this.music.play({
            volume: this.isMuted ? 0 : volume,
            loop: loop
        });
    }
    
    // ミュート切り替え
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        // すべての効果音をミュート/ミュート解除
        Object.values(this.sounds).forEach(sound => {
            sound.setMute(this.isMuted);
        });
        
        // BGMをミュート/ミュート解除
        if (this.music) {
            this.music.setMute(this.isMuted);
        }
        
        return this.isMuted;
    }
}