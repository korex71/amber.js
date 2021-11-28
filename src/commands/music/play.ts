const { QueryType } = require("discord-player");
import { Client, Message } from "discord.js";
import Amber from "../../index";

module.exports = {
  name: "play",
  aliases: ["p"],
  utilisation: "{prefix}play [song name/URL]",
  voiceChannel: true,

  async execute(client: Client, message: any, args: any) {
    if (!args[0]) {
      const queue = Amber.player?.getQueue(message.guild.id);

      if (queue) {
        if (!queue.playing) {
          return message.channel.send(
            `Por favor, faça uma pesquisa válida ${message.author}.`
          );
        }

        const success = queue.setPaused(false);

        if (success) {
          return message.channel.send(
            `Música atual ${queue.current.title} tocando novamente ✅`
          );
        } else {
          const try_pause = queue.setPaused(true);

          return message.channel.send(
            try_pause
              ? `Música atual ${queue.current.title} foi pausada ✅`
              : `Por favor, faça uma pesquisa válida ${message.author}.`
          );
        }
      } else {
        return message.channel.send(
          `Por favor, faça uma pesquisa válida ${message.author}.`
        );
      }
    }

    const res = await Amber.player?.search(args.join(" "), {
      requestedBy: message.member,
      searchEngine: QueryType.AUTO,
    });

    if (!res || !res.tracks.length)
      return message.channel.send(
        `Sem resultados encontrados ${message.author}.`
      );

    const queue = Amber.player?.createQueue(message.guild, {
      metadata: message.channel,
    });

    try {
      if (queue) {
        if (!queue.connection)
          await queue.connect(message.member.voice.channel);
      }
    } catch {
      Amber.player?.deleteQueue(message.guild.id);
      return message.channel.send(
        `Não foi possível me conectar ao canal de voz ${message.author}.`
      );
    }

    await message.channel.send(
      `Carregando ${res.playlist ? "playlist" : "track"}... 🎧`
    );

    if (queue) {
      res.playlist
        ? queue.addTracks(res.tracks)
        : queue.addTrack(res.tracks[0]);

      if (!queue.playing) await queue.play();
    }
  },
};
