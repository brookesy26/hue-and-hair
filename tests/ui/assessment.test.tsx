import React from 'react';
import { afterEach, describe, it, expect } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Assessment } from '@/components/assessment';
import { questions } from '@/features/colour-analysis/model';
afterEach(cleanup);
describe('assessment navigation', () => {
  it('requires an answer, preserves choices when going back, and restarts uncertain results', () => {
    render(<Assessment />);
    expect(
      screen.getByRole('button', { name: /Next question/ }),
    ).toBeDisabled();
    const unsure = questions[0].options.find((o) => o.value === 'unsure')!;
    fireEvent.click(
      screen.getByRole('radio', { name: new RegExp(unsure.label) }),
    );
    fireEvent.click(screen.getByRole('button', { name: /Next question/ }));
    expect(screen.getByText('Question 2 of 3')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Back/ }));
    expect(
      screen.getByRole('radio', { name: new RegExp(unsure.label) }),
    ).toBeChecked();
    fireEvent.click(screen.getByRole('button', { name: /Next question/ }));
    for (let i = 1; i < questions.length; i++) {
      const option = questions[i].options.find((o) => o.value === 'unsure')!;
      fireEvent.click(
        screen.getByRole('radio', { name: new RegExp(option.label) }),
      );
      fireEvent.click(
        screen.getByRole('button', {
          name:
            i === questions.length - 1 ? /See suggestions/ : /Next question/,
        }),
      );
    }
    expect(
      screen.getByRole('button', { name: 'Start again' }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Start again' }));
    expect(screen.getByText('Question 1 of 3')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Next question/ }),
    ).toBeDisabled();
  });
  it('does not retain answers across a remount', () => {
    const view = render(<Assessment />);
    fireEvent.click(screen.getAllByRole('radio')[0]);
    view.unmount();
    render(<Assessment />);
    expect(
      screen.getByRole('button', { name: /Next question/ }),
    ).toBeDisabled();
  });
});
