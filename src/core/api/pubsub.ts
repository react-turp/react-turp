const pubSub = <T>() => {
  type Handler = (store: Partial<T>) => void;
  const pubsub = {
    handlers: [] as Handler[],
    subscribe(handler: Handler): void {
      // console.log('inscrito');
      if (!this.handlers.includes(handler)) {
        this.handlers.push(handler);
      }
    },
    unsubscribe(handler: Handler): void {
      // console.log('não inscrito');
      const index = this.handlers.indexOf(handler);
      if (index > -1) {
        this.handlers.splice(index, 1);
      }
    },
    notify(newStore: Partial<T>): void {
      // console.log('notify');
      this.handlers.forEach((handler: Handler) => handler(newStore));
    },
  };

  return {
    pubsub,
  };
};

export default pubSub;
