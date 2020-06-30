import { Circle, Infinite } from 'infinite-circle';

const circles = new Map();
const infinite = new Infinite();
const listeners = new Map();

function addCircle(eventType) {
  if (circles.has(eventType)) {
    return circles.get(eventType);
  }

  const circle = new Circle({
    listen: (notify) => {
      window.addEventListener(eventType, notify);
    },
    unlisten: (notify) => {
      window.removeEventListener(eventType, notify);
    },
  });

  infinite.add(circle);
  circles.set(eventType, circle);

  return circle;
}

const getResizeInfo = (function () {
  let lastWidth, lastHeight;

  return function () {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const delta = {
      width: width - (lastWidth || 0),
      height: height - (lastHeight || 0),
    };

    // Prevent delta from being 0
    if (lastWidth !== width) {
      lastWidth = width;
    }
    if (lastHeight !== height) {
      lastHeight = height;
    }

    return {
      width,
      height,
      delta,
    };
  };
})();

const getScrollInfo = (function () {
  let lastTop;

  return function () {
    // Handle negative scrolling on mobile devices
    const top = Math.max(0, window.scrollY);
    const delta = top - (lastTop || 0);

    // Prevent delta from being 0
    if (lastTop !== top) {
      lastTop = top;
    }

    return {
      delta,
      top,
    };
  };
})();

function subscribe(eventType, callback, options = {}) {
  const circle = addCircle(eventType);

  const id = circle.register({
    meta: {
      interval: options.throttleRate || 50,
    },
    read: () => {
      const payload = {
        type: eventType,
      };

      if (eventType === 'scroll' || eventType === 'touchmove') {
        payload.scroll = getScrollInfo();
      }

      if (eventType === 'resize') {
        payload.resize = getResizeInfo();
      }

      return payload;
    },
    write: ({ payload }) => callback(payload),
  });

  listeners.set(id, {
    callback,
    eventType,
  });

  return {
    unsubscribe: () => circle.unregister(id),
  };
}

function unsubscribe(eventType, callback) {
  for (const { key, value } of listeners.entries()) {
    if (value.eventType === eventType && value.callback === callback) {
      circles.get(eventType).unregister(key);
    }
  }
}

export { subscribe, unsubscribe };
