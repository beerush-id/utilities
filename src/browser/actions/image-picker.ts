export enum ImagePickerEventType {
  SELECT = 'imageselect',
  LOAD = 'imageload',
  ERROR = 'imageerror',
}

export type UploadOptions = {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxWidth?: number;
  maxHeight?: number;
};

export type ImageLoadEvent = CustomEvent<{
  file: File;
  dataURI: string;
}>;

export type ImageSelectEvent = CustomEvent<{
  files: FileList | null;
}>;

export type ImageUploadInstance = {
  update: (options: UploadOptions) => void;
  destroy: () => void;
};

/**
 * Attach an image upload event to an element.
 * @param {HTMLElement} element
 * @param {UploadOptions} options
 * @returns {ImageUploadInstance}
 */
export function imagePicker(element: HTMLElement, options?: UploadOptions): ImageUploadInstance {
  const selectFile = () => {
    const input = document.createElement('input');

    input.type = 'file';
    input.accept = options?.accept ?? 'image/*';
    input.multiple = options?.multiple ?? false;
    input.onchange = async () => {
      const file = input.files?.item(0);

      element.dispatchEvent(new CustomEvent(ImagePickerEventType.SELECT, { detail: { files: input.files } }));

      if (file) {
        const result = await loadImageFile(file);

        if (options?.maxSize && result.size > options.maxSize) {
          element.dispatchEvent(
            new CustomEvent(ImagePickerEventType.ERROR, {
              detail: {
                file,
                error: 'File is too large',
              },
            })
          );

          return;
        }

        if (options?.maxWidth && result.width > options.maxWidth) {
          element.dispatchEvent(
            new CustomEvent(ImagePickerEventType.ERROR, {
              detail: {
                file,
                error: 'Image width is too large',
              },
            })
          );

          return;
        }

        if (options?.maxHeight && result.height > options.maxHeight) {
          element.dispatchEvent(
            new CustomEvent(ImagePickerEventType.ERROR, {
              detail: {
                file,
                error: 'Image height is too large',
              },
            })
          );

          return;
        }

        element.dispatchEvent(
          new CustomEvent(ImagePickerEventType.LOAD, {
            detail: {
              file,
              dataURI: result.image,
            },
          })
        );
      }
    };

    input.click();
  };

  element?.addEventListener('click', selectFile);

  return {
    update: (newOptions: UploadOptions) => {
      options = newOptions;
    },
    destroy: () => {
      element?.removeEventListener('click', selectFile);
    },
  };
}

export const loadImageFile = (file: File) => {
  return new Promise<{ width: number; height: number; size: number; image: string }>((resolve) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const { width, height } = await getImageSize(reader.result as string);
      resolve({ width, height, size: file.size, image: reader.result as string });
    };
    reader.readAsDataURL(file);
  });
};

export const getImageSize = (image: string) => {
  return new Promise<{ width: number; height: number }>((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.src = image;
  });
};
