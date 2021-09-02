const { red, green, grey, inverse } = require("chalk");
const fetch = require("node-fetch");
const { writeFile } = require("fs");

const errorType = require("./errorType.js");

module.exports = { write, request };

function write(obj, path) {
  writeFile(path, JSON.stringify(obj), "utf8", (err) => {
    if (err) {
      console.error("couldn't write to config.json");
      console.error(err);
    }
  });
}

async function request(link, options, exitAfter) {
  console.log(red(`fetching ${link}`));

  const response = await fetch(link, options).catch(console.log);

  if (response)
    if (response.ok) {
      console.log(
        green(`server responded with status ${inverse(response.status)}`)
      );
      const body = await response[config.type]().catch(console.log);
      if (body) console.log(body);
    } else {
      console.log(
        red(`server responded with status ${inverse(response.status)}`)
      );
      console.log(options);
      const error = errorType(response.status);
      console.log(grey(error));
    }

  if (exitAfter) return process.exit();
}
