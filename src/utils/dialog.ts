import { Alert, Platform } from 'react-native';

/**
 * Cross-platform confirm dialog.
 * React Native Alert.alert has no web implementation — buttons never fire on web.
 */
export function confirmAction(options: {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void | Promise<void>;
}): void {
  const { title, message, confirmLabel = 'OK', onConfirm } = options;

  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n\n${message}`)) {
      void Promise.resolve(onConfirm());
    }
    return;
  }

  Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel' },
    {
      text: confirmLabel,
      style: 'destructive',
      onPress: () => void Promise.resolve(onConfirm()),
    },
  ]);
}

export function showMessage(title: string, message: string): void {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
    return;
  }

  Alert.alert(title, message);
}
