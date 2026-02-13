import React from 'react';
import { render } from '@testing-library/react-native';
import { AppText } from '../Text';

describe('AppText', () => {
  it('renders children', () => {
    const { getByText } = render(<AppText>Hello</AppText>);
    expect(getByText('Hello')).toBeTruthy();
  });

  it('renders with variant', () => {
    const { getByText } = render(
      <AppText variant="title1">Title</AppText>
    );
    expect(getByText('Title')).toBeTruthy();
  });

  it('renders with color', () => {
    const { getByText } = render(
      <AppText color="textSecondary">Muted</AppText>
    );
    expect(getByText('Muted')).toBeTruthy();
  });
});
