import CollisionBlock from "./utils/CollisionBlock.js"
import Player from "./sprites/player.js"
import Enemy from "./sprites/enemy.js"
import Sprite from "./sprites/sprite.js"
import KeyStatesConsumer from "./utils/KeyStatesConsumer.js"
import Launcher from "./utils/Launcher.js";

canvas.width = 1024
canvas.height = 576

const scaledCanvas = {
    width: canvas.width / 4,
    height: canvas.height / 4,
}

const floorCollisions2D = []

for (let i = 0; i < floorCollisions.length; i += 48) {
    floorCollisions2D.push(floorCollisions.slice(i, i + 48))
}

const collisionBlocks = []
floorCollisions2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol == 1729) {
            //console.log('fuck you')
            collisionBlocks.push(
                new CollisionBlock({
                    position: {
                        x: x * 12,
                        y: y * 12,
                    },
                })
            )
        }
    })
})

console.log(collisionBlocks)
//敌人列表
const enemyList = []

const player = new Player({
    position: {
        x: 10,
        y: 300,
    },
    collisionBlocks: collisionBlocks,
    imageSrc: './assets/warrior/Idle.png',
    frameRate: 8,
    animations: {
        Idle: {
            imageSrc: './assets/warrior/Idle.png',
            frameRate: 8,
            frameBuffer: 3,
        },
        Run: {
            imageSrc: './assets/warrior/Run.png',
            frameRate: 8,
            frameBuffer: 5,
        },
        Jump: {
            imageSrc: './assets/warrior/Jump.png',
            frameRate: 2,
            frameBuffer: 3,
        },
        Fall: {
            imageSrc: './assets/warrior/Fall.png',
            frameRate: 2,
            frameBuffer: 3,
        },
        FallLeft: {
            imageSrc: './assets/warrior/FallLeft.png',
            frameRate: 2,
            frameBuffer: 3,
        },
        RunLeft: {
            imageSrc: './assets/warrior/RunLeft.png',
            frameRate: 8,
            frameBuffer: 5,
        },
        IdleLeft: {
            imageSrc: './assets/warrior/IdleLeft.png',
            frameRate: 8,
            frameBuffer: 3,
        },
        JumpLeft: {
            imageSrc: './assets/warrior/JumpLeft.png',
            frameRate: 2,
            frameBuffer: 3,
        },
        Attack1_right: {
            imageSrc: './assets/warrior/Attack1.png',
            frameRate: 4,
            frameBuffer: 5,
        },
        Attack2_right: {
            imageSrc: './assets/warrior/Attack2.png',
            frameRate: 4,
            frameBuffer: 5,
        },
        Attack3_right: {
            imageSrc: './assets/warrior/Attack3.png',
            frameRate: 4,
            frameBuffer: 5,
        },
        Attack1_left: {
            imageSrc: './assets/warrior/Attack1Mirror.png',
            frameRate: 4,
            frameBuffer: 5,
        },
        Attack2_left: {
            imageSrc: './assets/warrior/Attack2Mirror.png',
            frameRate: 4,
            frameBuffer: 5,
        },
        Attack3_left: {
            imageSrc: './assets/warrior/Attack3Mirror.png',
            frameRate: 4,
            frameBuffer: 5,
        },
        TakeHit_right: {
            imageSrc: './assets/warrior/TakeHit.png',
            frameRate: 4,
            frameBuffer: 6,
        },
        TakeHit_left: {
            imageSrc: './assets/warrior/TakeHitMirror.png',
            frameRate: 4,
            frameBuffer: 5,
        },
        Death:{
            imageSrc: './assets/warrior/Death.png',
            frameRate: 6,
            frameBuffer: 5,
        },
        DeathMirror:{
            imageSrc: './assets/warrior/DeathMirror.png',
            frameRate: 6,
            frameBuffer: 5,
        },
    },
})

