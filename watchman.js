#! /usr/bin/env node
import { createInterface } from "readline";
import { figureCommand, fetchLink, help, log, watchPath } from "./commands.js";
import { request } from "./util.js";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  completer: completer,
  terminal: true,
});

const args = process.argv.slice(2);
let path_to_watch = process.cwd();

if (args.length) checkArgs(false);
else init();

function checkArgs(wait) {
  const arg = args.shift();
  switch (arg) {
    case "-h":
      help(true);
      wait = true;
      break;
    case "-l":
      log([args.shift()]);
      break;
    case "-f":
      wait = true;
      request(args.shift());
      break;
    case "-p":
      path_to_watch = args.shift();
      wait = true;
      init();
      break;
    default:
      console.log(`invalid arg ${arg}\nuse -h for help`);
      break;
  }
  if (args.length) return checkArgs(wait);
  if (!wait) return process.exit();
}

function init() {
  console.log("API-WATCHMAN");
  watchPath(path_to_watch);

  fetchLink("def");
  read();
}

function read() {
  rl.on("line", (line) => {
    figureCommand(line);
  });
}

function completer(line) {
  const word = line.split(" ").pop();
  const completions =
    "help exit log rm config set fetch def opt header clear ".split(" ");
  const hits = completions.filter((c) => c.startsWith(word));

  return [hits.length ? hits : completions, word];
}
