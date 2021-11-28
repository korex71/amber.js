import messages from "../core/messages.json";
import Amber from "../../";

module.exports = {
  name: "back",
  aliases: ["previous"],
  utilisation: "{prefix}back",
  voiceChannel: true,

  async execute(client: any, message: any) {
    const queue = Amber.player?.getQueue(message.guild.id);

    if (!queue || !queue.playing)
      return message.channel.send(
        `${messages.NO_SONG_PLAYING} ${message.author}.`
      );

    if (!queue.previousTracks[1])
      return message.channel.send(
        `${messages.NO_HAVE_BEFORE_SONGS_TO_PLAY} ${message.author}.`
      );

    await queue.back();

    message.channel.send(`Tocando a música **anterior** ✅`);
  },
};
