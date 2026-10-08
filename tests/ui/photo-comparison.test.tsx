import React, { createRef } from 'react';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from 'vitest';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import {
  PhotoComparison,
  type PhotoComparisonHandle,
} from '@/components/photo-comparison';
import {
  prepareLocalPhoto,
  captureVideoPhoto,
  getPhotoFileError,
  MAX_PHOTO_BYTES,
} from '@/features/colour-analysis/photo';
vi.mock('@/features/colour-analysis/photo', async () => {
  const actual = await vi.importActual<
    typeof import('@/features/colour-analysis/photo')
  >('@/features/colour-analysis/photo');
  return { ...actual, prepareLocalPhoto: vi.fn(), captureVideoPhoto: vi.fn() };
});
const OriginalURL = globalThis.URL;
let revoke: Mock<(url: string) => void>,
  create: Mock<(blob: Blob | MediaSource) => string>,
  getMedia: Mock<() => Promise<MediaStream>>;
beforeEach(() => {
  revoke = vi.fn();
  create = vi.fn(() => 'blob:local-photo');
  getMedia = vi.fn();
  vi.stubGlobal(
    'URL',
    class extends OriginalURL {
      static createObjectURL(blob: Blob | MediaSource): string {
        return create(blob) as string;
      }
      static revokeObjectURL(url: string): void {
        revoke(url);
      }
    },
  );
  Object.defineProperty(navigator, 'mediaDevices', {
    configurable: true,
    value: { getUserMedia: getMedia },
  });
  vi.mocked(prepareLocalPhoto).mockReset();
  vi.mocked(prepareLocalPhoto).mockResolvedValue(
    new Blob(['local'], { type: 'image/jpeg' }),
  );
  vi.mocked(captureVideoPhoto).mockReset();
  vi.mocked(captureVideoPhoto).mockResolvedValue(
    new Blob(['capture'], { type: 'image/jpeg' }),
  );
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
function selectFile() {
  fireEvent.change(
    screen.getByLabelText('Choose a local JPG, PNG or WebP photo'),
    {
      target: {
        files: [new File(['photo'], 'portrait.jpg', { type: 'image/jpeg' })],
      },
    },
  );
}
describe('local photo comparison', () => {
  it('reuses the same local photo across questions and clears it through the exposed handle', async () => {
    const ref = createRef<PhotoComparisonHandle>();
    const view = render(<PhotoComparison ref={ref} questionId="temperature" />);
    selectFile();
    await screen.findByRole('button', { name: 'Remove photo' });
    expect(screen.getAllByRole('img')).toHaveLength(2);
    expect(create).toHaveBeenCalledTimes(1);
    view.rerender(<PhotoComparison ref={ref} questionId="depth" />);
    expect(screen.getAllByRole('img')).toHaveLength(3);
    expect(create).toHaveBeenCalledTimes(1);
    fireEvent.change(screen.getByLabelText('Photo zoom'), {
      target: { value: '1.5' },
    });
    expect(screen.getAllByRole('img')[0]).toHaveStyle({
      transform: 'translate(0%,0%) scale(1.5)',
    });
    act(() => ref.current?.clear());
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(revoke).toHaveBeenCalledWith('blob:local-photo');
  });
  it('keeps the original questionnaire optional when a file is rejected', async () => {
    vi.mocked(prepareLocalPhoto).mockRejectedValue(
      new Error('Choose a photo smaller than 10 MB.'),
    );
    render(<PhotoComparison questionId="chroma" />);
    selectFile();
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'smaller than 10 MB',
    );
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText(/You can skip the photo/)).toBeInTheDocument();
  });
  it('reports an unavailable camera without trapping the visitor', () => {
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: undefined,
    });
    render(<PhotoComparison questionId="temperature" />);
    fireEvent.click(screen.getByRole('button', { name: 'Use front camera' }));
    expect(screen.getByRole('alert')).toHaveTextContent('unavailable');
    expect(
      screen.queryByRole('button', { name: 'Capture photo' }),
    ).not.toBeInTheDocument();
  });
  it('reports declined permission and keeps file selection available', async () => {
    getMedia.mockRejectedValue(new DOMException('denied', 'NotAllowedError'));
    render(<PhotoComparison questionId="temperature" />);
    fireEvent.click(screen.getByRole('button', { name: 'Use front camera' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'permission was declined',
    );
    expect(
      screen.getByLabelText('Choose a local JPG, PNG or WebP photo'),
    ).toBeInTheDocument();
  });
  it('stops a late permission result after the visitor cancels', async () => {
    let resolve!: (stream: MediaStream) => void;
    getMedia.mockImplementation(
      () =>
        new Promise<MediaStream>((r) => {
          resolve = r;
        }),
    );
    const stop = vi.fn();
    render(<PhotoComparison questionId="temperature" />);
    fireEvent.click(screen.getByRole('button', { name: 'Use front camera' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel camera' }));
    await act(async () =>
      resolve({ getTracks: () => [{ stop }] } as unknown as MediaStream),
    );
    expect(stop).toHaveBeenCalledOnce();
    expect(
      screen.queryByRole('button', { name: 'Capture photo' }),
    ).not.toBeInTheDocument();
  });
  it('stops all camera tracks after capturing and revokes the photo on unmount', async () => {
    const stop = vi.fn();
    getMedia.mockResolvedValue({
      getTracks: () => [{ stop }],
    } as unknown as MediaStream);
    const view = render(<PhotoComparison questionId="temperature" />);
    fireEvent.click(screen.getByRole('button', { name: 'Use front camera' }));
    await waitFor(() => expect(getMedia).toHaveBeenCalled());
    await waitFor(() =>
      expect(screen.queryByRole('status')).not.toBeInTheDocument(),
    );
    const video = document.querySelector('video')!;
    Object.defineProperty(video, 'videoWidth', { value: 640 });
    fireEvent.loadedMetadata(video);
    fireEvent.click(screen.getByRole('button', { name: 'Capture photo' }));
    await screen.findByRole('button', { name: 'Remove photo' });
    expect(stop).toHaveBeenCalledOnce();
    expect(getMedia).toHaveBeenCalledWith({
      audio: false,
      video: { facingMode: { ideal: 'user' } },
    });
    view.unmount();
    expect(revoke).toHaveBeenCalledWith('blob:local-photo');
  });
  it('stops camera when the question changes', async () => {
    const stop = vi.fn();
    getMedia.mockResolvedValue({
      getTracks: () => [{ stop }],
    } as unknown as MediaStream);
    const view = render(<PhotoComparison questionId="temperature" />);
    fireEvent.click(screen.getByRole('button', { name: 'Use front camera' }));
    await waitFor(() =>
      expect(screen.queryByRole('status')).not.toBeInTheDocument(),
    );
    view.rerender(<PhotoComparison questionId="depth" />);
    expect(stop).toHaveBeenCalledOnce();
  });
  it('stops camera when hidden and clears the photo on pagehide', async () => {
    const stop = vi.fn();
    getMedia.mockResolvedValue({
      getTracks: () => [{ stop }],
    } as unknown as MediaStream);
    render(<PhotoComparison questionId="temperature" />);
    fireEvent.click(screen.getByRole('button', { name: 'Use front camera' }));
    await waitFor(() =>
      expect(screen.queryByRole('status')).not.toBeInTheDocument(),
    );
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      value: 'hidden',
    });
    fireEvent(document, new Event('visibilitychange'));
    expect(stop).toHaveBeenCalledOnce();
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      value: 'visible',
    });
    selectFile();
    await screen.findByRole('button', { name: 'Remove photo' });
    fireEvent(window, new Event('pagehide'));
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(revoke).toHaveBeenCalledWith('blob:local-photo');
  });
  it('validates permitted formats, empty files and size boundaries', () => {
    expect(
      getPhotoFileError(new File(['x'], 'camera.heic', { type: 'image/heic' })),
    ).toContain('HEIC');
    expect(
      getPhotoFileError(new File([], 'empty.jpg', { type: 'image/jpeg' })),
    ).toContain('empty');
    expect(getPhotoFileError(new File(['x'], 'photo.webp'))).toBeNull();
    expect(getPhotoFileError(new File(['x'], 'photo.exe'))).toContain('JPG');
    const tooLarge = new File(['x'], 'large.jpg', { type: 'image/jpeg' });
    Object.defineProperty(tooLarge, 'size', { value: MAX_PHOTO_BYTES + 1 });
    expect(getPhotoFileError(tooLarge)).toContain('10 MB');
    expect(
      getPhotoFileError(new File(['x'], 'ok.webp', { type: 'image/webp' })),
    ).toBeNull();
  });
});
