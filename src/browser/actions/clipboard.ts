export enum ClipboardEventType {
  COPY = 'copy',
}

export type ClipboardInstance = {
  update: (newText?: string) => string | undefined;
  destroy: () => void;
};

/**
 * Copy text to clipboard when the element is clicked.
 * @param {HTMLElement} element
 * @param {string} text
 * @returns {{update: (newText?: string) => string | undefined, destroy: () => void}}
 */
export function clipboard(element: HTMLElement, text?: string): ClipboardInstance {
  const copy = async () => {
    if (!text) return;
    await copyToClipboard(text);
    element.dispatchEvent(new CustomEvent(ClipboardEventType.COPY, { detail: { text } }));
  };

  element?.addEventListener('click', copy);

  return {
    update: (newText?: string) => (text = newText),
    destroy: () => element?.removeEventListener('click', copy),
  };
}

/**
 * Copy text to clipboard.
 * @param {string} text
 * @returns {Promise<void>}
 */
clipboard.copy = async (text: string): Promise<void> => {
  await copyToClipboard(text);
};

/**
 * Copy text to clipboard. If the browser does not support the Clipboard API, it will fallback to using a textarea.
 * @param {string} text
 * @returns {Promise<void>}
 */
export async function copyToClipboard(text: string): Promise<void> {
  if (!text) return;

  if ('clipboard' in navigator) {
    await navigator.clipboard.writeText(text);
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = text;

    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}
