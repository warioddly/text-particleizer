import { TextParticleizer } from "./lib/TextParticleizer.js";

console.log('INITIAL PROJECT');

const particleizer = new TextParticleizer();

window.onload = async () => {

    const renderButton = document.getElementById('w-button');
    renderButton.addEventListener('click', renderParticle);

}


function renderParticle() {

    const text = document.getElementById('w-input-field').value;

    particleizer.render(text);

}


