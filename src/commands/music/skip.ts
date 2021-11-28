import messages from "../core/messages.json";
import Amber from "../../";

module.exports = {
  name: "skip",
  aliases: ["sk", "fs"],
  utilisation: "{prefix}skip",
  voiceChannel: true,

  execute(client: any, message: any) {
    const queue = Amber.player?.getQueue(message.guild.id);

    if (!queue || !queue.playing)
      return message.channel.send(
        `${messages.NO_SONG_PLAYING} ${message.author}.`
      );

    const success = queue.skip();

    return message.channel.send(
      success
        ? `A música atual ${queue.current.title} foi pulada ✅`
        : `Algo de errado aconteceu ${message.author}... tentar novamente ?`
    );
  },
};
