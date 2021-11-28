import messages from "../core/messages.json";
import Amber from "../../";

module.exports = {
  name: "clear",
  aliases: ["cq"],
  utilisation: "{prefix}clear",
  voiceChannel: true,

  async execute(client: any, message: any) {
    const queue = Amber.player?.getQueue(message.guild.id);

    if (!queue || !queue.playing)
      return message.channel.send(
        `${messages.NO_SONG_PLAYING} ${message.author}.`
      );

    if (!queue.tracks[0])
      return message.channel.send(
        `${messages.NO_HAVE_AFTER_SONGS_TO_PLAY} ${message.author}.`
      );

    queue.clear();

    message.channel.send(`${messages.CLEARED_PLAYLIST} 🗑️`);
  },
};
