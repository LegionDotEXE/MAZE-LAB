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

class Animal extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, map) {
        super(scene, x, y, texture, frame);

        this.speed = 200;
        this.completeMoney = 100;
        this.thinkingTime = 2000; //10 seconds

        this.mapref = map;
        this.ignoreTile = false;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.statemachine = new StateMachine('Moving',
            {
                Moving: new MoveState(),
                Thinking: new ThinkingState()
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
                duration: this.speed
            });
        }
        this.activeTweens = this.scene.tweens.chain({
            targets: character,
            tweens: movementTweens
        });
    }
}