//添加敌人测试
const Evil_Wizard = new Enemy({
    position: {
        x: 100,
        y: 300,
    },
    collisionBlocks: collisionBlocks,
    imageSrc: './assets/enemys/EVil Wizard 2/Idle.png',
    classID: 1,
    HP_limit: 200,
    frameRate: 8,
    animations: {
        Idle: {
            imageSrc: './assets/enemys/EVil Wizard 2/Idle.png',
            frameRate: 8,
            frameBuffer: 3,
        },
        Run: {
            imageSrc: './assets/enemys/EVil Wizard 2/Run.png',
            frameRate: 8,
            frameBuffer: 5,
        },
        Jump: {
            imageSrc: './assets/enemys/EVil Wizard 2/Jump.png',
            frameRate: 2,
            frameBuffer: 3,
        },
        Fall: {
            imageSrc: './assets/enemys/EVil Wizard 2/Fall.png',
            frameRate: 2,
            frameBuffer: 3,
        },
        FallLeft: {
            imageSrc: './assets/enemys/EVil Wizard 2/FallLeft.png',
            frameRate: 2,
            frameBuffer: 3,
        },
        RunLeft: {
            imageSrc: './assets/enemys/EVil Wizard 2/RunLeft.png',
            frameRate: 8,
            frameBuffer: 5,
        },
        IdleLeft: {
            imageSrc: './assets/enemys/EVil Wizard 2/IdleLeft.png',
            frameRate: 8,
            frameBuffer: 3,
        },
        JumpLeft: {
            imageSrc: './assets/enemys/EVil Wizard 2/JumpLeft.png',
            frameRate: 2,
            frameBuffer: 3,
        },
        Attack1_right: {
            imageSrc: './assets/enemys/EVil Wizard 2/Attack1.png',
            frameRate: 8,
            frameBuffer: 5,
        },
        Attack2_right: {
            imageSrc: './assets/enemys/EVil Wizard 2/Attack2.png',
            frameRate: 8,
            frameBuffer: 5,
        },
        
        Attack1_left: {
            imageSrc: './assets/enemys/EVil Wizard 2/Attack1Mirror.png',
            frameRate: 8,
            frameBuffer: 5,
        },
        Attack2_left: {
            imageSrc: './assets/enemys/EVil Wizard 2/Attack2Mirror.png',
            frameRate: 8,
            frameBuffer: 5,
        },
        TakeHit_right: {
            imageSrc: './assets/enemys/EVil Wizard 2/TakeHit.png',
            frameRate: 3,
            frameBuffer: 4,
        },
        TakeHit_left: {
            imageSrc: './assets/enemys/EVil Wizard 2/TakeHitMirror.png',
            frameRate: 3,
            frameBuffer: 4,
        },
        Death: {
            imageSrc: './assets/enemys/EVil Wizard 2/Death.png',
            frameRate: 7,
            frameBuffer: 8,
        },
        DeathMirror: {
            imageSrc: './assets/enemys/EVil Wizard 2/DeathMirror.png',
            frameRate: 7,
            frameBuffer: 8,
        },
    },
})

