const messages = require("../core/messages.json");
const { MessageEmbed } = require("discord.js");
import Amber from "../../";

module.exports = {
  name: "queue",
  aliases: ["q"],
  utilisation: "{prefix}queue",
  voiceChannel: true,

  execute(client: any, message: any) {
    const queue = Amber.player?.getQueue(message.guild.id);

    if (!queue || !queue.playing)
      return message.channel.send(
        `${messages.NO_SONG_PLAYING} ${message.author}.`
      );

    if (!queue.tracks[0])
      return message.channel.send(
        `Sem músicas na playlist após a atual ${message.author}.`
      );

    const embed = new MessageEmbed();
    const methods = ["", "🔁", "🔂"];

    embed.setColor("RED");
    embed.setThumbnail(message.guild.iconURL({ size: 2048, dynamic: true }));
    embed.setAuthor(
      `Playlist do servidor - ${message.guild.name} ${
        methods[queue.repeatMode]
      }`,
      client.user.displayAvatarURL({ size: 1024, dynamic: true })
    );

    const tracks = queue.tracks.map(
      (track, i) =>
        `**${i + 1}** - ${track.title} | ${track.author} (requisitada por ${
          track.requestedBy.username
        })`
    );

    const songs = queue.tracks.length;
    const nextSongs =
      songs > 5
        ? `E **${songs - 5}** outras música(s)...`
        : `Na playlist **${songs}** música(s)...`;

    embed.setDescription(
      `Atual ${queue.current.title}\n\n${tracks
        .slice(0, 5)
        .join("\n")}\n\n${nextSongs}`
    );

    embed.setTimestamp();
    embed.setFooter("Queue ❤️", message.author.avatarURL({ dynamic: true }));

    message.channel.send({ embeds: [embed] });
  },
};
