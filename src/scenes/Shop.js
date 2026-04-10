class Shop extends Phaser.Scene {
    constructor() {
        super('ShopScene')
    }

    create() {
        //this.cameras.main.setBackgroundColor("#2b2b2b")

        // Track whether shop is open
        this.shopOpen = false

        this.cameras.main.setBackgroundColor('rgba(0,0,0,0)');

        // Added this line here to fix phone layering issue
        this.scene.bringToTop('ShopScene');

        // -----------------------------
        // SMALL PHONE ICON (closed state)
        // Will be replaced later with a custom sprite
        // -----------------------------
        // OLD: replaced with phone_closed asset from earlier branch
        /*
        this.closedPhone = this.add.rectangle(700, 500, 50, 90, 0x111111)
            .setStrokeStyle(3, 0x666666)
            .setInteractive({ useHandCursor: true })

        this.add.rectangle(700, 470, 20, 4, 0x555555) // speaker
        this.add.circle(700, 535, 6, 0x444444)        // home button
        */

        // Phone sprite using asset
        this.closedPhone = this.add.image(500, 320, 'phone_closed')
            .setInteractive({ useHandCursor: true })
            .setDepth(100)      
            .setScale(0.9)
        
        // hover effect
        this.closedPhone.on('pointerover', () => {
            this.closedPhone.setTint(0xaaaaaa)
        })
        
        this.closedPhone.on('pointerout', () => {
            this.closedPhone.clearTint()
        })

        this.closedPhone.on("pointerdown", () => {
            this.openShop()
        })

        // -----------------------------
        // FULL SHOP PHONE (open state)
        // -----------------------------
        this.createShopUI()

        // Start hidden
        this.shopContainer.setVisible(false)
    }

    createShopUI() {
        const phoneX = 500
        const phoneY = 300

        // This creates a container to hold all shop UI elements
        this.shopContainer = this.add.container(0, 0).setDepth(200)

        //This will most likely be replaced with a custom sprite but for now we can just use shapes to make a phone UI
        // OLD: replaced with phone_open asset from earlier branch
        /*
        // Main phone body 
        const body = this.add.rectangle(phoneX, phoneY, 260, 440, 0x111111)
            .setStrokeStyle(4, 0x777777)

        // Screen
        const screen = this.add.rectangle(phoneX, phoneY, 220, 350, 0x222222)
            .setStrokeStyle(2, 0x999999)

        // Speaker
        const speaker = this.add.rectangle(phoneX, phoneY - 185, 60, 8, 0x555555)

        // Home button
        const homeButton = this.add.circle(phoneX, phoneY + 185, 14, 0x333333)
            .setStrokeStyle(2, 0x777777)
        */

        // Use phone open asset as background
        const phoneBody = this.add.image(phoneX, phoneY, 'phone_open')
            .setScale(0.4)

        // Shop title text
        const title = this.add.text(phoneX, phoneY - 145, "SHOP", {
            fontSize: "24px",
            color: "#ffffff",
            fontStyle: "bold",
            fontFamily: 'monospace'
        }).setOrigin(0.5).setDepth(201)

        // Close button
        const closeText = this.add.text(phoneX + 100, phoneY - 165, "X", {
            fontSize: "22px",
            color: "#ff6666",
            fontStyle: "bold",
            fontFamily: 'monospace'
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .setDepth(201)

        closeText.on("pointerdown", () => {
            this.closeShop()
        })

        // Shop buttons
        this.shopButtons = []

        //Might change this layout to just be in a column but for now this is fine for testing purposes
        const buttonData = [
            { label: "Upgrade 1", x: phoneX - 55, y: phoneY - 50 },
            { label: "Upgrade 2", x: phoneX + 55, y: phoneY - 50 },
            { label: "Upgrade 3", x: phoneX - 55, y: phoneY + 50 },
            { label: "Upgrade 4", x: phoneX + 55, y: phoneY + 50 }
        ]

        buttonData.forEach((data, index) => {
            const button = this.add.rectangle(data.x, data.y, 85, 85, 0x00aa00)
                .setStrokeStyle(2, 0xffffff)
                .setInteractive({ useHandCursor: true })
                .setDepth(201)

            const label = this.add.text(data.x, data.y, data.label, {
                fontSize: "14px",
                color: "#ffffff",
                align: "center",
                wordWrap: { width: 70 }
            }).setOrigin(0.5).setDepth(201)

            button.on("pointerdown", () => {
                this.buyItem(index)
            })

            this.shopButtons.push({
                button,
                label,
                bought: false
            })
        })

        //Okay this was somewhat new to me but a container is really OP, it works kinda like an 
        //empty game object from unity in which everything inside it will be affected by changes to the container 
        //itself. The really weird looking part is at the bottom that uses flatMaps and the spread operator (...).
        //Basically flatMap builds a list of all buttons and labels
        //... injects them into the main array
        //container.add() groups them all into one UI object

        // OLD: body, screen, speaker, homeButton replaced with phoneBody asset
        /*
        this.shopContainer.add([
            body,
            screen,
            speaker,
            homeButton,
            title,
            closeText,
            ...this.shopButtons.flatMap(item => [item.button, item.label])
        ])
        */

        this.shopContainer.add([
            phoneBody,
            title,
            closeText,
            ...this.shopButtons.flatMap(item => [item.button, item.label])
        ])

        // Optional: start scaled down so it can animate open
        this.shopContainer.setScale(0)
    }

    openShop() {
        if (this.shopOpen) return
        this.shopOpen = true

        this.closedPhone.setVisible(false)
        this.shopContainer.setVisible(true)

        this.tweens.add({
            targets: this.shopContainer,
            scaleX: 1,
            scaleY: 1,
            duration: 200,
            ease: "Cubic.easeInOut"
        })
    }

    closeShop() {
        if (!this.shopOpen) return
        this.shopOpen = false

        this.tweens.add({
            targets: this.shopContainer,
            scaleX: 0,
            scaleY: 0,
            duration: 150,
            ease: "Cubic.easeInOut",
            onComplete: () => {
                this.shopContainer.setVisible(false)
                this.closedPhone.setVisible(true)
            }
        })
    }

    //We can use this function to handle the logic for buying items
    //for now it just changes the button color and text but we can easily expand 
    //this so that it spawns the drugs or whatever we want to add to the game when an item is bought
    buyItem(index) {
        const item = this.shopButtons[index]

        if (item.bought) return

        item.bought = true
        item.button.setFillStyle(0xaa0000)
        item.button.disableInteractive()
        item.label.setText("BOUGHT")

        console.log(`Bought item ${index + 1}`)
    }
}