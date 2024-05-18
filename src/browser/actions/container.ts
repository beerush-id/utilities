export type ContainerQuery = {
  maxWidth?: number;
  maxHeight?: number;
  minWidth?: number;
  minHeight?: number;
  orientation?: 'portrait' | 'landscape';
};

export type StyleDeclaration = Partial<CSSStyleDeclaration> & {
  [key: `-${string}`]: string;
};
export type Styler = StyleDeclaration | ((e: QueryEvent) => StyleDeclaration);

export type ContainerOptions = {
  query: ContainerQuery;
  style: Styler;
  differs?: Styler;
  container?: HTMLElement | undefined | null;
  noReset?: boolean;
  callback?: (e: QueryEvent) => void;
};

export type ContainerInstance = {
  update: (newOptions: Partial<ContainerOptions>) => void;
  destroy: () => void;
};

/**
 * Container query.
 * @param {HTMLElement} element
 * @param {ContainerOptions} options
 * @returns {ContainerInstance}
 */
export function container(element: HTMLElement, options: ContainerOptions): ContainerInstance {
  const parent = (options.container ?? element.parentElement) as HTMLElement;
  const matcher = matchContainer(parent, options.query);

  let recentEvent: QueryEvent;
  const handleQuery = (e: QueryEvent) => {
    recentEvent = e;
    const style = typeof options.style === 'function' ? options.style(e) : options.style;

    if (e.matches) {
      options?.callback?.(e);

      if (options.differs) {
        const differs = typeof options.differs === 'function' ? options.differs(e) : options.differs;

        for (const [key] of Object.entries(differs)) {
          if (key.includes('-')) {
            element.style.removeProperty(key);
          } else {
            element.style[key as never] = '';
          }
        }
      }

      for (const [key, value] of Object.entries(style)) {
        if (key.includes('-')) {
          element.style.setProperty(key, value as string);
        } else {
          element.style[key as never] = value as never;
        }
      }
    } else {
      if (!options?.noReset) {
        for (const [key] of Object.entries(style)) {
          if (key.includes('-')) {
            element.style.removeProperty(key);
          } else {
            element.style[key as never] = '';
          }
        }
      }

      if (options.differs) {
        const differs = typeof options.differs === 'function' ? options.differs(e) : options.differs;

        for (const [key, value] of Object.entries(differs)) {
          if (key.includes('-')) {
            element.style.setProperty(key, value as string);
          } else {
            element.style[key as never] = value as never;
          }
        }
      }
    }
  };

  let unsubscribe = matcher.subscribe(handleQuery);

  return {
    update(newOptions: Partial<ContainerOptions>) {
      options = { ...options, ...newOptions };

      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }

      matcher.update(options.query, options.container);
      unsubscribe = matcher.subscribe(handleQuery);

      if (recentEvent) {
        handleQuery(recentEvent);
      }
    },
    destroy() {
      unsubscribe();
      matcher.destroy();
    },
  };
}

export type QueryEvent = {
  matches: boolean;
  target: HTMLElement;
  query: ContainerQuery;
};

export type MatchContainerInstance = {
  update: (query: ContainerQuery, container?: HTMLElement | null) => void;
  destroy: () => void;
  subscribe: (callback: (e: QueryEvent) => void) => () => void;
};

/**
 * Match container query.
 * @param {HTMLElement} container
 * @param {ContainerQuery} query
 * @returns {MatchContainerInstance}
 */
