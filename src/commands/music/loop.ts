import { QueueRepeatMode } from "discord-player";
import messages from "../core/messages.json";
import Amber from "../../";

module.exports = {
  name: "loop",
  aliases: ["lp", "repeat"],
  utilisation: "{prefix}loop <queue>",
  voiceChannel: true,

  execute(client: any, message: any, args: any) {
    const queue = Amber.player?.getQueue(message.guild.id);

    if (!queue || !queue.playing)
      return message.channel.send(
        `${messages.NO_SONG_PLAYING} ${message.author}.`
      );

    if (args.join("").toLowerCase() === "queue") {
      if (queue.repeatMode === 1)
        return message.channel.send(
          `Você deve primeiro desabilitar a música atual no modo de loop (${client.config.app.px}loop) ${message.author}.`
        );

      const success = queue.setRepeatMode(
        queue.repeatMode === 0 ? QueueRepeatMode.QUEUE : QueueRepeatMode.OFF
      );

      return message.channel.send(
        success
          ? `Repeat mode **${
              queue.repeatMode === 0 ? "disabled" : "enabled"
            }** the whole queue will be repeated endlessly 🔁`
          : `Algo de errado aconteceu ${message.author}. tentar novamente?`
      );
    } else {
      if (queue.repeatMode === 2)
        return message.channel.send(
          `Você deve primeiro desabilitar a música atual no modo de loop (${client.config.app.px}loop queue) ${message.author}. tentar novamente?`
        );

      const success = queue.setRepeatMode(
        queue.repeatMode === 0 ? QueueRepeatMode.TRACK : QueueRepeatMode.OFF
      );

      return message.channel.send(
        success
          ? `Modo repetição **${
              queue.repeatMode === 0 ? "disabled" : "enabled"
            }** a música atual será repetida indefinidamente (você pode fazer um loop na playlist com a opção <queue>) 🔂`
          : `Algo de errado aconteceu ${message.author}... tentar novamente ?`
      );
    }
  },
};
