#! /usr/bin/env node
const readline = require("readline");

const { figureCommand, help, log, watchPath } = require("./commands.js");
const { request } = require("./util.js");

const rl = readline.createInterface({
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
      request(args.shift(), true);
      break;
    default:
      console.log(`invalid arg ${arg}\nuse -h for help`);
      break;
  }
  if (args.length) return checkArgs(wait);
  if (!wait) return process.exit();
}

function init() {
  //get config
  console.log("type help to know more");
  watchPath(path_to_watch);

  readLine();
}

function readLine() {
  rl.on("line", (line) => {
    figureCommand(line);
  });
}
