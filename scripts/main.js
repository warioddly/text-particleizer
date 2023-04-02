import { TextParticleizer } from "./lib/TextParticleizer.js";

console.log('INITIAL PROJECT');

const particleSize = 1;

const options = {
    initialValue: "WARIODDLY",
    particleSize: particleSize,
    rows: 600,
    cols: 800,
    particle: {
        radius: 40,
        friction: .9,
        gravity: .01,
        maxGravity: .05,
        size: particleSize
    }
}

const particleizer = new TextParticleizer(options);

window.onload = async () => {

    const renderButton = document.getElementById('w-render-button');
    renderButton.addEventListener('click', renderParticle);

}

function renderParticle() {

    const text = document.getElementById('w-input-field').value;
    particleizer.render(text);

}


