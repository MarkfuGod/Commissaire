import Sprite from "./sprite.js";
import CollisionCalculator from "../utils/CollisionCalculator.js";
export default class Player extends Sprite {
	/**
	 * 玩家类
	 * @param {object} position - 玩家的位置
	 * @param {array} collisionBlocks - 碰撞块数组
	 * @param {string} imageSrc - 玩家图像的路径
	 * @param {number} frameRate - 玩家动画的帧率
	 * @param {number} scale - 玩家的缩放比例
	 * @param {object} animations - 玩家动画对象
	 * @param {int} HP_limit - 玩家的最大生命值
	 * @param {int} HP - 玩家的生命值
	 * @param {int} damage - 玩家的攻击力

	 */
	constructor({
		position,
		collisionBlocks,
		imageSrc,
		frameRate,
		scale = 0.5,
		animations,
	}) {
		super({ imageSrc, frameRate, scale });
		this.jumpingCount = 0;
		this.position = position;
		this.velocity = {
			x: 0,
			y: 1,
		};

		this.collisionBlocks = collisionBlocks;
		this.hitbox = {
			position: {
				x: this.position.x,
				y: this.position.y,
			},
			width: 10,
			height: 10,
		};

		this.animations = animations;
		this.lastDirection = "right";

		for (let key in this.animations) {
			const image = new Image();
			image.src = this.animations[key].imageSrc;

			this.animations[key].image = image;
		}

		this.camerabox = {
			position: {
				x: this.position.x,
				y: this.position.y,
			},
			width: 200,
			height: 80,
		};
		this.HP_limit = 100;
		this.HP = this.HP_limit;
		this.damage = 10;
	}

	/*玩家属性组方法 */
	get_HP_limit() {
		return this.HP_limit;
	}
	set_HP_limit(value) {
		this.HP_limit = value;
	}
	get_HP() {
		return this.HP;
	}
	set_HP(value) {
		this.HP = value;
	}
	get_damage() {
		return this.damage;
	}
	set_damage(value) {
		this.damage = value;
	}

	/**
	 * 尝试跳跃
	 */
	try2Jump() {
		if (this.jumpingCount == 2) {
			return;
		}
		this.#jump();
	}

