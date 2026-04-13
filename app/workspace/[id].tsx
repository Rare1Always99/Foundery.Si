import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { theme } from '../../constants/theme';
import { useApp } from '../../contexts/AppContext';

export default function WorkspaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    workspaces,
    setActiveWorkspace,
    setActiveFile,
    deleteWorkspace,
    addFileToWorkspace,
  } = useApp();

  const workspace = workspaces.find((ws) => ws.id === id);

  if (!workspace) {
    return (
      <SafeAreaView edges={['top']} style={styles.container}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: theme.textPrimary }}>Workspace not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleOpenInEditor = (fileId?: string) => {
    Haptics.selectionAsync();
    setActiveWorkspace(workspace);
    const file = fileId
      ? workspace.files.find((f) => f.id === fileId)
      : workspace.files[0];
    if (file) setActiveFile(file);
    router.push('/(tabs)/editor');
  };

  const handleAddFile = () => {
    const ext = workspace.language === 'python' ? '.py' : workspace.language === 'rust' ? '.rs' : workspace.language === 'go' ? '.go' : '.ts';
    const newFile = {
      id: `f-${Date.now()}`,
      name: `new_file${ext}`,
      language: workspace.language,
      content: `// New file\n`,
    };
    addFileToWorkspace(workspace.id, newFile);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Workspace',
      `Delete "${workspace.name}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteWorkspace(workspace.id);
            router.back();
          },
        },
      ]
    );
  };

  const langColor = theme.languages[workspace.language] || '#666';

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => {
            Haptics.selectionAsync();
            router.back();
          }}
        >
          <Ionicons name="chevron-back" size={24} color={theme.textSecondary} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {workspace.name}
        </Text>
        <Pressable style={styles.menuBtn} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color={theme.error} />
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Workspace Info Card */}
        <View style={styles.infoCard}>
          <View style={[styles.langDot, { backgroundColor: langColor }]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.wsName}>{workspace.name}</Text>
            <Text style={styles.wsDesc}>{workspace.description}</Text>
            <View style={styles.wsMetaRow}>
              <Text style={[styles.wsLang, { color: langColor }]}>{workspace.language}</Text>
              <Text style={styles.wsMeta}>·</Text>
              <Text style={styles.wsMeta}>{workspace.files.length} files</Text>
              <Text style={styles.wsMeta}>·</Text>
              <Text style={styles.wsMeta}>{workspace.lastModified}</Text>
            </View>
          </View>
        </View>

        {/* Open in Editor Button */}
        <Pressable
          style={({ pressed }) => [
            styles.openEditorBtn,
            pressed && { opacity: 0.85 },
          ]}
          onPress={() => handleOpenInEditor()}
        >
          <Ionicons name="code-slash" size={20} color={theme.textInverse} />
          <Text style={styles.openEditorText}>Open in Editor</Text>
        </Pressable>

        {/* Files Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>FILES</Text>
          <Pressable style={styles.addFileBtn} onPress={handleAddFile}>
            <Ionicons name="add" size={16} color={theme.primary} />
            <Text style={styles.addFileText}>Add File</Text>
          </Pressable>
        </View>

        {workspace.files.map((file) => (
          <Pressable
            key={file.id}
            style={({ pressed }) => [
              styles.fileCard,
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => handleOpenInEditor(file.id)}
          >
            <View style={styles.fileIcon}>
              <Ionicons name="document-text" size={18} color={langColor} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.fileName}>{file.name}</Text>
              <Text style={styles.fileMeta}>
                {file.content.split('\n').length} lines · {file.language}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
          </Pressable>
        ))}

        {/* Terminal History */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>TERMINAL HISTORY</Text>
        </View>
        <View style={styles.terminalCard}>
          {workspace.terminalHistory.slice(-8).map((line, i) => (
            <Text
              key={i}
              style={[
                styles.termLine,
                line.startsWith('$') && styles.termCommand,
              ]}
            >
              {line}
            </Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textPrimary,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    flex: 1,
    textAlign: 'center',
  },
  menuBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: theme.surface,
    borderRadius: theme.radius.lg,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  langDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  wsName: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.textPrimary,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    marginBottom: 4,
  },
  wsDesc: {
    fontSize: 14,
    color: theme.textSecondary,
    lineHeight: 20,
    marginBottom: 10,
  },
  wsMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  wsLang: {
    fontSize: 12,
    fontWeight: '600',
  },
  wsMeta: {
    fontSize: 12,
    color: theme.textMuted,
  },
  openEditorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.primary,
    borderRadius: theme.radius.md,
    paddingVertical: 14,
    marginTop: 16,
    marginBottom: 24,
  },
  openEditorText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.textInverse,
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
  addFileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.primary + '15',
  },
  addFileText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.primary,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: theme.surface,
    borderRadius: theme.radius.md,
    padding: 14,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  fileIcon: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textPrimary,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
  },
  fileMeta: {
    fontSize: 12,
    color: theme.textMuted,
    marginTop: 2,
  },
  terminalCard: {
    backgroundColor: '#0A0E14',
    borderRadius: theme.radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  termLine: {
    fontSize: 12,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    color: theme.textSecondary,
    lineHeight: 18,
  },
  termCommand: {
    color: theme.success,
  },
});
