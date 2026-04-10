class Load extends Phaser.Scene{
    constructor() {
        super('loadScene')
    }

    preload(){
      this.load.setPath("./assets/");

        // lobster sprite
        this.load.image("Lobster", "Lobster16.png");

        // Load tilemap information
        this.load.image("maze_tiles", "tileset_full.png");  //tileset
        this.load.tilemapTiledJSON("TestingMaze", "TestingMaze.tmj");   // JSON (tmj) tilemap
        
        // NEW: Load monitor and button assets
        this.load.image("monitor_screen", "monitor_screen.png");
        this.load.image("mini_game_button", "mini_game_button.png");
        this.load.image("phone_closed", "phone_closed.png");
        this.load.image("phone_open", "phone_open.png");

        // Custom cursor asset
        //this.load.image("hand_cursor", "hand_cursor.png");
    }

    create(){
        // Added a custom cursor that follows the mouse pointer
        // Initially planned 
        // --------------------------------------------------
        // this.cursor = this.add.image(0, 0, 'hand_cursor')
        //     .setDepth(10000)     
        //     .setOrigin(0.2)      
        //     .setScrollFactor(0);  
        
        // Update cursor position on pointer move
        this.input.on('pointermove', (pointer) => {
            this.cursor.setPosition(pointer.x, pointer.y);
        });

        this.scene.launch('GameManager')
        this.scene.launch('ShopScene')
        this.scene.launch('MiniGame')
        this.scene.launch('mazeScene')
    }

}