class Load extends Phaser.Scene {
    constructor() {
        super("mazeloadscene");
    }

    preload() {
        this.load.setPath("./assets/");

       

        // Load tilemap information
        this.load.image("tilemap_tiles", "tilemap_packed.png");                   // Packed tilemap
        this.load.tilemapTiledJSON("three-farmhouses", "three-farmhouses.tmj");   // Tilemap in JSON
    }

    create() {
        

         // ...and pass to the next Scene
         this.scene.start("pathfinderScene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}