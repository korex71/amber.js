import {
  DMChannel,
  Message,
  NewsChannel,
  TextChannel,
  VoiceChannel,
  VoiceConnection,
} from "discord.js";
import { MusicVideo } from "node-youtube-music/dist/src/models";
import { Emitter } from "../event_handler";
import { ISong } from "./ITypes";
import ytdl from "ytdl-core-discord";

interface IQueueConstructor {
  voice_channel: VoiceChannel | null | undefined;
  message_channel: TextChannel | DMChannel | NewsChannel;
  connection: VoiceConnection | undefined;
  songs: ISong[];
}

class Playlist {
  public queue = new Map<string | undefined, IQueueConstructor>();

  private constructPlaylist(message: Message) {
    const queue_constructor = {
      voice_channel: message.member?.voice.channel,
      message_channel: message.channel,
      connection: undefined as undefined | VoiceConnection,
      songs: [] as ISong[],
    };

    this.queue.set(message.guild?.id, queue_constructor);
  }

  async addSong(song: ISong, message: Message) {
    if (!this.queue.get(message.guild?.id)) {
      this.constructPlaylist(message);

      let playlist = this.queue.get(message.guild?.id);

      if (playlist) {
        playlist.songs.push(song);

        try {
          const connection = await playlist.voice_channel?.join();

          playlist.connection = connection;

          this.queue.set(message.guild?.id, playlist);

          return this.executePlay(message, playlist.songs[0]);
        } catch (error) {
          Emitter.emit("error", {
            message: `Não foi possível tocar ${
              playlist.songs[0].title || "uma música."
            }`,
            data: { channel: message.channel },
          });

          if (!playlist.songs.length) {
          }
          return console.warn(error.message);
        }
      }
    }

    const queuePl = this.queue.get(message.guild?.id);

    if (queuePl && !queuePl.songs.length) {
      queuePl.songs.push(song);

      this.executePlay(message, queuePl.songs[0]);
      return;
    } else if (queuePl && queuePl.songs.length) {
      queuePl.songs.push(song);
      return message.channel.send(
        `👍 **${song.title} - ${song.artist}** adicionada a playlist!`
      );
    }
  }

  private async executePlay(message: Message, song: ISong) {
    const guild = message.guild;

    if (!guild) return;

    const song_queue = this.queue.get(guild.id);

    // if (song_queue && !song_queue.songs.length) {
    //   song_queue.voice_channel?.leave();
    //   this.queue.delete(guild.id);
    //   return;
    // }

    if (song_queue) {
      song_queue.connection
        ?.play(await ytdl(song.url), {
          type: "opus",
        })
        .on("finish", () => {
          // const lastSong = song_queue.songs[0];
          song_queue.songs.shift();

          if (song_queue.songs.length) {
            this.executePlay(message, song_queue.songs[0]);
          } else {
            // Call autoplay?
          }
        });

      await song_queue.message_channel.send(
        `Tocando agora: \`${song.title} - ${song.artist}\`\nAdicionada por <@${message.author.id}>`
      );
    }
  }

  skip(message: Message) {
    if (this.isUserOutVoiceChannel(message))
      return message.reply(
        "Você precisa estar conectado a um canal de voz para isso."
      );

    const server_queue = this.queue.get(message.guild?.id);

    if (!server_queue) {
      return message.reply("Não existem músicas na playlist ainda.");
    }

    server_queue.connection?.dispatcher.end();
  }

  isUserOutVoiceChannel(message: Message) {
    return !message.member?.voice.channel;
  }

  GetNextSong() {}
}

export default new Playlist();
