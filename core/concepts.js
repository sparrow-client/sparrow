class Usecase {
  #json;

  constructor(jsonString) {
    this.#json = JSON.parse(jsonString);
  }

  steps() {
    return this.#json.steps;
  }

  run() {
    const results = window.coreApi.runUsecase({ usecaseJson: this.#json });
    console.log(results);
    return results;
  }
}

export { Usecase };
