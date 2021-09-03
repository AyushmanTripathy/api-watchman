import { readFileSync, watch } from "fs";
import pkg from "chalk";
const { red, green, grey } = pkg;
import { request, write, loadJson } from "./util.js";

const config = loadJson("./config.json");
const options = loadJson("./options.json");

export { figureCommand, fetchLink, log, help, watchPath };

function figureCommand(line) {
  const input = processLine(line);
  const command = input.shift();

  switch (command) {
    case "opt":
      changeOptions(input);
      break;
    case "header":
      changeHeader(input);
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

function fetchLink(command) {
  //special case for def
  if (command == "def")
    if (!config[config.def])
      return console.log(red(`def ${config.def} is not defined!`));
    else command = config.def;

  //check if var exits
  if (!config[command] && command)
    return console.log(red(`${command} not defined!`));
  if (command != undefined) request(config[command], options, config.type);
}

function remove(input) {
  switch (input.shift()) {
    case "opt":
      input.forEach((key) => {
        if (options[key] == undefined)
          return console.log(red(`${key} not defined in options`));
        delete options[key];
        write(options, new URL("options.json", import.meta.url));
        console.log(grey(`removed ${key} from options`));
      });
      break;
    case "config":
      input.forEach((key) => {
        if (config[key] == undefined)
          return console.log(red(`${key} not defined in config`));
        delete config[key];
        write(config, new URL("config.json", import.meta.url));
        console.log(grey(`removed ${key} from config`));
      });
      break;
    case "header":
      input.forEach((key) => {
        if (options.headers[key] == undefined)
          return console.log(red(`${key} not defined in header`));
        delete options.headers[key];
        write(options, new URL("options.json", import.meta.url));
        console.log(grey(`removed ${key} from header`));
      });
      break;
    default:
      console.log(red("no such objects"));
      break;
  }
}

function help(exitAfter) {
  const content = readFileSync(new URL("help.txt", import.meta.url), "utf8");
  console.log(content);
  if (exitAfter) process.exit();
}

function log(input, exitAfter) {
  // log property if it exits
  // else log the entire obj

  switch (input[0]) {
    case "opt":
      if (options[input[1]]) console.log(options[input[1]]);
      else console.log(options);
      break;
    case "header":
      if (options.headers[input[1]]) console.log(options.headers[input[1]]);
      else console.log(options.headers);
      break;
    default:
      if (!config[input[0]]) console.log(config);
      else console.log(config[input[0]]);
      break;
  }

  if (exitAfter) process.exit();
}

function changeOptions(args) {
  if (!args.length) return log(["opt"]);

  options[args[0]] = args[1];
  write(options, new URL("options.json", import.meta.url));
  console.log(green(`${args[0]} : ${args[1]} (option)`));
}

function changeConfig(args) {
  if (!args.length) return log([]);

  config[args[0]] = args[1];
  write(config, new URL("config.json", import.meta.url));
  console.log(green(`${args[0]} : ${args[1]} (config)`));
}

function changeHeader(args) {
  if (!args.length) return log(["header"]);

  options.headers[args[0]] = args[1];
  write(options, new URL("options.json", import.meta.url));
  console.log(green(`${args[0]} : ${args[1]} (header)`));
}
