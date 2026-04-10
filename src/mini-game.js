//mini-game.js-taylor
'use strict';

class MiniGame extends Phaser.Scene {
  constructor() {
    super('MiniGame');

    this.health = 0; // When game manager is implemented this will be set there maybe - Robert
    //reference the game manager so we can interact with it - Robert
    this.gameManager = game.scene.getScene('GameManager');
  }

  create() {  
    /*
    const button = this.add.circle(600, 300, 50, 0xff0000);

    button.setInteractive();

    button.on('pointerdown', () => {
      this.health += 1; 
      this.gameManager.battery -= 10; // Example of how to interact with GameManager's battery stat
      console.log(`Health: ${ this.gameManager.battery}`);
    });

    button.on('pointerover', () => {
      button.setFillStyle(0xcc0000);
    });

    button.on('pointerout', () => {
      button.setFillStyle(0xff0000);
    });
    */
    
    // Button Asset Implementation -- Saurav
    // Testing Purpose only, will be replaced with actual mini-game mechanics later?
    this.button = this.add.image(1050, 350, 'mini_game_button')
      .setInteractive({ useHandCursor: true })
      .setDepth(100)
      .setScale(0.7)
    
    // hover effects
    this.button.on('pointerover', () => {
      this.button.setTint(0x888888)
      this.button.setScale(0.95)
    })
    
    this.button.on('pointerout', () => {
      this.button.clearTint()
      this.button.setScale(0.9)
    })

    this.button.on('pointerdown', () => {
      this.health += 1; 
      this.gameManager.battery -= 10;               // I am just adding this here to test interaction with GameManager
      console.log(`Health: ${this.health}, Battery: ${this.gameManager.battery}`);
      
      // Click animation
      // thought it would be cool
      // -------------------------------
      this.tweens.add({
        targets: this.button,
        scaleX: 0.85,
        scaleY: 0.85,
        duration: 100,
        yoyo: true
      })
    });
  }

};