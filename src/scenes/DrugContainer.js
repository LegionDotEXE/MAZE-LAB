class DrugContainer {
    constructor(scene, x, y, width = 80, height = 80, color = 0x448844, alpha = 0.1) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.drugData = null;
        this.sprite = null;
        this.occupied = false;

        this.rect = scene.add.rectangle(x, y, width, height, color, alpha)
            .setStrokeStyle(1, 0xffffff)
            .setInteractive();
    }
    // preload() {
    //     this.scene.load.audio("Drag", "../assets/audio/Clinking.mp3");
    // }
    containsPoint(x, y) {
        return Phaser.Geom.Rectangle.Contains(this.rect.getBounds(), x, y);
    }

    hasDrug() {
        return this.sprite !== null;
    }

    setDrug(drugData, sprite) {
        this.drugData = drugData;
        this.sprite = sprite;
        this.occupied = !!sprite;

        if (sprite) {
            sprite.x = this.x - sprite.displayWidth / 2;
            sprite.y = this.y;

            this.scene.game.sound.play("Drag");
        }
    }

    clearDrug() {
        this.drugData = null;
        this.sprite = null;
        this.occupied = false;
    }

    
    swapDrug(otherContainer) {
        const myDrugData = this.drugData;
        const mySprite = this.sprite;

        this.setDrug(otherContainer.drugData, otherContainer.sprite);
        otherContainer.setDrug(myDrugData, mySprite);
    }

    setHighlight(on) {
        this.rect.setStrokeStyle(on ? 3 : 1, on ? 0xffff00 : 0xffffff);
    }
}