import { act, render, screen } from '@testing-library/react';
import { Reveal } from '@/components/ui/Reveal';

type ObserverCallback = (entries: Pick<IntersectionObserverEntry, 'isIntersecting'>[]) => void;

let callbacks: ObserverCallback[] = [];
const disconnect = jest.fn();

class MockIntersectionObserver {
  constructor(callback: ObserverCallback) {
    callbacks.push(callback);
  }
  observe = jest.fn();
  disconnect = disconnect;
}

function mockMatchMedia(reduced: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string) => ({ matches: reduced && query.includes('reduce'), media: query }),
  });
}

function emit(isIntersecting: boolean) {
  act(() => callbacks.forEach((callback) => callback([{ isIntersecting }])));
}

beforeEach(() => {
  callbacks = [];
  disconnect.mockClear();
  mockMatchMedia(false);
  Object.defineProperty(window, 'IntersectionObserver', { configurable: true, writable: true, value: MockIntersectionObserver });
});

afterEach(() => {
  Reflect.deleteProperty(window, 'IntersectionObserver');
});

describe('Reveal', () => {
  it('renders its children', () => {
    render(<Reveal>Hello</Reveal>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('stays visible when IntersectionObserver is missing', () => {
    Reflect.deleteProperty(window, 'IntersectionObserver');
    render(<Reveal>Hello</Reveal>);
    expect(screen.getByText('Hello')).not.toHaveClass('opacity-0');
  });

  it('stays visible when the user prefers reduced motion', () => {
    mockMatchMedia(true);
    render(<Reveal>Hello</Reveal>);
    expect(callbacks).toHaveLength(0);
    expect(screen.getByText('Hello')).not.toHaveClass('opacity-0');
  });

  it('hides content that starts off screen, then reveals it with the delay when it scrolls in', () => {
    render(
      <Reveal delay={120} className="extra">
        Hello
      </Reveal>,
    );
    const el = screen.getByText('Hello');

    emit(false);
    expect(el).toHaveClass('opacity-0', 'extra');

    emit(true);
    expect(el).not.toHaveClass('opacity-0');
    expect(el).toHaveClass('animate-reveal', 'extra');
    expect(el).toHaveStyle({ animationDelay: '120ms' });
    expect(disconnect).toHaveBeenCalled();
  });

  it('does not animate content that is on screen at first paint', () => {
    render(<Reveal>Hello</Reveal>);
    emit(true);
    expect(screen.getByText('Hello')).not.toHaveClass('opacity-0');
    expect(screen.getByText('Hello')).not.toHaveClass('animate-reveal');
  });

  it('renders as the requested element', () => {
    render(<Reveal as="section">Hello</Reveal>);
    expect(screen.getByText('Hello').tagName).toBe('SECTION');
  });
});
