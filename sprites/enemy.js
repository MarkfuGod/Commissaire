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
		this.enemyLastAttackTime = Date.now();
		this.attackCount = 0;
		this.showDead = true;
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
		this.closer = false;

		// Combat state
		this.isInvincible = false;
		this.lastHitTime = 0;
		this.deathStarted = false;

		// Per-class stat sheet
		if (this.classID === 1) {
			// Evil Wizard — standard enemy
			this.damage = 10;
			this.enemyAttackCooldown = 2000;
			this.speed = 0.8;
			this.invincibilityDuration = 350;
			this.attackAnimationDuration = 700; // ms the attack anim plays before reverting to Idle
		} else if (this.classID === 2) {
			// Wizard — boss: hits harder, faster cooldown, shorter stun window
			this.damage = 18;
			this.enemyAttackCooldown = 1400;
			this.speed = 1.1;
			this.invincibilityDuration = 200;
			this.attackAnimationDuration = 1000;
		} else {
			this.damage = 10;
			this.enemyAttackCooldown = 2000;
			this.speed = 0.8;
			this.invincibilityDuration = 350;
			this.attackAnimationDuration = 700;
		}
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
	 * Attack the player once per cooldown trigger.
	 * Damage is applied a single time; the caller (enemy_AI) is responsible
	 * for enforcing the cooldown so this method is not called every frame.
	 */
	attack(player) {
		if (this.attackCount % 3 !== 0) {
			this.switchSprite(this.lastDirection === 'right' ? 'Attack1_right' : 'Attack1_left');
		} else {
			this.switchSprite(this.lastDirection === 'right' ? 'Attack2_right' : 'Attack2_left');
		}
		if (this.isPlayerInAttackRange(player)) {
			player.takeDamage(this.damage, this.lastDirection);
		}
	}

	/**
	 * Receive a hit — apply damage once, trigger i-frames, knockback, and TakeHit animation.
	 * Silently ignored while already invincible or dead.
	 */
	takeDamage(amount, attackerDirection) {
		if (this.isInvincible || this.HP <= 0) return;
		this.HP = Math.max(0, this.HP - amount);
		this.isInvincible = true;
		this.lastHitTime = Date.now();
		// Knockback
		this.velocity.x = attackerDirection === 'right' ? 1.5 : -1.5;
		this.velocity.y = -0.5;
		this.switchSprite(this.lastDirection === 'right' ? 'TakeHit_right' : 'TakeHit_left');
	}

	/**
	 * Trigger the death animation exactly once, then hide the enemy.
	 */
	startDeathAnimation() {
		if (this.deathStarted) return;
		this.deathStarted = true;
		this.switchSprite(this.lastDirection === 'right' ? 'Death' : 'DeathMirror');
		setTimeout(() => { this.showDead = false; }, 680);
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
	 * Enemy AI — called every frame.
	 *
	 * States:
	 *  - Out of detection range  → Idle
	 *  - In detection range, attack range not yet reached → Chase (+ jump when player is above)
	 *  - In attack range → Stop and attack on cooldown
	 *
	 * Jumping/falling animations always take priority over the state animations.
	 */
	enemy_AI(player_position, player) {
		// Stunned after taking a hit — let TakeHit animation play uninterrupted
		if (this.isInvincible) return;

		const dx = player_position.x - this.position.x;
		const dy = player_position.y - this.position.y; // positive = player is below enemy

		// Keep facing direction up to date
		if (dx > 0) this.lastDirection = 'right';
		else if (dx < 0) this.lastDirection = 'left';

		const inDetectionRange = CollisionCalculator.hasCollision({
			object1: this.camerabox,
			object2: player.hitbox,
		});

		if (!inDetectionRange) {
			// Player is too far away — stand idle
			this.velocity.x = 0;
			this.switchSprite(this.lastDirection === 'right' ? 'Idle' : 'IdleLeft');
			return;
		}

		const inAttackRange = Math.abs(dx) <= 35 && Math.abs(dy) <= 25;

		if (inAttackRange) {
			// Close enough to hit — stop moving and attack
			this.velocity.x = 0;

			if (this.canEnemyAttack()) {
				this.enemyLastAttackTime = Date.now();
				this.attackCount++;
				this.attack(player);
			}

			// Revert to Idle only after the attack animation has had time to finish.
			// Without this guard, Idle would override the attack sprite every frame.
			if (this.attackCount === 0 ||
				Date.now() - this.enemyLastAttackTime > this.attackAnimationDuration) {
				this.switchSprite(this.lastDirection === 'right' ? 'Idle' : 'IdleLeft');
			}
		} else {
			// Chase the player
			this.velocity.x = dx > 0 ? this.speed : -this.speed;
			this.switchSprite(dx > 0 ? 'Run' : 'RunLeft');

			// Jump to reach a player who is noticeably above and enemy is grounded
			if (dy < -20 && this.velocity.y === 0) {
				this.try2Jump();
			}
		}

		// Jumping / falling animations override the state animations above
		if (this.velocity.y < -0.1) {
			this.switchSprite(this.lastDirection === 'right' ? 'Jump' : 'JumpLeft');
		} else if (this.velocity.y > 0.5) {
			this.switchSprite(this.lastDirection === 'right' ? 'Fall' : 'FallLeft');
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
		this.currentFrame = 0;
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
		// Tick down invincibility frames
		if (this.isInvincible && Date.now() - this.lastHitTime > this.invincibilityDuration) {
			this.isInvincible = false;
		}
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
