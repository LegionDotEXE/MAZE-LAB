//LLMs were used for a few function, view the chat log here: https://gemini.google.com/share/fe7fd7289a33

class HealthBar {
    constructor(scene, x, y) {
        this.bar = new Phaser.GameObjects.Graphics(scene);

        this.x = x;
        this.y = y;
        this.value = 100;
        this.maxHealthbarSize = 246;
        this.p = this.maxHealthbarSize / 100;

        this.draw();

        scene.add.existing(this.bar);
    }

    decrease(amount) {
        this.value -= amount;

        if (this.value < 0) {
            this.value = 0;
        }

        this.draw();

        return (this.value === 0);
    }
    //increase amount for button - taylor
    increase(amount) {
        this.value += amount;

        if (this.value > 100) {
            this.value = 100;
        }

        this.draw();
    }

    draw() {
        this.bar.clear();

        //  BG
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x, this.y, 250, 16);

        //  Health

        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(this.x + 2, this.y + 2, this.maxHealthbarSize, 12);

        if (this.value < 30) {
            this.bar.fillStyle(0xff0000);
        }
        else {
            this.bar.fillStyle(0x00ff00);
        }

        var d = Math.floor(this.p * this.value);

        this.bar.fillRect(this.x + 2, this.y + 2, d, 12);
    }

}

class Maze extends Phaser.Scene {
    constructor() {
        super("mazeScene");
    }

    preload() {
    }

    init() {
        this.TILESIZE = 16;
        this.SCALE = 1.25;
        // below is the size of the tilemap in tiles
        this.TILEWIDTH = 16;
        this.TILEHEIGHT = 16;
        this.gameManager = game.scene.getScene('GameManager');
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
        this.startingLocation2 = { x: this.tileXtoWorld(10), y: this.tileYtoWorld(13) }

        // create lobster sprite
        my.sprite.lobster = new Animal(this, this.startingLocation2.x, this.startingLocation2.y, "Lobster", null, this.map).setOrigin(0, 0);

        this.activeCharacter = my.sprite.lobster;

        this.physics.add.overlap(this.activeCharacter, this.groundLayer, this.TileEffecthandler, null, this);

        this.initiatePath(); //start animal pathfinding and movement

        //Health bar spawns using lobster spawn location as basis (will change)
        this.HP = new HealthBar(this, this.startingLocation.x + 18.5, this.startingLocation.y - 105);

        // health bar goes down over time - taylor
        this.healthDeplete = this.time.addEvent({
            delay: 1000,
            callback: () => {
                const isEmpty = this.HP.decrease(1);
                if (isEmpty) {
                    this.healthDeplete.remove(false);
                    // add black screen or whatever else here when lobster dies
                }
            },
            callbackScope: this,
            loop: true
        });
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
        return grid;
    }

    //Selects one of the goals at random whenever this function is called
    chooseGoal() {
        let goalNum = Math.floor(Math.random() * this.pointMap.size)
        let Goal = {
            Goal: goalNum,
            x: this.pointMap.get(`GOAL${goalNum}`).x,
            y: this.pointMap.get(`GOAL${goalNum}`).y
        }
        return Goal
    }

    //Finds a path and then immediately lets the animal start moving
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
                //console.log(path);
                this.activeCharacter.statemachine.transition("Moving", path);
            }
        });
        this.finder.calculate();
    }

    resetCharacter(player) {
        player.x = this.startingLocation2.x;
        player.y = this.startingLocation2.y;
        //sets a new goal
        this.initiatePath();
        //prevents multiple tweens from occuring (no buggy looking movement)
        this.activeCharacter.activeTweens.stop();
    }

    //pulled from past project
    async TileEffecthandler(player, tile) {
        if (tile.properties.GOAL) {
            console.log("reached goal");
            this.gameManager.money += this.activeCharacter.completeMoney;
            console.log(this.gameManager.money);
            //resets to starting location
            this.resetCharacter(player)
        }

        if (tile.properties.THINKING) {
            if (this.activeCharacter.statemachine.state === "Moving") {
                tile.properties.THINKING = false;
                this.activeCharacter.statemachine.transition("Thinking");
                //thinking tiles turn themselves off for the characters thinking time + 1.5s in order to prevent the lobster 
                //from being stuck thinking on the same tile for so long
                this.time.delayedCall((this.activeCharacter.thinkingTime + 2000), () => {
                    tile.properties.THINKING = true;
                }, null, this);
            }
        }
    }
}
