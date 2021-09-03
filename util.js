import chalk from "chalk";
const { red, green, grey, inverse } = chalk;
import fetch from "node-fetch";
import { writeFile, readFileSync, watch } from "fs";

import { fetchLink } from "./commands.js";
import errorType from "./errorType.js";

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

  const response = await fetch(link, options).catch(handleFetchErrors);

  if (response)
    if (response.ok) {
      console.log(
        green(`server responded with status ${inverse(response.status)}`)
      );
      const body = await response[type]().catch(handleFetchErrors);
      if (body) console.log(body);
    } else {
      console.log(
        red(`server responded with status ${inverse(response.status)}`)
      );
      console.log(options);
      const error = errorType(response.status);
      console.log(error);
    }

  if (exitAfter) return process.exit();
}

function handleFetchErrors(err) {
  console.log(red(err.name));
  console.log(`type : ${err.type}`);
  console.log(err.message);
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
    "clear",
    "rm",
    "config",
    "help",
    "exit",
  ];
  arr = arr.concat(Object.keys(config));
  arr = arr.concat(Object.keys(options));
  arr = arr.concat(Object.keys(options.headers));
  return arr;
}
