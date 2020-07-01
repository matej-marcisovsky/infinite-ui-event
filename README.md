# infinite-ui-event

Fast and lightweight library for subscription to UI browser events.

## Installation

```bash
npm i infinite-ui-event --save
```

## Usage

```javascript
import { subscribe, unsubscribe } from 'infinite-ui-event';

function eventHandler(payload) {
  console.log(payload);
}

let subscription = subscribe('scroll', eventHandler);

// Unsubscribe exact subscription
subscription.unsubscribe();

/*
 * Unsubscribe by event type and event handler.
 * Unsafe - it will unsubscribe all matching event handlers. They can have different throttle rates for eg.
 */
unsubscribe('scroll', eventHandler);
```

## API

### subscribe

```javascript
Object subscribe(String eventType, Function callback, Object? options = {})
```

Subscribe to windows events such as `scroll`, `resize`, `touchmove` etc.

#### Payload

```javascript
{
  type: <String>, // 'scroll', 'resize' etc.
  scroll: { // Scroll object is present only for 'scroll' and 'touchmove' events.
    delta: <Number>, // Delta of vertical scroll position.
    top: <Number> // Vertical scroll position.
  },
  resize: { // Resize object is present only for 'resize' event.
    delta: {
      height <Number>, // Delta of height.
      width <Number> // Delta of width.
    },
    height <Number>,
    width <Number>
  }
}
```

#### Options

```javascript
{
  throttleRate <Number> // Default value is 50 (ms).
}
```

#### Return type

```javascript
{
  unsubscribe <Function> // Unsubscribe this exact subscription.
}
```

### unsubscribe

```javascript
Object unsubscribe(String eventType, Function callback)
```

Unsubscribe by event type and event handler.
**Unsafe** - it will unsubscribe all matching event handlers. They can have different throttle rates for eg.
