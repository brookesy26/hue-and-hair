'use client';
import { useRef, useState } from 'react';
import {
  questions,
  assessAnswers,
  type Answers,
} from '@/features/colour-analysis/model';
import { getPalette } from '@/lib/content';
import { PaletteCard } from './palette-card';
export function Assessment() {
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const focus = useRef<HTMLDivElement>(null);
  const q = questions[step];
  function move(n: number) {
    setStep(n);
    requestAnimationFrame(() => focus.current?.focus());
  }
  const result = step === questions.length ? assessAnswers(answers) : null;
  return (
    <div className="assessment-panel" ref={focus} tabIndex={-1}>
      {result ? (
        <>
          <p className="eyebrow">Your starting point</p>
          <h2>{result.title}</h2>
          <p className="lead">{result.description}</p>
          <ul>
            {result.observations.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
          <div className="palette-grid">
            {result.paletteSlugs.map((slug) => {
              const p = getPalette(slug);
              return p ? <PaletteCard palette={p} key={slug} /> : null;
            })}
          </div>
          <p className="small-note">
            This result is tentative and based only on your answers. It does not
            analyse your image or identify a season from your gender or
            ethnicity.
          </p>
          <div className="actions">
            <button
              className="button"
              onClick={() => move(questions.length - 1)}
            >
              Review answers
            </button>
            <button
              className="button secondary"
              onClick={() => {
                setAnswers({});
                move(0);
              }}
            >
              Start again
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="eyebrow">
            Question {step + 1} of {questions.length}
          </p>
          <div className="progress-track" aria-hidden="true">
            <span
              style={{ width: `${((step + 1) / questions.length) * 100}%` }}
            />
          </div>
          <fieldset>
            <legend>{q.title}</legend>
            <p>{q.description}</p>
            <div className="answer-options">
              {q.options.map((o) => (
                <label
                  className={`answer-option ${answers[q.id] === o.value ? 'chosen' : ''}`}
                  key={o.value}
                >
                  <input
                    type="radio"
                    name={q.id}
                    value={o.value}
                    checked={answers[q.id] === o.value}
                    onChange={() => setAnswers({ ...answers, [q.id]: o.value })}
                  />
                  <span>
                    <strong>{o.label}</strong>
                    <span>{o.description}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="assessment-actions">
            {step > 0 ? (
              <button
                className="button secondary"
                onClick={() => move(step - 1)}
              >
                ← Back
              </button>
            ) : (
              <span />
            )}
            <button
              className="button"
              disabled={!answers[q.id]}
              onClick={() => move(step + 1)}
            >
              {step === questions.length - 1
                ? 'See suggestions'
                : 'Next question'}{' '}
              →
            </button>
          </div>
          <p className="small-note">
            It is fine to be unsure. Your answers stay in this page’s memory and
            clear when you refresh.
          </p>
        </>
      )}
    </div>
  );
}
