export interface IBootstrapConfig {
  BOT_TOKEN?: string | undefined;
  BOT_PREFIX?: string | undefined;
  BOT_DESCRIPTION?: string;
}

export interface IBotOptions {
  autoplay?: false;
  volume?: number;
  loop?: false;
  replyUser?: boolean;
}
