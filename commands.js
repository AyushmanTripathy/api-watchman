const { readFileSync, watch } = require("fs");
const { red, green } = require("chalk");

const { request, write, loadJson } = require("./util.js");
const config = loadJson("./config.json");
const options = loadJson("./options.json");

module.exports = { figureCommand, log, help, watchPath };

function figureCommand(line) {
  const input = processLine(line);
  const command = input.shift();

  switch (command) {
    case "opt":
      changeOptions(input);
      break;
    case "set":
      changeConfig(input);
      break;
    case "fetch":
      request(input[0], options);
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
    case "exit":
      process.exit();
      break;
    default:
      fetchLink(command);
      break;
  }
}

function processLine(line) {
  let arr = [];
  line = line.trim().split(" ");
  line.forEach((word) => {
    if (word != "") arr.push(word);
  });

  return arr;
}

function watchPath(path) {
  console.log(red(`watching ${path}`));

  let running = false;
  watch(path, (eventType, filename) => {
    if (running) return;

    running = true;
    console.log(red(`dectected ${eventType} on ${filename}`));

    setTimeout(() => {
      running = false;
      fetchLink("def");
    }, config.delay);
  });
}

function fetchLink(command) {
  //special case for def
  if (command == "def")
    if (!config[config.def]) return console.log(red(`def is not defined!`));
    else command = config.def;

  //check if var exits
  if (!config[command] && command)
    return console.log(red(`${command} not defined!`));
  if (command != undefined) request(config[command], options);
}

function remove(args) {
  args.forEach((key) => {
    if (config[key] == undefined) return console.log(red(`${key} not defined`));
    delete config[key];
    write(config, `${__dirname}/config.json`);
    console.log(red(`removed ${key}`));
  });
}

function help(exitAfter) {
  const content = readFileSync(`${__dirname}/help.txt`, "utf8");
  console.log(content);
  if (exitAfter) process.exit();
}

function log(input, exitAfter) {
  // log property if it exits
  // else log the entire obj
  if (input[0] == "opt")
    if (options[input[1]]) console.log(options[input[1]]);
    else console.log(options);
  else if (!config[input[0]]) console.log(config);
  else console.log(config[input[0]]);

  if (exitAfter) process.exit();
}

function changeOptions(args) {
  if (!args.length) return log(["opt"]);

  options[args[0]] = args[1];
  write(options, `${__dirname}/options.json`);
  console.log(green(`${args[0]} : ${args[1]}`));
}

function changeConfig(args) {
  if (!args.length) return log([]);

  config[args[0]] = args[1];
  write(config, `${__dirname}/config.json`);
  console.log(green(`${args[0]} : ${args[1]}`));
}
