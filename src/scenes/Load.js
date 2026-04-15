class Load extends Phaser.Scene{
    constructor() {
        super('loadScene')
    }

    preload(){
        this.load.setPath("./assets/");

        this.load.image('background', './images/BackgroundV1.png');
        this.load.image('buttonDown', './images/ButtonDown.png');
        this.load.image('buttonUp', './images/ButtonUp.png');
        this.load.image('blackScreen', './images/blackscreen4.png');
        

        // lobster sprite
        this.load.image("Lobster", "Lobster16.png");

        // Load tilemap information
        this.load.image("maze_tiles", "tileset_full.png");  //tileset
        this.load.tilemapTiledJSON("TestingMaze", "Maze.tmj");   // JSON (tmj) tilemap

        // NEW: Load phone assets for shop UI (from earlier branch)
        this.load.image("phone_closed", "phone_closed.png");
        this.load.image("phone_open", "phone_open.png");
    }

    create(){
        //this.add.text(20, 20, "Load Scene", { font: "16px Arial", fill: "#ffffff" });
        this.scene.start("MainUI");
        //use .launch to start your scenes so they can run in parallel and not interrupt each other - Robert
        this.scene.launch('GameManager')
        this.scene.launch('mazeScene')
        this.scene.launch('ShopScene')
        this.scene.launch('MiniGame')

        this.scene.moveBelow('ShopScene', 'mazeScene') //moves the maze scene to be below the shop scene
    }

}