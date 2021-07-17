import { Message, MessageEmbed } from "discord.js";

const parseSongList = (results: any[]) => {
  return results.map((item, index) => `[${index}] ${item.title}\n`);
};

export const CreateResultsEmbed = (
  results: any,
  message: Message,
  query: string
) => {
  return new MessageEmbed()
    .setColor("#42fcff")
    .setTitle(query)
    .setAuthor(message.author.username)
    .setTimestamp()
    .addField("Resultados", parseSongList(results), true);
};

export const CreateQueueEmbed = (queue: any[]) => {
  return new MessageEmbed()
    .setColor("#42fcff")
    .setTitle("Playlist")
    .setTimestamp()
    .addField("", parseSongList(queue), true);
};
