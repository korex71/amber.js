import messages from "../core/messages.json";
import Amber from "../../";

module.exports = {
  name: "pause",
  aliases: [],
  utilisation: "{prefix}pause",
  voiceChannel: true,

  execute(client: any, message: any) {
    const queue = Amber.player?.getQueue(message.guild.id);

    if (!queue || !queue.playing)
      return message.channel.send(
        `${messages.NO_SONG_PLAYING} ${message.author}.`
      );

    const success = queue.setPaused(true);

    return message.channel.send(
      success
        ? `A música atual ${queue.current.title} foi pausada ✅`
        : `Algo de errado aconteceu${message.author}.`
    );
  },
};
