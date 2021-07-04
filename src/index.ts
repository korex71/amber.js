import "dotenv/config";
import Discord from "discord.js";
import Command from "./command_handler";
import { Emitter } from "./event_handler";

const client = new Discord.Client(),
  config = {
    token: process.env.BOT_TOKEN,
    prefix: process.env.BOT_PREFIX || ";;",
  };

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

const commands = ["play", "skip", "fs", "stop"];

Emitter.on("error", (data) => {
  data.channel.send(data.message);
});

client.on("message", (message) => {
  let [command, ...args] = message.content
    .substring(config.prefix.length)
    .split(" ");

  if (!commands.includes(command)) return;

  Command.handle(
    command,
    args.toString().split(",").join(" ").toString(),
    message
  );

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
