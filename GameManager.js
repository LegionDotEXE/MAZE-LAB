class GameManager extends Phaser.Scene {
    constructor() {
        super('GameManager')

        // Initialize player stats
        this.money = 0;
        this.battery = 100;
    }

    create(){
        this.add.sprite(0, 0, 'background').setOrigin(0, 0).setDepth(-1);
        this.add.sprite(0,50, 'monitor').setDepth(1).setOrigin(0,0)

        // drug unlocks
        window.drugUnlocks = {
            high: false,
            crack: false,
            trip: false
        };
    }   
}
