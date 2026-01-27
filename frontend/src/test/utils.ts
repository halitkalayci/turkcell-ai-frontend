import { ReactElement } from 'react';
import { render } from '@testing-library/react';

// Extend this for global providers when needed (Router, Theme, etc.)
export function renderWithProviders(ui: ReactElement) {
  return render(ui);
}
