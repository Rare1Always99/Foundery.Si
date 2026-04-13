import React, { useState, useRef } from 'react';
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
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { theme } from '../../constants/theme';
import { useApp } from '../../contexts/AppContext';

export default function EditorScreen() {
  const insets = useSafeAreaInsets();
  const {
    activeWorkspace,
    activeFile,
    setActiveFile,
    updateFileContent,
    addTerminalEntry,
    workspaces,
    setActiveWorkspace,
  } = useApp();
  const [terminalInput, setTerminalInput] = useState('');
  const [showTerminal, setShowTerminal] = useState(true);
  const [editingContent, setEditingContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const terminalScrollRef = useRef<ScrollView>(null);

  // Use first workspace if none active
  const workspace = activeWorkspace || workspaces[0] || null;
  const currentFile = activeFile || workspace?.files[0] || null;

  const handleFileSelect = (file: typeof currentFile) => {
    if (!file) return;
    Haptics.selectionAsync();
    setActiveFile(file);
    setIsEditing(false);
  };

  const handleEditStart = () => {
    if (!currentFile) return;
    setEditingContent(currentFile.content);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!workspace || !currentFile) return;
    updateFileContent(workspace.id, currentFile.id, editingContent);
    setIsEditing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleTerminalSubmit = () => {
    if (!terminalInput.trim() || !workspace) return;
    addTerminalEntry(workspace.id, `$ ${terminalInput}`);

    // Mock responses
    const cmd = terminalInput.trim().toLowerCase();
    if (cmd === 'ls') {
      addTerminalEntry(workspace.id, workspace.files.map((f) => f.name).join('  '));
    } else if (cmd === 'pwd') {
      addTerminalEntry(workspace.id, `/home/dev/${workspace.name}`);
    } else if (cmd === 'whoami') {
      addTerminalEntry(workspace.id, 'developer');
    } else if (cmd === 'date') {
      addTerminalEntry(workspace.id, new Date().toString());
    } else if (cmd.startsWith('echo ')) {
      addTerminalEntry(workspace.id, terminalInput.slice(5));
    } else if (cmd === 'clear') {
      // Clear handled differently
    } else if (cmd === 'help') {
      addTerminalEntry(workspace.id, 'Available: ls, pwd, whoami, date, echo, clear, help');
    } else {
      addTerminalEntry(workspace.id, `bash: ${terminalInput}: command simulated`);
    }

    setTerminalInput('');
    setTimeout(() => terminalScrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const getLineNumbers = (content: string) => {
    const lines = content.split('\n');
    return lines.map((_, i) => i + 1);
  };

  const colorizeCode = (content: string) => {
    return content;
  };

  if (!workspace) {
    return (
      <SafeAreaView edges={['top']} style={styles.container}>
        <View style={styles.noWorkspace}>
          <Ionicons name="code-slash-outline" size={48} color={theme.textMuted} />
          <Text style={styles.noWsTitle}>No workspace open</Text>
          <Text style={styles.noWsDesc}>Select a project from the Projects tab</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <Ionicons name="code-slash" size={18} color={theme.primary} />
          <Text style={styles.topBarTitle} numberOfLines={1}>
            {workspace.name}
          </Text>
        </View>
        <View style={styles.topBarActions}>
          {isEditing ? (
            <Pressable style={styles.saveBtn} onPress={handleSave}>
              <Ionicons name="checkmark" size={18} color={theme.textInverse} />
              <Text style={styles.saveBtnText}>Save</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.actionBtn} onPress={handleEditStart}>
              <MaterialIcons name="edit" size={18} color={theme.textSecondary} />
            </Pressable>
          )}
          <Pressable
            style={styles.actionBtn}
            onPress={() => {
              Haptics.selectionAsync();
              setShowTerminal(!showTerminal);
            }}
          >
            <Ionicons
              name="terminal"
              size={18}
              color={showTerminal ? theme.primary : theme.textSecondary}
            />
          </Pressable>
        </View>
      </View>

      {/* File Tabs */}
      <View style={styles.fileTabs}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12, gap: 4 }}
        >
          {workspace.files.map((file) => (
            <Pressable
              key={file.id}
              style={[
                styles.fileTab,
                currentFile?.id === file.id && styles.fileTabActive,
              ]}
              onPress={() => handleFileSelect(file)}
            >
              <Ionicons
                name="document-text"
                size={14}
                color={
                  currentFile?.id === file.id ? theme.primary : theme.textMuted
                }
              />
              <Text
                style={[
                  styles.fileTabText,
                  currentFile?.id === file.id && styles.fileTabTextActive,
                ]}
              >
                {file.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Editor Area */}
      <View style={{ flex: 1 }}>
        <ScrollView
          style={styles.editorScroll}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {currentFile && (
            <View style={styles.editorContent}>
              {/* Line Numbers */}
              <View style={styles.lineNumbers}>
                {getLineNumbers(
                  isEditing ? editingContent : currentFile.content
                ).map((num) => (
                  <Text key={num} style={styles.lineNumber}>
                    {num}
                  </Text>
                ))}
              </View>
              {/* Code */}
              <View style={styles.codeArea}>
                {isEditing ? (
                  <TextInput
                    style={styles.codeInput}
                    value={editingContent}
                    onChangeText={setEditingContent}
                    multiline
                    autoCapitalize="none"
                    autoCorrect={false}
                    spellCheck={false}
                    textAlignVertical="top"
                    keyboardAppearance="dark"
                    scrollEnabled={false}
                  />
                ) : (
                  <Text style={styles.codeText} selectable>
                    {renderSyntaxHighlighted(currentFile.content, currentFile.language)}
                  </Text>
                )}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Terminal Panel */}
        {showTerminal && (
          <View style={styles.terminalPanel}>
            <View style={styles.terminalHeader}>
              <View style={styles.terminalHeaderLeft}>
                <Ionicons name="terminal" size={14} color={theme.success} />
                <Text style={styles.terminalTitle}>TERMINAL</Text>
              </View>
              <Pressable onPress={() => setShowTerminal(false)}>
                <Ionicons name="close" size={16} color={theme.textMuted} />
              </Pressable>
            </View>
            <ScrollView
              ref={terminalScrollRef}
              style={styles.terminalOutput}
              contentContainerStyle={{ paddingBottom: 8 }}
            >
              {workspace.terminalHistory.map((line, i) => (
                <Text
                  key={i}
                  style={[
                    styles.terminalLine,
                    line.startsWith('$') && styles.terminalCommand,
                  ]}
                >
                  {line}
                </Text>
              ))}
            </ScrollView>
            <View style={styles.terminalInputRow}>
              <Text style={styles.terminalPrompt}>$</Text>
              <TextInput
                style={styles.terminalInputField}
                value={terminalInput}
                onChangeText={setTerminalInput}
                onSubmitEditing={handleTerminalSubmit}
                placeholder="Type a command..."
                placeholderTextColor={theme.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardAppearance="dark"
                returnKeyType="send"
              />
            </View>
          </View>
        )}
      </View>

      {/* Bottom Status Bar */}
      <View style={[styles.statusBar, { paddingBottom: Math.max(insets.bottom, 4) }]}>
        <Text style={styles.statusText}>
          {currentFile?.language || 'plaintext'}
        </Text>
        <Text style={styles.statusText}>
          {(isEditing ? editingContent : currentFile?.content || '').split('\n').length} lines
        </Text>
        <Text style={styles.statusText}>UTF-8</Text>
        <Text style={styles.statusText}>
          {isEditing ? '● Modified' : '✓ Saved'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

// Simple syntax highlighting renderer
function renderSyntaxHighlighted(content: string, language: string) {
  const lines = content.split('\n');
  const keywords = [
    'import', 'from', 'export', 'default', 'const', 'let', 'var', 'function',
    'return', 'if', 'else', 'for', 'while', 'class', 'new', 'async', 'await',
    'try', 'catch', 'throw', 'typeof', 'interface', 'type', 'enum', 'extends',
    'implements', 'def', 'print', 'self', 'True', 'False', 'None', 'fn', 'let',
    'mut', 'pub', 'use', 'struct', 'impl', 'match', 'Some', 'package', 'func',
    'fmt', 'http', 'sudo', 'apt', 'npm', 'pip', 'docker', 'git',
  ];
  
  return (
    <Text>
      {lines.map((line, lineIdx) => {
        const parts: React.ReactNode[] = [];
        
        // Comment lines
        if (line.trim().startsWith('//') || line.trim().startsWith('#')) {
          parts.push(
            <Text key={`${lineIdx}-comment`} style={{ color: theme.syntax.comment }}>
              {line}
            </Text>
          );
        }
        // String lines
        else if (line.includes("'") || line.includes('"') || line.includes('`')) {
          // Simple approach: colorize keywords, rest default
          const words = line.split(/(\s+)/);
          words.forEach((word, wi) => {
            if (keywords.includes(word)) {
              parts.push(
                <Text key={`${lineIdx}-${wi}`} style={{ color: theme.syntax.keyword }}>
                  {word}
                </Text>
              );
            } else if (/^['"`]/.test(word) || /['"`]$/.test(word)) {
              parts.push(
                <Text key={`${lineIdx}-${wi}`} style={{ color: theme.syntax.string }}>
                  {word}
                </Text>
              );
            } else if (/^\d+$/.test(word)) {
              parts.push(
                <Text key={`${lineIdx}-${wi}`} style={{ color: theme.syntax.number }}>
                  {word}
                </Text>
              );
            } else {
              parts.push(
                <Text key={`${lineIdx}-${wi}`} style={{ color: theme.textPrimary }}>
                  {word}
                </Text>
              );
            }
          });
        } else {
          const words = line.split(/(\s+)/);
          words.forEach((word, wi) => {
            if (keywords.includes(word)) {
              parts.push(
                <Text key={`${lineIdx}-${wi}`} style={{ color: theme.syntax.keyword }}>
                  {word}
                </Text>
              );
            } else if (/^\d+$/.test(word)) {
              parts.push(
                <Text key={`${lineIdx}-${wi}`} style={{ color: theme.syntax.number }}>
                  {word}
                </Text>
              );
            } else if (/^[A-Z][a-zA-Z]+$/.test(word)) {
              parts.push(
                <Text key={`${lineIdx}-${wi}`} style={{ color: theme.syntax.type }}>
                  {word}
                </Text>
              );
            } else if (word.endsWith('(') || word.endsWith(')')) {
              parts.push(
                <Text key={`${lineIdx}-${wi}`} style={{ color: theme.syntax.function }}>
                  {word}
                </Text>
              );
            } else {
              parts.push(
                <Text key={`${lineIdx}-${wi}`} style={{ color: theme.textPrimary }}>
                  {word}
                </Text>
              );
            }
          });
        }

        return (
          <Text key={lineIdx} style={{ fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }), fontSize: 13, lineHeight: 20 }}>
            {parts}
            {lineIdx < lines.length - 1 ? '\n' : ''}
          </Text>
        );
      })}
    </Text>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  topBarTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.textPrimary,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
  },
  topBarActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.primary,
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.textInverse,
  },
  fileTabs: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    justifyContent: 'center',
  },
  fileTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.sm,
    backgroundColor: 'transparent',
  },
  fileTabActive: {
    backgroundColor: theme.surface,
  },
  fileTabText: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.textMuted,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
  },
  fileTabTextActive: {
    color: theme.textPrimary,
  },
  editorScroll: {
    flex: 1,
  },
  editorContent: {
    flexDirection: 'row',
    paddingTop: 8,
  },
  lineNumbers: {
    width: 44,
    alignItems: 'flex-end',
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: theme.borderLight,
  },
  lineNumber: {
    fontSize: 13,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    color: theme.textMuted,
    lineHeight: 20,
  },
  codeArea: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 16,
  },
  codeText: {
    fontSize: 13,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    color: theme.textPrimary,
    lineHeight: 20,
  },
  codeInput: {
    fontSize: 13,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    color: theme.textPrimary,
    lineHeight: 20,
    padding: 0,
    margin: 0,
  },
  terminalPanel: {
    height: 200,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    backgroundColor: '#0A0E14',
  },
  terminalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
  },
  terminalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  terminalTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.textSecondary,
    letterSpacing: 0.5,
  },
  terminalOutput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 6,
  },
  terminalLine: {
    fontSize: 12,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    color: theme.textSecondary,
    lineHeight: 18,
  },
  terminalCommand: {
    color: theme.success,
  },
  terminalInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: theme.borderLight,
    gap: 6,
  },
  terminalPrompt: {
    fontSize: 13,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    color: theme.success,
    fontWeight: '700',
  },
  terminalInputField: {
    flex: 1,
    fontSize: 13,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    color: theme.textPrimary,
    padding: 0,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 16,
    backgroundColor: theme.surface,
    borderTopWidth: 1,
    borderTopColor: theme.borderLight,
  },
  statusText: {
    fontSize: 11,
    color: theme.textMuted,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
  },
  noWorkspace: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  noWsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  noWsDesc: {
    fontSize: 14,
    color: theme.textSecondary,
  },
});
