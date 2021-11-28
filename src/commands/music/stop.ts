import messages from "../core/messages.json";
import Amber from "../../";

module.exports = {
  name: "stop",
  aliases: ["dc"],
  utilisation: "{prefix}stop",
  voiceChannel: true,

  execute(client: any, message: any) {
    const queue = Amber.player?.getQueue(message.guild.id);

    if (!queue || !queue.playing)
      return message.channel.send(
        `${messages.NO_SONG_PLAYING} ${message.author}.`
      );

    queue.destroy();

    message.channel.send(
      `A música foi parada no servidor, te vejo numa próxima 😉`
    );
  },
};
