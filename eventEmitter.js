// myClass.js
class EventEmitter {



    constructor() {
      this.events = {};
    }
  
    // Register an event handler
    on(eventName, listener) {
      if (!this.events[eventName]) {
        this.events[eventName] = [];
      }
      this.events[eventName].push(listener);
    }
  
    // Remove an event handler
    off(eventName, listenerToRemove) {
      if (!this.events[eventName]) return;
  
      this.events[eventName] = this.events[eventName].filter(
        (listener) => listener !== listenerToRemove
      );
    }
  
    // Emit (trigger) an event
    emit(eventName, ...args) {
      if (!this.events[eventName]) return;
  
      this.events[eventName].forEach((listener) => {
        listener(...args);
      });
    }
  
    // Register an event handler that runs only once
    once(eventName, listener) {
      const wrapper = (...args) => {
        listener(...args);
        this.off(eventName, wrapper);
      };
      this.on(eventName, wrapper);
    }

  



}

module.exports = EventEmitter;
