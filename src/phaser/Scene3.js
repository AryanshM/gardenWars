import Phaser from "phaser"
export class Scene3 extends Phaser.Scene {
    constructor(){
        super("gameOver")
    }
    create(){
        this.add.text(100,100,"GAME OVER...")
        
        setTimeout(()=>{
        this.scene.start("playGame")
        }, 2000)

        

    }
}