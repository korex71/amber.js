import Discord from "discord.js";
import "dotenv/config";
import Command from "./command_handler";

const client = new Discord.Client(),
  config = {
    token: process.env.BOT_TOKEN,
    prefix: process.env.BOT_PREFIX || ";;",
  };

client.on("ready", () => {
  console.log(`Logget in as ${client.user?.tag}`);
});

const commands = ["play", "ping"];

client.on("message", (message) => {
  const msg = message.content;

  const args = message.content.substring(config.prefix.length).split(" ");

  if (!commands.includes(args[0])) return;

  Command.handle(args[0], args[1], message);

  // const command = commands.find((command, index) => {
  //   const cmd = message.content.includes(`.${command}`);
  // });

  // if (command) {
  //   console.log(command);
  //   message.createdTimestamp - new Date().getTime();

  //   let parameters = msg.slice(command.length);
  //   return Command.handle(command, parameters);
  // }
});

client.login(config.token);

export { client, config };
