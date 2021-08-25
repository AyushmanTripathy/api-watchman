#! /usr/bin/env node

const fetch = require("node-fetch");
const readline = require("readline");
const fs = require("fs");
const chalk = require("chalk");

const config = require("./config.json");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

const watchPath = process.cwd();

init();
function init() {
  //get config

  console.log("type help to know more");

  console.log(chalk.red(`watching ${watchPath}`));
  console.log(config);

  request(config[config.def]);

  watch(watchPath);

  rl.on("line", (line) => {
    figureCommand(line);
  });
}

function figureCommand(line) {
  const input = processLine(line);
  const command = input.shift();

  switch (command) {
    case "set":
      change(input);
      break;
    case "fetch":
      request(input[0]);
      break;
    case "log":
      log(input);
      break;
    case "clear":
      console.clear();
      break;
    case "rm":
      remove(input);
      break;
    case "help":
      help();
      break;
    default:
      fetchLink(command);
      break;
  }
}

function processLine(line) {
  arr = [];
  line = line.trim().split(" ");
  line.forEach((word) => {
    if (word != "") arr.push(word);
  });

  return arr;
}

function watch(path) {
  let running = false;
  fs.watch(path, (eventType, filename) => {
    if (running) return;

    running = true;
    console.log(chalk.red(`dectected ${eventType} on ${filename}`));

    setTimeout(() => {
      running = false;
      request(config[config.def]);
    }, config.delay);
  });
}

function fetchLink(command) {
  if (!config[command] && command)
    return console.log(chalk.red(`${command} not defined!`));
  if (command != undefined) request(config[command]);
}

function remove(args) {
  args.forEach((key) => {
    if (config[key] == undefined) return;
    delete config[key];
    write(config, `${__dirname}/config.json`);
    console.log(chalk.red(`removed ${key}`));
  });
}

function help() {
  fs.readFile(`${__dirname}/help.txt`, "utf8", function read(err, content) {
    if (err) console.log(chalk.red("could not fetch help.txt"));
    console.log(content);
  });
}

function log(input) {
  if (!config[input[0]]) return console.log(config);
  console.log(config[input[0]]);
}

function change(args) {
  config[args[0]] = args[1];
  write(config, `${__dirname}/config.json`);
  console.log(chalk.green(`${args[0]} : ${args[1]}`));
}

function write(obj, path) {
  fs.writeFile(path, JSON.stringify(obj), "utf8", (err, data) => {
    if (err) {
      console.error("couldn't write to config.json");
      console.error(err);
    }
  });
}

function request(link) {
  console.log(chalk.red(`to ${link}`));

  try {
    fetch(link)
      .then((res) => {
        return res[config.type]();
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
}
