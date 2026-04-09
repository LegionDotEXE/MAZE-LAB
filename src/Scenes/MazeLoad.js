class Load extends Phaser.Scene {
    constructor() {
        super("mazeloadscene");
    }

    preload() {
        this.load.setPath("./assets/");

       

        // Load tilemap information
        this.load.image("maze_tiles", "tileset_full.png");  //tileset
        this.load.tilemapTiledJSON("TestingMaze", "Testing Maze.tmh");   // JSON (tmj) tilemap
    }

    create() {
        

         // ...and pass to the next Scene
         this.scene.start("MazeTesting");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}