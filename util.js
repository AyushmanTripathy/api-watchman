import chalk from "chalk";
const { red, green, grey, inverse } = chalk;
import fetch from "node-fetch";
import { writeFile, readFileSync } from "fs";

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
