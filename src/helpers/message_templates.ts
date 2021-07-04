import { Message, MessageEmbed } from "discord.js";

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
    .addFields(
      results.map((item: any, index: number) => {
        return { name: index, value: item.title, inline: false };
      })
    );
};
