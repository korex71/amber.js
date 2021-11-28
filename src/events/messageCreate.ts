import { config } from "../config";
import Amber from "../";

module.exports = (client: any, message: any) => {
  if (message.author.bot || message.channel.type === "dm") return;

  const prefix = Amber.BOT_PREFIX;

  if (message.content.indexOf(prefix) !== 0) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  const cmd: any =
    Amber.commands.get(command) ||
    Amber.commands.find(
      (cmd: any) => cmd.aliases && cmd.aliases.includes(command)
    );

  const DJ = config.DJ;

  if (cmd && DJ.enabled && DJ.commands.includes(cmd.name)) {
    const roleDJ = message.guild.roles.cache.find(
      (x: any) => x.name === DJ.roleName
    );

    if (!message.member._roles.includes(roleDJ.id)) {
      return message.channel.send(
        `Este comando está reservado para membros com a tag ${DJ.roleName} de permissão no servidor, ${message.author}.`
      );
    }
  }

  if (cmd && cmd.voiceChannel) {
    if (!message.member.voice.channel)
      return message.channel.send(
        `Você precisa estar em um canal de voz para isso ${message.author}.`
      );

    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return message.channel.send(
        `Não estamos no mesmo canal de voz ${message.author}.`
      );
  }

  if (cmd) cmd.execute(client, message, args);
};
