const EventEmitter = require("./EventEmit");
const NativeInterface = require("./NativeInterface");

class Adapter {
  constructor() {
    this.eventEmitter = new EventEmitter();
  }

  postMessage({ id, payload: { action, module, params } }) {
    const hybridMessage = {
      id,
      module,
      action,
      params
    };

    if (
      global.webkit &&
      global.webkit.messageHandlers &&
      global.webkit.messageHandlers.nativeApp
    ) {
      global.webkit.messageHandlers.nativeApp.postMessage(
        hybridMessage
      );
    } else if (global.nativeApp && global.nativeApp.sendToNative) {
      global.nativeApp.sendToNative(JSON.stringify(hybridMessage));
    }
  }

  connect() {
    const { eventEmitter } = this;

    global.webApp = new NativeInterface({
      eventEmitter
    });
  }
}

module.exports = Adapter;
