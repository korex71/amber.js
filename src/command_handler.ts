import { Message, VoiceConnection, VoiceChannel } from "discord.js";
import { config } from "./";
import ytdl from "ytdl-core-discord";
import ytsr from "ytsr";
import ytmusic from "node-youtube-music";
import {
  CreateQueueEmbed,
  CreateResultsEmbed,
} from "./helpers/message_templates";
import { Emitter } from "./event_handler";
import { MusicVideo } from "node-youtube-music/dist/src/models";
import { searchSongs } from "./helpers/getVideos";
import { createInstance } from "./helpers/searchInstance";
import { ISong } from "./helpers/ITypes";
import playlist_manager from "./helpers/playlist_manager";

interface ISearchItems extends ytsr.Video {}
interface IResults extends ytsr.Result {
  items: ytsr.Video[];
}
class Handler {
  queue = new Map();
  options = new Map();

  async handle(command: string, parameters: string, message: Message) {
    if (command === "play") {
      if (!parameters) {
        return message.reply(
          `O comando precisa de argumentos. aprenda com ${config.prefix}help`
        );
      }

      if (message.member && message.member.voice.channel) {
        const voice_channel = message.member.voice.channel;

        await this.play(parameters, message);
      } else {
        message.reply(
          "Você precisa estar conectado a um canal de voz para isso."
        );
      }
    }

    if (command === "skip" || command === "fs")
      await playlist_manager.skip(message);
    if (command === "stop") await this.stop(message);
    if (command === "queue") await this.playlist(message);
  }

  async play(query: string, message: Message) {
    var song: ISong;

    const isYoutubeLink = ytdl.validateURL(query);

    if (isYoutubeLink) {
      const info = await ytdl.getBasicInfo(query);

      song = {
        id: info.videoDetails.videoId,
        title: info.videoDetails.title,
        url: info.videoDetails.video_url,
        artist: info.videoDetails.media.artist || info.videoDetails.author.name,
      };

      playlist_manager.addSong(song, message);

      message.reply(`Música encontrada: ${info.videoDetails.title}`);

      return message.delete();
    } else {
      const userId = message.author.id;
      const results = await searchSongs(query);
      const embed = CreateResultsEmbed(results, message, query);
      const botMessage = await message.channel.send(embed);
      createInstance(results, userId, message, botMessage);
    }
  }

  private async executePlay(message: Message, song: ISong) {
    const guild = message.guild;

    if (!guild) return;

    const song_queue = this.queue.get(guild?.id);

    if (!song_queue) {
      song_queue.voice_channel.leave();
      this.queue.delete(guild?.id);
      return;
    }

    song_queue.connection
      .play(await ytdl(song.url), {
        type: "opus",
      })
      .on("finish", () => {
        song_queue.songs.shift();
        if (song_queue.songs.length) {
          this.executePlay(message, song_queue.songs[0]);
        }
      });

    await song_queue.message_channel.send(
      `Tocando agora: \`${song.title} - ${song.artist}\`\nAdicionada por <@${message.author.id}>`
    );
  }

  skip(message: Message) {
    if (this.isUserOutVoiceChannel(message))
      return message.reply(
        "Você precisa estar conectado a um canal de voz para isso."
      );

    const server_queue = this.queue.get(message.guild && message.guild.id);

    if (!server_queue) {
      return message.reply("Não existem músicas na playlist ainda.");
    }

    server_queue.connection.dispatcher.end();
  }

  stop(message: Message) {
    if (this.isUserOutVoiceChannel(message))
      return message.reply(
        "Você precisa estar conectado a um canal de voz para isso."
      );

    const server_queue = this.queue.get(message.guild && message.guild.id);

    server_queue.songs = [];
    server_queue.connection.dispatcher.end();
  }

  async playlist(message: Message) {
    if (this.isUserOutVoiceChannel(message))
      return message.reply(
        "Você precisa estar conectado a um canal de voz para isso."
      );

    const server_queue = this.queue.get(message.guild && message.guild.id);

    if (!server_queue.songs.length) {
      return message.reply("A Playlist está vazia.");
    }

    const embed = CreateQueueEmbed(server_queue.songs);

    await message.reply(embed);
  }

  searchHandleExecute() {}

  isUserOutVoiceChannel(message: Message) {
    return !message.member?.voice.channel;
  }
}

export default new Handler();
