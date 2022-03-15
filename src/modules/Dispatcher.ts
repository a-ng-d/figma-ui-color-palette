export default class Dispatcher {

  time: string;
  callback: any;
  on: any;

  constructor(callback, time) {
    this.callback = callback;
    this.time = time;
    this.on = {
      active: null,
      blocked: false,
      interval: '',
      send() {
        this.interval = setInterval(callback, time);
        this.blocked = true
      },
      stop() {
        clearInterval(this.interval);
        this.blocked = false
      },
      get status() {
        return this.active;
      },
      set status(bool) {
        if (!this.blocked)
          this.send()
        else if (this.blocked && !bool)
          this.stop();
        this.active = bool
      }
    }
  }

}
