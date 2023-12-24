import Sprite from "./sprite.js";
import CollisionCalculator from "../utils/CollisionCalculator.js";
import HealthBar from "../utils/HealthBar.js";
export default class Enemy extends Sprite {
	/**
	 * ������
	 * @param {object} position - ���˵�λ��
	 * @param {array} collisionBlocks - ��ײ������
	 * @param {string} imageSrc - ����ͼ���·��
	 * @param {number} frameRate - ���˶�����֡��
	 * @param {number} scale - ���˵����ű���
	 * @param {object} animations - ���˶�������
	 * @param {int} HP_limit - ���˵��������ֵ
	 * @param {int} HP - ���˵�����ֵ
	 * @param {int} damage - ���˵Ĺ�����
	 * @param {int} player_position - �������λ��
	 * @param {boolean} closer - �����Ƿ����������ƶ�
	 * @param {int}  enemyLastAttackTime - ���˹���ʱ��
	 * @param {int}  enemyAttackCooldown - ���˹�����ȴ
	 * @param {int}  attackCount- ���˹�������
	 * @param {bool} hasDamage - �����Ƿ�����˺�
	 * @param {bool} showDead - �Ƿ񲥷���������
	 * @param {int} preHP -ǰһ��״̬��HP�������ж��Ƿ��ܵ��˺�
	 * @param {bool} behurt - �Ƿ��ܵ��˺�
	 * @param {int}  classID - ���ID
	 */
	constructor({
		position,
		collisionBlocks,
		platformCollisionBlocks,
		classID,
		HP_limit,
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
		this.platformCollisionBlocks = platformCollisionBlocks;
		this.hitbox = {
			position: {
				x: this.position.x,
				y: this.position.y,
			},
			width: 10,
			height: 10,
		};
		this.animations = animations;
		this.classID = classID;
		this.healthBar = new HealthBar(this);
		this.lastDirection = 'left';
		this.enemyAttackCooldown= 2000;
		this.enemyLastAttackTime = Date.now();
		this.attackCount = 0;
		this.showDead = true;
		this.behurt = true;
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
		this.HP_limit = HP_limit;
		this.HP = this.HP_limit;
		this.preHP = this.HP;
		this.damage = 0.2;
	}

	/*���������鷽��*/
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
	get_position() {
		return this.position;
	}
	get_hitbox() {
		return this.hitbox;
	}
	/**
	 * ������Ծ
	 */
	try2Jump() {
		if (this.jumpingCount == 2) {
			return;
		}
		this.#jump();
	}
	canEnemyAttack() {
		return Date.now() >= this.enemyLastAttackTime + this.enemyAttackCooldown;
	  }
	//�ж�����Ƿ��ڹ�����Χ��
	isPlayerInAttackRange(player)
	{
		return Math.abs(player.position.x-this.position.x) <= 40
				&& 	Math.abs(player.position.y-this.position.y) <=20
	}
	/**
	 * ��������
	 */
	attack(player) {
		console.log(this.attackCount)
		if(this.attackCount%3!=0)
		{
			if(this.lastDirection=='right')
				this.switchSprite('Attack1_right');
			else 
				this.switchSprite('Attack1_left');
		}
		else
		{
			if(this.lastDirection=='right')
				this.switchSprite('Attack2_right');
			else 
				this.switchSprite('Attack2_left');
		}
		if(this.isPlayerInAttackRange(player))
		{
			if(player.HP>0 && !this.hasDamage)
			{
				this.hasDamage = true
				if(this.damage>player.HP)
				{
					player.HP = 0
				}
				else
				{
					player.HP -= this.damage
					if(player.lastDirection=='right')
						player.switchSprite('TakeHit_right')
					else
						player.switchSprite('TakeHit_left')
				}
			}
		}
		this.hasDamage = false
	}
		

	
	

	/**
	 * ��Ծ����
	 */
	#jump() {
		this.velocity.y = -3.0;
		this.jumpingCount++;
	}

