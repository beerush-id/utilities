export type DraggableOptions = {
  enabled?: boolean;
  startX?: number;
  startY?: number;
  drag?: (deltaX: number, deltaY: number) => void;
  done?: (deltaX: number, deltaY: number) => void;
};

export type DraggableInstance = {
  update: (options: DraggableOptions) => void;
  destroy: () => void;
};

/**
 * Add draggable behavior to an element.
 * @param {HTMLElement} element
 * @param {DraggableOptions} options
 * @returns {DraggableInstance}
 */
export function draggable(element: HTMLElement, options: DraggableOptions): DraggableInstance {
  let { enabled = true } = options;
  let dragInitiated = false;
  let dragStarted = false;

  let currentX = 0;
  let currentY = 0;
  let dragStartX = 0;
  let dragStartY = 0;

  const mouseDown = (e: MouseEvent) => {
    if (!enabled) return;

    dragInitiated = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
  };

  const mouseMove = (e: MouseEvent) => {
    if (!dragInitiated) return;

    if (dragInitiated && !dragStarted) {
      dragStarted = true;
    }

    if (!dragStarted) return;

    const { clientX, clientY } = e;
    const deltaX = clientX - dragStartX;
    const deltaY = clientY - dragStartY;

    options?.drag?.(currentX + deltaX, currentY + deltaY);
  };

  const mouseUp = (e: MouseEvent) => {
    if (!dragStarted) {
      dragInitiated = false;
      return;
    }

    dragInitiated = false;
    dragStarted = false;

    currentX = currentX + (e.clientX - dragStartX);
    currentY = currentY + (e.clientY - dragStartY);

    options?.done?.(currentX, currentY);
  };

  const touchstart = (e: TouchEvent) => {
    if (!enabled) return;

    dragInitiated = true;
    dragStartX = e.touches[0].clientX;
    dragStartY = e.touches[0].clientY;
  };

  const touchmove = (e: TouchEvent) => {
    if (!dragInitiated) return;

    if (dragInitiated && !dragStarted) {
      dragStarted = true;
    }

    if (!dragStarted) return;

    const { clientX, clientY } = e.touches[0];
    const deltaX = clientX - dragStartX;
    const deltaY = clientY - dragStartY;

    options?.drag?.(currentX + deltaX, currentY + deltaY);
  };

  const touchend = (e: TouchEvent) => {
    if (!dragStarted) {
      dragInitiated = false;
      return;
    }

    dragInitiated = false;
    dragStarted = false;

    currentX = currentX + (e.changedTouches[0].clientX - dragStartX);
    currentY = currentY + (e.changedTouches[0].clientY - dragStartY);

    options?.done?.(currentX, currentY);
  };

  element.addEventListener('mousedown', mouseDown);
  element.addEventListener('touchstart', touchstart);
  document.addEventListener('mousemove', mouseMove);
  document.addEventListener('touchmove', touchmove);
  document.addEventListener('mouseup', mouseUp);
  document.addEventListener('touchend', touchend);

  return {
    update: (newOptions: DraggableOptions) => {
      options = newOptions;

      enabled = options.enabled ?? enabled;

      if (!enabled) {
        currentX = 0;
        currentY = 0;
      }
    },
    destroy: () => {
      element.removeEventListener('mousedown', mouseDown);
      element.removeEventListener('touchstart', touchstart);
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('touchmove', touchmove);
      document.removeEventListener('mouseup', mouseUp);
      document.removeEventListener('touchend', touchend);
    },
  };
}
