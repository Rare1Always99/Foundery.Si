import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { theme } from '../../constants/theme';
import { useApp } from '../../contexts/AppContext';

const languageIcons: Record<string, string> = {
  typescript: 'logo-nodejs',
  javascript: 'logo-javascript',
  python: 'logo-python',
  rust: 'hardware-chip',
  go: 'code-slash',
  shell: 'terminal',
  html: 'logo-html5',
  css: 'logo-css3',
  markdown: 'document-text',
  json: 'code',
};

export default function ProjectsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { workspaces, deleteWorkspace, setActiveWorkspace, setActiveFile } = useApp();
  const [showStats, setShowStats] = useState(true);

  const totalFiles = workspaces.reduce((acc, ws) => acc + ws.files.length, 0);
  const languages = [...new Set(workspaces.map((ws) => ws.language))];

  const handleOpenWorkspace = (ws: typeof workspaces[0]) => {
    Haptics.selectionAsync();
    setActiveWorkspace(ws);
    if (ws.files.length > 0) setActiveFile(ws.files[0]);
    router.push(`/workspace/${ws.id}`);
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Delete Workspace',
      `Are you sure you want to delete "${name}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            deleteWorkspace(id);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>
              <Text style={{ color: theme.primary }}>Dev</Text>Forge
            </Text>
            <Text style={styles.tagline}>Local AI Workspace</Text>
          </View>
          <Pressable
            style={styles.settingsBtn}
            onPress={() => {
              Haptics.selectionAsync();
              setShowStats(!showStats);
            }}
          >
            <Ionicons name="settings-outline" size={22} color={theme.textSecondary} />
          </Pressable>
        </View>

        {/* Stats Row */}
        {showStats && (
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{workspaces.length}</Text>
              <Text style={styles.statLabel}>PROJECTS</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{totalFiles}</Text>
              <Text style={styles.statLabel}>FILES</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{languages.length}</Text>
              <Text style={styles.statLabel}>LANGUAGES</Text>
            </View>
          </View>
        )}

        {/* Ollama Status */}
        <View style={styles.ollamaCard}>
          <View style={styles.ollamaLeft}>
            <View style={[styles.statusDot, { backgroundColor: theme.warning }]} />
            <View>
              <Text style={styles.ollamaTitle}>Ollama</Text>
              <Text style={styles.ollamaStatus}>Connect to enable local AI</Text>
            </View>
          </View>
          <Pressable style={styles.ollamaConnect}>
            <Text style={styles.ollamaConnectText}>Configure</Text>
          </Pressable>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>WORKSPACES</Text>
          <Pressable
            style={styles.newBtn}
            onPress={() => {
              Haptics.selectionAsync();
              router.push('/new-workspace');
            }}
          >
            <Ionicons name="add" size={18} color={theme.primary} />
            <Text style={styles.newBtnText}>New</Text>
          </Pressable>
        </View>

        {/* Workspace List */}
        {workspaces.length === 0 ? (
          <View style={styles.emptyState}>
            <Image
              source={require('../../assets/images/empty-projects.png')}
              style={styles.emptyImage}
              contentFit="contain"
            />
            <Text style={styles.emptyTitle}>No workspaces yet</Text>
            <Text style={styles.emptyDescription}>
              Create your first workspace to start coding locally
            </Text>
            <Pressable
              style={styles.emptyBtn}
              onPress={() => router.push('/new-workspace')}
            >
              <Ionicons name="add" size={20} color={theme.textInverse} />
              <Text style={styles.emptyBtnText}>Create Workspace</Text>
            </Pressable>
          </View>
        ) : (
          workspaces.map((ws) => (
            <Pressable
              key={ws.id}
              style={({ pressed }) => [
                styles.workspaceCard,
                pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
              ]}
              onPress={() => handleOpenWorkspace(ws)}
              onLongPress={() => handleDelete(ws.id, ws.name)}
            >
              <View style={styles.wsCardHeader}>
                <View
                  style={[
                    styles.langIcon,
                    { backgroundColor: (theme.languages[ws.language] || '#666') + '20' },
                  ]}
                >
                  <Ionicons
                    name={(languageIcons[ws.language] || 'code-slash') as any}
                    size={20}
                    color={theme.languages[ws.language] || '#666'}
                  />
                </View>
                <View style={styles.wsInfo}>
                  <Text style={styles.wsName}>{ws.name}</Text>
                  <Text style={styles.wsDescription} numberOfLines={1}>
                    {ws.description}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
              </View>
              <View style={styles.wsCardFooter}>
                <View style={styles.wsTag}>
                  <Text style={[styles.wsTagText, { color: theme.languages[ws.language] || '#666' }]}>
                    {ws.language}
                  </Text>
                </View>
                <Text style={styles.wsFiles}>{ws.files.length} files</Text>
                <Text style={styles.wsTime}>{ws.lastModified}</Text>
              </View>
            </Pressable>
          ))
        )}

        {/* Quick Actions */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>QUICK START</Text>
        </View>
        <View style={styles.quickStartGrid}>
          {[
            { icon: 'logo-nodejs', label: 'Node.js', color: '#3FB950', lang: 'typescript' },
            { icon: 'logo-python', label: 'Python', color: '#3572A5', lang: 'python' },
            { icon: 'hardware-chip', label: 'Rust', color: '#DEA584', lang: 'rust' },
            { icon: 'terminal', label: 'Shell', color: '#89E051', lang: 'shell' },
          ].map((item) => (
            <Pressable
              key={item.label}
              style={({ pressed }) => [
                styles.quickStartItem,
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                router.push('/new-workspace');
              }}
            >
              <View style={[styles.quickStartIcon, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon as any} size={24} color={item.color} />
              </View>
              <Text style={styles.quickStartLabel}>{item.label}</Text>
            </Pressable>
          ))}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  logo: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  tagline: {
    fontSize: 13,
    color: theme.textSecondary,
    marginTop: 2,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.surface,
    borderRadius: theme.radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.primary,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.textSecondary,
    letterSpacing: 1,
    marginTop: 4,
  },
  ollamaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.surface,
    borderRadius: theme.radius.md,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  ollamaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  ollamaTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  ollamaStatus: {
    fontSize: 12,
    color: theme.textSecondary,
    marginTop: 1,
  },
  ollamaConnect: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.primary + '15',
  },
  ollamaConnectText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.primary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.textSecondary,
    letterSpacing: 0.5,
  },
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.primary + '15',
  },
  newBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.primary,
  },
  workspaceCard: {
    backgroundColor: theme.surface,
    borderRadius: theme.radius.lg,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  wsCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  langIcon: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wsInfo: {
    flex: 1,
  },
  wsName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textPrimary,
    fontFamily: 'monospace',
  },
  wsDescription: {
    fontSize: 13,
    color: theme.textSecondary,
    marginTop: 2,
  },
  wsCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.borderLight,
  },
  wsTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.backgroundSecondary,
  },
  wsTagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  wsFiles: {
    fontSize: 12,
    color: theme.textSecondary,
  },
  wsTime: {
    fontSize: 12,
    color: theme.textMuted,
    marginLeft: 'auto',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyImage: {
    width: 160,
    height: 160,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.textPrimary,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: theme.radius.md,
  },
  emptyBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.textInverse,
  },
  quickStartGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  quickStartItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: theme.radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  quickStartIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickStartLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.textSecondary,
  },
});
