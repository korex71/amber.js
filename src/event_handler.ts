import Event from "events";

const Emitter = new Event();

class EventManager {
  constructor() {}

  public send(type: string, message: string, args: any) {
    Emitter.emit(type, { message, args });
  }
}

export { Emitter };
