export default class CollisionBlock{
	constructor({position, height = 16}){
		this.position = position // the actual position
		this.width = 16
		this.height = 16
	}

	draw(){
		c.fillStyle = 'rgba(255, 0, 0, 0.5)' // r, g , b , alpha
		c.fillRect(this.position.x, this.position.y, this.width, this.height)
	}
	
	update(){
		this.draw()
	}
}
