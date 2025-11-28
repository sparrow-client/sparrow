import * as http from "node:http";

class CoreApi {
  async runUsecase({ usecaseJson }) {
    const json = JSON.parse(usecaseJson);
    const step = json.steps[0];

    const promises = [];

    for (const step of json.steps) {
      const url = step.do.url;
      const method = step.do.method;
      const body = step.do.body;
      const headers = { "content-type": "application/json" };
      for (const header in step.do.headers) {
        headers.push(header);
        headers.push(step.do.headers[header]);
      }

      const promise = fetch(url, {
        method: method,
        headers: headers,
        body: JSON.stringify(body),
      }).then((response) => response.json());
      promises.push(promise);
    }

    const responses = [];
    const iter = await Promise.all(promises);
    for (const promise of iter) {
      responses.push(promise);
    }
    console.log(responses);
    return responses;
  }
}

export { CoreApi };
