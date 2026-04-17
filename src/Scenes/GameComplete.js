class GameComplete extends Phaser.Scene{
    constructor() {
        super('GameComplete')
    }

    create(){
        this.DragSystemUI = this.scene.get('MainUI');
        this.gameManager = this.scene.get('GameManager');
        this.Maze = this.scene.get('mazeScene');
        this.MiniGame = this.scene.get('MiniGame');
        this.Shop = this.scene.get('ShopScene')
    }
    
    EndGame(){
        const { width, height } = this.cameras.main;

        console.log("complete");
        this.MiniGame.scene.stop();
        this.Maze.scene.stop();
        this.DragSystemUI.scene.stop();
        this.Shop.scene.stop();
        this.Maze.mazeBGM.stop();

        this.sound.play("FNAFPowerOff");

        this.endScreen = this.add.rectangle(0, 0, width, height, 0x0b0b17, 1).setOrigin(0).setAlpha(0);
        
        this.tweens.add({
            targets: this.endScreen,
            duration: 10000,
            ease: "Cubic.easeInOut",
            alpha: 1,
            onComplete: () => {
            this.label = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, `THANKS FOR PLAYING`, {
            font: '24px Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
            }
        })


        
    }
}