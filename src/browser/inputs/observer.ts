const WATCHED_INPUTS = ['INPUT', 'TEXTAREA'];

export type ObserverOptions = {
  root?: HTMLElement;
  focusClass?: string;
  filledClass?: string;
  checkedClass?: string;
  indeterminateClass?: string;
};

export type InputObserverInstance = {
  nodes: Set<HTMLElement>;
  observe: () => void;
  destroy: () => void;
};

/**
 * Create an observer to watch input elements and apply classes based on their state.
 * @param {ObserverOptions} options
 * @returns {InputObserverInstance}
 */
export function createInputObserver(options?: ObserverOptions): InputObserverInstance {
  const {
    focusClass = 'focus',
    filledClass = 'filled',
    checkedClass = 'checked',
    indeterminateClass = 'indeterminate',
  } = options ?? {};

  const watchedNodes = new Set<HTMLElement>();

  const handleMutations = (mutations: MutationRecord[]) => {
    mutations.forEach((mutation) => {
      handleAddedNodes(mutation.addedNodes);
      handleRemovedNodes(mutation.removedNodes);
    });
  };

  const handleAddedNodes = (nodes: NodeList) => {
    nodes.forEach((node) => {
      if (node instanceof HTMLElement && WATCHED_INPUTS.includes(node.tagName)) {
        watchInput(node as HTMLInputElement);
        watchedNodes.add(node);
      }
    });
  };

  const handleRemovedNodes = (nodes: NodeList) => {
    nodes.forEach((node) => {
      if (node instanceof HTMLElement && WATCHED_INPUTS.includes(node.tagName)) {
        unwatchInput(node as HTMLInputElement);
        watchedNodes.delete(node);
      }
    });
  };

  const watchInput = (input: HTMLInputElement) => {
    input.addEventListener('input', handleInput);
    input.addEventListener('focus', () => handleFocusBlur(input, focusClass, true));
    input.addEventListener('blur', () => handleFocusBlur(input, focusClass, false));
  };

  const unwatchInput = (input: HTMLInputElement) => {
    input.removeEventListener('input', handleInput);
    input.removeEventListener('focus', () => handleFocusBlur(input, focusClass, true));
    input.removeEventListener('blur', () => handleFocusBlur(input, focusClass, false));
  };

  const handleInput = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const parent = input.parentElement;
    const isCheckboxOrRadio = input.type === 'checkbox' || input.type === 'radio';

    if (isCheckboxOrRadio) {
      parent?.classList.toggle(checkedClass, input.checked);
      parent?.classList.toggle(indeterminateClass, input.indeterminate);
    } else {
      parent?.classList.toggle(filledClass, Boolean(input.value));
    }
  };

  const handleFocusBlur = (input: HTMLInputElement, className: string, isFocus: boolean) => {
    input.parentElement?.classList.toggle(className, isFocus);
  };

  const observer: MutationObserver = new MutationObserver(handleMutations);
  const observe = () => {
    observer.observe(options?.root ?? document.body, {
      childList: true,
      subtree: true,
    });

    document.querySelectorAll<HTMLElement>(WATCHED_INPUTS.map((t) => t.toLowerCase()).join(',')).forEach((element) => {
      watchedNodes.add(element);
      watchInput(element as HTMLInputElement);
    });
  };

  const destroy = () => {
    observer.disconnect();
    watchedNodes.forEach((element) => {
      unwatchInput(element as HTMLInputElement);
    });
  };

  return {
    nodes: watchedNodes,
    observe,
    destroy,
  } as InputObserverInstance;
}
