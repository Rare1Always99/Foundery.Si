import React, { useState, useRef, useEffect } from 'react';
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
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { theme } from '../../constants/theme';
import { config } from '../../constants/config';
import { useApp } from '../../contexts/AppContext';
import { suggestedPrompts } from '../../services/mockData';

export default function AssistantScreen() {
  const insets = useSafeAreaInsets();
  const {
    chatSessions,
    activeChatSession,
    setActiveChatSession,
    selectedModel,
    setSelectedModel,
    sendMessage,
    deleteChatSession,
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (activeChatSession?.messages.length) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 200);
    }
  }, [activeChatSession?.messages.length]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    Haptics.selectionAsync();
    sendMessage(inputText.trim());
    setInputText('');
  };

  const handleSuggestedPrompt = (prompt: string) => {
    Haptics.selectionAsync();
    setInputText(prompt);
  };

  const currentModel = config.models.find((m) => m.id === selectedModel) || config.models[0];

  const renderMessage = (msg: typeof activeChatSession extends { messages: (infer M)[] } | null ? M : never) => {
    const isUser = msg.role === 'user';

    return (
      <View
        key={msg.id}
        style={[styles.messageBubble, isUser ? styles.userBubble : styles.assistantBubble]}
      >
        {!isUser && (
          <View style={styles.assistantHeader}>
            <View style={styles.modelBadge}>
              <Ionicons name="sparkles" size={12} color={theme.accent} />
              <Text style={styles.modelBadgeText}>{msg.model || selectedModel}</Text>
            </View>
            <Text style={styles.messageTime}>{msg.timestamp}</Text>
          </View>
        )}
        <Text style={[styles.messageText, isUser && styles.userText]}>
          {renderFormattedText(msg.content)}
        </Text>
        {isUser && (
          <Text style={[styles.messageTime, { textAlign: 'right', marginTop: 4 }]}>
            {msg.timestamp}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {activeChatSession ? (
            <Pressable
              style={styles.backBtn}
              onPress={() => {
                Haptics.selectionAsync();
                setActiveChatSession(null);
              }}
            >
              <Ionicons name="chevron-back" size={20} color={theme.textSecondary} />
            </Pressable>
          ) : null}
          <View>
            <Text style={styles.headerTitle}>
              {activeChatSession ? activeChatSession.title : 'AI Assistant'}
            </Text>
            <Pressable
              style={styles.modelSelector}
              onPress={() => {
                Haptics.selectionAsync();
                setShowModelPicker(!showModelPicker);
              }}
            >
              <Ionicons name="sparkles" size={12} color={theme.accent} />
              <Text style={styles.modelName}>{currentModel.name}</Text>
              <Ionicons name="chevron-down" size={12} color={theme.textMuted} />
            </Pressable>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Pressable
            style={styles.headerBtn}
            onPress={() => {
              Haptics.selectionAsync();
              setShowHistory(!showHistory);
            }}
          >
            <Ionicons name="time-outline" size={20} color={theme.textSecondary} />
          </Pressable>
          <Pressable
            style={styles.headerBtn}
            onPress={() => {
              Haptics.selectionAsync();
              setActiveChatSession(null);
            }}
          >
            <Ionicons name="add" size={20} color={theme.primary} />
          </Pressable>
        </View>
      </View>

      {/* Model Picker */}
      {showModelPicker && (
        <View style={styles.modelPicker}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
            {config.models.map((model) => (
              <Pressable
                key={model.id}
                style={[
                  styles.modelCard,
                  selectedModel === model.id && styles.modelCardActive,
                ]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedModel(model.id);
                  setShowModelPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.modelCardName,
                    selectedModel === model.id && styles.modelCardNameActive,
                  ]}
                >
                  {model.name}
                </Text>
                <Text style={styles.modelCardDesc}>{model.description}</Text>
                <View style={styles.modelCardMeta}>
                  <Text style={styles.modelCardSize}>{model.size}</Text>
                  <Text style={styles.modelCardSpeed}>{model.speed}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Chat History Panel */}
      {showHistory && !activeChatSession && (
        <View style={styles.historyPanel}>
          <Text style={styles.historyTitle}>Recent Conversations</Text>
          <ScrollView style={{ maxHeight: 200 }}>
            {chatSessions.map((session) => (
              <Pressable
                key={session.id}
                style={styles.historyItem}
                onPress={() => {
                  setActiveChatSession(session);
                  setShowHistory(false);
                }}
              >
                <View style={styles.historyItemLeft}>
                  <Ionicons name="chatbubble-outline" size={16} color={theme.textMuted} />
                  <View>
                    <Text style={styles.historyItemTitle} numberOfLines={1}>{session.title}</Text>
                    <Text style={styles.historyItemMeta}>
                      {session.model} · {session.messages.length} messages · {session.createdAt}
                    </Text>
                  </View>
                </View>
                <Pressable
                  onPress={() => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                    deleteChatSession(session.id);
                  }}
                >
                  <Ionicons name="trash-outline" size={16} color={theme.error} />
                </Pressable>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Messages / Empty State */}
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 16,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {activeChatSession && activeChatSession.messages.length > 0 ? (
            activeChatSession.messages.map((msg) => renderMessage(msg))
          ) : (
            <View style={styles.emptyChat}>
              <Image
                source={require('../../assets/images/ai-assistant.png')}
                style={styles.emptyChatImage}
                contentFit="contain"
              />
              <Text style={styles.emptyChatTitle}>Local AI Assistant</Text>
              <Text style={styles.emptyChatDesc}>
                Powered by Ollama · Mistral · CodeLlama · Qwen{'\n'}
                All processing happens on your machine
              </Text>

              {/* Suggested Prompts */}
              <View style={styles.suggestedGrid}>
                {suggestedPrompts.slice(0, 4).map((prompt, i) => (
                  <Pressable
                    key={i}
                    style={({ pressed }) => [
                      styles.suggestedCard,
                      pressed && { opacity: 0.7 },
                    ]}
                    onPress={() => handleSuggestedPrompt(prompt)}
                  >
                    <Ionicons
                      name={['code-slash', 'terminal', 'key', 'git-branch'][i] as any}
                      size={16}
                      color={theme.accent}
                    />
                    <Text style={styles.suggestedText} numberOfLines={2}>
                      {prompt}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={[styles.inputArea, { paddingBottom: Math.max(insets.bottom, 8) }]}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder={`Ask ${currentModel.name}...`}
              placeholderTextColor={theme.textMuted}
              multiline
              maxLength={2000}
              keyboardAppearance="dark"
              returnKeyType="default"
            />
            <Pressable
              style={[
                styles.sendBtn,
                !inputText.trim() && styles.sendBtnDisabled,
              ]}
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <Ionicons
                name="send"
                size={18}
                color={inputText.trim() ? theme.textInverse : theme.textMuted}
              />
            </Pressable>
          </View>
          <Text style={styles.disclaimer}>
            Responses generated locally via {currentModel.name} (mocked)
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Simple markdown-ish text renderer
function renderFormattedText(text: string) {
  const parts = text.split(/(```[\s\S]*?```|\*\*.*?\*\*|`.*?`)/g);

  return (
    <Text>
      {parts.map((part, i) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const code = part.slice(3, -3).replace(/^[a-z]+\n/, '');
          return (
            <Text
              key={i}
              style={{
                fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
                fontSize: 12,
                color: theme.syntax.string,
                backgroundColor: '#0A0E14',
              }}
            >
              {'\n'}{code}{'\n'}
            </Text>
          );
        }
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <Text key={i} style={{ fontWeight: '700', color: theme.textPrimary }}>
              {part.slice(2, -2)}
            </Text>
          );
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <Text
              key={i}
              style={{
                fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
                fontSize: 12,
                backgroundColor: theme.surface,
                color: theme.primary,
                paddingHorizontal: 4,
              }}
            >
              {part.slice(1, -1)}
            </Text>
          );
        }
        return <Text key={i}>{part}</Text>;
      })}
    </Text>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  modelSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  modelName: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.accent,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 6,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modelPicker: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  modelCard: {
    width: 160,
    padding: 12,
    borderRadius: theme.radius.md,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  modelCardActive: {
    borderColor: theme.accent,
    backgroundColor: theme.accent + '10',
  },
  modelCardName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textPrimary,
    marginBottom: 4,
  },
  modelCardNameActive: {
    color: theme.accent,
  },
  modelCardDesc: {
    fontSize: 11,
    color: theme.textSecondary,
    marginBottom: 8,
  },
  modelCardMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  modelCardSize: {
    fontSize: 10,
    color: theme.textMuted,
    fontWeight: '600',
  },
  modelCardSpeed: {
    fontSize: 10,
    color: theme.success,
    fontWeight: '600',
  },
  historyPanel: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    backgroundColor: theme.backgroundSecondary,
  },
  historyTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
  },
  historyItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  historyItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.textPrimary,
  },
  historyItemMeta: {
    fontSize: 11,
    color: theme.textMuted,
    marginTop: 2,
  },
  messageBubble: {
    maxWidth: '90%',
    padding: 14,
    borderRadius: theme.radius.lg,
    marginTop: 12,
  },
  userBubble: {
    backgroundColor: theme.primary + '20',
    borderColor: theme.primary + '30',
    borderWidth: 1,
    alignSelf: 'flex-end',
  },
  assistantBubble: {
    backgroundColor: theme.surface,
    borderColor: theme.borderLight,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  assistantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: theme.accent + '15',
    borderRadius: theme.radius.sm,
  },
  modelBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.accent,
  },
  messageText: {
    fontSize: 14,
    color: theme.textPrimary,
    lineHeight: 21,
  },
  userText: {
    color: theme.textPrimary,
  },
  messageTime: {
    fontSize: 10,
    color: theme.textMuted,
  },
  emptyChat: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  emptyChatImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
    opacity: 0.8,
  },
  emptyChatTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.textPrimary,
    marginBottom: 8,
  },
  emptyChatDesc: {
    fontSize: 13,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  suggestedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    width: '100%',
    paddingHorizontal: 8,
  },
  suggestedCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: theme.radius.md,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  suggestedText: {
    fontSize: 12,
    color: theme.textSecondary,
    flex: 1,
    lineHeight: 17,
  },
  inputArea: {
    paddingHorizontal: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    backgroundColor: theme.backgroundSecondary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    backgroundColor: theme.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: theme.textPrimary,
    maxHeight: 100,
    lineHeight: 20,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: theme.surface,
  },
  disclaimer: {
    fontSize: 10,
    color: theme.textMuted,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 4,
  },
});
