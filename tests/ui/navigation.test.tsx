import React from 'react';
import { afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { SiteHeader } from '@/components/site-header';
vi.mock('next/navigation', () => ({
  usePathname: () => '/hairstyles/soft-pixie/',
}));
afterEach(cleanup);
describe('site navigation', () => {
  it('opens the native modal and closes it through the close action', () => {
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
      configurable: true,
      value() {},
    });
    Object.defineProperty(HTMLDialogElement.prototype, 'close', {
      configurable: true,
      value() {},
    });
    const show = vi
      .spyOn(HTMLDialogElement.prototype, 'showModal')
      .mockImplementation(function (this: HTMLDialogElement) {
        this.setAttribute('open', '');
      });
    const close = vi
      .spyOn(HTMLDialogElement.prototype, 'close')
      .mockImplementation(function (this: HTMLDialogElement) {
        this.removeAttribute('open');
      });
    render(<SiteHeader />);
    fireEvent.click(screen.getByRole('button', { name: /Menu/ }));
    expect(show).toHaveBeenCalledOnce();
    expect(screen.getByRole('dialog', { name: 'Explore' })).toHaveAttribute(
      'open',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(close).toHaveBeenCalledOnce();
    show.mockRestore();
    close.mockRestore();
  });
  it('offers the primary destinations in the desktop navigation', () => {
    render(<SiteHeader />);
    expect(
      screen.getByRole('navigation', { name: 'Main navigation' }),
    ).toHaveTextContent('Hairstyles');
    expect(
      screen.getByRole('navigation', { name: 'Main navigation' }),
    ).toHaveTextContent('Colour analysis');
    expect(
      screen.getByRole('link', { name: 'Hue and Hair home' }),
    ).toHaveAttribute('href', '/');
  });
});
