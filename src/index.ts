import "dotenv/config";
import { Player } from "discord-player";
import { Client, Intents, Collection } from "discord.js";
import { IBootstrapConfig, IBotOptions } from "./interfaces";
import { config as setupConfig } from "./config";
import Loader from "./bootstrap/loader";
import Events from "./bootstrap/events";
import EventEmitter from "events";

class Main extends EventEmitter {
  private static BOT_TOKEN = "";
  public BOT_PREFIX = "";
  private BOT_DESCRIPTION = "Music bot";

  public client: Client | null = null;

  public player: Player | null = null;

  public commands = new Collection();

  constructor(config: IBootstrapConfig, options?: IBotOptions) {
    super();

    if (!config.BOT_TOKEN || !config.BOT_PREFIX) {
      throw new Error(
        `Invalid config ${
          !config.BOT_DESCRIPTION ? [config.BOT_PREFIX] : [config.BOT_TOKEN]
        }`
      );
    }

    Object.assign(this, config);

    this.initialize();
  }

  initialize() {
    const client = new Client({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
      ],
    });

    this.player = new Player(client, setupConfig.discordPlayer);

    Object.assign(this, {
      client,
    });

    client.login(process.env.BOT_TOKEN).then(() => {
      new Loader(client);
      new Events(this.player);

      this.emit("ready", (this.client, this.player, this.BOT_PREFIX));
    });
  }

  // private static async start(client: Client) {
  //   client = client;
  //   this.player = new Player(client, setupConfig.discordPlayer);

  //   const loader = new Loader(client, this.commands);

  //   await client.login(this.BOT_TOKEN);
  // }
}

export default new Main({
  BOT_TOKEN: process.env.BOT_TOKEN,
  BOT_PREFIX: process.env.BOT_PREFIX,
  BOT_DESCRIPTION: process.env.BOT_DESCRIPTION,
});
