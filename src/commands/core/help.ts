import { MessageEmbed } from "discord.js";
import Amber from "../../";

module.exports = {
  name: "help",
  aliases: ["h"],
  showHelp: false,
  utilisation: "{prefix}help",

  execute(client: any, message: any, args: any) {
    const embed = new MessageEmbed();

    embed.setColor("RED");
    embed.setAuthor(
      client.user.username,
      client.user.displayAvatarURL({ size: 1024, dynamic: true })
    );

    const commands = Amber.commands.filter((x: any) => x.showHelp !== false);

    embed.addField(
      `Habilitados - ${commands.size}`,
      commands
        .map(
          (x: any) =>
            `\`${x.name}${
              x.aliases && x.aliases.length > 0
                ? ` (${x.aliases.map((y: any) => y).join(", ")})\``
                : "`"
            }`
        )
        .join(" | ")
    );

    embed.setTimestamp();

    embed.setFooter("Help", message.author.avatarURL({ dynamic: true }));

    message.channel.send({ embeds: [embed] });
  },
};
