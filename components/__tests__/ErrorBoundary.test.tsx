import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { ErrorBoundary } from '../ErrorBoundary';

const Throw = () => {
  throw new Error('test error');
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it('renders children when there is no error', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <Text>OK</Text>
      </ErrorBoundary>
    );
    expect(getByText('OK')).toBeTruthy();
  });

  it('renders fallback UI when child throws', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <Throw />
      </ErrorBoundary>
    );
    expect(getByText('Something went wrong')).toBeTruthy();
    expect(getByText('Close the app and try again.')).toBeTruthy();
  });

  it('Try again button is present and pressable', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <Throw />
      </ErrorBoundary>
    );
    const tryAgain = getByText('Try again');
    expect(tryAgain).toBeTruthy();
    fireEvent.press(tryAgain);
  });
});
