import messages from "../commands/core/messages.json";
import Amber from "../";

module.exports = (client: any, int: any) => {
  if (!int.isButton()) return;
  const queue = Amber.player?.getQueue(int.guildId);

  switch (int.customId) {
    case "saveTrack": {
      if (!queue || !queue.playing)
        return int.reply({
          content: `Não tem músicas tocando atualmente... tentar novamente ? ❌`,
          ephemeral: true,
          components: [],
        });

      int.member
        .send(
          `You saved the track ${queue.current.title} | ${queue.current.author} from the server ${int.member.guild.name} ✅`
        )
        .then(() => {
          return int.reply({
            content: `Eu te enviei o título da música por DM 😉`,
            ephemeral: true,
            components: [],
          });
        })
        .catch((error: any) => {
          return int.reply({
            content: `${messages.IT_WAS_NOT_POSSIBLE_SEND_DM}.`,
            ephemeral: true,
            components: [],
          });
        });
    }
  }
};
