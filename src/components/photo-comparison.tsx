'use client';
/* eslint-disable @next/next/no-img-element -- Device-local blob URLs use the native image element and never reach an image server. */
/* A local image is an optional visual aid. It never selects or scores an answer. */
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { getComparisonSets } from '@/features/colour-analysis/comparisons';
import {
  captureVideoPhoto,
  prepareLocalPhoto,
} from '@/features/colour-analysis/photo';

export type PhotoComparisonHandle = { clear: () => void };
export type PhotoComparisonProps = {
  questionId: string | null;
  onPhotoClear?: () => void;
  onContinueWithoutPhoto?: () => void;
};
export const PhotoComparison = forwardRef<
  PhotoComparisonHandle,
  PhotoComparisonProps
>(function PhotoComparison(
  { questionId, onPhotoClear, onContinueWithoutPhoto },
  ref,
) {
  const [photo, setPhoto] = useState<string | null>(null),
    [error, setError] = useState(''),
    [cameraOpen, setCameraOpen] = useState(false),
    [ready, setReady] = useState(false),
    [busy, setBusy] = useState(false);
  const [x, setX] = useState(0),
    [y, setY] = useState(0),
    [zoom, setZoom] = useState(1),
    [setIndex, setSetIndex] = useState(0),
    [sampleIndex, setSampleIndex] = useState(0);
  const video = useRef<HTMLVideoElement>(null),
    stream = useRef<MediaStream | null>(null),
    photoUrl = useRef<string | null>(null),
    generation = useRef(0),
    mounted = useRef(false),
    fileInput = useRef<HTMLInputElement>(null);
  const stopCamera = useCallback((update = true) => {
    generation.current++;
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
    if (video.current) video.current.srcObject = null;
    if (update && mounted.current) {
      setCameraOpen(false);
      setReady(false);
      setBusy(false);
    }
  }, []);
  const replacePhoto = useCallback((blob: Blob) => {
    if (photoUrl.current) URL.revokeObjectURL(photoUrl.current);
    const url = URL.createObjectURL(blob);
    photoUrl.current = url;
    setPhoto(url);
    setX(0);
    setY(0);
    setZoom(1);
    setError('');
  }, []);
  const clear = useCallback(() => {
    stopCamera();
    if (photoUrl.current) URL.revokeObjectURL(photoUrl.current);
    photoUrl.current = null;
    if (mounted.current) {
      setPhoto(null);
      setError('');
      setX(0);
      setY(0);
      setZoom(1);
    }
    if (fileInput.current) fileInput.current.value = '';
    onPhotoClear?.();
  }, [stopCamera, onPhotoClear]);
  useImperativeHandle(ref, () => ({ clear }), [clear]);
  useEffect(() => {
    mounted.current = true;
    const hidden = () => {
      if (document.visibilityState === 'hidden') stopCamera();
    };
    const leaving = () => {
      stopCamera();
      if (photoUrl.current) URL.revokeObjectURL(photoUrl.current);
      photoUrl.current = null;
      setPhoto(null);
    };
    document.addEventListener('visibilitychange', hidden);
    window.addEventListener('pagehide', leaving);
    return () => {
      mounted.current = false;
      stopCamera(false);
      if (photoUrl.current) URL.revokeObjectURL(photoUrl.current);
      photoUrl.current = null;
      document.removeEventListener('visibilitychange', hidden);
      window.removeEventListener('pagehide', leaving);
    };
  }, [stopCamera]);
  useEffect(() => {
    stopCamera();
  }, [questionId, stopCamera]);
  const sets = questionId ? getComparisonSets(questionId) : [];
  const activeSet = sets[Math.min(setIndex, Math.max(0, sets.length - 1))];
  const samples = activeSet?.samples ?? [];
  const activeSample = Math.min(sampleIndex, Math.max(0, samples.length - 1));
  async function chooseFile(file?: File) {
    if (!file) return;
    stopCamera();
    const token = generation.current;
    setBusy(true);
    setError('');
    try {
      const blob = await prepareLocalPhoto(file);
      if (mounted.current && generation.current === token) replacePhoto(blob);
    } catch (cause) {
      if (mounted.current && generation.current === token)
        setError(
          cause instanceof Error
            ? cause.message
            : 'The photo could not be opened. Try another file.',
        );
    } finally {
      if (mounted.current && generation.current === token) setBusy(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  }
  async function openCamera() {
    stopCamera();
    setError('');
    if (!navigator.mediaDevices?.getUserMedia) {
      setError(
        'Camera access is unavailable in this browser. Choose a photo, or continue without one.',
      );
      return;
    }
    setCameraOpen(true);
    setBusy(true);
    const token = generation.current;
    try {
      const next = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: 'user' } },
      });
      if (!mounted.current || generation.current !== token) {
        next.getTracks().forEach((track) => track.stop());
        return;
      }
      stream.current = next;
      if (video.current) {
        video.current.srcObject = next;
        await video.current.play();
      }
      if (mounted.current && generation.current === token) setBusy(false);
    } catch (cause) {
      if (mounted.current && generation.current === token) {
        stopCamera();
        const name = cause instanceof DOMException ? cause.name : '';
        setError(
          name === 'NotAllowedError'
            ? 'Camera permission was declined. Choose a photo, or continue without one.'
            : 'The camera could not be opened. It may be busy or unavailable. Choose a photo, or continue without one.',
        );
      }
    }
  }
  async function capture() {
    if (!video.current) return;
    const token = generation.current;
    setBusy(true);
    try {
      const blob = await captureVideoPhoto(video.current);
      if (mounted.current && generation.current === token) {
        stopCamera();
        replacePhoto(blob);
      }
    } catch (cause) {
      if (mounted.current && generation.current === token) {
        setError(
          cause instanceof Error
            ? cause.message
            : 'The photo could not be captured.',
        );
        setBusy(false);
      }
    }
  }
  return (
    <section className="photo-tool" aria-labelledby="photo-tool-title">
      <div className="photo-tool-heading">
        <p className="eyebrow">Optional · only on your device</p>
        <h2 id="photo-tool-title">Try a photo beside the colours</h2>
        <p>
          Choose a clear, front-facing photo in indirect daylight, or use your
          front camera. Keep your face centred and avoid filters. Your photo
          stays in this page’s memory; it is never uploaded or saved.
        </p>
      </div>
      <div className="photo-control-actions">
        <label className="button secondary photo-file-label">
          {photo ? 'Choose another photo' : 'Choose a photo'}
          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => void chooseFile(e.target.files?.[0])}
            aria-label="Choose a local JPG, PNG or WebP photo"
          />
        </label>
        <button
          type="button"
          className="button secondary"
          onClick={() => void openCamera()}
        >
          {photo ? 'Retake with camera' : 'Use front camera'}
        </button>
        {photo && (
          <button
            type="button"
            className="text-link reset-button"
            onClick={clear}
          >
            Remove photo
          </button>
        )}
      </div>
      <button
        type="button"
        className="text-link reset-button photo-skip-button"
        onClick={() => {
          clear();
          onContinueWithoutPhoto?.();
        }}
      >
        Continue without a photo →
      </button>
      <p className="small-note">
        JPG, PNG or WebP · up to 10 MB and 25 megapixels. HEIC photos need
        exporting as JPG. A digital preview cannot account for camera
        processing, lighting or your screen.
      </p>
      {error && (
        <p role="alert" className="photo-error">
          {error}
        </p>
      )}
      {busy && (
        <p role="status">
          {cameraOpen ? 'Opening camera…' : 'Preparing your photo…'}
        </p>
      )}
      {cameraOpen && (
        <div className="camera-panel">
          <div className="camera-frame">
            <video
              ref={video}
              muted
              playsInline
              autoPlay
              onLoadedMetadata={() =>
                setReady(Boolean(video.current?.videoWidth))
              }
              aria-label="Live front camera preview"
            />
            <div className="face-guide" aria-hidden="true" />
          </div>
          <p>
            Keep your face inside the oval. This guide does not detect your
            face.
          </p>
          <div className="photo-control-actions">
            <button
              type="button"
              className="button"
              onClick={() => void capture()}
              disabled={!ready || busy}
            >
              Capture photo
            </button>
            <button
              type="button"
              className="button secondary"
              onClick={() => stopCamera()}
            >
              Cancel camera
            </button>
          </div>
        </div>
      )}
      {photo && (
        <>
          <div className="photo-position-controls">
            <label>
              Horizontal position
              <input
                type="range"
                min="-40"
                max="40"
                step="1"
                value={x}
                onChange={(e) => setX(Number(e.target.value))}
              />
            </label>
            <label>
              Vertical position
              <input
                type="range"
                min="-40"
                max="40"
                step="1"
                value={y}
                onChange={(e) => setY(Number(e.target.value))}
              />
            </label>
            <label>
              Photo zoom
              <input
                type="range"
                min="1"
                max="2.5"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
              />
            </label>
            <button
              type="button"
              className="text-link reset-button"
              onClick={() => {
                setX(0);
                setY(0);
                setZoom(1);
              }}
            >
              Reset positioning
            </button>
          </div>
          {sets.length > 1 && (
            <label className="comparison-set-label">
              Colour comparison
              <select
                value={activeSet.id}
                onChange={(e) => {
                  setSetIndex(sets.findIndex((s) => s.id === e.target.value));
                  setSampleIndex(0);
                }}
              >
                {sets.map((s) => (
                  <option value={s.id} key={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          )}
          {samples.length > 0 ? (
            <>
              <p className="photo-help">
                The same photo appears with each fabric colour. These controls
                preview colours only; choose your questionnaire answer
                separately.
              </p>
              <div
                className="photo-mobile-switch"
                role="group"
                aria-label="Preview a fabric colour"
              >
                {samples.map((s, i) => (
                  <button
                    type="button"
                    className="button secondary"
                    key={s.value}
                    aria-pressed={activeSample === i}
                    onClick={() => setSampleIndex(i)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <div
                className="photo-comparison-grid"
                style={
                  { '--photo-panels': samples.length } as React.CSSProperties
                }
              >
                {samples.map((sample, index) => (
                  <figure
                    className={`photo-drape-panel ${index === activeSample ? 'mobile-active' : ''}`}
                    key={sample.value}
                  >
                    <div className="photo-portrait-frame">
                      <img
                        src={photo}
                        alt="Your locally selected photo, shown unchanged for this colour comparison"
                        style={{
                          transform: `translate(${x}%,${y}%) scale(${zoom})`,
                        }}
                      />
                      <div
                        className="photo-drape"
                        style={{ backgroundColor: sample.hex }}
                        aria-hidden="true"
                      />
                      <div
                        className="photo-frame-edge"
                        style={{ borderColor: sample.hex }}
                        aria-hidden="true"
                      />
                    </div>
                    <figcaption>
                      <strong>{sample.label}</strong>
                      <span>{sample.hex}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </>
          ) : (
            <figure className="photo-drape-panel photo-plain-preview">
              <div className="photo-portrait-frame">
                <img
                  src={photo}
                  alt="Your locally selected photo"
                  style={{ transform: `translate(${x}%,${y}%) scale(${zoom})` }}
                />
              </div>
              <figcaption>
                Your photo remains here while you review your suggestions.
              </figcaption>
            </figure>
          )}
        </>
      )}
      <p className="photo-privacy-note">
        No facial analysis, automatic season assignment or skin tinting is
        performed. You can skip the photo and answer every question as usual.
      </p>
    </section>
  );
});
