export type PopoverXDir = 'left' | 'right' | 'before' | 'between' | 'after';
export type PopoverYDir = 'top' | 'bottom' | 'above' | 'between' | 'below';
export type PopOverTrigger = 'hover' | 'click' | 'manual';

export type PopoverOptions = {
  xDir?: PopoverXDir;
  yDir?: PopoverYDir;
  open?: boolean;
  swap?: boolean;
  container?: string;
  trigger?: PopOverTrigger;
  callback?: (active: boolean) => void;
  offset?: number | string;
};

export type PopoverInstance = {
  update: (newOptions?: PopoverOptions) => void;
  destroy: () => void;
};

/**
 * Attach a popover to an element.
 * @param {HTMLElement} element
 * @param {PopoverOptions} options
 * @returns {PopoverInstance}
 */
export function popover(element: HTMLElement, options?: PopoverOptions): PopoverInstance {
  let {
    xDir = 'between',
    yDir = 'below',
    container = '.popover-container',
    trigger = 'hover',
    offset = 8,
  } = options ?? {};
  let active = false;
  const parent: HTMLElement = element.parentElement as never;

  const mouseEnter = () => {
    if (!element.parentElement || active) return;

    let target = document.querySelector(container as string);

    if (!target) {
      target = document.createElement('div');
      target.classList.add('popover-container');
      document.body.appendChild(target);
    }

    if (target && !active) {
      target.appendChild(element);
      active = true;
      options?.callback?.(active);
    }

    const { width, height, top, left } = parent.getBoundingClientRect();
    const { width: elWidth, height: elHeight } = element.getBoundingClientRect();

    const centerX = left + width - width / 2;
    const centerY = top + height - height / 2;

    const offsetUnit = () => (typeof offset === 'number' ? `${offset}px` : offset);

    element.style.removeProperty('--popover-x');
    element.style.removeProperty('--popover-y');

    if (xDir === 'before') {
      let x = left - elWidth;
      let o = `-${offsetUnit()}`;
      let c = 'x-before';

      if (x < 0) {
        if (options?.swap) {
          x = left + width;
          o = offsetUnit();
          c = 'x-after';
        } else {
          x = 0;
        }
      }

      element.style.setProperty('--popover-x', `${x}px`);
      element.style.setProperty('--popover-offset-x', o);
      element.classList.add(c);
    } else if (xDir === 'between') {
      let x = centerX - elWidth / 2;
      if (x < 0) x = 0;
      if (x + elWidth > window.innerWidth) x = window.innerWidth - elWidth;
      element.style.setProperty('--popover-x', `${x}px`);
      element.classList.add('x-between');
    } else if (xDir === 'after') {
      let x = left + width;
      let o = offsetUnit();
      let c = 'x-after';

      if (x + elWidth > window.innerWidth) {
        if (options?.swap) {
          x = left - elWidth;
          o = `-${offsetUnit()}`;
          c = 'x-before';
        } else {
          x = window.innerWidth - elWidth;
        }
      }

      element.style.setProperty('--popover-x', `${x}px`);
      element.style.setProperty('--popover-offset-x', o);
      element.classList.add(c);
    } else if (xDir === 'left') {
      element.style.setProperty('--popover-x', `${left}px`);
      element.classList.add('x-left');
    } else if (xDir === 'right') {
      element.style.setProperty('--popover-x', `${left + width - elWidth}px`);
      element.classList.add('x-right');
    }

    if (yDir === 'above') {
      let y = top - elHeight;
      let o = `-${offsetUnit()}`;
      let c = 'y-above';

      if (y < 0) {
        if (options?.swap) {
          y = top + height;
          o = offsetUnit();
          c = 'y-below';
        } else {
          y = 0;
        }
      }

      element.style.setProperty('--popover-y', `${y}px`);
      element.style.setProperty('--popover-offset-y', o);
      element.classList.add(c);
    } else if (yDir === 'between') {
      let y = centerY - elHeight / 2;
      if (y < 0) y = 0;
      if (y + elHeight > window.innerHeight) y = window.innerHeight - elHeight;
      element.style.setProperty('--popover-y', `${y}px`);
      element.classList.add('y-between');
    } else if (yDir === 'below') {
      let y = top + height;
      let o = offsetUnit();
      let c = 'y-below';

      if (y + elHeight > window.innerHeight) {
        if (options?.swap) {
          y = top - elHeight;
          o = `-${offsetUnit()}`;
          c = 'y-above';
        } else {
          y = window.innerHeight - elHeight;
        }
      }

      element.style.setProperty('--popover-y', `${y}px`);
      element.style.setProperty('--popover-offset-y', o);
      element.classList.add(c);
    } else if (yDir === 'top') {
      element.style.setProperty('--popover-y', `${top}px`);
      element.classList.add('y-top');
    } else if (yDir === 'bottom') {
      element.style.setProperty('--popover-y', `${top + height - elHeight}px`);
      element.classList.add('y-bottom');
    }

    if (trigger === 'click' || trigger === 'manual') {
      setTimeout(() => {
        document.addEventListener('click', clickOutside);
      }, 100);
    }
  };

  const mouseLeave = () => {
    if (parent) {
      parent?.appendChild(element);
    }
    active = false;
    options?.callback?.(active);
  };

  const clickOutside = (e?: MouseEvent) => {
    if (element.contains(e?.target as Node)) return;
    mouseLeave();
    document.removeEventListener('click', clickOutside);
    active = false;
    options?.callback?.(active);
  };

  const toggle = () => {
    if (trigger !== 'manual') return;

    if (options?.open) {
      mouseEnter();
    } else {
      clickOutside();
    }
  };

  if (trigger === 'hover') {
    parent?.addEventListener('mouseenter', mouseEnter);
    parent?.addEventListener('mouseleave', mouseLeave);
    parent?.addEventListener('click', mouseLeave);
  } else if (trigger === 'click') {
    parent?.addEventListener('click', mouseEnter);
  } else if (trigger === 'manual' && options?.open) {
    mouseEnter();
  }

  const observer = new ResizeObserver(() => {
    if (active) mouseEnter();
  });
  observer.observe(element);

  return {
    update: (newOptions?: PopoverOptions) => {
      options = newOptions;

      xDir = newOptions?.xDir ?? xDir;
      yDir = newOptions?.yDir ?? yDir;
      container = newOptions?.container ?? container;
      trigger = newOptions?.trigger ?? trigger;
      offset = newOptions?.offset ?? offset;

      toggle();
    },
    destroy: () => {
      parent?.removeEventListener('click', mouseEnter);
      parent?.removeEventListener('mouseenter', mouseEnter);
      parent?.removeEventListener('mouseleave', mouseLeave);
      parent?.removeEventListener('click', mouseLeave);
      document.removeEventListener('click', mouseLeave);
      observer.disconnect();
      element.remove();
    },
  };
}