const Wizard = new Enemy({
    position: {
        x: 500,
        y: 300,
    },
    collisionBlocks: collisionBlocks,
    imageSrc: './assets/enemys/Wizard Pack/Idle.png',
    frameRate: 8,
    classID: 2,
    HP_limit: 1000,
    animations: {
        Idle: {
            imageSrc: './assets/enemys/Wizard Pack/Idle.png',
            frameRate: 6,
            frameBuffer: 6,

        },
        Run: {
            imageSrc: './assets/enemys/Wizard Pack/Run.png',
            frameRate: 8,
            frameBuffer: 5,
        },
        Jump: {
            imageSrc: './assets/enemys/Wizard Pack/Jump.png',
            frameRate: 2,
            frameBuffer: 3,
        },
        Fall: {
            imageSrc: './assets/enemys/Wizard Pack/Fall.png',
            frameRate: 2,
            frameBuffer: 3,
        },
        FallLeft: {
            imageSrc: './assets/enemys/Wizard Pack/FallMirror.png',
            frameRate: 2,
            frameBuffer: 3,
        },
        RunLeft: {
            imageSrc: './assets/enemys/Wizard Pack/RunMirror.png',
            frameRate: 8,
            frameBuffer: 5,
        },
        IdleLeft: {
            imageSrc: './assets/enemys/Wizard Pack/IdleMirror.png',
            frameRate: 6,
            frameBuffer: 6,
        },
        JumpLeft: {
            imageSrc: './assets/enemys/Wizard Pack/JumpMirror.png',
            frameRate: 2,
            frameBuffer: 3,
        },
        Attack1_right: {
            imageSrc: './assets/enemys/Wizard Pack/Attack1.png',
            frameRate: 8,
            frameBuffer: 8,
        },
        Attack1_left: {
            imageSrc: './assets/enemys/Wizard Pack/Attack1Mirror.png',
            frameRate: 8,
            frameBuffer: 8,
        },
        Attack2_right: {
            imageSrc: './assets/enemys/Wizard Pack/Attack2.png',
            frameRate: 8,
            frameBuffer: 5,
        },
        Attack2_left: {
            imageSrc: './assets/enemys/Wizard Pack/Attack2Mirror.png',
            frameRate: 8,
            frameBuffer: 5,
        },
        TakeHit_right: {
            imageSrc: './assets/enemys/Wizard Pack/Hit.png',
            frameRate: 4,
            frameBuffer: 4,
        },
        TakeHit_left: {
            imageSrc: './assets/enemys/Wizard Pack/HitMirror.png',
            frameRate: 4,
            frameBuffer: 4,
        },
        Death: {
            imageSrc: './assets/enemys/Wizard Pack/Death.png',
            frameRate: 7,
            frameBuffer: 8,
        },
        DeathMirror: {
            imageSrc: './assets/enemys/Wizard Pack/DeathMirror.png',
            frameRate: 7,
            frameBuffer: 8,
        },

    
    }
    
})


const keys = {
    d: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
    w: {
        pressed: false
    },
    j: {
        pressed: false
    },
    k: {
        pressed: false
    },
    i: {
        pressed: false
    },
}

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: './assets/img/background.png',
})

const backgroundImageHeight = 432

const camera = {
    position: {
        x: 0,
        y: -backgroundImageHeight + scaledCanvas.height,
    },
}


