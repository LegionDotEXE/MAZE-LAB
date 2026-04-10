class GameManager extends Phaser.Scene {
    constructor() {
        super('GameManager')

        // Initialize player stats
        this.money = 0;
        this.battery = 100;
    }

    create(){
        // Ensure this scene stays in the background and doesn't interfere with other scenes
        this.cameras.main.setVisible(false);
        
        // Log to confirm GameManager is running
        console.log("GameManager initialized - Money:", this.money, "Battery:", this.battery);
    }
    
    update() {
        // Keep GameManager stats accessible
        // This scene runs in parallel without rendering
    }
}