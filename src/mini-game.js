//mini-game.js-taylor
'use strict';

class MiniGame extends Phaser.Scene {
  constructor() {
    super('MiniGame');
    this.gameManager = game.scene.getScene('GameManager');
    
  }

  create() {  
    this.Maze = game.scene.getScene('mazeScene');
    this.button = this.add.sprite(700, 300, 'buttonUp').setInteractive();
    this.healAmount = 1;

    this.button.on('pointerdown', () => {
      this.gameManager.battery += 1; // Example of how to interact with GameManager's battery stat
      this.Maze.HP.increase(this.healAmount || 1); // added healing variable for meds
      //console.log(`Battery: ${ this.gameManager.battery}`);
       this.button.setTexture('buttonDown');
    });

    this.button.on('pointerup', () => {
      this.button.setTexture('buttonUp');
    });
    
    this.button.on('pointerover', () => {
      
    });

    this.button.on('pointerout', () => {
      this.button.setTexture('buttonUp');
    });
  }

};