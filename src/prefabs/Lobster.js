class Lobster extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)
        
        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setScale(4)
        this.setCollideWorldBounds(true)

        // stand in numeric vars
        this.moveSpeed = 10 
        this.hestiation = 50 
        this.health = 10;
        this.healthMax = 20;

    
        this.stateMachine = new StateMachine('idle', {
            idle: new LobsterIdleState(),
            move: new LobsterMoveState(),
            stop: new LobsterStopState(),
        }, [scene, this])
    }
}

class LobsterIdleState extends State {
    enter(scene, lobster) {
    }

    execute(scene, lobster) {
        
    }

    exit(scene, lobster) {
        
    }
}

class LobsterMoveState extends State {
    enter(scene, lobster) {
    }

    execute(scene, lobster) {
        
    }

    exit(scene, lobster) {
        
    }
}

class LobsterStopState extends State {
    enter(scene, lobster) {
    }

    execute(scene, lobster) {
        
    }

    exit(scene, lobster) {
        
    }
}