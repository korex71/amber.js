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

const commands = ["play", "skip", "fs", "stop", "queue", "pl"];

client.on("message", (message) => {
  if (!isNaN(Number(message.content))) {
    const int = Number(message.content);
    if (int < 0 || int > 20) return;

    Emitter.emit("search-instance", {
      data: { selected: int, userId: message.author.id },
    });

    return;
  }

  let [command, ...args] = message.content
    .substring(config.prefix.length)
    .split(" ");

  if (!commands.includes(command)) return;

  Command.handle(command, args.join(" "), message);
});

client.login(config.token);

export { client, config };
