import chalk from "chalk";
const { red, green, grey, inverse } = chalk;
import fetch from "node-fetch";
import { writeFile, readFileSync, watch } from "fs";

import { fetchLink } from "./commands.js";
import { explainStatusCode } from "./errorType.js";

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
  console.log(grey(`fetching ${link}`));

  const response = await fetch(link, options).catch(
    handleFetchErrors.bind({ link, exitAfter })
  );

  if (response)
    if (response.ok) {
      console.log(
        green(`server responded with status ${inverse(response.status)}`)
      );
      const body = await response[type]().catch(
        handleFetchErrors.bind({ link })
      );
      if (body) console.log(body);
    } else {
      console.log(
        red(`server responded with status ${inverse(response.status)}`)
      );
      console.log(options);
      const error = explainStatusCode(response.status);
      console.log(error);
    }

  if (exitAfter) return process.exit();
}

function handleFetchErrors(err) {
  console.log(red(err.name));
  console.log(`type : ${err.type}`);
  console.log(err.message);

  if (this.exitAfter) return;
  switch (err.type) {
    case "invalid-json":
      console.log(grey(`fetching as text instead`));
      request(this.link, options, "text", this.exitAfter);
      break;
    case "system":
      break;
  }
}

export function watchPath(path) {
  console.log(grey(`watching ${path}`));

  let running = false;
  watch(path, (eventType, filename) => {
    if (running) return;

    running = true;
    console.log(grey(`dectected ${eventType} on ${filename}`));

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
    "fetch",
    "log",
    "https://",
    "clear",
    "rm",
    "config",
    "help",
    "exit",
    config[config.def],
  ];
  arr = arr.concat(Object.keys(config));
  arr = arr.concat(Object.keys(options));
  arr = arr.concat(Object.keys(options.headers));
  return arr;
}
