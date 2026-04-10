class Load extends Phaser.Scene{
    constructor() {
        super('loadScene')
    }

    preload(){
      
        
    }

    create(){
        //this.add.text(20, 20, "Load Scene", { font: "16px Arial", fill: "#ffffff" });
        this.scene.start("MainUI");
    }

}