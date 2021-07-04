import { Message, VoiceConnection, VoiceChannel } from "discord.js";
import { config } from "./";
import ytdl from "ytdl-core-discord";
import ytsr from "ytsr";
import ytmusic from "node-youtube-music";
import { CreateResultsEmbed } from "./helpers/message_templates";
import { Emitter } from "./event_handler";

type ISong = {
  title?: string;
  url: string;
  artist?: string;
};

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

        await this.play(parameters, message, voice_channel);
      } else {
        message.reply(
          "Você precisa estar conectado a um canal de voz para isso."
        );
      }
    }

    if (command === "skip" || command === "fs") await this.skip(message);
    if (command === "stop") await this.stop(message);
    if (command === "queue") await this.playlist(message);
  }

  async play(query: string, message: Message, voice_channel: VoiceChannel) {
    const server_queue = this.queue.get(message.guild && message.guild.id);

    var song: ISong;

    const isYoutubeLink = ytdl.validateURL(query);

    if (isYoutubeLink) {
      const info = await ytdl.getBasicInfo(query);

      song = {
        title: info.videoDetails.title,
        url: info.videoDetails.video_url,
        artist: info.videoDetails.media.artist || info.videoDetails.author.name,
      };

      message.reply(`Música encontrada: ${info.videoDetails.title}`);

      message.delete();
    }
    // // const searchResults = await ytsr(query, {limit: 10});
    // const uri = "https://www.youtube.com/watch?v=" + search[0].youtubeId;

    // message.reply(
    //   `Música encontrada: ${search[0].title} de ${search[0].artist}`
    // );

    // return connection.play(await ytdl(uri), {
    //   type: "opus",
    // });

    // const embed = CreateResultsEmbed(search, message, query);

    // message.reply(embed);

    const search = await ytmusic.searchMusics(query);

    if (!search.length)
      return Emitter.emit("error", { channel: message.channel });

    const uri = "https://www.youtube.com/watch?v=" + search[0].youtubeId;

    song = { title: search[0].title, url: uri, artist: search[0].artist };

    if (!server_queue) {
      const queue_constructor = {
        voice_channel: message.member?.voice.channel,
        message_channel: message.channel,
        connection: null as null | VoiceConnection,
        songs: [] as ISong[],
      };

      this.queue.set(message.guild?.id, queue_constructor);
      queue_constructor.songs.push(song);

      try {
        const connection = await voice_channel.join();
        queue_constructor.connection = connection;

        this.executePlay(message, queue_constructor.songs[0]);
      } catch (error) {
        Emitter.emit("error", { channel: message.channel });
        console.warn(error.message);
      }
    } else {
      if (!server_queue.songs.length) {
        server_queue.songs.push(song);
        this.executePlay(message, server_queue.songs[0]);
        return message.channel.send(
          `Tocando **${song.title} - ${song.artist}**`
        );
      } else {
        server_queue.songs.push(song);
        return message.channel.send(
          `👍 **${song.title} - ${song.artist}** adicionada a playlist!`
        );
      }
    }

    console.log(query, message.author.username);
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
    if (message.member && !message.member.voice.channel)
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
    if (message.member && !message.member.voice.channel)
      return message.reply(
        "Você precisa estar conectado a um canal de voz para isso."
      );

    const server_queue = this.queue.get(message.guild && message.guild.id);

    server_queue.songs = [];
    server_queue.connection.dispatcher.end();
  }

  async playlist(message: Message) {
    if (message.member && !message.member.voice.channel)
      return message.reply(
        "Você precisa estar conectado a um canal de voz para isso."
      );

    const server_queue = this.queue.get(message.guild && message.guild.id);

    if (!server_queue.songs.length) {
      return message.reply("A Playlist está vazia.");
    }

    await message.reply(
      server_queue.songs.map(
        (item: ISong, index: number) => `[${index}] ${item.title}\n`
      )
    );
  }

  searchHandleExecute() {}
}

export default new Handler();
