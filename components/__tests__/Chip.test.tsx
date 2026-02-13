import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Chip } from '../Chip';

describe('Chip', () => {
  it('renders label', () => {
    const { getByText } = render(<Chip label="Habits" />);
    expect(getByText('Habits')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Chip label="Focus" onPress={onPress} />
    );
    fireEvent.press(getByText('Focus'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders selected state', () => {
    const { getByText } = render(
      <Chip label="Selected" selected />
    );
    expect(getByText('Selected')).toBeTruthy();
  });
});
