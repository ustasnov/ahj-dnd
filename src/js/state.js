export class State {
  constructor(type) {
    this.storageName = type;
  }

  save(data) {
    localStorage.setItem(this.storageName, JSON.stringify(data));
  }

  clear() {
    localStorage.removeItem(this.storageName);
  }

  load() {
    try {
      return JSON.parse(localStorage.getItem(this.storageName));
    } catch (e) {
      throw new Error(`Invalid data from storage named ${this.storageName}`);
    }
  }
}
