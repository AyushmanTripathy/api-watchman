const fetch = require("node-fetch");
const readline = require("readline");
const fs = require("fs");
const config = require("./config.json");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

const watchPath = process.argv[process.argv.length - 1];

init();
function init() {
  //get config

  console.log("\x1b[31m", `watching ${watchPath}`, "\x1b[31m");
  console.log(config);

  request(config.link);

  watch(watchPath);

  rl.on("line", (line) => {
    figureCommand(line);
  });
}

function watch(path) {
  let running = false;
  fs.watch(path, (eventType, filename) => {
    if (running) return;

    running = true;
    console.log(
      "\x1b[31m",
      "dectected " + eventType + " on " + filename,
      "\x1b[31m"
    );
    console.log("\x1b[39m");

    setTimeout(() => {
      running = false;
      request(config.link);
    }, config.delay);
  });
}

function figureCommand(line) {
  const input = line.split(" ");
  const command = input.shift();

  switch (command) {
    case ":set":
      change(input);
      break;
    case ":link":
      request(config.link);
      break;
    case ":open":
      request(input[0]);
      break;
    case ":log":
      console.log(config[input[0]]);
      break;
  }
}

function change(args) {
  config[args[0]] = args[1];
  write(config, `${__dirname}/config.json`);
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
  let response;

  console.log(`to ${link}`);

  try {
    fetch(link)
      .then((res) => {
        return res[config.type]();
      })
      .then((res) => {
        console.log(res);
        response = res;
      })
      .catch((err) => {
        console.log(err);
      });

    return response;
  } catch (err) {}
}
