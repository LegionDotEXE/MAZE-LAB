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
        this.load.image('monitor', './images/Monitor.png');
        
        // lobster sprite
        this.load.image("Lobster", "./sprites/Lobster16.png");
        this.load.image("LobsterHigh", "./sprites/LobsterHigh.png");
        this.load.image("LobsterCrack", "./sprites/LobsterCrack.png");
        this.load.image("LobsterTrip", "./sprites/LobsterTrip.png");
        this.load.image("LobsterMeds", "./sprites/LobsterMeds.png");
        this.load.image("LobsterHC", "./sprites/LobsterHC.png");
        this.load.image("LobsterHT", "./sprites/LobsterHT.png");
        this.load.image("LobsterHM", "./sprites/LobsterHM.png");
        this.load.image("LobsterCT", "./sprites/LobsterCT.png");
        this.load.image("LobsterCM", "./sprites/LobsterCM.png");
        this.load.image("LobsterTM", "./sprites/LobsterTM.png");

        // drug icons
        this.load.image("high", "high.png");
        this.load.image("Phigh", "Phigh.png");
        this.load.image("crack", "crack.png");
        this.load.image("Pcrack", "Pcrack.png");
        this.load.image("trip", "trip.png");
        this.load.image("Ptrip", "Ptrip.png");
        this.load.image("meds", "meds.png");

        // goal item
        this.load.image("goal", "Tfruit.png");

        this.load.json('drugData', '../lib/drugs.json');   
        
        // Load tilemap information
        this.load.image("maze_tiles", "tileset_full.png");  //tileset
        this.load.tilemapTiledJSON("TestingMaze", "Maze.tmj");   // JSON (tmj) tilemap

        // NEW: Load phone assets for shop UI (from earlier branch)
        this.load.image("phone_closed", "phone_closed.png");
        this.load.image("phone_open", "phone_open.png");

        //title screen logo
        this.load.image("title_logo", "title.png");
    }

    create(){
        //this.add.text(20, 20, "Load Scene", { font: "16px Arial", fill: "#ffffff" });
        //use .launch to start your scenes so they can run in parallel and not interrupt each other - Robert
        
        this.scene.launch('GameManager')
        this.scene.launch('mazeScene')
        this.scene.launch('ShopScene')
        this.scene.launch('MiniGame')
        this.scene.launch("MainUI");
        this.scene.launch('TitleScreen');
        this.scene.launch('CursorScene');
        this.scene.bringToTop('CursorScene');

        this.scene.moveAbove('ShopScene', 'mainUI') //moves the maze scene to be below the shop scene
        this.scene.bringToTop('MainUI') 
        this.scene.bringToTop('TitleScreen')
    }

}