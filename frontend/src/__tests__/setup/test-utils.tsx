import { ReactElement, ReactNode, useEffect } from 'react';
import { render, RenderOptions, screen, waitFor } from '@testing-library/react';

/**
 * Custom render function with providers
 * Extend this when global providers are needed (Router, Theme, etc.)
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, options);
}

/**
 * Hook consumer component for testing custom hooks with React Testing Library
 */
interface HookConsumerProps<T> {
  hook: () => T;
  children: (result: T) => ReactNode;
}

export function HookConsumer<T>({ hook, children }: HookConsumerProps<T>) {
  const result = hook();
  
  useEffect(() => {
    // Trigger re-render when result changes
  }, [result]);
  
  return <>{children(result)}</>;
}

/**
 * Wait for loading state to finish
 */
export async function waitForLoadingToFinish() {
  await waitFor(
    () => {
      const loadingElements = screen.queryAllByText(/loading/i);
      expect(loadingElements).toHaveLength(0);
    },
    { timeout: 3000 }
  );
}

/**
 * Wait for an element to be removed from the document
 */
export async function waitForElementToBeRemoved(
  getElement: () => HTMLElement | null,
  timeout = 3000
) {
  await waitFor(
    () => {
      expect(getElement()).not.toBeInTheDocument();
    },
    { timeout }
  );
}

/**
 * Create a simple hook consumer for testing
 */
export function createSimpleHookConsumer<T extends Record<string, unknown>>(
  hookResult: T,
  labels: Partial<Record<keyof T, string>> = {}
) {
  return (
    <div>
      {Object.entries(hookResult).map(([key, value]) => {
        const label = labels[key as keyof T] || key;
        return (
          <div key={key} aria-label={label}>
            {String(value)}
          </div>
        );
      })}
    </div>
  );
}
