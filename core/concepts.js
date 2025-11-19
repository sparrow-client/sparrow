class Usecase {
  #json;

  constructor(jsonString) {
    this.#json = JSON.parse(jsonString);
  }

  steps() {
    return this.#json.steps;
  }

  run() {
    const jsonString = JSON.stringify(this.#json, null, 2);
    const results = window.coreApi.runUsecase({ usecaseJson: jsonString });
    console.log(results);
    return results;
  }
}

export { Usecase };
