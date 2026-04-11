class TargetBox {
    constructor(scene, x, y, width = 80, height = 80, color = 0x448844) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.occupied = false;
        this.containedDrug = null;

        this.rect = scene.add.rectangle(x, y, width, height, color)
            .setStrokeStyle(2, 0xffffff)
            .setInteractive();
    }

    containsPoint(x, y) {
        // Checks if a given point is inside a Rectangle's bounds
        return Phaser.Geom.Rectangle.Contains(this.rect.getBounds(), x, y);
    }

    // add the drug sprite to the center of the box and mark it as occupied
    placeDrug(drugSprite) {
        drugSprite.setOrigin(0.5, 0.5);
        drugSprite.x = this.rect.x;
        drugSprite.y = this.rect.y;
        this.occupied = true;
        this.containedDrug = drugSprite;
    }

    clear() {
        if (this.containedDrug) {
            this.containedDrug.destroy();
        }
        this.occupied = false;
        this.containedDrug = null;
    }

    setHighlight(on) {
        if (on) {
            this.rect.setStrokeStyle(3, 0xffff00);
        } else {
            this.rect.setStrokeStyle(2, 0xffffff);
        }
    }
}