import { SymbolView } from 'expo-symbols';
import type { ComponentProps } from 'react';
import { StyleSheet, View, type ColorValue } from 'react-native';

export type AppIconName =
  | 'home'
  | 'practice'
  | 'review'
  | 'profile'
  | 'arrowRight'
  | 'arrowLeft'
  | 'play'
  | 'check'
  | 'clock'
  | 'work'
  | 'travel'
  | 'conversation'
  | 'book'
  | 'sparkles'
  | 'sound'
  | 'shield'
  | 'target'
  | 'micOff'
  | 'info'
  | 'chart';

type SymbolName = ComponentProps<typeof SymbolView>['name'];

const symbolNames: Record<AppIconName, SymbolName> = {
  home: { ios: 'house.fill', android: 'home', web: 'home' },
  practice: { ios: 'bubble.left.and.bubble.right.fill', android: 'forum', web: 'forum' },
  review: { ios: 'books.vertical.fill', android: 'menu_book', web: 'menu_book' },
  profile: { ios: 'person.crop.circle.fill', android: 'person', web: 'person' },
  arrowRight: { ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' },
  arrowLeft: { ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' },
  play: { ios: 'play.fill', android: 'play_arrow', web: 'play_arrow' },
  check: { ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' },
  clock: { ios: 'clock.fill', android: 'schedule', web: 'schedule' },
  work: { ios: 'briefcase.fill', android: 'business_center', web: 'business_center' },
  travel: { ios: 'airplane', android: 'flight', web: 'flight' },
  conversation: { ios: 'bubble.left.fill', android: 'chat_bubble', web: 'chat_bubble' },
  book: { ios: 'book.closed.fill', android: 'book', web: 'book' },
  sparkles: { ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' },
  sound: { ios: 'speaker.wave.2.fill', android: 'volume_up', web: 'volume_up' },
  shield: { ios: 'shield.fill', android: 'shield', web: 'shield' },
  target: { ios: 'flag.fill', android: 'flag', web: 'flag' },
  micOff: { ios: 'mic.slash.fill', android: 'mic_off', web: 'mic_off' },
  info: { ios: 'info.circle.fill', android: 'info', web: 'info' },
  chart: { ios: 'chart.bar.fill', android: 'bar_chart', web: 'bar_chart' },
};

type AppIconProps = {
  color: ColorValue;
  name: AppIconName;
  size?: number;
};

export function AppIcon({ color, name, size = 22 }: AppIconProps) {
  return (
    <View style={[styles.frame, { height: size, width: size }]}>
      <SymbolView name={symbolNames[name]} size={size} tintColor={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { alignItems: 'center', justifyContent: 'center' },
});
