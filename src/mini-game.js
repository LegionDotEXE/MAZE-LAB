//mini-game.js-taylor
'use strict';

class MiniGame extends Phaser.Scene {
  constructor() {
    super('MiniGame');
    this.health = 0;
  }

create() {  const button = this.add.circle(600, 300, 50, 0xff0000);

button.setInteractive();

button.on('pointerdown', () => {
    this.health += 1;
    console.log(`Health: ${this.health}`);
});

button.on('pointerover', () => {
    button.setFillStyle(0xcc0000);
});

button.on('pointerout', () => {
    button.setFillStyle(0xff0000);
});}

};
