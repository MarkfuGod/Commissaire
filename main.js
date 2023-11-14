import CollisionBlock from "./utils/CollisionBlock.js"
import Player from "./sprites/player.js"
import Sprite from "./sprites/sprite.js"
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
        Attack1: {
            imageSrc: './assets/warrior/Attack1.png',
            frameRate: 4,
            frameBuffer: 5,
        },
        Attack2: {
            imageSrc: './assets/warrior/Attack2.png',
            frameRate: 4,
            frameBuffer: 5,
        },
        Attack3: {
            imageSrc: './assets/warrior/Attack3.png',
            frameRate: 4,
            frameBuffer: 5,
        },
    },
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
    window.requestAnimationFrame(animate)
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
        player.switchSprite('Attack1')
        console.log(player.currentFrame)
        player.lastDirection = 'right'
        if(player.currentFrame == 3)
            keys.j.pressed = false
    }
    else if(keys.k.pressed)
    {
        player.switchSprite('Attack2')
        console.log(player.currentFrame)
        player.lastDirection = 'right'
        if(player.currentFrame == 3)
            keys.k.pressed = false
    }
    else if(keys.i.pressed)
    {
        player.switchSprite('Attack3')
        console.log(player.currentFrame)
        player.lastDirection = 'right'
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

    c.restore()
    /*----------------------*/
}

animate()


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
