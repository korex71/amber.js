import messages from "../core/messages.json";
import Amber from "../../";

module.exports = {
  name: "resume",
  aliases: ["rs"],
  utilisation: "{prefix}resume",
  voiceChannel: true,

  execute(client: any, message: any) {
    const queue = Amber.player?.getQueue(message.guild.id);

    if (!queue || !queue.playing)
      return message.channel.send(
        `${messages.NO_SONG_PLAYING} ${message.author}.`
      );

    const success = queue.setPaused(false);

    return message.channel.send(
      success
        ? `Música atual ${queue.current.title} tocando novamente ✅`
        : `Algo deu errado ${message.author}... tentar novamente ? ❌`
    );
  },
};
