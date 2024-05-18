type Readable<T> = {
  subscribe: (run: (value: T) => void) => () => void;
};

export enum ScrollDirection {
  TOP = 'top',
  BOTTOM = 'bottom',
}

export type ScrollOptions = {
  direction?: ScrollDirection;
  callback?: (scrollable: boolean, element: HTMLElement) => void;
  stores?: Readable<unknown>[];

  enabled?: boolean;
  debounce?: number;
  useObserver?: boolean;
  compare?: 'self' | 'parent';
  behavior?: 'auto' | 'smooth' | 'instant';
};

export type AutoScrollInstance = {
  update: (newOptions: ScrollOptions) => void;
  destroy: () => void;
};

/**
 * Autoscrolls an element to the top or bottom.
 * @param {HTMLElement} element
 * @param {ScrollOptions} options
 * @returns {AutoScrollInstance}
 */
export function autoscroll(element: HTMLElement, options: ScrollOptions): AutoScrollInstance {
  let {
    direction = ScrollDirection.BOTTOM,
    enabled = true,
    useObserver = true,
    compare = 'parent',
    behavior = 'smooth',
    debounce = 0,
  } = options || {};
  let scrollable = false;

  const applyScroll = () => {
    const { height } = (compare === 'parent' ? element.parentElement : element)?.getBoundingClientRect() || {
      height: 0,
    };
    scrollable = element.scrollHeight > height;

    options?.callback?.(scrollable, element);

    if (!enabled) return;

    if (scrollable) {
      setTimeout(() => {
        scroll();
      }, debounce);
    }
  };

  const scroll = () => {
    element.scrollTo({
      top: direction === 'bottom' ? element.scrollHeight : 0,
      behavior,
    });
  };

  const mutationObserver = new MutationObserver(() => {
    if (useObserver) {
      applyScroll();
    }
  });

  let unsubscribe: () => void;

  const subscribeStores = () => {
    if (typeof unsubscribe === 'function') {
      unsubscribe();
    }

    if (Array.isArray(options.stores)) {
      const subscriptions = options.stores.map((store) => store.subscribe(applyScroll));
      unsubscribe = () => {
        for (const unsub of subscriptions) {
          unsub();
        }
      };
    }
  };

  const disconnect = () => {
    mutationObserver.disconnect();

    if (typeof unsubscribe === 'function') {
      unsubscribe();
    }
  };

  mutationObserver.observe(element, { childList: true });

  applyScroll();
  subscribeStores();

  return {
    update: (newOptions: ScrollOptions = { enabled: true, useObserver: true }) => {
      options = newOptions;

      enabled = options?.enabled ?? enabled;
      direction = options?.direction ?? direction;
      useObserver = options?.useObserver ?? useObserver;
      compare = options?.compare ?? compare;
      behavior = options?.behavior ?? behavior;
      debounce = options?.debounce ?? debounce;

      applyScroll();
      subscribeStores();
    },
    destroy: () => disconnect(),
  };
}

/**
 * Scrolls an element to the bottom.
 * @param {HTMLElement} element
 * @param {ScrollOptions} options
 * @returns {AutoScrollInstance}
 */
export function bottomScroll(element: HTMLElement, options: ScrollOptions = {}): AutoScrollInstance {
  const instance = autoscroll(element, { ...options, direction: ScrollDirection.BOTTOM });
  return {
    update: (newOptions: ScrollOptions = {}) => {
      instance.update({ ...newOptions, direction: ScrollDirection.BOTTOM });
    },
    destroy: () => {
      instance.destroy();
    },
  };
}

/**
 * Scrolls an element to the top.
 * @param {HTMLElement} element
 * @param {ScrollOptions} options
 * @returns {AutoScrollInstance}
 */
export function topScroll(element: HTMLElement, options: ScrollOptions = {}): AutoScrollInstance {
  const instance = autoscroll(element, { ...options, direction: ScrollDirection.TOP });

  return {
    update: (newOptions: ScrollOptions = {}) => {
      instance.update({ ...newOptions, direction: ScrollDirection.TOP });
    },
    destroy: () => {
      instance.destroy();
    },
  };
}

export type ViewportResizeInstance = {
  update: (enabled: boolean) => void;
  destroy: () => void;
};

/**
 * Automatically scrolls the viewport when the virtual keyboard is opened.
 * @param {HTMLElement} element
 * @param {boolean} enabled
 * @returns {ViewportResizeInstance}
 */
export function viewportResize(element: HTMLElement, enabled: boolean): ViewportResizeInstance {
  let textarea: HTMLTextAreaElement | null = null;

  function handleViewportResize() {
    if (!enabled) return;

    if (!textarea) {
      textarea = element.querySelector('textarea');
    }

    if (textarea) {
      setTimeout(() => {
        textarea?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }

  function handleViewportScroll() {
    if (!enabled) return;
    const { pageTop } = visualViewport || { pageTop: 0 };
    const height = Math.round(pageTop);
    document.documentElement.style.setProperty('--keyboard-height', `${height}px`);
  }

  if (enabled) {
    visualViewport?.addEventListener('resize', handleViewportResize);
    visualViewport?.addEventListener('scroll', handleViewportScroll);
  }

  return {
    update: (newEnabled: boolean) => {
      visualViewport?.removeEventListener('resize', handleViewportResize);
      visualViewport?.removeEventListener('scroll', handleViewportScroll);

      enabled = newEnabled;

      if (enabled) {
        visualViewport?.addEventListener('resize', handleViewportResize);
        visualViewport?.addEventListener('scroll', handleViewportScroll);
      }
    },
    destroy: () => {
      document.documentElement.style.removeProperty('--keyboard-height');
      visualViewport?.removeEventListener('resize', handleViewportResize);
      visualViewport?.removeEventListener('scroll', handleViewportScroll);
    },
  };
}

export type StayVisibleInstance = {
  update: (enabled: boolean) => void;
};

/**
 * Keeps an element visible when the virtual keyboard is opened.
 * @param {HTMLElement} element
 * @param {boolean} enabled
 * @returns {StayVisibleInstance}
 */
export function stayVisible(element: HTMLElement, enabled: boolean): StayVisibleInstance {
  function scrollIntoView() {
    if (!enabled || element.classList.contains('always-visible')) return;

    setTimeout(() => {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('always-visible');
    }, 500);
  }

  scrollIntoView();

  return {
    update: (newEnabled: boolean) => {
      enabled = newEnabled;

      if (enabled) {
        scrollIntoView();
      } else {
        element.classList.remove('always-visible');
      }
    },
  };
}
