class Animal extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, map) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // base stats
        this.baseStats = {
            speed: 600,
            thinkingTime: 2000,
            completeMoney: 1
        };

        this.drugTextures = {
            high: "LobsterHigh",
            crack: "LobsterCrack",
            trip: "LobsterTrip"
        };
        this.baseTexture = "Lobster";

        // drug system
        this.drugs = {
            high: {
                key: "high",
                active: false,
                unlocked: false,
                duration: 20000,
                cooldown: 10000,
                timer: 0,
                cooldownTimer: 0,
                tint: 0x5bb450
            },

            crack: {
                key: "crack",
                active: false,
                unlocked: false,
                duration: 20000,
                cooldown: 10000,
                timer: 0,
                cooldownTimer: 0,
                tint: 0x0021f3
            },

            trip: {
                key: "trip",
                active: false,
                unlocked: false,
                duration: 20000,
                cooldown: 10000,
                timer: 0,
                cooldownTimer: 0,
                tint: 0xFFDE21
            }
        };

        this.activeDrugs = [];

        // tint cycling
        this.tintTimer = 0;
        this.tintIndex = 0;

        //this.Path = path;
        this.mapref = map;
        this.ignoreTile = false;
        this.lastPos = new Phaser.Math.Vector2(x, y);
        this.direction = 1;

        // update active drug
        scene.events.on('update', this.updateDrugs, this);

        // keyboard testing
        this.keys = scene.input.keyboard.addKeys({
            one: Phaser.Input.Keyboard.KeyCodes.ONE,
            two: Phaser.Input.Keyboard.KeyCodes.TWO,
            three: Phaser.Input.Keyboard.KeyCodes.THREE
        });

        // movement state machine
        this.statemachine = new StateMachine('Moving',
            {
                Moving: new MoveState(),
                Thinking: new ThinkingState()
            },
            [this]);

        return this;
    }   

    // maze pathing
    moveCharacter(character, path) {
        var movementTweens = [];
        for (var i = 0; i < path.length - 1; i++) {
            var ex = path[i + 1].x;
            var ey = path[i + 1].y;
            movementTweens.push({
                x: ex * this.mapref.tileWidth,
                y: ey * this.mapref.tileHeight,
                duration: this.baseStats.speed
            });
        }
        this.activeTweens = this.scene.tweens.chain({
            targets: character,
            tweens: movementTweens
        });
    }

    // update speed stats during set tween pathing
    updateTweenSpeed() {
        if (!this.activeTweens) return;

        this.activeTweens.setTimeScale(this.currentSpeedMultiplier);
    }

    // activate drugs
    activateDrugs(key) {
        const drug = this.drugs[key];

        if (!drug.unlocked) return;

        // cancel if re-clicked
        if (drug.active) {
            console.log(`${key} canceled early, cooldown started`);
            this.deactivateDrugs(drug);
            return;
        }

        // Check cooldown
        if (drug.cooldownTimer > 0) {
            console.log(`${key} is on cooldown`);
            return;
        }

        // maximum of 3 at a time
        if (this.activeDrugs.length >= 3) {
            console.log("Max active drugs reached");
            return;
        }

        // activate
        drug.active = true;
        drug.timer = drug.duration;
        this.activeDrugs.push(drug);

        console.log(`${key} activated`);
    }

    // deactivate drugs
    deactivateDrugs(drug) {
        drug.active = false;
        drug.timer = 0;
        drug.cooldownTimer = drug.cooldown;
        this.activeDrugs = this.activeDrugs.filter(d => d !== drug);
        this.tintIndex = 0;
        console.log(`${drug.key} cooldown started`);
    }

    // update
    updateDrugs(time, delta) {

        // make sure drugs are unlocked
        for (let key in this.drugs) {
            this.drugs[key].unlocked = window.drugUnlocks[key];
        }

        // key inputs (for now)
        if (Phaser.Input.Keyboard.JustDown(this.keys.one)) {
            this.activateDrugs("high");
        }
        if (Phaser.Input.Keyboard.JustDown(this.keys.two)) {
            this.activateDrugs("crack");
        }
        if (Phaser.Input.Keyboard.JustDown(this.keys.three)) {
            this.activateDrugs("trip");
        }

        // activation/cooldown timers
        for (let key in this.drugs) {
            const drug = this.drugs[key];

            if (drug.active) {
                drug.timer -= delta;

                if (drug.timer <= 0) {
                    console.log(`${key} expired, cooldown started`);
                    this.deactivateDrugs(drug);
                }
            } else if (drug.cooldownTimer > 0) {
                drug.cooldownTimer -= delta;

                if (drug.cooldownTimer <= 0) {
                    drug.cooldownTimer = 0;
                    console.log(`${key} cooldown finished`);
                }
            }
        }

        // apply effects
        this.applyDrugEffects();

        // sprites
        this.updateSprite(delta);
    }

    // set drugs qualities
    applyDrugEffects() {
        this.speed = this.baseStats.speed;
        this.thinkingTime = this.baseStats.thinkingTime;
        this.completeMoney = this.baseStats.completeMoney;
        let speedMultiplier = 1;

        this.activeDrugs.forEach(drug => {
            switch (drug.key) {
                case "high":
                    this.thinkingTime = 500;
                    break;

                case "crack":
                    speedMultiplier *= 3;
                    break;

                case "trip":
                    this.completeMoney = 5;
                    break;
            }
        });

        // speed check
        this.currentSpeedMultiplier = speedMultiplier;
        this.updateTweenSpeed();
    }

    updateSprite(delta) {
        // no drugs
        if (this.activeDrugs.length === 0) {
            this.setTexture(this.baseTexture);
            return;
        }

        // one drug
        if (this.activeDrugs.length === 1) {
            const drug = this.activeDrugs[0];
            this.setTexture(this.drugTextures[drug.key]);
            return;
        }

        // multiple drugs
        this.tintTimer += delta;
        let interval = this.activeDrugs.length === 2 ? 500 : 250;

        if (this.tintTimer >= interval) {
            this.tintTimer = 0;
            this.tintIndex = (this.tintIndex + 1) % this.activeDrugs.length;
        }

        // safety clamp
        if (this.tintIndex >= this.activeDrugs.length) {
            this.tintIndex = 0;
        }

        const currentDrug = this.activeDrugs[this.tintIndex];
        if (!currentDrug) return; 
        this.setTexture(this.drugTextures[currentDrug.key]);
    }

    // extra health drain per drug
    getHealthDrainMultiplier() {
        return Math.max(2, this.activeDrugs.length);
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
