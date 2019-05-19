export default class AppModel {
  constructor(state) {
    this.state = state;
  }

  static extractClipNames(data) {
    return data.items.map(clip => clip.snippet.title);
  }

  async getClips(path) {
    let { url } = this.state;

    if (path) {
      url += path;
    } else {
      url += 'rock';
    }

    const responce = await fetch(url);
    const data = await responce.json();
    return AppModel.extractClipNames(data);
  }
}
