import Particle from "./Particle.js";
import Fontography from "./Fontography.js";
import Preloader from "./Preloader.js";

export class TextParticleizer {

    #particles = [];

    #previousText = null;

    #preloader = new Preloader();


    constructor(options) {

        this.options = options;

        this.canvas = document.createElement('canvas');

        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });

        this.canvas.width = this.options.cols * this.options.particleSize;
        this.canvas.height = this.options.rows * this.options.particleSize;

        this.render(this.options.initialValue);
    }


    async render(text) {

        if (this.#previousText === text.toLowerCase() || text.length === 0) return;
        else this.#previousText = text.toLowerCase();

        this.#preloader.setLoading = true;

        console.log("[+] RENDERING TEXT: " + text);

        const fontography = new Fontography(
        this.options.cols * this.options.particleSize,
        this.options.rows * this.options.particleSize,
        );

        const base64 = fontography.render(text);

        const texture = await PIXI.Assets.load(base64);

        this.#renderCanvas();

        await this.#drawImage(base64, () => {

            this.#renderParticles(texture);

            this.#animate();

            this.#preloader.setLoading = false;

            console.log("[+] RENDERED");

        });

    }


    #renderCanvas() {

        if (this.app) this.app.destroy(true);

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

        for (let i = 0; i < this.options.cols; i++) {
            for (let j = 0; j < this.options.rows; j++) {

                if (this.#isRenderableParticle(
                    i * this.options.particleSize,
                    j * this.options.particleSize,
                    this.options.particleSize
                )) {

                    const particle = new Particle(
                        i * this.options.particleSize,
                        j * this.options.particleSize,
                        texture,
                        this.options.particle,
                    )

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

            const mouse = this.app.renderer.events.rootPointerEvent.global;

            this.#particles.forEach(particle => particle.update(mouse));

        });

    }


}