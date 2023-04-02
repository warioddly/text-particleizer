import Particle from "./Particle.js";
import Fontography from "./Fontography.js";
import Preloader from "./Preloader.js";

export class TextParticleizer {

    particleSize = 1;
    #particles = [];
    rows = 600;
    cols = 800;

    currentText = null;

    preloader = new Preloader();


    constructor() {

        this.canvas = document.createElement('canvas');

        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });

        this.canvas.width = this.cols * this.particleSize;
        this.canvas.height = this.rows * this.particleSize;

        this.render("WARIODDLY");
    }


    async render(text) {

        if (this.currentText === text.toLowerCase()) return;
        else this.currentText = text.toLowerCase();

        this.preloader.setLoading = true;

        console.log("[+] RENDERING TEXT: " + text);


        const fontography = new Fontography(this.cols * this.particleSize, this.rows * this.particleSize);

        const base64 = fontography.render(text);

        const texture = await PIXI.Assets.load(base64);

        this.#renderCanvas();

        await this.#drawImage(base64, () => {

            this.#renderParticles(texture);

            this.#animate();

            this.preloader.setLoading = false;

            console.log("[+] RENDERED");

        });

    }


    #renderCanvas() {

        if (this.app) {
            this.app.destroy(true);
        }

        this.app = new PIXI.Application( window.innerWidth, window.innerHeight, { autoresize: true, antialias: true } );

        this.content = document.getElementById("canvas-container");

        this.container = new PIXI.ParticleContainer(1000000);

        this.content.appendChild(this.app.view);

        this.app.stage.addChild(this.container);

    }


    async #drawImage(image, callback) {

        const renderedImage = this.#createImage(image);

        renderedImage.onload = () => {
            this.ctx.drawImage(renderedImage, 0, 0);
            callback()
        };

    }


    #createImage(source) {
        const image = new Image();
        image.src = source;
        return image;
    }


    #renderParticles(texture) {

        this.#particles = [];

        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {

                if (this.#isRenderableParticle(i * this.particleSize, j * this.particleSize, this.particleSize)) {

                    const particle = new Particle(i * this.particleSize, j * this.particleSize, texture, this.particleSize )

                    this.#particles.push(particle);

                    this.container.addChild(particle.sprite)

                }
            }
        }

    }


    #isRenderableParticle(x, y, size) {

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (this.ctx.getImageData( x + i, y + i, 1, 1).data[1] > 0) return true;
            }
        }

        return false;
    }


    #animate() {

        this.app.ticker.add(() => {

            this.mouse = this.app.renderer.events.rootPointerEvent.global;

            this.#particles.forEach(particle => particle.update(this.mouse));

        });

    }


}