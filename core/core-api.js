import * as http from "node:http";

class CoreApi {
  #savedState;
  #givenState;
  constructor() {
    this.#savedState = new Map();
    this.#givenState = new Map();
  }
  async runUsecase({ usecaseJson }) {
    const json = JSON.parse(usecaseJson);

    const responses = [];

    this.#initializeGivenState(json.given);

    for (const step of json.steps) {
      const url = this.#resolve(step.do.url);
      const method = step.do.method;
      const body = step.do.body;
      this.#resolve(body);


      const headers = { "content-type": "application/json" };
      for (const header in step.do.headers) {
        headers.push(header);
        headers.push(this.#resolve(step.do.headers[header]));
      }

      const savedVariables = step.do.saved;

      const response = await fetch(url, {
        method: method,
        headers: headers,
        body: JSON.stringify(body),
      })
      const json = await response.json();
      if (response.status.toString().match(/^[45]\d{2}$/)) {
        responses.push({ statusCode: response.status, body: "{}" });
      } else {
      this.#updateSavedState({ json, savedVariables });

      responses.push({ statusCode: response.status, body: JSON.stringify(json, null, 2) });
      }
    }
    return responses;
  }

  #updateSavedState({ json, savedVariables }) {
    if (!savedVariables) {
      return;
    }
    for (const [k, v] of Object.entries(savedVariables)) {
      if (looksLikeMetaVariable(v)) {
        this.#savedState[k] = lookup({ pointer: trim(v), json: json });
      } else {
        this.#savedState[k] = v;
      }
    }
  }

  #initializeGivenState(givenState) {
    if (!givenState) {
      return;
    }
    for (const [k, v] of Object.entries(givenState)) {
      this.#givenState[k] = v;
    }
  }

  #findSaved(k) {
    return this.#savedState[k];
  }

  #findGiven(k) {
    return this.#givenState[k];
  }

  #resolve(json) {
    if (typeof json !== "object") {
      let value = json;
      if (containsMetaVariable(json)) {
        value = this.#substituteMetaVariable(json);
        if (!value) {
          throw new Error(`not found saved variable ${json}`);
        }
      }
      return value;
    } else {
      for (const [k, v] of Object.entries(json)) {
        const resolved = this.#resolve(json[k]);
        json[k] = resolved;
      }
    }
    return json;
  }

  #substituteMetaVariable(json) {
    if (containsMetaVariable(json)) {
      let tmp = json;
      const regex = /{{[\w_\.]+}}/g;

      const metaParts = [];
      let m;
      while ((m = regex.exec(tmp))) {
        metaParts.unshift({ metaReference: trim(m[0])});
      }

      for (const metaPart of metaParts) {
        const meta = metaPart.metaReference;
        const savedMeta = meta.replace(/^(saved\.)/, "");
        const givenMeta = meta.replace(/^(given\.)/, "");

        const saveMetaValue = this.#findSaved(savedMeta);
        const givenMetaValue = this.#findGiven(givenMeta);

        if (saveMetaValue) {
          tmp = tmp.replace(`{{${meta}}}`, saveMetaValue);
          continue;
        } else if (givenMetaValue) {
          tmp = tmp.replace(`{{${meta}}}`, givenMetaValue);
          continue;
        }
        throw new Error(`could not replace ${meta}`);
      }

      return tmp;
    }
    return json;
  }
}

function containsMetaVariable(str) {
  return typeof str === "string" && str.match(/.*{{.*}}.*/);
}
function looksLikeMetaVariable(str) {
  return typeof str === "string" && str.startsWith("{{") && str.endsWith("}}");
}
function trim(str) {
  return str.slice(2, -2);
}

function lookup({ pointer, json }) {
  const value = pointer.split(".").reduce((current, prop) => current?.[prop], json);

  if (!value) {
    throw new Error(`invalid pointer {{${pointer}}}`);
  }

  return value;
}

export { CoreApi };
