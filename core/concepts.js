class Usecase {
  #json;

  constructor(jsonString) {
    this.#json = JSON.parse(jsonString);
  }

  steps() {
    return this.#json.steps;
  }

  run() {
    const results = [];
    for (const step of this.steps()) {
      // do stuff
    }

    return results;
  }
}

export { Usecase }
