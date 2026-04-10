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
    }

    create(){
        //use .launch to start your scenes so they can run in parallel and not interrupt each other - Robert
        this.scene.launch('GameManager')
        this.scene.launch('ShopScene')
        this.scene.launch('MiniGame')
        this.scene.launch('mazeScene')
    }

}