export enum SwipeEventType {
  SWIPE = 'swipe',
  MOVE = 'swipemove',
}

export type SwipeEvent = CustomEvent<{
  dir: 'left' | 'right' | 'up' | 'down';
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  offsetX: number;
  offsetY: number;
  target: HTMLElement;
}>;

export type SwipeOptions = {
  enabled?: boolean;
  callback: (e: SwipeEvent) => void;
};

export type SwipeInstance = {
  update: (options: SwipeOptions) => void;
  destroy: () => void;
};

/**
 * Attach a swipe event to an element.
 * @param {HTMLElement} element
 * @param {SwipeOptions} options
 * @returns {SwipeInstance}
 */
export function swipe(element: HTMLElement, options: SwipeOptions): SwipeInstance {
  let { enabled = true, callback: handler } = options;
  let startX = 0;
  let startY = 0;
  let swipeInit = false;
  let swiping = false;
  let lastEvent: SwipeEvent;

  const offset = 10;

  const getDir = (e: MouseEvent) => {
    if (!enabled) return;
    const diffX = e.clientX - startX;
    const diffY = e.clientY - startY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > offset) {
        return 'right';
      } else if (diffX < -offset) {
        return 'left';
      }
    } else {
      if (diffY > offset) {
        return 'down';
      } else if (diffY < -offset) {
        return 'up';
      }
    }
  };

  const mouseDown = (e: MouseEvent) => {
    swipeInit = true;
    startX = e.clientX;
    startY = e.clientY;
  };

  const mouseMove = (e: MouseEvent) => {
    if (!swipeInit) return;

    swiping = true;

    e.preventDefault();
    e.stopPropagation();

    lastEvent = new CustomEvent(SwipeEventType.MOVE, {
      detail: {
        dir: getDir(e),
        startX,
        startY,
        currentX: e.clientX,
        currentY: e.clientY,
        offsetX: e.clientX - startX,
        offsetY: e.clientY - startY,
        target: element,
      },
      cancelable: true,
      bubbles: true,
    }) as never;

    handler?.(lastEvent);
    element.dispatchEvent(lastEvent);
  };

  const mouseUp = () => {
    if (!swiping || !swipeInit) return;

    const event = new CustomEvent(SwipeEventType.SWIPE, {
      detail: lastEvent?.detail,
      cancelable: true,
      bubbles: true,
    });

    handler?.(event as never);
    element.dispatchEvent(event);

    swiping = false;
    swipeInit = false;

    return false;
  };

  const mouseCancel = () => {
    swiping = false;
    swipeInit = false;
  };

  element.addEventListener('mousedown', mouseDown);
  element.addEventListener('mousemove', mouseMove);
  element.addEventListener('mouseup', mouseUp);
  element.addEventListener('mouseleave', mouseCancel);

  return {
    update(newOptions: SwipeOptions) {
      options = newOptions;
      enabled = newOptions.enabled ?? enabled;
      handler = newOptions.callback ?? handler;
    },
    destroy() {
      element.removeEventListener('mousedown', mouseDown);
      element.removeEventListener('mousemove', mouseMove);
      element.removeEventListener('mouseup', mouseUp);
      element.removeEventListener('mouseleave', mouseCancel);
    },
  };
}