	/**
	 * 攻击方法
	 */
	try2Attack(i) {
		switch(i)
		{
			case 0:
				this.attack1()
				break
			case 1:
				this.attack2()
				break
			case 2:
				this.attack3()
				break
		}
		

	}
	attack1() {
		//插入攻击1逻辑
	}
	attack2() {
		//插入攻击2逻辑
	}
	attack3() {
		//插入攻击3逻辑
	}
	/**
	 * 跳跃方法
	 */
	#jump() {
		this.velocity.y = -3.5;
		this.jumpingCount++;
	}

	/**
	 * 跳跃重置方法
	 */
	#jumpResets() {
		this.jumpingCount = 0;
	}

	/**
	 * 切换精灵方法
	 * @param {string} key - 精灵的键名
	 */
	switchSprite(key) {
		if (this.image == this.animations[key].image || !this.loaded) {
			return;
		}

		this.image = this.animations[key].image;
		this.frameBuffer = this.animations[key].frameBuffer;
		this.frameRate = this.animations[key].frameRate;
		
	}

	/**
	 * 更新camerabox
	 */
	updateCamerabox() {
		this.camerabox = {
			position: {
				x: this.position.x - 50,
				y: this.position.y,
			},
			width: 200,
			height: 80,
		};
	}

	/**
	 * 检查水平方向上的碰撞
	 */
	checkforHorizontalCanvasCollision() {
		if (
			this.hitbox.position.x + this.hitbox.width + this.velocity.x >= 576 ||
			this.hitbox.position.x + this.velocity.x <= 0
		) {
			this.velocity.x = 0; // 不能通过边缘
		}
	}

	/**
	 * 是否需要向左平移相机
	 * @param {object} canvas - 画布对象
	 * @param {object} camera - 相机对象
	 */
	shouldPanCameraToLeft({ canvas, camera }) {
		const cameraboxRightSide = this.camerabox.position.x + this.camerabox.width;

		if (cameraboxRightSide >= 576) return;

		if (cameraboxRightSide >= canvas.width / 4 + Math.abs(camera.position.x)) {
			camera.position.x -= this.velocity.x;
		}
	}

	/**
	 * 是否需要向右平移相机
	 * @param {object} canvas - 画布对象
	 * @param {object} camera - 相机对象
	 */
	shouldPanCameraToRight({ canvas, camera }) {
		if (this.camerabox.position.x <= 0) return;
		if (this.camerabox.position.x <= Math.abs(camera.position.x)) {
			camera.position.x -= this.velocity.x;
		}
	}

	/**
	 * 是否需要向下平移相机
	 * @param {object} canvas - 画布对象
	 * @param {object} camera - 相机对象
	 */
	shouldPanCameraDown({ canvas, camera }) {
		if (this.camerabox.position.y + this.velocity.y <= 0) return;

		if (this.camerabox.position.y <= Math.abs(camera.position.y) + canvas.height / 4) {
			camera.position.y -= this.velocity.y;
		}
	}

	/**
	 * 是否需要向上平移相机
	 * @param {object} canvas - 画布对象
	 * @param {object} camera - 相机对象
	 */
	shouldPanCameraUp({ canvas, camera }) {
		if (
			this.camerabox.position.y + this.camerabox.height + this.velocity.y >=
			432
		)
			return;

		if (
			this.camerabox.position.y + this.camerabox.height >=
			Math.abs(camera.position.y) + canvas.height / 4
		) {
			camera.position.y -= this.velocity.y;
		}
	}

	/**
	 * 更新方法
	 */
	update() {
		this.updateFrames();
		this.updateHitbox();

		this.updateCamerabox();
		// c.fillStyle = 'rgba(0, 0, 255, 0.2)'
		// c.fillRect (
		// 	this.camerabox.position.x,
		// 	this.camerabox.position.y,
		// 	this.camerabox.width,
		// 	this.camerabox.height )

		//绘制图像
		c.fillStyle = "rgba(0, 255, 0, 0.2)";
		c.fillRect(this.position.x, this.position.y, this.width, this.height);

		c.fillStyle = "rgba(255, 0, 0, 0.2)";
		c.fillRect(
			this.hitbox.position.x,
			this.hitbox.position.y,
			this.hitbox.width,
			this.hitbox.height
		);
	
		this.draw();

		this.position.x += this.velocity.x;
		this.updateHitbox();
		this.checkForHorizontalCollisions(); //注意序列
		this.applyGravity();
		this.updateHitbox();
		this.checkForVerticalCollisions();
	}

	/**
	 * 更新hitbox
	 */
	updateHitbox() {
		this.hitbox = {
			position: {
				x: this.position.x + 35,
				y: this.position.y + 26,
			},
			width: 14,
			height: 27,
		};
	}

	/**
	 * 检查水平碰撞
	 */
	checkForHorizontalCollisions() {
		for (let i = 0; i < this.collisionBlocks.length; i++) {
			const collisionBlock = this.collisionBlocks[i];

			if (
				CollisionCalculator.hasCollision({
					object1: this.hitbox,
					object2: collisionBlock,
				})
			) {
				if (this.velocity.x >= 0) {
					this.velocity.x = 0;
					const offset =
						this.hitbox.position.x - this.position.x + this.hitbox.width;
					this.position.x = collisionBlock.position.x - offset - 0.01; // 减去最后一个
				}

				if (this.velocity.x < 0) {
					this.velocity.x = 0;

					const offset = this.hitbox.position.x - this.position.x;
					this.position.x =
						collisionBlock.position.x + collisionBlock.width - offset + 0.01; // 加上最后一个
				}
			}
		}
	}

	/**
	 * 应用重力
	 */
	applyGravity() {
		this.velocity.y += gravity;
		this.position.y += this.velocity.y;
	}

	/**
	 * 检查垂直碰撞
	 */
	checkForVerticalCollisions() {
		for (let i = 0; i < this.collisionBlocks.length; i++) {
			const collisionBlock = this.collisionBlocks[i];

			if (
				CollisionCalculator.hasCollision({
					object1: this.hitbox,
					object2: collisionBlock,
				})
			) {
				if (this.velocity.y >= 0) {
					this.velocity.y = 0;
					this.#jumpResets();
					const offset =
						this.hitbox.position.y - this.position.y + this.hitbox.height;

					this.position.y = collisionBlock.position.y - offset - 0.01; // 减去最后一个
					break;
				}

				if (this.velocity.y < 0) {
					this.velocity.y = 0;

					const offset = this.hitbox.position.y - this.position.y;
					this.position.y =
						collisionBlock.position.y + collisionBlock.height - offset + 0.01; // 加上最后一个
					break;
				}
			}
		}
	}
}
