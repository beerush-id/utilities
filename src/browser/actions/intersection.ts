export type IntersectionObserverCallback = (entry: IntersectionObserverEntry) => void;

export enum IntersectionEventType {
  INTERSECTION = 'intersection',
  ENTER = 'intersectionenter',
  EXIT = 'intersectionexit',
}

export type Intersection = CustomEvent<IntersectionObserverEntry>;
export type IntersectionEnter = CustomEvent<IntersectionObserverEntry>;
export type IntersectionExit = CustomEvent<IntersectionObserverEntry>;

export type CustomIntersectionObserver = {
  observe: (element: HTMLElement, callback: IntersectionObserverCallback) => void;
  unobserve: (element: HTMLElement) => void;
  callback?: (e: Intersection | IntersectionEnter | IntersectionExit) => void;
};

export function createIntersectionObserver(
  options?: IntersectionObserverInit,
  callback?: (e: CustomEvent<IntersectionObserverEntry>) => void
): CustomIntersectionObserver {
  if (typeof window === 'undefined') {
    return {
      observe: () => undefined,
      unobserve: () => undefined,
    };
  }

  const observerOptions = {
    threshold: 25 / 100,
    ...options,
  };

  const subscribers = new Map<HTMLElement, (entry: IntersectionObserverEntry) => void>();

  const observer = new IntersectionObserver((entries) => {
    for (const [element, callback] of subscribers.entries()) {
      const entry = entries.find((entry) => entry.target === element);
      if (entry) callback(entry);
    }
  }, observerOptions);

  return {
    observe: (element: HTMLElement, callback: IntersectionObserverCallback) => {
      subscribers.set(element, callback);
      observer.observe(element);
    },
    unobserve: (element: HTMLElement) => {
      subscribers.delete(element);
      observer.unobserve(element);
    },
    callback,
  };
}

export type IntersectionInstance = {
  update: (newObserver: CustomIntersectionObserver) => void;
  destroy: () => void;
};

/**
 * Attach an intersection observer to an element.
 * @param {HTMLElement} element
 * @param {CustomIntersectionObserver} observer
 * @returns {IntersectionInstance}
 */
export function intersection(element: HTMLElement, observer?: CustomIntersectionObserver): IntersectionInstance {
  let currentObserver: CustomIntersectionObserver;

  const observe = (newObserver?: CustomIntersectionObserver) => {
    if (currentObserver) currentObserver.unobserve(element);

    if (newObserver) {
      currentObserver = newObserver;
      currentObserver.observe(element, (entry) => {
        const interEvent = new CustomEvent(IntersectionEventType.INTERSECTION, {
          detail: entry,
        });
        element.dispatchEvent(interEvent);
        observer?.callback?.(interEvent);

        if (entry.isIntersecting) {
          const enterEvent = new CustomEvent(IntersectionEventType.ENTER, {
            detail: entry,
          });
          element.dispatchEvent(enterEvent);
          observer?.callback?.(enterEvent);
        } else {
          const exitEvent = new CustomEvent(IntersectionEventType.EXIT, {
            detail: entry,
          });
          element.dispatchEvent(exitEvent);
          observer?.callback?.(exitEvent);
        }
      });
    }
  };

  observe(observer);

  return {
    update: (newObserver: CustomIntersectionObserver) => {
      observe(newObserver);
    },
    destroy: () => {
      currentObserver?.unobserve(element);
    },
  };
}
