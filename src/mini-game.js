//mini-game.js-taylor
'use strict';

class MiniGame extends Phaser.Scene {
  constructor() {
    super('MiniGame');
    this.gameManager = game.scene.getScene('GameManager');
    
  }

  create() {  
    this.Maze = game.scene.getScene('mazeScene');
    const button = this.add.circle(700, 300, 50, 0xff0000);

    button.setInteractive();

    button.on('pointerdown', () => {
      this.gameManager.battery += 1; // Example of how to interact with GameManager's battery stat
      this.Maze.HP.increase(1);
      console.log(`Battery: ${ this.gameManager.battery}`);
    });

    button.on('pointerover', () => {
      button.setFillStyle(0xcc0000);
    });

    button.on('pointerout', () => {
      button.setFillStyle(0xff0000);
    });
  }

};
