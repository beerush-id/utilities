import { logger as defaultLogger } from '../../logger.js';

const logger = defaultLogger.create({
  tags: ['autoplay'],
});

export type AutoplayOptions = {
  enabled?: boolean;
  behavior?: 'auto' | 'hover';
};

export type AutoplayInstance = {
  update: (options: AutoplayOptions) => void;
  destroy: () => void;
};

/**
 * Autoplay video with hover or auto behavior.
 * @param {HTMLVideoElement} video
 * @param {AutoplayOptions} options
 * @returns {AutoplayInstance}
 */
export function autoplay(video: HTMLVideoElement, options: AutoplayOptions): AutoplayInstance {
  let { enabled = false, behavior = 'auto' } = options ?? {};

  let removed = false;
  let stopped = false;

  const setPlayState = (playing = true) => {
    if (removed || !enabled) return;

    if (playing) {
      video.dispatchEvent(new Event('play'));
      video
        .play()
        .then(() => {
          stopped = false;
          video.classList.remove('opacity-0');
        })
        .catch((error) => {
          if (stopped) return;
          logger.warn('Error playing video:', error);
        });
    } else {
      stopped = true;
      video.pause();
      video.classList.add('opacity-0');
      video.dispatchEvent(new Event('pause'));
    }
  };

  const play = () => {
    setPlayState(true);
  };

  const pause = () => {
    setPlayState(false);
  };

  if (behavior === 'hover') {
    video.parentElement?.addEventListener('mouseenter', play);
    video.parentElement?.addEventListener('mouseleave', pause);
  } else {
    setPlayState(true);
  }

  return {
    update: (newOptions: AutoplayOptions) => {
      if (newOptions.enabled === enabled && newOptions.behavior === behavior) return;

      options = newOptions;
      enabled = newOptions.enabled ?? enabled;
      behavior = newOptions.behavior ?? behavior;

      video.parentElement?.removeEventListener('mouseenter', play);
      video.parentElement?.removeEventListener('mouseleave', pause);

      if (behavior === 'hover') {
        video.parentElement?.addEventListener('mouseenter', play);
        video.parentElement?.addEventListener('mouseleave', pause);
      } else {
        setPlayState(true);
      }
    },
    destroy: () => {
      removed = true;
    },
  };
}
