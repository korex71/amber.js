import { MessageEmbed } from "discord.js";
import { QueryType } from "discord-player";

import messages from "../core/messages.json";
import Amber from "../../";

module.exports = {
  name: "search",
  aliases: ["s"],
  utilisation: "{prefix}search [song name]",
  voiceChannel: true,

  async execute(client: any, message: any, args: any) {
    if (!args[0])
      return message.channel.send(`Pesquisa inválida ${message.author}...`);

    const res = await Amber.player?.search(args.join(" "), {
      requestedBy: message.member,
      searchEngine: QueryType.AUTO,
    });

    if (!res || !res.tracks.length)
      return message.channel.send(`Sem resultados ${message.author}.`);

    const queue = Amber.player?.createQueue(message.guild, {
      metadata: message.channel,
    });

    const embed = new MessageEmbed();

    embed.setColor("RED");
    embed.setAuthor(
      `Results for ${args.join(" ")}`,
      client.user.displayAvatarURL({ size: 1024, dynamic: true })
    );

    const maxTracks = res.tracks.slice(0, 10);

    embed.setDescription(
      `${maxTracks
        .map((track, i) => `**${i + 1}**. ${track.title} | ${track.author}`)
        .join("\n")}\n\nSelecione entre **1** e **${
        maxTracks.length
      }** ou **cancel** ⬇️`
    );

    embed.setTimestamp();
    embed.setFooter("Search 🔍", message.author.avatarURL({ dynamic: true }));

    message.channel.send({ embeds: [embed] });

    const collector = message.channel.createMessageCollector({
      time: 15000,
      errors: ["time"],
      filter: (m: any) => m.author.id === message.author.id,
    });

    collector.on("collect", async (query: any) => {
      if (query.content.toLowerCase() === "cancel")
        return (
          message.channel.send(`Pesquisa cancelada ✅`) && collector.stop()
        );

      const value = parseInt(query.content);

      if (!value || value <= 0 || value > maxTracks.length)
        return message.channel.send(
          `Resposta inválida, tente um valor entre **1** e **${maxTracks.length}** ou **cancel**...`
        );

      collector.stop();

      try {
        if (queue) {
          if (!queue.connection)
            await queue.connect(message.member.voice.channel);
        }
      } catch {
        Amber.player?.deleteQueue(message.guild.id);
        return message.channel.send(
          `Não pude me conectar ao canal de voz ${message.author}...`
        );
      }

      await message.channel.send(`Carregando sua pesquisa... 🎧`);

      if (queue) {
        queue.addTrack(res.tracks[query.content - 1]);

        if (!queue.playing) await queue.play();
      }
    });

    collector.on("end", (msg: any, reason: any) => {
      if (reason === "time")
        return message.channel.send(
          `Tempo da pesquisa esgotado ${message.author}... tentar novamente ?`
        );
    });
  },
};
