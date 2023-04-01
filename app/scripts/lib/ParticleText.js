import RenderParticle from "./RenderParticle.js";

export class ParticleText {


    container = null;
    particleSize = 3;
    particles = [];
    rows = 200;
    cols = 300;


     constructor () {

       this.app = new PIXI.Application(
            window.innerWidth,
            window.innerHeight,
            {
                autoresize: true,
            }
       );

       document.body.appendChild(this.app.view);


       this.container = new PIXI.ParticleContainer(1000000);
       this.app.stage.addChild(this.container);


       this.objectLoader();

    }


    async objectLoader() {

        const texture = await PIXI.Assets.load('../../app/images/boundle.jpeg');

        const canvas = document.createElement('canvas');
        document.body.appendChild(canvas);

        this.ctx = canvas.getContext('2d');

        canvas.width = this.cols * this.particleSize;
        canvas.height = this.rows * this.particleSize;

        var img = document.createElement('img');
        img.src = `${texture.baseTexture.resource.src}`;

        img.onload = () => {

            this.ctx.drawImage(img, 0, 0);

            for (let i = 0; i < this.cols; i++) {

                for (let j = 0; j < this.rows; j++) {

                    if (this.isRenderable(i * this.particleSize, j * this.particleSize, this.particleSize)) {

                        const particle = new RenderParticle(
                            i * this.particleSize,
                            j * this.particleSize,
                            texture,
                            this.particleSize,
                        )
    
                        this.particles.push(particle);
                        this.container.addChild(particle.sprite)
    

                    }
            
                }

            }

            this.animate();
        };

    }


    isRenderable(x, y, size) {

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (this.ctx.getImageData( x + i, y + i, 1, 1).data[2] > 0) return true;
            }
        }

        return false
    }


    animate() {

        this.app.ticker.add(() => {

            this.mouse = this.app.renderer.plugins.interaction.rootPointerEvent.client;

            this.particles.forEach(particle => particle.update(this.mouse));
        
        });
        
    }


}

