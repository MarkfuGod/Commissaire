export default class Sprite {

	static id = 0;

	constructor({
		position,
		imageSrc,
		frameRate = 1,
		frameBuffer = 3,
		scale = 1,
	}) {
		this.position = position; // the actual position
		this.scale = scale;
		this.loaded = false;
		this.image = new Image();
		this.image.onload = () => {
			this.width = (this.image.width / this.frameRate) * this.scale;
			this.height = this.image.height * this.scale;
			this.loaded = true;
		};
		this.image.src = imageSrc;
		this.frameRate = frameRate;
		this.currentFrame = 0;
		this.frameBuffer = frameBuffer;
		this.elapsedFrame = 0;
		this.id = Sprite.id;
		Sprite.id += 1;
	}
	draw() {
		if (!this.image) return;

		const cropbox = {
			position: {
				x: this.currentFrame * (this.image.width / this.frameRate),
				y: 0,
			},
			width: this.image.width / this.frameRate,
			height: this.image.height,
		};

		c.drawImage(
			this.image,
			cropbox.position.x,
			cropbox.position.y,
			cropbox.width,
			cropbox.height,
			this.position.x,
			this.position.y,
			this.width,
			this.height
		);
	}
	update() {
		this.draw();
		this.updateFrames();
	}
	/**
	 * @variation elapsedFrame - the global timestamp for player
	 * @variation frameBuffer - the delay time between player frame
	 * @variation currentFrame - the current timestamp in player frame circle
	 */
	updateFrames() {
		this.elapsedFrame++;

		if (this.elapsedFrame % this.frameBuffer == 0) {
			if (this.currentFrame < this.frameRate - 1) this.currentFrame++;
			else this.currentFrame = 0;
		}
	}

	saveData() {
		let storage = window.localStorage;
		this.setStorage(this.id + "position", this.position)
	}

	loadData() {
		let storage = window.localStorage;
		this.position = this.getStorage(this.id + "position")
	}

	toJson(object) {
		return JSON.stringify(object);
	}

	toObject(json) {
		return JSON.parse(json);
	}

	setStorage(key, object) {
		let storage = window.localStorage;
		storage.setItem(key, this.toJson(object))
	}

	getStorage(key) {
		let storage = window.localStorage;
		return this.toObject(storage.getItem(key))
	}

}
