import { createInterface } from "readline";
import { figureCommand, fetchLink, help, log } from "./commands.js";
import { watchPath, generateTags } from "./util.js";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  completer: completer,
  terminal: true,
});

globalThis.log = (string) => console.log(string);

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
  global.completions = generateTags();
  fetchLink("def");
  read();
}

function read() {
  rl.on("line", (line) => {
    if (!line) return;
    figureCommand(line);
  });
}

function completer(line) {
  const word = line.split(" ").pop();
  const hits = completions.filter((tag) => tag.startsWith(word));

  return [hits.length ? hits : completions, word];
}
