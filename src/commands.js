import { readFileSync } from "fs";
import { red, green, dim } from "btss"
import { config as envConfig } from "dotenv";

import { request, write, loadJson, generateTags } from "./util.js";

global.config = loadJson("../config.json");
global.options = loadJson("../options.json");

export { figureCommand, fetchLink, log, help };

function figureCommand(line) {
  const input = processLine(line);
  const command = input.shift();

  switch (command) {
    case "opt":
      changeOptions(input);
      break;
    case "body":
      changeBody(input);
      break;
    case "header":
      changeHeader(input);
      break;
    case "load":
      loadEnv(input[0], input[1], input[2]);
      break;
    case "set":
      changeConfig(input);
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
    case "quit":
      process.exit();
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

function fetchLink(command) {
  // fetch if it is a link
  if (command.startsWith("http"))
    return request(command, options, config.type);

  //special case for def
  if (command == "def")
    if (config.def.startsWith("http"))
      return request(config.def, options, config.type);
    else if (!config[config.def])
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
        console.log(dim(`removed ${key} from options`));
      });
      break;
    case "config":
      input.forEach((key) => {
        if (config[key] == undefined)
          return console.log(red(`${key} not defined in config`));
        delete config[key];
        write(config, new URL("config.json", import.meta.url));
        console.log(dim(`removed ${key} from config`));
      });
      break;
    case "header":
      input.forEach((key) => {
        if (options.headers[key] == undefined)
          return console.log(red(`${key} not defined in header`));
        delete options.headers[key];
        write(options, new URL("options.json", import.meta.url));
        console.log(dim(`removed ${key} from header`));
      });
      break;
    case "body":
      input.forEach((key) => {
        if (options.body[key] == undefined)
          return console.log(red(`${key} not defined in body`));
        delete options.body[key];
        write(options, new URL("options.json", import.meta.url));
        console.log(dim(`removed ${key} from body`));
      });
      break;
    default:
      console.log(red("no such objects"));
      break;
  }
}

function help(exitAfter) {
  const content = readFileSync(new URL("../help.txt", import.meta.url), "utf8");
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
    case "body":
      if (options.body[input[1]]) console.log(options.body[input[1]]);
      else console.log(options.body);
      break;
    default:
      if (!config[input[0]]) console.log(config);
      else console.log(config[input[0]]);
      break;
  }

  if (exitAfter) process.exit();
}

function loadEnv(envKey, saveUnder, saveKey) {
  envConfig();
  if (!process.env[envKey])
    return console.log(red(`key ${envKey} is not defined in .env`));

  console.log(dim(`loaded ${envKey} : ${process.env[envKey]}`));
  switch (saveUnder) {
    case "config":
      changeConfig([saveKey, process.env[envKey]]);
      break;
    case "opt":
      changeOptions([saveKey, process.env[envKey]]);
      break;
    case "header":
      changeHeader([saveKey, process.env[envKey]]);
      break;
    case "body":
      changeBody([saveKey, process.env[envKey]]);
      break;
    default:
      console.log(red(`${saveUnder} not defined!`));
      break;
  }
}

function changeOptions(args) {
  if (!args.length) return log(["opt"]);

  const key = args.shift();
  // if there are no more args
  if (!args.length) return console.log(options[key]);

  const value = args.join(" ");

  options[key] = value;
  write(options, new URL("options.json", import.meta.url));
  console.log(green(`${key} : ${value} (option)`));

  //add to completions
  global.completions.push(key);
}

function changeConfig(args) {
  if (!args.length) return log([]);

  const key = args.shift();

  // if there are no more args
  if (!args.length) return console.log(config[key]);

  const value = args.join(" ");

  config[key] = value;
  write(config, new URL("config.json", import.meta.url));
  console.log(green(`${key} : ${value} (config)`));

  // refresh completions to have latest def
  if (key == "def") global.completions = generateTags();
  else global.completions.push(key);
}

function changeHeader(args) {
  if (!args.length) return log(["header"]);

  const key = args.shift();

  // if there are no more args
  if (!args.length) return console.log(options.headers[key]);

  const value = args.join(" ");

  options.headers[key] = value;
  write(options, new URL("options.json", import.meta.url));
  console.log(green(`${key} : ${value} (header)`));

  global.completions.push(key);
}

function changeBody(args) {
  if (!args.length) return log(["body"]);

  const key = args.shift();
  // if there are no more args
  if (!args.length) return console.log(options.body[key]);

  const value = args.join(" ");

  options.body[key] = value;
  write(options, new URL("options.json", import.meta.url));
  console.log(green(`${key} : ${value} (body)`));

  global.completions.push(key);
}
