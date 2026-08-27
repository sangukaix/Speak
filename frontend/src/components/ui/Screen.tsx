import type { ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { colors, layout, spacing } from '@/theme/tokens';

type ScreenProps = {
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  edges?: Edge[];
  scroll?: boolean;
};

export function Screen({ children, contentStyle, edges = ['top', 'left', 'right'], scroll = true }: ScreenProps) {
  const { width } = useWindowDimensions();
  const horizontalPadding = width >= 800 ? layout.wideScreenPadding : layout.screenPadding;
  const responsiveStyle = { paddingHorizontal: horizontalPadding };

  return (
    <SafeAreaView edges={edges} style={styles.safeArea}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.content, responsiveStyle, contentStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, styles.flexContent, responsiveStyle, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1 },
  content: {
    alignSelf: 'center',
    paddingBottom: spacing.huge,
    paddingTop: spacing.lg,
    width: '100%',
    maxWidth: layout.maxContentWidth,
  },
  flexContent: { flex: 1 },
});
