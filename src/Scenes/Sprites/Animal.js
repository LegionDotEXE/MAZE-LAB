class Animal extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, map) {
        super(scene, x, y, texture, frame);
        this.miniGame = scene.scene.get('MiniGame');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // base stats
        this.baseStats = {
            speed: 600,
            thinkingTime: 2000,
            completeMoney: 1
        };

        // sprites
        this.drugSprites = {
            high: "LobsterHigh",
            crack: "LobsterCrack",
            trip: "LobsterTrip",
            meds: "LobsterMeds"
        };
        this.baseTexture = "Lobster";

        // drug system
        this.drugs = {
            high: {
                key: "high",
                active: false,
                unlocked: false
            },

            crack: {
                key: "crack",
                active: false,
                unlocked: false,
            },

            trip: {
                key: "trip",
                active: false,
                unlocked: false,
            },

            meds: {
                key: "meds",
                active: false,
                unlocked: false,
            }
        };

        // drug array
        this.activeDrugs = [];

        // sprite cycling
        this.spriteTimer = 0;
        this.spriteIndex = 0;
      
        //this.Path = path;
        this.mapref = map;
        this.ignoreTile = false;
        this.lastPos = new Phaser.Math.Vector2(x, y);
        // this.direction = 1;

        // update active drug
        scene.events.on('update', this.updateDrugs, this);

        // keyboard testing
        this.keys = scene.input.keyboard.addKeys({
            one: Phaser.Input.Keyboard.KeyCodes.ONE,
            two: Phaser.Input.Keyboard.KeyCodes.TWO,
            three: Phaser.Input.Keyboard.KeyCodes.THREE,
            four: Phaser.Input.Keyboard.KeyCodes.FOUR
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

        // toggle off
        if (drug.active) {
            console.log(`${key} off`);
            this.deactivateDrugs(drug);
            return;
        }

        // max 3 drugs
        if (this.activeDrugs.length >= 3) {
            console.log("max 3 drugs only");
            return;
        }

        // toggle on
        drug.active = true;
        this.activeDrugs.push(drug);

    }

    // deactivate drugs
    deactivateDrugs(drug) {
        drug.active = false;

        // specify drug
        this.activeDrugs = this.activeDrugs.filter(d => d !== drug);
        this.spriteIndex = 0; 

        console.log(`${drug.key} af!`);
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
        if (Phaser.Input.Keyboard.JustDown(this.keys.four)) {
            this.activateDrugs("meds");
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
        this.healMultiplier = 1;
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

                case "meds":
                    speedMultiplier *= 0.5;
                    this.healMultiplier = 2;
                    break;
            }
        });

        // speed check
        this.currentSpeedMultiplier = speedMultiplier;
        this.updateTweenSpeed();

        // heal increase
        if (this.miniGame) {
            this.miniGame.healAmount = this.healMultiplier || 1;
        }
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
            this.setTexture(this.drugSprites[drug.key]);
            return;
        }

        // multiple drugs
        this.spriteTimer += delta;
        let interval = this.activeDrugs.length === 2 ? 500 : 250;

        if (this.spriteTimer >= interval) {
            this.spriteTimer = 0;
            this.spriteIndex = (this.spriteIndex + 1) % this.activeDrugs.length;
        }

        // safety clamp
        if (this.spriteIndex >= this.activeDrugs.length) {
            this.spriteIndex = 0;
        }

        const currentDrug = this.activeDrugs[this.spriteIndex];
        if (!currentDrug) return; 
        this.setTexture(this.drugSprites[currentDrug.key]);
    }

    // extra health gain
    getHealMultiplier() {
        return this.healMultiplier || 1;
    }

    // extra health drain per drug
    getHealthDrainMultiplier() {
        return Math.max(2, this.activeDrugs.length);
    }

}


// movement state classes
class MoveState extends State {
    enter(character, path) {
        console.log("moving")
        //animation for moving
        if (path) {
            character.moveCharacter(character, path)
        }
        else {
            //had LLMs fix the below code
            if (character.activeTweens && character.activeTweens.callbacks) {
                character.activeTweens.resume();
            } 
        }
    }
}

class ThinkingState extends State {
    enter(character) {
        //animation for thinking
        console.log("thinking");
        if (character.activeTweens) {
            character.activeTweens.pause();
        }
        character.scene.time.delayedCall(character.thinkingTime, () => { 
            character.statemachine.transition("Moving");
        }, null, this);
    }
}
