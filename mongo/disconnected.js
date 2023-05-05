const chalk = require("chalk");

module.exports = {
  name: "disconnected",
  execute() {
    console.log(chalk.yellow("[DATABASE STATUS]: disconnected"));
  },
};
