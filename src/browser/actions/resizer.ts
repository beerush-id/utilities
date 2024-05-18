export type TextAreaFitInstance = {
  update: () => void;
  destroy: () => void;
};

/**
 * Auto resize textarea height based on content.
 * @param {HTMLTextAreaElement} element
 * @param {boolean} autofocus
 * @returns {TextAreaFitInstance}
 */
export function textareaFit(element: HTMLTextAreaElement, autofocus?: boolean): TextAreaFitInstance {
  function resize() {
    element.style.height = 'auto';
    const height = element.scrollHeight + 2;
    element.style.height = `${height}px`;
  }

  function update() {
    resize();
  }

  function destroy() {
    element?.removeEventListener('input', resize);
    element?.removeEventListener('focus', resize);
  }

  element?.addEventListener('input', resize);
  element?.addEventListener('focus', resize);
  resize();

  if (autofocus) {
    setTimeout(() => {
      element?.focus();
    }, 100);
  }

  return {
    update,
    destroy,
  };
}

export type AutofocusInstance = {
  update: (status?: boolean) => void;
  destroy: () => void;
};

/**
 * Auto focus an element.
 * @param {HTMLElement} element
 * @param {boolean} enabled
 * @returns {AutofocusInstance}
 */
export function autofocus(element: HTMLElement, enabled?: boolean): AutofocusInstance {
  const focus = () => {
    if (!enabled) return;

    setTimeout(() => {
      element?.focus();
    }, 200);
  };

  focus();

  return {
    update: (status?: boolean) => {
      enabled = status;
      focus();
    },
    destroy: () => undefined,
  };
}
