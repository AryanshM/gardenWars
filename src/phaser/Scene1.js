import Phaser from "phaser"
export class Scene1 extends Phaser.Scene {
    constructor(){
        super("bootgame")
    }
    create(){
        this.add.text(20,20,"loading game...").setScale(3)
        setTimeout(()=>{
        this.scene.start("playGame")
        }, 500)

        

    }
}