
class Particle {

    constructor (x, y, texture, size) {

        this.x = x;
        this.y = y;

        this.sprite = new PIXI.Sprite(new PIXI.Texture(texture));

        this.sprite.texture.frame = new PIXI.Rectangle(x, y, size, size);

        this.sprite.x = x;
        this.sprite.y = y;


        this.speedX = 0;
        this.speedY = 0;


        this.radius = 60;
        this.friction = .9;
        this.gravity = 0.01;
        this.maxGravity = 0.01 + Math.random() * .07;

    }

    update(mouse) {

        let distanceX = mouse.x - this.sprite.x;
        let distanceY = mouse.y - this.sprite.y;


        let distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);


        let normalX = distanceX / distance;
        let normalY = distanceY / distance;


        if (distance < this.radius) {

            this.gravity *= this.friction;

            this.speedX -= normalX;
            this.speedY -= normalY;

        }
        else {
            this.gravity += 0.1 * (this.maxGravity - this.gravity);
        }


        const oDistX = this.x - this.sprite.x;
        const oDistY = this.y - this.sprite.y;


        this.speedX += oDistX * this.gravity;
        this.speedY += oDistY * this.gravity;


        this.speedX *= this.friction;
        this.speedY *= this.friction;


        this.sprite.x += this.speedX;
        this.sprite.y += this.speedY;

    }

    destroy() {
        this.sprite.destroy();
    }

}


export default Particle;