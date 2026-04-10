// Main.Js
//Hello test test
/*
* Incremental Maze Game 
* CMPM 170
* PROTOTYPE VERSION

* Description: A 2D incremental game where you test animals in mazes to fund unethical research.
*              Buy drugs to enhance, or debuff, subjects.

* Sources: Phaser 3 (phaser.io), 
           maze-winner (GitHub)  --- Pending Approval             
           EasyStar.js (pathfinding)   --- Pending Approval
*
*/
'use strict';

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  backgroundColor: '#1a1a24',
  pixelArt: true,           
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },        // Top-down architecture, as planned
      debug: true
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [
    Load, GameManager, MiniGame, Shop, MazeLoad, MazeTesting
  ]
};

var my = {sprite: {}}; //grabbed from my 120 class

const game = new Phaser.Game(config);
console.log("Unethical Lab initialized.");