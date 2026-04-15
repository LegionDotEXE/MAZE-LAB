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
      if (this.gameManager.battery != 100){
        if (this.Maze.healthDeplete.paused) {
          this.Maze.healthDeplete.paused = false;
          this.Maze.showScreen()
        }
        this.Maze.HP.increase(this.healAmount || 1);
      }
      console.log(`Battery: ${ this.gameManager.battery}`);
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