import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button', () => {
  it('renders title', () => {
    const { getByText } = render(
      <Button title="Submit" onPress={() => {}} />
    );
    expect(getByText('Submit')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Tap me" onPress={onPress} />
    );
    fireEvent.press(getByText('Tap me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Tap me" onPress={onPress} disabled />
    );
    fireEvent.press(getByText('Tap me'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not call onPress when loading', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <Button title="Save" onPress={onPress} loading />
    );
    fireEvent.press(getByTestId('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows ActivityIndicator when loading', () => {
    const { getByTestId, UNSAFE_getByType } = render(
      <Button title="Save" onPress={() => {}} loading />
    );
    expect(getByTestId('button')).toBeTruthy();
    const { ActivityIndicator: AI } = require('react-native');
    expect(UNSAFE_getByType(AI)).toBeTruthy();
  });
});
