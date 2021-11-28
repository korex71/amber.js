module.exports = {
  name: "ping",
  description: "Ping!",
  execute(client: any, message: any) {
    return message.channel.send(`Pong! ${Math.round(client.ws.ping)}ms.`);
  },
};
