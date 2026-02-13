import React, { Component, ErrorInfo } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '@/components/Text';
import { Button } from '@/components/Button';
import { spacing } from '@/constants/spacing';
import { colors } from '@/constants/typography';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (__DEV__) console.error('ErrorBoundary', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <AppText variant="title2" style={styles.title}>
            Something went wrong
          </AppText>
          <AppText variant="body" color="textSecondary" style={styles.body}>
            Close the app and try again.
          </AppText>
          <Button
            title="Try again"
            onPress={() => this.setState({ hasError: false })}
            style={styles.btn}
          />
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  title: {
    marginBottom: spacing.sm,
  },
  body: {
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  btn: {},
});
