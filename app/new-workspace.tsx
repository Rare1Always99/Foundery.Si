import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { theme } from '../constants/theme';
import { useApp } from '../contexts/AppContext';

const languageOptions = [
  { id: 'typescript', label: 'TypeScript', icon: 'logo-nodejs', color: '#3178C6' },
  { id: 'javascript', label: 'JavaScript', icon: 'logo-javascript', color: '#F1E05A' },
  { id: 'python', label: 'Python', icon: 'logo-python', color: '#3572A5' },
  { id: 'rust', label: 'Rust', icon: 'hardware-chip', color: '#DEA584' },
  { id: 'go', label: 'Go', icon: 'code-slash', color: '#00ADD8' },
  { id: 'shell', label: 'Shell / Bash', icon: 'terminal', color: '#89E051' },
  { id: 'html', label: 'HTML / CSS', icon: 'logo-html5', color: '#E34C26' },
  { id: 'markdown', label: 'Markdown', icon: 'document-text', color: '#083FA1' },
];

export default function NewWorkspaceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { createWorkspace } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('typescript');

  const handleCreate = () => {
    if (!name.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    createWorkspace(name.trim(), selectedLanguage, description.trim() || `${selectedLanguage} project`);
    router.back();
  };

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
          <Ionicons name="close" size={22} color={theme.textSecondary} />
        </Pressable>
        <Text style={styles.headerTitle}>New Workspace</Text>
        <Pressable
          style={[styles.createBtn, !name.trim() && styles.createBtnDisabled]}
          onPress={handleCreate}
          disabled={!name.trim()}
        >
          <Text
            style={[
              styles.createBtnText,
              !name.trim() && styles.createBtnTextDisabled,
            ]}
          >
            Create
          </Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: insets.bottom + 24,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>PROJECT NAME</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={(text) => setName(text.replace(/\s/g, '-').toLowerCase())}
              placeholder="my-awesome-project"
              placeholderTextColor={theme.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
              keyboardAppearance="dark"
            />
            <Text style={styles.inputHint}>
              Lowercase, hyphens allowed. This becomes your project folder name.
            </Text>
          </View>

          {/* Description Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>DESCRIPTION</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Brief description of your project..."
              placeholderTextColor={theme.textMuted}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              keyboardAppearance="dark"
            />
          </View>

          {/* Language Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>LANGUAGE / RUNTIME</Text>
            <View style={styles.langGrid}>
              {languageOptions.map((lang) => (
                <Pressable
                  key={lang.id}
                  style={[
                    styles.langCard,
                    selectedLanguage === lang.id && styles.langCardActive,
                    selectedLanguage === lang.id && {
                      borderColor: lang.color,
                    },
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setSelectedLanguage(lang.id);
                  }}
                >
                  <Ionicons
                    name={lang.icon as any}
                    size={22}
                    color={
                      selectedLanguage === lang.id ? lang.color : theme.textMuted
                    }
                  />
                  <Text
                    style={[
                      styles.langLabel,
                      selectedLanguage === lang.id && { color: theme.textPrimary },
                    ]}
                  >
                    {lang.label}
                  </Text>
                  {selectedLanguage === lang.id && (
                    <View style={[styles.langCheck, { backgroundColor: lang.color }]}>
                      <Ionicons name="checkmark" size={12} color="#fff" />
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          </View>

          {/* Template Info */}
          <View style={styles.templateInfo}>
            <Ionicons name="information-circle" size={16} color={theme.textMuted} />
            <Text style={styles.templateText}>
              A starter file will be created based on your language selection. You can add more files later.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  createBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.primary,
  },
  createBtnDisabled: {
    backgroundColor: theme.surface,
  },
  createBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textInverse,
  },
  createBtnTextDisabled: {
    color: theme.textMuted,
  },
  inputGroup: {
    marginTop: 24,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: theme.surface,
    borderRadius: theme.radius.md,
    padding: 14,
    fontSize: 15,
    color: theme.textPrimary,
    borderWidth: 1,
    borderColor: theme.borderLight,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
  },
  textArea: {
    height: 80,
    fontFamily: undefined,
  },
  inputHint: {
    fontSize: 12,
    color: theme.textMuted,
    marginTop: 6,
  },
  langGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  langCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: theme.radius.md,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  langCardActive: {
    backgroundColor: theme.surfaceElevated,
  },
  langLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.textMuted,
    flex: 1,
  },
  langCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 24,
    padding: 14,
    backgroundColor: theme.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  templateText: {
    fontSize: 13,
    color: theme.textMuted,
    flex: 1,
    lineHeight: 19,
  },
});
