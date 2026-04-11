class MainUI extends Phaser.Scene {
    constructor() {
        super('MainUI');
    }

    preload() {
        this.load.json('drugData', '../lib/Drugs.json');
        this.load.image("Drug1", "../assets/DrugT1.png");
        this.load.image("Drug2", "../assets/DrugT2.png");
    }

    create() {

        this.initConfig();
        this.initState();

        //useless text, will delete later
        this.add.text(20, 20, "Main UI Scene", { font: "16px Arial", fill: "#ffffff" });



        this.createTargetBoxes();
        this.createDrugPack();
        this.createPackSlots();

        // This is only from top to bottom
        // need to change the method of creating shop
        this.createShop();

        this.bindGlobalInput();
    }

    initConfig() {
        // slot width: spacing + slotPadding * maxSlot
        this.slotSpacing = 100;
        this.slotPadding = 20;
        this.packHeight = 120;

        //Since there is already shop in main, the method shop create needs to be changed
        this.shopHeight = 320;
        this.shopPadding = 30;
        this.shopWidth = 120;

    }

    initState() {
        this.maxSlot = 3;
        this.usedSlot = 0;

        this.drugs = this.cache.json.get('drugData');

        this.targetBoxes = [];
        this.drugSlots = [];

        this.selectedDrug = null;
        this.dragSource = null;
        this.dragGhost = null;
        
    }

    createTargetBoxes() {
        this.targetBoxes = [
            // Example positions, can be adjusted as needed
            new TargetBox(this, 200, 200),
            new TargetBox(this, 320, 200)
        ];

        this.targetBoxes.forEach(box => {
            box.rect.on('pointerdown', () => {
                if (this.selectedDrug && !box.occupied) {
                    box.placeDrug(this.selectedDrug);
                    this.selectedDrug.clearTint();
                    this.selectedDrug.disableInteractive();
                    this.selectedDrug = null;
                }
            });
        });
        
    }

    createDrugPack() {
        const cam = this.cameras.main;
        const packWidth = this.slotPadding + this.slotSpacing * this.maxSlot;
        
        this.drugPack = this.add.rectangle(cam.width, cam.height, packWidth, this.packHeight, 0x333366)
            .setOrigin(1, 1)
            .setStrokeStyle(2, 0xffffff);

        this.packStartX = this.drugPack.x - this.drugPack.width;
        this.packCenterY = this.drugPack.y - this.drugPack.height / 2;
    }

    createPackSlots() {
        for (let i = 0; i < this.maxSlot; i++) {
            const x = this.packStartX + 20 + i * this.slotSpacing;
            const y = this.packCenterY;

            this.drugSlots.push({x, y, occupied: false, sprite: null});

            // show up the slot positions with rectangles, can be removed if not needed
            this.add.rectangle(x + this.shopPadding, y, 60, 60, 0xffffff, 0.08).setStrokeStyle(1, 0xffffff);
        }
    }

    createShop() {
        const can = this.cameras.main;

        this.shop = this.add.rectangle(
            50,
            can.height,
            this.shopWidth,
            this.shopHeight,
            0x663333
        )
        .setOrigin(0, 1)
        .setStrokeStyle(2, 0xffffff);

        const shopStartY = this.shop.y - this.shop.height;
        const shopCenterX = this.shop.x + this.shop.width / 2;

        this.drugs.forEach((drug, index) => {
            const y = shopStartY + 20 + index * 80;

            const shopSprite = this.add.sprite(shopCenterX, y, drug.texture)
                .setScale(2)
                .setOrigin(0.5, 0)
                .setInteractive({ useHandCursor: true });

            const soldOutText = this.add.text(shopSprite.x, shopSprite.y + 30, "Sold Out", {
                font: "14px Arial",
                color: "#ff6666"
            }).setOrigin(0.5, 1).setVisible(false);

            drug.shopSprite = shopSprite;
            drug.soldOutText = soldOutText;

            shopSprite.on('pointerdown', () => {
                this.buyDrug(drug);
            });
        });
    }

    buyDrug(drug) {
        if (drug.bought) {
            return;
        }

        if (this.usedSlot >= this.maxSlot) {
            this.showSlotFullMessage();
            return;
        }

        const slot = this.drugSlots[this.usedSlot];

        const packSprite = this.add.sprite(slot.x, slot.y, drug.texture)
            .setScale(2)
            .setOrigin(0, 0.5)
            .setInteractive({ useHandCursor: true });

        packSprite.homeX = slot.x;
        packSprite.homeY = slot.y;

        this.input.setDraggable(packSprite);

        packSprite.on('pointerdown', () => {
            if (!packSprite.visible) return;

            this.selectedDrug = packSprite;

            this.drugs.forEach(d => {
                if (d.packSprite) d.packSprite.clearTint();
            });

            packSprite.setTint(0xffff88);
        });

        slot.occupied = true;
        slot.sprite = packSprite;

        drug.packSprite = packSprite;
        drug.bought = true;
        drug.slotIndex = this.usedSlot;
        drug.soldOutText.setVisible(true);

        this.usedSlot += 1;
    }

    // not sure how to show the message yet
    // showSlotFullMessage() {
    //     const msg = this.add.text(this.cameras.main.centerX, 50, "All slots are full!");
    // }


    // The druge useage actually have huge issue right now
    // The useSlot is just a pointer to the next empty slot
    // but when the drug is used, the slot will be cleared but the pointer won't move back
    // even it does won't help becasue the drug is not always used in order.

    // Here is my current thinking, we only doing a check when buy, every time we buy we check if there is any empty slot
    // if there is no empty slot, we show the message and prevent the buy, if there is empty slot, 
    // we will reorder the slot, move the exiting drug to the left and move the pointer to the empty slot
    // Or we can write a function to find the first empty slot every time we buy
    bindGlobalInput() {
        this.input.on('dragstart', (pointer, gameObject) => {
            if (!gameObject.visible) return;

            this.dragSource = gameObject;

            this.dragGhost = this.add.sprite(gameObject.x, gameObject.y, gameObject.texture.key)
                .setOrigin(gameObject.originX, gameObject.originY)
                .setScale(gameObject.scaleX, gameObject.scaleY)
                .setAlpha(0.5)
                .setDepth(1000);
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (!this.dragGhost) return;

            this.dragGhost.x = dragX;
            this.dragGhost.y = dragY;

            let hoveringBox = null;

            for (const box of this.targetBoxes) {
                if (box.containsPoint(dragX, dragY) && !box.occupied) {
                    hoveringBox = box;
                    break;
                }
            }

            this.targetBoxes.forEach(box => {
                box.setHighlight(box === hoveringBox);
            });
        });

        this.input.on('dragend', () => {
            if (!this.dragGhost || !this.dragSource) return;

            let hitBox = null;

            for (const box of this.targetBoxes) {
                if (box.containsPoint(this.dragGhost.x, this.dragGhost.y) && !box.occupied) {
                    hitBox = box;
                    break;
                }
            }

            if (hitBox) {
                hitBox.placeDrug(this.dragSource);
                this.dragSource.clearTint();
                this.dragSource.disableInteractive();


                if (this.selectedDrug === this.dragSource) {
                    this.selectedDrug = null;
                }
            }

            this.targetBoxes.forEach(box => box.setHighlight(false));

            this.dragGhost.destroy();
            this.dragGhost = null;
            this.dragSource = null;
        });
    }
}