export const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
export const MAX_PHOTO_PIXELS = 25_000_000;
export const PHOTO_EDGE = 1536;
const formats = new Set(['image/jpeg', 'image/png', 'image/webp']);

export function getPhotoFileError(file: File): string | null {
  if (!formats.has(file.type))
    return 'Choose a JPG, PNG or WebP image. HEIC and HEIF photos are not supported; export your photo as JPG first.';
  if (file.size > MAX_PHOTO_BYTES) return 'Choose a photo smaller than 10 MB.';
  if (file.size === 0) return 'This file is empty. Choose another photo.';
  return null;
}

function toBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(
              new Error(
                'The photo could not be prepared. Try another JPG, PNG or WebP.',
              ),
            ),
      'image/jpeg',
      0.9,
    ),
  );
}

export async function prepareLocalPhoto(file: File): Promise<Blob> {
  const error = getPhotoFileError(file);
  if (error) throw new Error(error);
  const source = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = source;
    await image.decode();
    const width = image.naturalWidth,
      height = image.naturalHeight;
    if (!width || !height)
      throw new Error(
        'This photo has no usable image dimensions. Choose another photo.',
      );
    if (width * height > MAX_PHOTO_PIXELS)
      throw new Error('Choose a photo with no more than 25 megapixels.');
    const scale = Math.min(1, PHOTO_EDGE / Math.max(width, height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const context = canvas.getContext('2d');
    if (!context)
      throw new Error(
        'Photo preparation is unavailable in this browser. You can continue without a photo.',
      );
    context.fillStyle = '#faf7f1';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return await toBlob(canvas);
  } catch (cause) {
    if (cause instanceof Error && !(cause instanceof DOMException)) throw cause;
    throw new Error(
      'This image could not be opened. Use a valid JPG, PNG or WebP; HEIC photos must be exported as JPG first.',
    );
  } finally {
    URL.revokeObjectURL(source);
  }
}

export async function captureVideoPhoto(
  video: HTMLVideoElement,
): Promise<Blob> {
  if (!video.videoWidth || !video.videoHeight)
    throw new Error(
      'The camera is not ready yet. Please wait or choose a photo instead.',
    );
  const scale = Math.min(
    1,
    PHOTO_EDGE / Math.max(video.videoWidth, video.videoHeight),
  );
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
  canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
  const context = canvas.getContext('2d');
  if (!context)
    throw new Error('Camera capture is unavailable. Choose a photo instead.');
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  return toBlob(canvas);
}
