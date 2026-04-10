class MainUI extends Phaser.Scene {
    constructor() {
        super('MainUI');
    }

    preload() {
        this.load.image("Drug1", "../assessts/DrugT1.png");
        this.load.image("Drug2", "../assessts/DrugT2.png");
    }
// I do know the code is stupid and repetitive, this is just for demonstration purposes. I will refactor it later. - Cliff
    create() {
        const can = this.cameras.main;

        this.add.text(50, 50, "Test UI Scene", { font: "16px Arial", fill: "#ffffff" });


        // Create target box to place drugs in, position is not important, just needs to be somewhere in the main area.
        const targetX = 200;
        const targetY = 200;

        this.targetBox = this.add.rectangle(targetX, targetY, 80, 80, 0x448844).setStrokeStyle(2, 0xffffff).setInteractive();


        const drugPack = this.add.rectangle(can.width, can.height, 250, 120, 0x333366)
        drugPack.setOrigin(1, 1);
        drugPack.setStrokeStyle(2, 0xffffff);

        const packStartX = drugPack.x - drugPack.width;
        const packCenterY = drugPack.y - drugPack.height / 2;
        
        const spacing = 60;

        // Create drug slots in the pack
        const drugSlot1 = this.add.sprite(packStartX + 20, packCenterY, 'Drug1').setScale(2);
        const drugSlot2 = this.add.sprite(packStartX + 20 * 2 + spacing, packCenterY, 'Drug2').setScale(2);
        const drugSlot3 = this.add.sprite(packStartX + 20 * 3 + spacing * 2, packCenterY, 'Drug1').setScale(2);
        drugSlot1.setOrigin(0, 0.5);
        drugSlot2.setOrigin(0, 0.5);
        drugSlot3.setOrigin(0, 0.5);    
        drugSlot1.visible = false;
        drugSlot2.visible = false;
        drugSlot3.visible = false;
        drugSlot1.setInteractive();
        drugSlot2.setInteractive();
        drugSlot3.setInteractive();

        // Store home positions for dragging
        drugSlot1.homeX = drugSlot1.x;
        drugSlot1.homeY = drugSlot1.y;
        drugSlot2.homeX = drugSlot2.x;
        drugSlot2.homeY = drugSlot2.y;
        drugSlot3.homeX = drugSlot3.x;
        drugSlot3.homeY = drugSlot3.y;
        this.dragSource = null;
        this.dragGhost = null;

        // Create shop area
        const shop = this.add.rectangle(50, can.height, 120, 250, 0x663333);
        shop.setOrigin(0, 1);
        shop.setStrokeStyle(2, 0xffffff);

        const shopStartY = shop.y - shop.height;
        const shopCenterX = shop.x + shop.width / 2;

        const shopSlot1 = this.add.sprite(shopCenterX, shopStartY + 20, 'Drug1').setScale(2);
        const shopSlot2 = this.add.sprite(shopCenterX, shopStartY + 20 * 2 + spacing, 'Drug2').setScale(2);
        const shopSlot3 = this.add.sprite(shopCenterX, shopStartY + 20 * 3 + spacing * 2, 'Drug1').setScale(2);
        shopSlot1.setOrigin(0.5, 0);
        shopSlot2.setOrigin(0.5, 0);
        shopSlot3.setOrigin(0.5, 0);
        shopSlot1.setInteractive();
        shopSlot2.setInteractive();
        shopSlot3.setInteractive();

        const soldOut1 = this.add.text(shopSlot1.x, shopSlot1.y + 30, "Sold Out", {font: "14px Arial", color: "#ff6666"}).setOrigin(0.5, 1).setVisible(false);
        const soldOut2 = this.add.text(shopSlot2.x, shopSlot2.y + 30, "Sold Out", {font: "14px Arial", color: "#ff6666"}).setOrigin(0.5, 1).setVisible(false);
        const soldOut3 = this.add.text(shopSlot3.x, shopSlot3.y + 30, "Sold Out", {font: "14px Arial", color: "#ff6666"}).setOrigin(0.5, 1).setVisible(false);

        let sellDrug1 = false;
        let sellDrug2 = false;
        let sellDrug3 = false;

        // Add interactivity to shop slots
        shopSlot1.on('pointerdown', () => {
            if (!sellDrug1) {
                //ShopSlot1.visible = false;
                drugSlot1.visible = true;
                sellDrug1 = true;
                soldOut1.setVisible(true);
            }

        });
        shopSlot2.on('pointerdown', () => {
            if (!sellDrug2) {
                //ShopSlot2.visible = false;
                drugSlot2.visible = true;
                sellDrug2 = true;
                soldOut2.setVisible(true);
            }
        });
        shopSlot3.on('pointerdown', () => {
            if (!sellDrug3) {
                //ShopSlot3.visible = false;
                drugSlot3.visible = true;
                sellDrug3 = true;
                soldOut3.setVisible(true);
            }
        });


        // Drag and drop logic for drug slots
        this.input.setDraggable(drugSlot1);
        this.input.setDraggable(drugSlot2);
        this.input.setDraggable(drugSlot3);
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (!this.dragGhost) return;

            this.dragGhost.x = dragX;
            this.dragGhost.y = dragY;
        });

        this.input.on('dragstart', (pointer, gameObject) => {
            if (!gameObject.visible) return;

            this.dragSource = gameObject;

            this.dragGhost = this.add.sprite(gameObject.x, gameObject.y, gameObject.texture.key)
                .setOrigin(gameObject.originX, gameObject.originY)
                .setScale(gameObject.scaleX, gameObject.scaleY)
                .setAlpha(0.5)
                .setDepth(1000);
        });
        this.input.on('dragend', (pointer, gameObject) => {
            if (!this.dragGhost || !this.dragSource) return;

            const boxBounds = this.targetBox.getBounds();
            const inside = Phaser.Geom.Rectangle.Contains(
                boxBounds,
                this.dragGhost.x,
                this.dragGhost.y
            );

            if (inside) {
                // orginal drug placed in target box
                this.dragSource.x = this.targetBox.x - this.dragSource.displayWidth / 2;
                this.dragSource.y = this.targetBox.y;
                this.dragSource.disableInteractive();
            }

            this.dragGhost.destroy();
            this.dragGhost = null;
            this.dragSource = null;
        });


        // Selecting drugs
        this.selectedDrug = null;
        const selectDrug = (drug) => {
            if (!drug.visible) return;
            this.selectedDrug = drug;

            drugSlot1.clearTint();
            drugSlot2.clearTint();
            drugSlot3.clearTint();

            drug.setTint(0xffff88);
        };

        drugSlot1.on('pointerdown', () => selectDrug(drugSlot1));
        drugSlot2.on('pointerdown', () => selectDrug(drugSlot2));
        drugSlot3.on('pointerdown', () => selectDrug(drugSlot3));

        this.targetBox.on('pointerdown', () => {
            if (this.selectedDrug) {
                this.selectedDrug.x = this.targetBox.x - this.selectedDrug.displayWidth / 2;
                this.selectedDrug.y = this.targetBox.y;
                this.selectedDrug.clearTint();
                this.selectedDrug.disableInteractive();
                this.selectedDrug = null;
            }
        });
    }
}