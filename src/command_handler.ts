import { Message, VoiceConnection, MessageEmbed } from "discord.js";
import { client, config } from "./";
import ytdl from "ytdl-core-discord";
import ytsr from "ytsr";
import ytmusic from "node-youtube-music";

class Handler {
  async handle(command: string, parameters: string, message: Message) {
    if (!parameters) {
      message.reply(
        `O comando precisa de argumentos. aprenda com ${config.prefix}help`
      );

      return;
    }

    if (command === "play") {
      if (message.member && message.member.voice.channel) {
        const connection = await message.member.voice.channel.join();

        await this.play(parameters, message, connection);
      } else {
        message.reply(
          "Você precisa estar conectado a um canal de voz para isso."
        );
      }
    }
  }

  async play(query: string, message: Message, connection: VoiceConnection) {
    const isYoutube = ytdl.validateURL(query);

    if (isYoutube) {
      message.channel.send(`Tocando ${query}`);

      message.delete();

      connection.play(await ytdl(query), {
        type: "opus",
      });
    } else {
      // const searchResults = await ytsr(query, {limit: 10});
      const search = await ytmusic.searchMusics(query);
      const uri = "https://www.youtube.com/watch?v=" + search[0].youtubeId;

      message.reply(
        `Música encontrada: ${search[0].title} de ${search[0].artist}`
      );

      return connection.play(await ytdl(uri), {
        type: "opus",
      });

      const embed = new MessageEmbed()
        .setColor("#42fcff")
        .setTitle(query)
        .setAuthor(message.author.username)
        .setTimestamp()
        .addFields(
          search.map((item, index) => {
            return { name: index, value: item.title, inline: false };
          })
        );

      message.reply(embed);
    }

    console.log(query, message.author.username);
  }

  ping() {}
}

export default new Handler();
