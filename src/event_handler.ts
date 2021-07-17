import Event from "events";
import playlist_manager from "./helpers/playlist_manager";

const Emitter: IEmitter = new Event();
export interface IEmitter extends Event {
  emit(event: IEventTypes, args: IArgs): boolean;

  on(event: IEventTypes, listener: (...args: any[]) => void): this;
}

export type IArgs = { message?: string; data?: any };

export type IEventTypes =
  | any
  | "error"
  | "log"
  | "message"
  | "search-instance"
  | "play-song"
  | "update-state";

Emitter.on("play-song", ({ data, message }) => {});

Emitter.on("update-state", ({ data, message }) => {});

Emitter.on("log", ({ message }) => {
  const timestamp = new Date().toLocaleString();
  console.log(`${timestamp} => ${message}`);
});

Emitter.on("error", ({ data, message }) => {
  console.warn(message);
  data.channel.send(message);
});

Emitter.on("message", ({ data, message }) => {
  try {
    if (data.reply) {
      return data.message.reply(message);
    }

    data.channel.send(message);
  } catch (error) {
    console.warn(error);
  }
});

Emitter.on("pause-song", ({ data }) => {
  if (!data.message) return "Message data is mandatory";

  playlist_manager.pause(data.message);
});
class EventManager extends Event {
  public send(type: IEventTypes, args: IArgs) {
    Emitter.emit(type, args);
  }
}

const Manager = new EventManager();

export { Emitter, Manager };
