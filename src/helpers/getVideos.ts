import ytsr from "ytsr";
import ytmusic from "node-youtube-music";
import { MusicVideo } from "node-youtube-music/dist/src/models";

const parseYtsr = (items: ytsr.Video[]) => {
  console.log("*** YTSR");

  return items.map((item) => {
    const data: MusicVideo = {
      youtubeId: item.id,
      album: "",
      artist: item.author?.name,
      duration: {
        label: item.duration || "",
        totalSeconds: Number(item.duration),
      },
      thumbnailUrl: undefined,
      title: item.title,
    };

    return data;
  });
};

const first = (query: string) => {
  return new Promise((resolve) => {
    ytmusic
      .searchMusics(query)
      .then((results) => resolve(results))
      .catch((err) =>
        console.warn("*** YTM: ", err.message || "Unexpected error")
      );
  });
};

const second = (query: string) => {
  return new Promise((resolve) => {
    ytsr(query)
      .then((data) => {
        if (data.results > 0) {
          return data.items;
        }

        throw new Error("No data");
      })
      .then((results) => parseYtsr(results))
      .then((parsedResults) => resolve(parsedResults))
      .catch((err) =>
        console.warn("*** YTSR: ", err.message || "Unexpected error")
      );
  });
};

// type cb = (data: MusicVideo[]) => void;

const searchSongs = async (query: string): Promise<MusicVideo[]> => {
  return new Promise((resolve) => {
    first(query)
      .then((data: any) => resolve(data))
      .catch((err) => console.warn(err));

    second(query)
      .then((data: any) => resolve(data))
      .catch((err) => console.warn(err));
  });
};

export { searchSongs };
