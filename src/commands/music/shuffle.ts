const messages = require("../core/messages.json");
import Amber from "../../";

module.exports = {
  name: "shuffle",
  aliases: ["sh"],
  utilisation: "{prefix}shuffle",
  voiceChannel: true,

  async execute(client: any, message: any) {
    const queue = Amber.player?.getQueue(message.guild.id);

    if (!queue || !queue.playing)
      return message.channel.send(
        `${messages.NO_SONG_PLAYING} ${message.author}.`
      );

    if (!queue.tracks[0])
      return message.channel.send(
        `Sem músicas na fila após a atual ${message.author}.`
      );

    queue.shuffle();

    return message.channel.send(
      `Playlist embaralhada **${queue.tracks.length}** música(s) ! ✅`
    );
  },
};
