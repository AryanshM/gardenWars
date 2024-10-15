import React, { useEffect, useRef } from 'react';
import Phaser, { Physics } from 'phaser';
import { Scene1 } from './Scene1';
import { Scene2 } from './Scene2';
import { Scene3 } from "./Scene3"
const PhaserGame = () => {
  const gameRef = useRef(null);

  useEffect(() => {
    // Phaser configuration
    const config = {
      type: Phaser.AUTO,
      width: 600,
      height: 600,
      scene: [Scene1, Scene2, Scene3],
      pixelArt: true,
      physics: {
        default: "arcade",
        arcade:{
          debug: false
        }
      }
    };

    // Create a new Phaser game instance
    const game = new Phaser.Game(config);
    var gameSettings = {
      playerSpeed: 200,
      maxPowerups: 2,
      powerUpVel: 50,
    }
    
    // Reference the Phaser game in the DOM
    gameRef.current.appendChild(game.canvas);

    // Clean up on unmount
    return () => {
      game.destroy(true);
    };

  }, []);

  

  return <div ref={gameRef} />;
};

export default PhaserGame;