	/**
	 * ��Ծ���÷���
	 */
	#jumpResets() {
		this.jumpingCount = 0;
	}

	/**
	 *����AI
	 */
	enemy_AI(player_position, player) {
		//�������λ��
		if (this.position.x <player_position.x) {
			this.lastDirection = 'right';
		} else if (this.position.x > player_position.x) {
			this.lastDirection = 'left';
		}
		
		//�������Ұ��Χ�ڣ����ɫ�ƶ�
		if (CollisionCalculator.hasCollision({object1:this.camerabox, object2:player.hitbox})) {
			this.closer = true
			//����һ�ξ���󣬲������ɫ�ƶ�
			
			if((this.position.x-player_position.x)<30&&(this.position.x-player_position.x)>-30)
			{
				//console.log(this.position.x-player_position.x)
				this.velocity.x = 0;
				switch(this.lastDirection)
				{
					case 'right':
						this.switchSprite('Idle')
						break;
					case 'left':
						this.switchSprite('IdleLeft')
						break;
				}
				if((this.position.y-player_position.y) < 15 && (this.position.y-player_position.y) > -15) {
					// 用 Math.abs()更简洁 
					this.closer = false
					if(this.canEnemyAttack())
				{
					console.log('attack')
					setTimeout(() => {
						this.enemyLastAttackTime = Date.now();
						this.attackCount++;
		
					}, 500); //500��λʱ���Լ������һ�ι�������
					this.attack(player);
				}

				}
				else this.try2Jump()
				
			}

			if(this.closer)
			{
				//������ƶ�
				switch (this.lastDirection) {
				case 'right':
					this.switchSprite('Run')
					this.velocity.x = 0.8
					this.lastDirection = 'right'
					
					break;
				case 'left':
					this.switchSprite('RunLeft')
					this.velocity.x = -0.8
					this.lastDirection = 'left'
					
					break;
				}
			}

			//������Ծ(����)
			if (this.velocity.y < 0) {
			
				if (this.lastDirection == 'right') this.switchSprite('Jump')
				else this.switchSprite('JumpLeft')
			
			}
			else if (this.velocity.y > 0) {

				if (this.lastDirection == 'right') this.switchSprite('Fall')
				else this.switchSprite('FallLeft')
			}
					
		
		}
		else
		{
			this.velocity.x = 0;
			switch(this.lastDirection)
			{
				case 'right':
					this.switchSprite('Idle')
					break;
				case 'left':
					this.switchSprite('IdleLeft')
					break;
			}
			
		}
	}

	/**
	 * �л����鷽��
	 * @param {string} key - ����ļ���
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
	 * ����camerabox
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
	 * ���ˮƽ�����ϵ���ײ
	 */
	checkforHorizontalCanvasCollision() {
		if (
			this.hitbox.position.x + this.hitbox.width + this.velocity.x >= 576 ||
			this.hitbox.position.x + this.velocity.x <= 0
		) {
			this.velocity.x = 0; // ����ͨ����Ե
			return true;
		}
		else return false;
	}
	
	/**
	 * ���·���
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

		//����ͼ��
		/*
		c.fillStyle = "rgba(0, 255, 0, 0.2)";
		c.fillRect(this.position.x, this.position.y, this.width, this.height);

		c.fillStyle = "rgba(255, 0, 0, 0.2)";
		c.fillRect(
			this.hitbox.position.x,
			this.hitbox.position.y,
			this.hitbox.width,
			this.hitbox.height
		);
	*/
		this.draw();

		this.position.x += this.velocity.x;
		this.updateHitbox();
		this.checkForHorizontalCollisions(); //ע������
		this.applyGravity();
		this.updateHitbox();
		this.checkForVerticalCollisions();
		this.check();
		this.healthBar.update();
    	this.healthBar.draw(c);
	}

	/**
	 * ����hitbox
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
	 * ���ˮƽ��ײ
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
					this.position.x = collisionBlock.position.x - offset - 0.01; // ��ȥ���һ��
					this.try2Jump();
				}

				if (this.velocity.x < 0) {
					this.velocity.x = 0;

					const offset = this.hitbox.position.x - this.position.x;
					this.position.x =
						collisionBlock.position.x + collisionBlock.width - offset + 0.01; // �������һ��
					this.try2Jump();
				}
			}
		}
	}

	/**
	 * Ӧ������
	 */
	applyGravity() {
		this.velocity.y += gravity;
		this.position.y += this.velocity.y;
	}

	/**
	 * ��鴹ֱ��ײ
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

					this.position.y = collisionBlock.position.y - offset - 0.01; // ��ȥ���һ��
					break;
				}

				if (this.velocity.y < 0) {
					this.velocity.y = 0;

					const offset = this.hitbox.position.y - this.position.y;
					this.position.y =
						collisionBlock.position.y + collisionBlock.height - offset + 0.01; // �������һ��
					break;
				}
			}
		}
	}
	check() {
		for (let i = 0; i < this.platformCollisionBlocks.length; i++) {
			const platformCollisionBlock = this.platformCollisionBlocks[i];

			if (
				CollisionCalculator.hasPlatformCollision({
					object1: this.hitbox,
					object2: platformCollisionBlock,
				})
			) {
				if (this.velocity.y >= 0) {
					this.velocity.y = 0;
					this.#jumpResets();
					const offset =
						this.hitbox.position.y - this.position.y + this.hitbox.height;

					this.position.y = platformCollisionBlock.position.y - offset - 0.01; // 减去最后一个
					break;
				}
			}
		}
	}

	saveData() {
		super.saveData()
		this.setStorage( this.id + "hitbox", this.hitbox)
		this.setStorage(this.id + "HP", this.HP)
		this.setStorage(this.id + "camerabox", this.camerabox)
		this.setStorage(this.id + "showDead", this.showDead)
	}

	loadData() {
		super.loadData()
		this.hitbox = this.getStorage(this.id + "hitbox")
		this.HP = this.getStorage(this.id + "HP")
		this.camerabox = this.getStorage(this.id + "camerabox")
		this.showDead = this.getStorage(this.id + "showDead")
	}

}
