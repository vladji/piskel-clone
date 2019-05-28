export default class AppModel {
  constructor(url) {
    this.url = url;
    this.urlGetId = {
      url: 'https://www.googleapis.com/youtube/v3/videos?&key=AIzaSyCTWC75i70moJLzyNh3tt4jzCljZcRkU8Y&part=snippet,statistics',
    };
  }

  async getID(data) {
    let { url } = this.urlGetId;
    const idClips = data.items.map(clip => clip.id.videoId).join(',');
    url += `&id=${idClips}`;

    const respId = await fetch(url);
    const detId = await respId.json();
    return AppModel.extractClipNames(detId);
  }

  static extractClipNames(data) {
    const titleClip = data.items.map(clip => clip.snippet.title);
    const clipPic = data.items.map(clip => clip.snippet.thumbnails.medium.url);
    const clipDesc = data.items.map(clip => clip.snippet.description);
    const clipChannel = data.items.map(clip => clip.snippet.channelTitle);
    const clipPublished = data.items.map(clip => clip.snippet.publishedAt);
    const clipStatistics = data.items.map(clip => clip.statistics.viewCount);

    const parsingData = [titleClip, clipPic, clipDesc, clipChannel, clipPublished, clipStatistics];
    return parsingData;
  }

  async getClips(path, token) {
    let { url } = this.url;

    if (token && path) {
      url = `${url}${path}&pageToken=${token}`;
    } else if (path) {
      url += path;
    } else {
      url += 'dogs';
    }

    const responce = await fetch(url);
    const data = await responce.json();
    return data;
  }
}
