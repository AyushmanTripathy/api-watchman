#! /usr/bin/env node
import { createInterface, emitKeypressEvents } from "readline";
import { figureCommand, fetchLink, help, log, watchPath } from "./commands.js";
import { request } from "./util.js";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
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

  //listner for keypress
  listen();

  readLine();
}

function readLine() {
  rl.on("line", (line) => {
    figureCommand(line);
  });
}

function listen() {
  emitKeypressEvents(process.stdin);

  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }
  process.stdin.on("keypress", (str, key) => {
    processKey(key);
  });
}

function processKey(key) {
  switch (key.name) {
    case "return":
      console.log("");
      process.stdout.write("\r");
      break;
    case "escape":
      process.exit();
      break;
    default:
      process.stdout.write(key.sequence);
      break;
  }
}
