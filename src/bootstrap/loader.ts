import { readdirSync } from "fs";
import { Client, Collection } from "discord.js";
import path from "path";
import Amber from "..";

class Loader {
  constructor(client: Client) {
    this.load_events(client);
    this.load_commands();
  }

  private log(args: any) {
    return console.log(`# ${new Date().toLocaleString()} -> ` + args);
  }

  load_events(client: Client) {
    const events = readdirSync(path.resolve("src", "events")).filter((file) =>
      file.endsWith(".ts")
    );

    for (const file of events) {
      const event = require(path.resolve("src", "events", file));
      this.log(`Loading event ${file.split(".")[0]}`);
      client.on(file.split(".")[0], event.bind(null, client));
      delete require.cache[
        require.resolve(path.resolve("src", "events", file))
      ];
    }
  }

  load_commands() {
    readdirSync(path.resolve("src", "commands")).forEach((dirs) => {
      const commands = readdirSync(
        path.resolve("src", "commands", dirs)
      ).filter((files) => files.endsWith(".ts"));

      for (const file of commands) {
        const command = require(path.resolve("src", "commands", dirs, file));

        this.log(`Loading command ${command.name.toLowerCase()}`);
        Amber.commands.set(command.name.toLowerCase(), command);
        delete require.cache[
          require.resolve(path.resolve("src", "commands", dirs, file))
        ];
      }
    });
  }
}

export default Loader;
