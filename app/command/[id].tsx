import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { theme } from '../../constants/theme';
import { linuxCommands } from '../../services/mockData';

const difficultyColors = {
  beginner: theme.success,
  intermediate: theme.warning,
  advanced: theme.error,
};

export default function CommandDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const command = linuxCommands.find((cmd) => cmd.id === id);

  if (!command) {
    return (
      <SafeAreaView edges={['top']} style={styles.container}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: theme.textPrimary }}>Command not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.closeBtn}
          onPress={() => {
            Haptics.selectionAsync();
            router.back();
          }}
        >
          <Ionicons name="chevron-down" size={24} color={theme.textSecondary} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerCommand}>{command.name}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.heroSection}>
          <Text style={styles.heroName}>{command.name}</Text>
          <Text style={styles.heroSynopsis}>{command.synopsis}</Text>
          <View style={styles.heroBadges}>
            <View style={styles.categoryBadge}>
              <Ionicons name="folder-open" size={12} color={theme.primary} />
              <Text style={styles.categoryBadgeText}>{command.category}</Text>
            </View>
            <View
              style={[
                styles.diffBadge,
                { backgroundColor: difficultyColors[command.difficulty] + '20' },
              ]}
            >
              <Text
                style={[
                  styles.diffBadgeText,
                  { color: difficultyColors[command.difficulty] },
                ]}
              >
                {command.difficulty}
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DESCRIPTION</Text>
          <Text style={styles.description}>{command.description}</Text>
        </View>

        {/* Syntax */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SYNTAX</Text>
          <View style={styles.syntaxBox}>
            <Text style={styles.syntaxText}>{command.syntax}</Text>
          </View>
        </View>

        {/* Flags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FLAGS & OPTIONS</Text>
          {command.flags.map((flag, i) => (
            <View key={i} style={styles.flagRow}>
              <View style={styles.flagBadge}>
                <Text style={styles.flagText}>{flag.flag}</Text>
              </View>
              <Text style={styles.flagDesc}>{flag.description}</Text>
            </View>
          ))}
        </View>

        {/* Examples */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EXAMPLES</Text>
          {command.examples.map((example, i) => (
            <View key={i} style={styles.exampleCard}>
              <View style={styles.exampleHeader}>
                <Text style={styles.exampleLabel}>Example {i + 1}</Text>
                <Pressable
                  style={styles.copyBtn}
                  onPress={() => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  }}
                >
                  <Ionicons name="copy-outline" size={14} color={theme.textMuted} />
                </Pressable>
              </View>
              <View style={styles.exampleSyntax}>
                <Text style={styles.exampleCommand}>{example.command}</Text>
              </View>
              <Text style={styles.exampleExplanation}>{example.explanation}</Text>
            </View>
          ))}
        </View>

        {/* Related Commands */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RELATED COMMANDS</Text>
          <View style={styles.relatedRow}>
            {command.relatedCommands.map((rel, i) => {
              const relatedCmd = linuxCommands.find((c) => c.name === rel);
              return (
                <Pressable
                  key={i}
                  style={styles.relatedChip}
                  onPress={() => {
                    if (relatedCmd) {
                      Haptics.selectionAsync();
                      router.push(`/command/${relatedCmd.id}`);
                    }
                  }}
                >
                  <Text style={styles.relatedText}>{rel}</Text>
                  {relatedCmd && (
                    <Ionicons name="arrow-forward" size={12} color={theme.primary} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerCommand: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textPrimary,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
  },
  heroSection: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  heroName: {
    fontSize: 48,
    fontWeight: '700',
    color: theme.primary,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    marginBottom: 8,
  },
  heroSynopsis: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  heroBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.full,
    backgroundColor: theme.primary + '15',
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.primary,
  },
  diffBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.full,
  },
  diffBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: theme.textPrimary,
    lineHeight: 22,
  },
  syntaxBox: {
    backgroundColor: theme.surface,
    borderRadius: theme.radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  syntaxText: {
    fontSize: 15,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    color: theme.syntax.string,
  },
  flagRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
  },
  flagBadge: {
    backgroundColor: theme.backgroundSecondary,
    borderRadius: theme.radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 50,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  flagText: {
    fontSize: 13,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    color: theme.syntax.keyword,
    fontWeight: '600',
  },
  flagDesc: {
    fontSize: 14,
    color: theme.textSecondary,
    flex: 1,
    lineHeight: 20,
    paddingTop: 2,
  },
  exampleCard: {
    backgroundColor: theme.surface,
    borderRadius: theme.radius.md,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  exampleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exampleLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  copyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.backgroundSecondary,
  },
  exampleSyntax: {
    backgroundColor: '#0A0E14',
    borderRadius: theme.radius.sm,
    padding: 10,
    marginBottom: 8,
  },
  exampleCommand: {
    fontSize: 13,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    color: theme.success,
  },
  exampleExplanation: {
    fontSize: 13,
    color: theme.textSecondary,
    lineHeight: 19,
  },
  relatedRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  relatedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: theme.radius.full,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  relatedText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.textPrimary,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
  },
});
