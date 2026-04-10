class Animal extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, map) {
        super(scene, x, y, texture, frame);


        this.speed = 100;
        this.completeMoney = 100;
        this.thinkingTime = 4000;
        //this.Path = path;
        this.mapref = map;
        this.ignoreTile = false;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // movement state machine
        this.statemachine = new StateMachine('Moving',
            {
                Moving: new MoveState(),
                Thinking: new ThinkingState()
            },
            [this]);

        // drug state machine
        this.drugmachine = new StateMachine('sober',
            {
                sober: new SoberState(),
                high: new HighState(),
                crack: new CrackState(),
                trip: new TripState(),
            },
            [this]);

        return this;
    }   


    moveCharacter(character, path) {
        var movementTweens = [];
        for (var i = 0; i < path.length - 1; i++) {
            var ex = path[i + 1].x;
            var ey = path[i + 1].y;
            movementTweens.push({
                x: ex * this.mapref.tileWidth,
                y: ey * this.mapref.tileHeight,
                duration: 200
            });
        }
        this.activeTweens = this.scene.tweens.chain({
            targets: character,
            tweens: movementTweens
        });
    }
}


// movement state classes
class MoveState extends State {
    enter(character, path) {
        //console.log("moving")
        //animation for moving
        if (path) {
            character.moveCharacter(character, path)
        }
        else {
            character.activeTweens.resume();
        }
    }
}

class ThinkingState extends State {
    enter(character) {
        //animation for thinking
        console.log("thinking")
        if (character.activeTweens) {
            character.activeTweens.pause();
        }
        character.scene.time.delayedCall(character.thinkingTime, () => {
            character.statemachine.transition("Moving");
        }, null, this);
    }
}

// drug state classes
class SoberState extends State {
    enter(scene, lobster) {
        // clear any tints
    }
    execute(scene, lobster) {
        // set default stats

        // if drug, state transition
    }

    exit(scene, lobster) {
    }
}

class HighState extends State {
    enter(scene, lobster) {
        // tint green
    }
    execute(scene, lobster) {
        // set default stats 
    }

    exit(scene, lobster) {
        // flash tint off
    }
}

class CrackState extends State {
    enter(scene, lobster) {
        // tint blue
    }
    execute(scene, lobster) {
        // set default stats
    }

    exit(scene, lobster) {
        // flash tint off
    }
}

class TripState extends State {
    enter(scene, lobster) {
        // tint yellow
    }
    execute(scene, lobster) {
        // set default stats
    }

    exit(scene, lobster) {
        // flash tint off
    }
}