const fetch = require("node-fetch");
const readline = require("readline");
const fs = require("fs");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});
let config;

init();
function init() {
  //get config
  const rawdata = fs.readFileSync("config.json");
  config = JSON.parse(rawdata);

  watch(process.cwd());

  rl.on("line", (line) => {
    figureCommand(line);
  });
}

function watch(path) {
  let running = false;
  fs.watch(path, (eventType, filename) => {
    if (running) return;

    running = true;
    console.log("\x1b[31m", "dectected " + eventType + " on " + filename);

    setTimeout(() => {
      running = false;
      request(config.link);
    }, config.delay);
  });
}

function figureCommand(line) {
  const input = line.split(" ");

  if (line.charAt(0) != ":") return req(input);

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
  }
}

function change(args) {
  config[args[0]] = args[1];
  write(config);
}

function write(obj) {
  fs.writeFile("config.json", JSON.stringify(obj), "utf8", (err, data) => {
    if (err) {
      console.error("couldn't write to config.json");
    }
  });
}

function req(args) {
  let link = `http://localhost:${config.port}`;

  args.forEach((ele) => {
    link += `/${ele}`;
  });

  request(link);
}

function request(link) {
  let response;
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
