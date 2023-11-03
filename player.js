class Player extends Sprite{
	constructor({position, collisionBlocks, imageSrc, frameRate, scale = 0.5, animations}){
		super({imageSrc, frameRate, scale})
		this.position = position
		this.velocity = {
			x:0,
			y:1,
		}

		this.collisionBlocks = collisionBlocks
		this.hitbox = {
			position: {
				x: this.position.x,
				y: this.position.y,
			},
			width: 10,
			height: 10,
		}

		this.animations = animations
		this.lastDirection = 'right'

		for(let key in this.animations) {
			const image = new Image()
			image.src = this.animations[key].imageSrc

			this.animations[key].image = image
		}

		this.camerabox = {
			position: {
				x: this.position.x,
				y: this.position.y,
			},
			width: 200,
			height: 80,
		}
	}

	switchSprite(key) {
		if(this.image == this.animations[key].image || !this.loaded) return 

		this.image = this.animations[key].image
		this.frameBuffer = this.animations[key].frameBuffer
		this.frameRate = this.animations[key].frameRate
	}

	updateCamerabox(){
		this.camerabox = {
		position: {
			x: this.position.x - 50,
				y: this.position.y,
				},
				width: 200,
				height: 80,
			}
		}

	checkforHorizontalCanvasCollision() {
		if(this.hitbox.position.x + this.hitbox.width + this.velocity.x >= 576 ||
			this.hitbox.position.x + this.velocity.x <= 0
			) {
			this.velocity.x = 0 // cannot pass the edge
		}
	}

	shouldPanCameraToLeft({canvas, camera}) {
		const cameraboxRightSide = this.camerabox.position.x + this.camerabox.width

		if (cameraboxRightSide >= 576) return 

		if(cameraboxRightSide >= canvas.width / 4 + Math.abs(camera.position.x)) {
			camera.position.x -= this.velocity.x
		}
	}

	shouldPanCameraToRight({canvas, camera}) {
		if(this.camerabox.position.x <= 0) return
		if(this.camerabox.position.x <= Math.abs(camera.position.x)) {
			camera.position.x -= this.velocity.x
	}

	}

	 shouldPanCameraDown({canvas, camera}) {
	 	if(this.camerabox.position.y + this.velocity.y <= 0) return

	 	if(this.camerabox.position.y <= Math.abs(camera.position.y)) {
	 		camera.position.y -= this.velocity.y
	 		//cosnole.log('fuck')
	 }

	 }
	  shouldPanCameraUp({canvas, camera}) {
	 	if(this.camerabox.position.y + this.camerabox.height + this.velocity.y >= 432) return

	 	if(this.camerabox.position.y + this.camerabox.height >= Math.abs(camera.position.y)
	 		+ canvas.height / 4) {
	 		camera.position.y -= this.velocity.y
	 		//cosnole.log('fuck')
	 }

	 }


	update(){
		this.updateFrames()
		this.updateHitbox()
        
        this.updateCamerabox()
		// c.fillStyle = 'rgba(0, 0, 255, 0.2)'
		// c.fillRect (
		// 	this.camerabox.position.x,
		// 	this.camerabox.position.y,
		// 	this.camerabox.width,
		// 	this.camerabox.height )

		//draws the image
		 c.fillStyle = 'rgba(0, 255, 0, 0.2)'
		 c.fillRect(this.position.x, this.position.y, this.width, this.height)

		 c.fillStyle = 'rgba(255, 0, 0, 0.2)'
		 c.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height)

		this.draw()

		this.position.x += this.velocity.x
		this.updateHitbox()
		this.checkForHorizontalCollisions() //mind the sequence
		this.applyGravity()
		this.updateHitbox()
		this.checkForVerticalCollisions()
	}
	updateHitbox(){
		this.hitbox = {
			position: {
				x: this.position.x + 35,
				y: this.position.y + 26,
			},
			width: 14,
			height: 27,
		}

	}
	checkForHorizontalCollisions() {
		for(let i = 0; i < this.collisionBlocks.length; i ++) {
			const collisionBlock = this.collisionBlocks[i]

			if (
				Collision({
					object1: this.hitbox,
					object2: collisionBlock,
				})
				) 
			{
				if(this.velocity.x > 0) {
					this.velocity.x = 0
					const offset = this.hitbox.position.x - this.position.x + this.hitbox.width
					this.position.x = collisionBlock.position.x - offset - 0.01 // subtract the last one
				}

				if(this.velocity.x < 0) {
					this.velocity.x = 0

					const offset = this.hitbox.position.x - this.position.x

					this.position.x = collisionBlock.position.x + collisionBlock.width - offset+ 0.01 // add the last one
				}
			}

		}
	}
	applyGravity() {
		this.velocity.y += gravity
		this.position.y += this.velocity.y
		
	}

	checkForVerticalCollisions() {
		for(let i = 0; i < this.collisionBlocks.length; i ++) {
			const collisionBlock = this.collisionBlocks[i]

			if (
				Collision({
					object1: this.hitbox,
					object2: collisionBlock,
				})
				) 
			{
				if(this.velocity.y > 0) {
					this.velocity.y = 0

					const offset = this.hitbox.position.y - this.position.y + this.hitbox.height

					this.position.y = collisionBlock.position.y - offset - 0.01 // subtract the last one
					break
				}

				if(this.velocity.y < 0) {
					this.velocity.y = 0

					const offset = this.hitbox.position.y - this.position.y 
					this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.01 // add the last one
					break
				}
			}

		}
	}
}

