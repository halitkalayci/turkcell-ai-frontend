/// <reference types="vitest" />
import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

// Initialize MSW server with handlers covering v1 and v2 products endpoints
export const server = setupServer(...handlers);

// Establish API mocking before all tests.
// Use 'warn' to catch missing handlers during test development
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));

// Reset handlers between tests to avoid test cross-talk.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
