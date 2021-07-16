import Event from "events";

const Emitter: IEmitter = new Event();
export interface IEmitter extends Event {
  emit(event: IEventTypes, args: IArgs): boolean;
  on(event: IEventTypes, listener: (args: IArgs) => void): this;
}

export type IArgs = { message?: string; data?: any };

export type IEventTypes =
  | "error"
  | "log"
  | "message"
  | "search-instance"
  | "play-song";

Emitter.on("play-song", ({ data, message }) => {
  const ytId = data.id;
});

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
class EventManager {
  constructor() {}

  public send(type: IEventTypes, args: IArgs) {
    Emitter.emit(type, args);
  }
}

const Manager = new EventManager();

export { Emitter, Manager };
