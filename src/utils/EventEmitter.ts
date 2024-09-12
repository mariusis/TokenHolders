type EventListener = (data: any) => void;

class EventEmitter {
  private events: { [event: string]: EventListener[] } = {};

  on(event: string, listener: EventListener): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  off(event: string, listener: EventListener): void {
    if (!this.events[event]) return;

    this.events[event] = this.events[event].filter((l) => l !== listener);
  }

  emit(event: string, data: any): void {
    if (!this.events[event]) return;
    console.log("Event emitted:", event); // Debug log
    this.events[event].forEach((listener) => listener(data));
  }
}

export default EventEmitter;
