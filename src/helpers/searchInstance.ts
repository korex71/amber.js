import { Message } from "discord.js";
import { MusicVideo } from "node-youtube-music/dist/src/models";
import { Emitter } from "../event_handler";
import { ISong } from "./ITypes";
import Playlist from "./playlist_manager";

const instance = new Map();

var MS_TO_THIRTY_MINUTES = (60 * 60 * 60) / 2;

Emitter.on("search-instance", (args) => {
  const { selected, userId } = args.data;

  if (instance.get(userId)) {
    console.log(instance.get(userId));
    const { results, message } = instance.get(userId);

    const song: ISong = results[selected];

    Playlist.addSong(song, message);

    instance.delete(userId);
  }
});

const createInstance = (
  results: MusicVideo[],
  userId: string,
  message: Message,
  botMessage: Message
) => {
  if (instance.get(userId)) {
    message.reply(
      "Já existe uma pesquisa em andamento, digite **cancel** para começar uma nova."
    );
  } else {
    let result: ISong[] = results.map(({ title, youtubeId, artist }) => {
      return {
        id: youtubeId || "",
        title,
        artist,
        url: `https://youtube.com/watch?v=${youtubeId}`,
      };
    });

    instance.set(userId, { results: result, botMessage, message });

    setTimeout(() => {
      if (instance.get(userId)) {
        instance.delete(userId);

        try {
          message.reply("Pesquisa cancelada por exceder a espera 30 segundos.");
        } catch (error) {
          console.warn(error);
        }
      }
    }, MS_TO_THIRTY_MINUTES);
  }
};

export { createInstance };
