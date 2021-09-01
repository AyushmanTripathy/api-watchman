#! /usr/bin/env node

const fetch = require("node-fetch");
const readline = require("readline");
const fs = require("fs");
const chalk = require("chalk");

const { errorType } = require("./errorType.js");
const config = require("./config.json");
const options = require('./options.json')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

const args = process.argv.slice(2);
let watchPath = process.cwd();

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
  watch(watchPath);
  console.log(config);

  request(config[config.def]);

  ask();
}

function ask(){
  rl.on('line',line=>{
    figureCommand(line)
  })
}

function figureCommand(line) {
  const input = processLine(line);
  const command = input.shift();

  switch (command) {
    case 'opt':
      changeOptions(input);
      break;
    case "set":
      changeConfig(input);
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
    case 'exit':
      process.exit()
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
  console.log(chalk.red(`watching ${watchPath}`));

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

function help(exitAfter) {
  fs.readFile(`${__dirname}/help.txt`, "utf8", function read(err, content) {
    if (err) console.log(chalk.red("could not fetch help.txt"));
    console.log(content);
    if (exitAfter) process.exit();
  });
}

function log(input, exitAfter) {
  if(input[0] == 'opt') console.log(options)
  else if (!config[input[0]]) console.log(config);
  else console.log(config[input[0]]);

  if (exitAfter) process.exit();
}

function changeOptions(args){
  if(!args.length) return log(['opt'])

  options[args[0]] = args[1]
  write(options,`${__dirname}/options.json`);
  console.log(chalk.green(`${args[0]} : ${args[1]}`));
}

function changeConfig(args) {
  if(!args.length) return log([])

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

async function request(link, exitAfter) {
  console.log(chalk.red(`fetching ${link}`));

  const response = await fetch(link,options).catch(console.log);

  if(response)
    if (response.ok) {
      console.log(chalk.green(`server responded with status ${response.status}`));
      const body = await response[config.type]().catch(console.log);
      if (body) console.log(body);
    } else {
      console.log(chalk.green(`server responded with status ${response.status}`));
      console.log(options)
      const error = errorType(response.status);
      console.log(error);
    }

  if (exitAfter) return process.exit();
}
