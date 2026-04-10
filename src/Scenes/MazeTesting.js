//LLMs were used for a few function, view the chat log here: https://gemini.google.com/share/fe7fd7289a33

class MazeTesting extends Phaser.Scene {
    constructor() {
        super("mazetestingscene");
    }

    preload() {
    }

    init() {
        this.TILESIZE = 16;
        this.SCALE = 2.0;
        // below is the size of the tilemap in tiles
        this.TILEWIDTH = 18;
        this.TILEHEIGHT = 18;
    }

    //Created by AI VVVVVV
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    create() {
        this.map = this.add.tilemap("TestingMaze", this.TILESIZE, this.TILESIZE, this.TILEHEIGHT, this.TILEWIDTH);

        // Add a tileset to the map
        this.tileset = this.map.addTilesetImage("TESTING TILESET FOR MAZE", "maze_tiles");

        // Create the layers
        this.groundLayer = this.map.createLayer("Ground", this.tileset, 0, 0);
        this.wallLayer = this.map.createLayer("MazeWalls", this.tileset, 0, 0);


        // Camera settings
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setZoom(this.SCALE);

        // Create grid of visible tiles for use with path planning
        let tinyTownGrid = this.layersToGrid([this.groundLayer, this.wallLayer]);

        //GID of walkable tiles found in the JSON of Testing Maze
        //18: GREY TILES | 36: GOAL TILES (stairs) | 370: THINKING TILES (green tiles) | 0: EMPTY TILES (just in case)
        let walkables = [18, 36, 0, 370];

        // Initialize EasyStar pathfinder
        this.finder = new EasyStar.js();

        this.finder.setGrid(tinyTownGrid);

        // Tell EasyStar which tiles can be walked on
        this.finder.setAcceptableTiles(walkables);

        this.pointMap = new Map()
        let pointMapIndex = 0;

        this.groundLayer.setCollisionByProperty({
            GOAL: true
        });

        this.groundLayer.forEachTile(tile => {
            if (tile.properties.GOAL) {
                this.pointMap.set(`GOAL${pointMapIndex}`, { x: tile.x, y: tile.y });
                console.log(`stored GOAL${pointMapIndex} at point ${tile.x}, ${tile.y}`);
                pointMapIndex++;
            }
        })

        this.startingLocation = { x: this.tileXtoWorld(1), y: this.tileYtoWorld(10) }

        my.sprite.lobster = new Animal(this, this.startingLocation.x, this.startingLocation.y, "Lobster", null, this.map).setOrigin(0, 0);
        //this.physics.add.sprite(this.startingLocation.x, this.startingLocation.y, "Lobster").setOrigin(0, 0);

        this.activeCharacter = my.sprite.lobster;

        this.physics.add.overlap(this.activeCharacter, this.groundLayer, this.TileEffecthandler, null, this);

        //this.input.on('pointerup', this.handleClick, this);

        //prolly replace these with state machines
        this.isMoving = false;
        this.isThinking = false;

        //this.Goal = this.chooseGoal();

        this.initiatePath(); //start animal pathfinding and movement

    }

    update() {

    }


    tileXtoWorld(tileX) {
        return tileX * this.TILESIZE;
    }

    tileYtoWorld(tileY) {
        return tileY * this.TILESIZE;
    }

    layersToGrid(arr) {
        let grid = [];


        for (let y = 0; y < this.map.height; y++) {
            grid[y] = [];
            for (let x = 0; x < this.map.width; x++) {
                grid[y][x] = -1;
            }
        }


        for (let i = 0; i < arr.length; i++) {
            for (let y = 0; y < this.map.height; y++) {
                for (let x = 0; x < this.map.width; x++) {
                    let tile = arr[i].getTileAt(x, y);
                    if (tile) {
                        grid[y][x] = tile.index
                    }
                }
            }
        }

        // Loop over layers to find tile IDs, store in grid
        // TODO: write this loop

        return grid;
    }

    chooseGoal() {
        let goalNum = Math.floor(Math.random() * this.pointMap.size)
        let Goal = {
            Goal: goalNum,
            x: this.pointMap.get(`GOAL${goalNum}`).x,
            y: this.pointMap.get(`GOAL${goalNum}`).y
        }
        return Goal
    }

    initiatePath() {
        let Goal = this.chooseGoal();
        var fromX = Math.floor(this.activeCharacter.x / this.TILESIZE);
        var fromY = Math.floor(this.activeCharacter.y / this.TILESIZE);
        let goalX = Goal.x;
        let goalY = Goal.y;
        console.log('going from (' + fromX + ',' + fromY + ') to (' + goalX + ',' + goalY + ')');

        this.finder.findPath(fromX, fromY, goalX, goalY, (path) => {
            if (path === null) {
                console.warn("Path was not found.");
            } else {
                console.log(path);
                this.activeCharacter.statemachine.transition("Moving", path);
            }
        });
        this.finder.calculate();
    }

    //pulled from past project
    async TileEffecthandler(player, tile) {
        if (tile.properties.GOAL) {
            console.log("reached goal");
            //resets to starting location
            player.x = this.startingLocation.x;
            player.y = this.startingLocation.y;
            //sets a new goal
            this.initiatePath();
            //prevents multiple tweens from occuring (no buggy looking movement)
            this.activeCharacter.activeTweens.stop();
        }

        if (tile.properties.THINKING) {
            if (this.activeCharacter.statemachine.state === "Moving"){
                this.activeCharacter.statemachine.transition("Thinking");
            }
        }
    }
}