export function matchContainer(container: HTMLElement, query: ContainerQuery): MatchContainerInstance {
  const subscribers = new Set<(e: QueryEvent) => void>();

  const handleResize = () => {
    requestAnimationFrame(() => {
      const { width, height } = container.getBoundingClientRect();

      let matches = true;

      if ('maxWidth' in query && width >= (query.maxWidth || 0)) {
        matches = false;
      }

      if ('maxHeight' in query && height >= (query.maxHeight || 0)) {
        matches = false;
      }

      if ('minWidth' in query && width <= (query.minWidth || 0)) {
        matches = false;
      }

      if ('minHeight' in query && height <= (query.minHeight || 0)) {
        matches = false;
      }

      if ('orientation' in query) {
        const deviceOrientation = window.matchMedia('(orientation: landscape)').matches ? 'landscape' : 'portrait';
        const orientation = width > height ? 'landscape' : 'portrait';

        if (orientation !== query.orientation && deviceOrientation !== query.orientation) {
          matches = false;
        }
      }

      subscribers.forEach((callback) => callback({ matches, query, target: container }));
    });
  };

  const observer = new ResizeObserver(handleResize);

  observer.observe(document.body);

  return {
    update(newQuery: ContainerQuery, newContainer?: HTMLElement | null) {
      query = { ...query, ...newQuery };

      if (newContainer && newContainer !== container) {
        observer.unobserve(document.body);

        container = newContainer;
        observer.observe(document.body);
      }
    },
    destroy() {
      observer.disconnect();
    },
    subscribe(callback: (e: QueryEvent) => void) {
      subscribers.add(callback);
      return () => subscribers.delete(callback);
    },
  };
}

export enum MatchMediaEventType {
  MATCH = 'matchmedia',
}

export type MatchMediaOptions = {
  query: string;
  callback: (e: MediaQueryListEvent) => void;
};

export type MatchMediaInstance = {
  update: (newOptions: MatchMediaOptions) => void;
  destroy: () => void;
};

/**
 * Match media query for an element.
 * @param {HTMLElement} element
 * @param {MatchMediaOptions} options
 * @returns {MatchMediaInstance}
 */
export function matchMedia(element: HTMLElement, options: MatchMediaOptions): MatchMediaInstance {
  let { query, callback } = options;
  const matcher = matchMediaQuery(query);

  const unsubscribe = matcher.subscribe((e) => {
    element.dispatchEvent(new CustomEvent(MatchMediaEventType.MATCH, { detail: e }));
    callback?.(e);
  });

  return {
    update(newOptions: MatchMediaOptions) {
      query = newOptions?.query ?? query;
      callback = newOptions?.callback ?? callback;
      matcher.update(query);
    },
    destroy() {
      unsubscribe();
    },
  };
}

const matchMediaCache = new Map<string, MediaQueryList>();

export type MatchMediaQueryInstance = {
  update: (query: string) => void;
  destroy: () => void;
  subscribe: (callback: (e: MediaQueryListEvent) => void) => () => void;
};

/**
 * Match media query.
 * @param {string} query
 * @returns {MatchMediaQueryInstance}
 */
export function matchMediaQuery(query: string): MatchMediaQueryInstance {
  const subscribers = new Set<(e: MediaQueryListEvent) => void>();

  const handleQuery = (e: MediaQueryListEvent) => {
    if (e.matches) {
      subscribers.forEach((callback) => callback(e));
    }
  };

  let mediaQuery = matchMediaCache.get(query) as MediaQueryList;
  if (!mediaQuery) {
    mediaQuery = window.matchMedia(query);
    matchMediaCache.set(query, mediaQuery);
  }

  mediaQuery.addEventListener('change', handleQuery);

  return {
    update(newQuery: string) {
      query = newQuery;

      mediaQuery.removeEventListener('change', handleQuery);

      mediaQuery = window.matchMedia(query);
      matchMediaCache.set(query, mediaQuery);
      mediaQuery.addEventListener('change', handleQuery);
    },
    destroy() {
      mediaQuery.removeEventListener('change', handleQuery);
    },
    subscribe(callback: (e: MediaQueryListEvent) => void) {
      if (mediaQuery.matches) {
        callback(mediaQuery as never);
      }

      subscribers.add(callback);

      return () => {
        subscribers.delete(callback);

        if (!subscribers.size) {
          mediaQuery.removeEventListener('change', handleQuery);
        }
      };
    },
  };
}
