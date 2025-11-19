import * as http from "node:http";

class CoreApi {
  runUsecase({ usecaseJson }) {
    const json = JSON.parse(usecaseJson);
    const step = json.steps[0];
    const url = step.do.url
    const method = step.do.method;
    const body = step.do.body;

    console.log(`I schaffe was! ${ url }`);

    const promise = new Promise((resolve, reject) => {
      const req = http.request(url, { method: method, timeout: 300, headers: { "content-type": "application/json" } }, (res) => {
        let body = "";

        res.on("data", (chunk) => body += chunk);
        res.on("end", () => resolve(body));
      });

      req.on("error", (e) => reject(e));

      req.write(JSON.stringify(body));
      req.end();
    });

    promise.then(body => console.log(body))
      .catch( err => console.error(err));
  }
}

export { CoreApi };
