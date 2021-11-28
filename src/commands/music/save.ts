import messages from "../core/messages.json";
import Amber from "../../";

module.exports = {
  name: "save",
  aliases: ["sv"],
  utilisation: "{prefix}save",
  voiceChannel: true,

  async execute(client: any, message: any) {
    const queue = Amber.player?.getQueue(message.guild.id);

    if (!queue || !queue.playing)
      return message.channel.send(
        `${messages.NO_SONG_PLAYING} ${message.author}.`
      );

    message.author
      .send(
        `Você salvou a música ${queue.current.title} | ${queue.current.author} do servidor ${message.guild.name} ✅`
      )
      .then(() => {
        message.channel.send(`Eu te enviei a música por DM ✅`);
      })
      .catch((error: any) => {
        message.channel.send(
          `Não foi possível te enviar a música por DM ${message.author}... tentar novamente ?`
        );
      });
  },
};
