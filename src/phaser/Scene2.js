import Phaser from "phaser"
import bgimg from "./bgimg.jpg"
import ship from "./spritesheets/ship.png"
import ship2 from "./spritesheets/ship2.png"
import ship3 from "./spritesheets/ship3.png"
import explosion from "./spritesheets/explosion.png"
import powerup from "./spritesheets/powerup.png"
import player from "./spritesheets/player.png"
import beam from "./spritesheets/beam.png"
import { Beam } from "./Beam"

var gameSettings = {
    playerSpeed: 400,
    maxPowerups: 2,
    powerUpVel: 50,
  }

export class Scene2 extends Phaser.Scene{
    constructor(){
        super("playGame")
    }
    
    preload(){
        
          
        this.load.image("bgimg", bgimg)
        this.load.spritesheet("ship",ship, {
            frameWidth: 16,
            frameHeight: 16
        })
        this.load.spritesheet("ship2",ship2, {
            frameWidth: 32,
            frameHeight: 16
        })
        this.load.spritesheet("ship3",ship3, {
            frameWidth: 32,
            frameHeight: 32
        })
        this.load.spritesheet("explosion", explosion, {
            frameWidth: 16,
            frameHeight: 16
        } )

        this.load.spritesheet("powerup" , powerup, {
            frameWidth:16,
            frameHeight: 16
        })
        this.load.spritesheet("player" , player, {
            frameWidth:16,
            frameHeight: 24
        })
        this.load.spritesheet("beam", beam, {
            frameWidth: 16,
            frameHeight: 16
        })
        
    }
    create(){   

        this.background = this.add.image(0,0,"bgimg")
        this.background.setScale(600/980)
        this.background.setOrigin(0,0) 
        this.SCORE = 0
        this.scoreLabel = this.add.text(20,20, `SCORE: ${this.SCORE}`, {
            fill : "white",
            
        }).setStroke("#black", 4)
        this.scoreLabel.setScale(2)
        this.ship = this.add.sprite(100,0, "ship").setScale(2)
        this.ship2 = this.add.sprite(200,0, "ship2").setScale(2)
        this.ship3 = this.add.sprite(300,0, "ship3").setScale(2)
        this.explosion = this.add.sprite(200,0, "explosion").setScale(2)
        this.player = this.add.sprite(200,0, "player").setScale(2)
        
        
        this.anims.create({
            key: "ship1_anims",
            frames: this.anims.generateFrameNumbers("ship"),
            frameRate:10,
            repeat:-1 // infinite
        })

        this.anims.create({
            key: "ship2_anims",
            frames: this.anims.generateFrameNumbers("ship2"),
            frameRate:10,
            repeat:-1 // infinite
        })

        this.anims.create({
            key: "ship3_anims",
            frames: this.anims.generateFrameNumbers("ship3"),
            frameRate:10,
            repeat:-1 // infinite
        })
        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers("explosion"),
            frameRate:10,
            repeat:0, // infinite
            hideOnComplete: true
        })

        this.anims.create({
            key:  "red",
            frames: this.anims.generateFrameNumbers("powerup", {
                start:0,
                end: 1
            }),
            frameRate: 20,
            repeat: -1
        })
        this.anims.create({
            key:  "grey",
            frames: this.anims.generateFrameNumbers("powerup", {
                start:2,
                end: 3
            }),
            frameRate: 20,
            repeat: -1
        })
        this.anims.create({
            key: "thrust",
            frames: this.anims.generateFrameNumbers("player"),
            frameRate: 10,
            repeat: -1
          });
          this.anims.create({
            key: "beam_anim",
            frames: this.anims.generateFrameNumbers("beam"),
            frameRate: 20,
            repeat: -1
          });
        this.powerUps = this.physics.add.group()

        var maxObjects = 4
        for (var i = 0; i <= maxObjects; i++) {
            var powerup = this.physics.add.sprite(16,16, "powerup")
            this.powerUps.add(powerup)
            powerup.setRandomPosition(0,0,600,600)
        
        if (Math.random() > 0.5) {
            powerup.play("red");
          } else {
            powerup.play("gray");
          }
          powerup.setVelocity(200,100)
          powerup.setCollideWorldBounds(true)
          powerup.setBounce(1)
        }

        // 2.1 ADD THE PLAYER SHIP
    this.player = this.physics.add.sprite(300, 300, "player").setScale(2);
    this.player.play("thrust");
    // 2.2 create the cursorKeys
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    // 3.3 don't let the player leave the screen
    this.player.setCollideWorldBounds(true);


    // 4.1  add a key for the player fire
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        
    this.ship.play("ship1_anims")
    this.ship2.play("ship2_anims")
    this.ship3.play("ship3_anims")
    

    this.ship.setInteractive()
    this.ship2.setInteractive()
    this.ship3.setInteractive()


    this.input.on("gameobjectdown", this.destroyShip, this)
    this.projectiles = this.add.group();
    this.physics.add.collider(this.projectiles, this.powerUps, (projectile, powerup)=>{
        projectile.destroy()
    })
    
    this.physics.add.overlap(this.player, this.powerUps, this.pickPowerup, null, this)
    // 4.1 create group to hold all our projectiles

    this.enemies = this.physics.add.group()
    this.enemies.add(this.ship)
    this.enemies.add(this.ship2)
    this.enemies.add(this.ship3)

    this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer, null, this)

    this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, null, this)



    }
    hitEnemy(projectile, enemy){
        projectile.destroy()
        this.resetShip(enemy)
        this.SCORE+=15
        this.scoreLabel.text = "SCORE: " + this.SCORE
        console.log(this.SCORE)
    }
    hurtPlayer(player, enemy){
        this.resetShip(enemy);
        player.x = 300
        player.y = 300
        this.SCORE = 0
        this.scoreLabel.text = "SCORE: " + this.SCORE
        setTimeout(()=>{
            this.scene.start("gameOver")
            }, 500)

    }
    pickPowerup(player, powerup){
        powerup.disableBody(true, true)
        // disabling the physics and making it hide
    }

    update(){

        this.movePlayerManager()
        if (Phaser.Input.Keyboard.JustDown(this.spacebar)){
            this.shootBeam()
            console.log("Fire!")
          }
        //   for(var i = 0; i < this.projectiles.getChildren().length; i++){
        //     var beam = this.projectiles.getChildren()[i];
        //     beam.update();
        //   }
        this.moveShip(this.ship, 3)
        if(this.ship.y > 600) {
            this.resetShip(this.ship)
        }
        this.moveShip(this.ship2, 2)
        if(this.ship2.y > 600) {
            this.resetShip(this.ship2)
        }
        this.moveShip(this.ship3, 5)
        if(this.ship3.y > 600) {
            this.resetShip(this.ship3)
        }
        
    }

    moveShip(ship, speed){
        ship.y += speed 
    }
    resetShip(ship){
        ship.y = 0
        var randomX = Phaser.Math.Between(0, 600)
        ship.x = randomX
    }

    destroyShip(pointer //mouse pointer
        , gameObject // for the clicked object
         ){
            gameObject.setTexture("explosion")
            gameObject.play("explode")
         }

    movePlayerManager(){

            this.player.setVelocity(0);
        
            if(this.cursorKeys.left.isDown){
              this.player.setVelocityX(-gameSettings.playerSpeed);
            }else if(this.cursorKeys.right.isDown){
              this.player.setVelocityX(gameSettings.playerSpeed);
            }
        
            if(this.cursorKeys.up.isDown){
              this.player.setVelocityY(-gameSettings.playerSpeed);
            }else if(this.cursorKeys.down.isDown){
              this.player.setVelocityY(gameSettings.playerSpeed);
            }
          }

    shootBeam(){

            // 4.2 add the beam to the croup
            var beam = new Beam(this)
            beam.setScale(2)

        }        
    }

