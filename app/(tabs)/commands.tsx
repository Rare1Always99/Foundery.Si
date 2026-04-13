import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { FlashList } from '@shopify/flash-list';
import { theme } from '../../constants/theme';
import { linuxCommands } from '../../services/mockData';
import { config } from '../../constants/config';
import { useApp } from '../../contexts/AppContext';

const difficultyColors = {
  beginner: theme.success,
  intermediate: theme.warning,
  advanced: theme.error,
};

const categoryIcons: Record<string, string> = {
  'File Management': 'folder-open',
  'Text Processing': 'document-text',
  'System Info': 'information-circle',
  'Network': 'globe',
  'Process Management': 'cog',
  'Package Management': 'cube',
  'Permissions': 'lock-closed',
  'Disk & Storage': 'server',
  'Search & Find': 'search',
  'Compression': 'archive',
  'User Management': 'people',
  'Shell Scripting': 'terminal',
};

export default function CommandsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { commandSearchQuery, setCommandSearchQuery, commandCategoryFilter, setCommandCategoryFilter } = useApp();

  const categories = ['All', ...config.commandCategories];

  const filteredCommands = useMemo(() => {
    let result = linuxCommands;

    if (commandCategoryFilter !== 'All') {
      result = result.filter((cmd) => cmd.category === commandCategoryFilter);
    }

    if (commandSearchQuery.trim()) {
      const q = commandSearchQuery.toLowerCase();
      result = result.filter(
        (cmd) =>
          cmd.name.toLowerCase().includes(q) ||
          cmd.synopsis.toLowerCase().includes(q) ||
          cmd.description.toLowerCase().includes(q) ||
          cmd.category.toLowerCase().includes(q)
      );
    }

    return result;
  }, [commandSearchQuery, commandCategoryFilter]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: linuxCommands.length };
    linuxCommands.forEach((cmd) => {
      counts[cmd.category] = (counts[cmd.category] || 0) + 1;
    });
    return counts;
  }, []);

  const handleCommandPress = (cmd: typeof linuxCommands[0]) => {
    Haptics.selectionAsync();
    router.push(`/command/${cmd.id}`);
  };

  const renderCommandItem = ({ item }: { item: typeof linuxCommands[0] }) => (
    <Pressable
      style={({ pressed }) => [
        styles.commandCard,
        pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
      ]}
      onPress={() => handleCommandPress(item)}
    >
      <View style={styles.cmdHeader}>
        <View style={styles.cmdNameRow}>
          <Text style={styles.cmdName}>{item.name}</Text>
          <View
            style={[
              styles.difficultyBadge,
              { backgroundColor: difficultyColors[item.difficulty] + '20' },
            ]}
          >
            <Text
              style={[
                styles.difficultyText,
                { color: difficultyColors[item.difficulty] },
              ]}
            >
              {item.difficulty}
            </Text>
          </View>
        </View>
        <Text style={styles.cmdSynopsis}>{item.synopsis}</Text>
      </View>
      <View style={styles.cmdSyntaxRow}>
        <Text style={styles.cmdSyntax} numberOfLines={1}>{item.syntax}</Text>
      </View>
      <View style={styles.cmdFooter}>
        <View style={styles.cmdCategory}>
          <Ionicons
            name={(categoryIcons[item.category] || 'code') as any}
            size={12}
            color={theme.textMuted}
          />
          <Text style={styles.cmdCategoryText}>{item.category}</Text>
        </View>
        <Text style={styles.cmdExampleCount}>
          {item.examples.length} examples · {item.flags.length} flags
        </Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Linux Commands</Text>
        <Text style={styles.headerCount}>{linuxCommands.length} commands</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={theme.textMuted} />
          <TextInput
            style={styles.searchInput}
            value={commandSearchQuery}
            onChangeText={setCommandSearchQuery}
            placeholder="Search commands, flags, descriptions..."
            placeholderTextColor={theme.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardAppearance="dark"
          />
          {commandSearchQuery.length > 0 && (
            <Pressable onPress={() => setCommandSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={theme.textMuted} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Category Filter */}
      <View style={styles.categoryBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        >
          {categories.map((cat) => (
            <Pressable
              key={cat}
              style={[
                styles.categoryChip,
                commandCategoryFilter === cat && styles.categoryChipActive,
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                setCommandCategoryFilter(cat);
              }}
            >
              {cat !== 'All' && (
                <Ionicons
                  name={(categoryIcons[cat] || 'code') as any}
                  size={13}
                  color={
                    commandCategoryFilter === cat
                      ? theme.textInverse
                      : theme.textSecondary
                  }
                />
              )}
              <Text
                style={[
                  styles.categoryChipText,
                  commandCategoryFilter === cat && styles.categoryChipTextActive,
                ]}
              >
                {cat}
              </Text>
              <Text
                style={[
                  styles.categoryCount,
                  commandCategoryFilter === cat && { color: theme.textInverse + '80' },
                ]}
              >
                {categoryCounts[cat] || 0}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Results Count */}
      <View style={styles.resultBar}>
        <Text style={styles.resultText}>
          {filteredCommands.length} command{filteredCommands.length !== 1 ? 's' : ''}
          {commandCategoryFilter !== 'All' ? ` in ${commandCategoryFilter}` : ''}
        </Text>
      </View>

      {/* Command List */}
      <View style={{ flex: 1 }}>
        {filteredCommands.length > 0 ? (
          <FlashList
            data={filteredCommands}
            renderItem={renderCommandItem}
            estimatedItemSize={130}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: insets.bottom + 16,
            }}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <View style={styles.emptySearch}>
            <Ionicons name="search-outline" size={48} color={theme.textMuted} />
            <Text style={styles.emptySearchTitle}>No commands found</Text>
            <Text style={styles.emptySearchDesc}>
              Try different keywords or clear filters
            </Text>
          </View>
        )}
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  headerCount: {
    fontSize: 13,
    color: theme.textSecondary,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: theme.radius.md,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: theme.textPrimary,
  },
  categoryBar: {
    height: 40,
    marginBottom: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: theme.radius.full,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  categoryChipActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  categoryChipTextActive: {
    color: theme.textInverse,
  },
  categoryCount: {
    fontSize: 10,
    color: theme.textMuted,
    fontWeight: '600',
  },
  resultBar: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  resultText: {
    fontSize: 12,
    color: theme.textMuted,
  },
  commandCard: {
    backgroundColor: theme.surface,
    borderRadius: theme.radius.lg,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  cmdHeader: {
    marginBottom: 8,
  },
  cmdNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cmdName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.primary,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.sm,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  cmdSynopsis: {
    fontSize: 13,
    color: theme.textSecondary,
    lineHeight: 18,
  },
  cmdSyntaxRow: {
    backgroundColor: theme.backgroundSecondary,
    borderRadius: theme.radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
  },
  cmdSyntax: {
    fontSize: 12,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    color: theme.syntax.string,
  },
  cmdFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cmdCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cmdCategoryText: {
    fontSize: 11,
    color: theme.textMuted,
  },
  cmdExampleCount: {
    fontSize: 11,
    color: theme.textMuted,
  },
  emptySearch: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptySearchTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  emptySearchDesc: {
    fontSize: 13,
    color: theme.textSecondary,
  },
});