function animate() {

    KeyStatesConsumer.consumes();
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)
    //player.draw()
    /*----------------------*///只影响save和restore之内的内容
    c.save()
    c.scale(4, 4)
    c.translate(camera.position.x, camera.position.y)
    background.update()
    // collisionBlocks.forEach((collisionBlock) =>{
    // 	collisionBlock.update()
    // })

    player.checkforHorizontalCanvasCollision()
    player.update()

    player.velocity.x = 0
    if (keys.d.pressed) {
        player.switchSprite('Run')
        player.velocity.x = 2
        player.lastDirection = 'right'
        player.shouldPanCameraToLeft({ canvas, camera })
    }

    else if (keys.a.pressed) {
        player.switchSprite('RunLeft')
        player.velocity.x = -2
        player.lastDirection = 'left'
        player.shouldPanCameraToRight({ canvas, camera })
    }
    else if(keys.j.pressed)
    {
        if(player.lastDirection == 'right')
        {
            player.switchSprite('Attack1_right')
            player.lastDirection = 'right'
        }
        else
        {
            player.switchSprite('Attack1_left')
            player.lastDirection = 'left'
        }
        if(player.currentFrame == 3)
            keys.j.pressed = false
    }
    else if(keys.k.pressed)
    {
        if(player.lastDirection == 'right')
        {
            player.switchSprite('Attack2_right')
            player.lastDirection = 'right'
        }
        else
        {
            player.switchSprite('Attack2_left')
            player.lastDirection = 'left'
        }
        if(player.currentFrame == 3)
            keys.k.pressed = false
    }
    else if(keys.i.pressed)
    {
        if(player.lastDirection == 'right')
        {
            player.switchSprite('Attack3_right')
            player.lastDirection = 'right'
        }
        else
        {
            player.switchSprite('Attack3_left')
            player.lastDirection = 'left'
        }
        if(player.currentFrame == 3)
            keys.i.pressed = false
    }
    else if (player.velocity.y == 0) {
        if (player.lastDirection == 'right') player.switchSprite('Idle')
        else player.switchSprite('IdleLeft')
    }

    if (player.velocity.y < 0) {
        player.shouldPanCameraDown({ camera, canvas })
        if (player.lastDirection == 'right') player.switchSprite('Jump')
        else player.switchSprite('JumpLeft')
    }
    else if (player.velocity.y > 0) {
        player.shouldPanCameraUp({ camera, canvas })
        if (player.lastDirection == 'right') player.switchSprite('Fall')
        else player.switchSprite('FallLeft')
    }
    if(player.HP == 0)
    {
        if(!player.isDead)
        {
            if(player.lastDirection == 'right')
                player.switchSprite('Death')
            else
                player.switchSprite('DeathMirror')
        }
        setTimeout(() => {
            player.isDead = true
        }, 500);
        
    }
    if(player.isDead)
    {
        background.image.src = './assets/img/gameover.png'
        camera.position = {x:0,y:0}
        background.update()
    }
    enemyList.push(Evil_Wizard)
    enemyList.push(Wizard)
    player.getEnemies(enemyList)
    
    
    if(Evil_Wizard.HP > 0)
    {
        Evil_Wizard.checkforHorizontalCanvasCollision()
        Evil_Wizard.enemy_AI(player.position,player)
        //检查敌人血量是否发生变化，若减少则播放受击动画
        if(Evil_Wizard.HP < Evil_Wizard.preHP)
        {
            Evil_Wizard.behurt = false
            Evil_Wizard.preHP = Evil_Wizard.HP
        }
        if(!Evil_Wizard.behurt)
        {
            if(Evil_Wizard.lastDirection == 'right')
                Evil_Wizard.switchSprite('TakeHit_right')
            else
                Evil_Wizard.switchSprite('TakeHit_left')
            setTimeout(() => {
                Evil_Wizard.behurt = true
            }, 200);
        }
            
        //console.log(enemy.showDead)
    }
    else
    {
        if(Evil_Wizard.showDead)
        {
            if(Evil_Wizard.lastDirection == 'right')
                Evil_Wizard.switchSprite('Death')
            else
                Evil_Wizard.switchSprite('DeathMirror')
            setTimeout(() => {
                Evil_Wizard.showDead = false
            }, 680);
        }
    }
    if(Evil_Wizard.showDead)
            Evil_Wizard.update()
    if(Wizard.HP > 0)
    {
        Wizard.checkforHorizontalCanvasCollision()
        Wizard.enemy_AI(player.position,player)
        //检查敌人血量是否发生变化，若减少则播放受击动画
        if(Wizard.HP < Wizard.preHP)
        {
            Wizard.behurt = false
            Wizard.preHP = Wizard.HP
        }
        if(!Wizard.behurt)
        {
            if(Wizard.lastDirection == 'right')
                Wizard.switchSprite('TakeHit_right')
            else
                Wizard.switchSprite('TakeHit_left')
            setTimeout(() => {
                Wizard.behurt = true
            }, 200);
        }
            
        //console.log(enemy.showDead)
    }
    else
    {
        if(Wizard.showDead)
        {
            if(Wizard.lastDirection == 'right')
                Wizard.switchSprite('Death')
            else
                Wizard.switchSprite('DeathMirror')
            setTimeout(() => {
                Wizard.showDead = false
            }, 680);
        }
    }
    if(Wizard.showDead)
        Wizard.update()   
    c.restore()
    /*----------------------*/
}

registerKeyHandlers();
Launcher.launchGame(60, animate)

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            break
        case 'a':
            keys.a.pressed = true
            break
        case 'w':
            if (!keys.w.pressed) {
                keys.w.pressed = true
                player.try2Jump()
                console.log('what the fuck')
            }
            break
        case 'j':
        //攻击1
            if (!keys.j.pressed) {
                keys.j.pressed = true
                player.try2Attack(0)
                console.log('attack1!')
            }
            break
        case 'k':
            if (!keys.k.pressed) {
                keys.k.pressed = true
                player.try2Attack(1)
                console.log('attack2!')
            
                console.log(player.currentAnimationName)
            }
            break
        case 'i':
            if (!keys.i.pressed) {
                keys.i.pressed = true
                player.try2Attack(2)
                console.log('attack3!')
            }
            break

    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'w':
            keys.w.pressed = false
            break
    }
})
