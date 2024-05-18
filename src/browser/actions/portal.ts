export type PortalInstance = {
  update(newTarget?: string | HTMLElement): void;
  destroy(): void;
};

/**
 * Teleports an element to a new target.
 * @param {HTMLElement} element
 * @param {string | HTMLElement} target
 * @returns {PortalInstance}
 */
export function portal(element: HTMLElement, target?: string | HTMLElement): PortalInstance {
  const parent = element.parentElement;
  let teleported = false;

  const teleport = () => {
    if (target) {
      const new_target = typeof target === 'string' ? document.querySelector(target) : target;

      if (new_target && new_target !== parent) {
        new_target.appendChild(element);
        teleported = true;
      }
    } else if (parent && teleported) {
      parent.appendChild(element);
    }
  };

  if (target) {
    teleport();
  }

  return {
    update(newTarget?: string | HTMLElement) {
      target = newTarget;
      teleport();
    },
    destroy() {
      element.remove();
    },
  };
}
