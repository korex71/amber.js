import { Player } from "discord-player";
import { config } from "../config";
// import Amber from "../";

class SetupEvents {
  constructor(player: Player | null) {
    if (player) this.setupEvents(player);
  }

  setupEvents(player: Player) {
    player.on("error", (queue, error) => {
      console.log(`Error emitted from the queue ${error.message}`);
    });

    player.on("connectionError", (queue, error) => {
      console.log(`Error emitted from the connection ${error.message}`);
    });

    player.on("trackStart", (queue: any, track) => {
      if (!config.loopMessage && queue.repeatMode !== 0) return;

      queue.metadata.send(
        `Começou a tocar ${track.title} em **${queue.connection.channel.name}** 🎧`
      );
    });

    player.on("trackAdd", (queue: any, track) => {
      queue.metadata.send(`Música ${track.title} adicionada à playlist ✅`);
    });

    player.on("botDisconnect", (queue: any) => {
      queue.metadata.send(
        "Eu fui manualmente disconectado do canal de voz, limpando a playlist..."
      );
    });

    player.on("channelEmpty", (queue: any) => {
      queue.metadata.send(
        "Não há mais ninguém aqui, saindo do canal de voz..."
      );
    });

    player.on("queueEnd", (queue: any) => {
      queue.metadata.send("Playlist finalizada. até uma próxima 😉");
    });
  }
}

export default SetupEvents;
