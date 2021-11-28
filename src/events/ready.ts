import { Client } from "discord.js";
import "dotenv";

module.exports = async (client: Client) => {
  console.log(
    `Logged to the client ${client.user?.username}\n-> Ready on ${client.guilds.cache.size} servers for a total of ${client.users.cache.size} users`
  );

  client.user?.setActivity(process.env.BOT_STATUS || "Music bot");
};
