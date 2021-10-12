import chalk from "chalk";
const { red, green, grey, inverse } = chalk;
import fetch from "node-fetch";
import { writeFile, readFileSync, watch } from "fs";

import { fetchLink } from "./commands.js";
import explainStatusCode from "./errorType.js";

export function write(obj, path) {
  writeFile(path, JSON.stringify(obj), "utf8", (err) => {
    if (err) {
      console.error("couldn't write to config.json");
      console.error(err);
    }
  });
}

export function loadJson(path) {
  const content = readFileSync(new URL(path, import.meta.url));
  return JSON.parse(content);
}

export async function request(link, options, type, exitAfter) {
  log(grey(`fetching ${link}`));

  const start_time = new Date().getTime()

  let optionsClone = { ...options };
  delete optionsClone.body;

  if (["PUT", "POST", "PATCH"].includes(options.method))
    optionsClone.body = JSON.stringify(options.body);

  const response = await fetch(link, optionsClone).catch(
    handleFetchErrors.bind({ link, exitAfter })
  );

  if (response)
    if (response.ok) {
      log(
        green(`server responded with status ${inverse(response.status)}`)
      );
      const body = await response[type]().catch(
        handleFetchErrors.bind({ link })
      );
      if (body) log(body);
    } else {
      log(
        red(`server responded with status ${inverse(response.status)}`)
      );
      log(options);
      const error = explainStatusCode(response.status);
      log(error);
    }

  const end_time = new Date().getTime();
  log(grey(`fetch ended in ${ (end_time - start_time)/1000 }s`))

  if (exitAfter) return process.exit();
}

function handleFetchErrors(err) {
  log(red(err.name));
  log(`type : ${err.type}`);
  log(err.message);

  if (this.exitAfter) return;
  switch (err.type) {
    case "invalid-json":
      log(grey(`fetching as text instead`));
      request(this.link, options, "text", this.exitAfter);
      break;
    case "system":
      break;
  }
}

export function watchPath(path) {
  log(grey(`watching ${path}`));

  let running = false;
  watch(path, (eventType, filename) => {
    if (running) return;

    running = true;
    log(grey(`dectected ${eventType} on ${filename}`));

    setTimeout(() => {

      running = false;
      fetchLink("def");
    }, config.delay);
  });
}

export function generateTags() {
  let arr = [
    "opt",
    "header",
    "load",
    "set",
    "log",
    "https://",
    "http://",
    "clear",
    "rm",
    "config",
    "POST",
    "GET",
    "body",
    "DELETE",
    "PUT",
    "help",
    "exit",
    "quit",
    config[config.def],
  ];
  arr = arr.concat(Object.keys(config));
  arr = arr.concat(Object.keys(options));
  arr = arr.concat(Object.keys(options.headers));
  arr = arr.concat(Object.keys(options.body));

  return arr;
}
