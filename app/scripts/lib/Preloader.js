


export default class Preloader {

  #isLoading = false;

  constructor() {
     this.preloader = document.getElementById('preloader');
  }

  toggleLoading() {

    this.#isLoading = !this.#isLoading;

    this.setLoading = this.#isLoading;

  }

  set setLoading(value) {

    if (value) this.preloader.classList.remove('loaded');
    else this.preloader.classList.add('loaded');

    this.#isLoading = value;
  }

  get isLoading() {
    return this.#isLoading;
  }


}