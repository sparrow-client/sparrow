import * as http from "node:http";

class CoreApi {
  #savedState;
  constructor() {
    this.#savedState = new Map();
  }
  async runUsecase({ usecaseJson }) {
    const json = JSON.parse(usecaseJson);

    const responses = [];

    for (const step of json.steps) {
      const url = this.#resolve(step.do.url);
      const method = step.do.method;
      const body = step.do.body;
      this.#resolve(body);
      console.log(url);
      console.log(method);
      console.log(body);

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

      console.log(json);
      console.log("=====");
      console.log(savedVariables);

      this.#updateSavedState({ json, savedVariables });

      responses.push(JSON.stringify(json, null, 2));
    }

    return responses;
  }

  #updateSavedState({ json, savedVariables }) {
    if (!savedVariables) {
      return;
    }
    for (const [k, v] of Object.entries(savedVariables)) {
      if (looksLikeMetaVariable(v)) {
        // console.log(`${k} --> ${v}`);
        // console.log(json);
        this.#savedState[k] = lookup({ pointer: trim(v), json: json });
      } else {
        this.#savedState[k] = v;
      }
    }
    console.log(`updated ${this.#savedState}`);
  }

  #findSaved(k) {
    return this.#savedState[k];
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
        json[k] = this.#resolve(json[k]);
      }
    }
  }

  #substituteMetaVariable(json) {
    if (containsMetaVariable(json)) {
      const start_i = json.indexOf("{");
      const end_i = json.lastIndexOf("}") + 1;
      const meta = trim(json.slice(start_i, end_i));
      const savedMeta = meta.replace(/^(saved\.)/, "");

      console.log("<<<SUBSTITUTING>>>");
      console.log(meta)
      console.log(savedMeta)
      const metaValue = this.#findSaved(savedMeta);
      if (metaValue) {
        console.log(">>>>>>>>");
        console.log(metaValue);
        return json.replace(`{{${meta}}}`, metaValue);
      }
      console.log(this.#savedState);
      throw new Error(`could not replace ${meta} with ${metaValue}`);
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
    throw new Error(`invalid pointer ${pointer}`);
  }

  return value;
}

export { CoreApi };
