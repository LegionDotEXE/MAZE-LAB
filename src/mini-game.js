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
  }

};
