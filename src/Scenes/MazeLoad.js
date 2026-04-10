class MazeLoad extends Phaser.Scene {
    constructor() {
        super("mazeloadscene");
    }

    preload() {
        this.load.setPath("./assets/");

        // lobster sprite
        this.load.image("Lobster", "Lobster16.png");

        // Load tilemap information
        this.load.image("maze_tiles", "tileset_full.png");  //tileset
        this.load.tilemapTiledJSON("TestingMaze", "TestingMaze.tmj");   // JSON (tmj) tilemap
    }

    create() {
         // go to next scene after loading assets
         this.scene.start("mazetestingscene");
    }
}