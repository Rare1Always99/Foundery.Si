import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
  Switch,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { theme } from '../../constants/theme';
import { useConstellation } from '../../contexts/ConstellationContext';

const GEOGRAPHY_COLORS: Record<string, string> = {
  USA: '#58A6FF',
  China: '#FF6B35',
  Local: '#3FB950',
};

export default function NodeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { nodes, toggleNode, resetNode } = useConstellation();

  const node = nodes.find((n) => n.id === id);

  if (!node) {
    return (
      <SafeAreaView edges={['top']} style={styles.container}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: theme.textPrimary }}>Node not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const healthColor = node.health === 'healthy' ? theme.success
    : node.health === 'degraded' ? theme.warning
    : theme.error;

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => { Haptics.selectionAsync(); router.back(); }}
        >
          <Ionicons name="chevron-back" size={24} color={theme.textSecondary} />
        </Pressable>
        <Text style={styles.headerTitle}>Node Detail</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.heroSection}>
          <View style={[styles.heroIcon, { backgroundColor: node.color + '20' }]}>
            <Ionicons name={node.icon as any} size={40} color={node.color} />
          </View>
          <Text style={styles.heroId}>{node.id}</Text>
          <Text style={styles.heroRole}>{node.role}</Text>
          <View style={styles.heroBadges}>
            <View style={[styles.geoBadge, { backgroundColor: GEOGRAPHY_COLORS[node.geography] + '15' }]}>
              <Ionicons name="location" size={12} color={GEOGRAPHY_COLORS[node.geography]} />
              <Text style={[styles.geoBadgeText, { color: GEOGRAPHY_COLORS[node.geography] }]}>
                {node.geography}
              </Text>
            </View>
            <View style={[styles.healthBadge, { backgroundColor: healthColor + '15' }]}>
              <View style={[styles.healthIndicator, { backgroundColor: healthColor }]} />
              <Text style={[styles.healthBadgeText, { color: healthColor }]}>
                {node.health}
              </Text>
            </View>
            <View style={styles.layerBadge}>
              <Text style={styles.layerBadgeText}>Layer {node.layer}</Text>
            </View>
          </View>
        </View>

        {/* Toggle */}
        <View style={styles.toggleRow}>
          <View>
            <Text style={styles.toggleLabel}>Node Active</Text>
            <Text style={styles.toggleDesc}>Include in constellation queries</Text>
          </View>
          <Switch
            value={node.enabled}
            onValueChange={() => {
              Haptics.selectionAsync();
              toggleNode(node.id);
            }}
            trackColor={{ false: theme.borderLight, true: theme.primary + '60' }}
            thumbColor={node.enabled ? theme.primary : theme.textMuted}
          />
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONFIGURATION</Text>
          <View style={styles.configGrid}>
            <View style={styles.configItem}>
              <Text style={styles.configLabel}>Model ID</Text>
              <Text style={styles.configValue}>{node.modelId}</Text>
            </View>
            <View style={styles.configItem}>
              <Text style={styles.configLabel}>Weight</Text>
              <Text style={[styles.configValue, { color: theme.primary }]}>{node.weight}x</Text>
            </View>
            <View style={styles.configItem}>
              <Text style={styles.configLabel}>Error Count</Text>
              <Text style={[styles.configValue, node.errorCount > 0 && { color: theme.error }]}>
                {node.errorCount} / {node.maxErrors}
              </Text>
            </View>
            <View style={styles.configItem}>
              <Text style={styles.configLabel}>Last Latency</Text>
              <Text style={styles.configValue}>
                {node.latencyMs !== null ? `${node.latencyMs}ms` : 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Languages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LANGUAGES</Text>
          <View style={styles.chipRow}>
            {node.languages.map((lang, i) => (
              <View key={i} style={styles.langChip}>
                <Text style={styles.langChipText}>{lang}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Specialties */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SPECIALTIES</Text>
          <View style={styles.chipRow}>
            {node.specialties.map((spec, i) => (
              <View key={i} style={[styles.specChip, { backgroundColor: node.color + '12' }]}>
                <Text style={[styles.specChipText, { color: node.color }]}>{spec}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Last Response */}
        {node.lastResponse ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>LAST RESPONSE</Text>
            <View style={styles.responseBox}>
              <Text style={styles.responseText}>{node.lastResponse}</Text>
            </View>
          </View>
        ) : null}

        {/* Circuit Breaker */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CIRCUIT BREAKER</Text>
          <View style={styles.circuitCard}>
            <View style={styles.circuitRow}>
              <Text style={styles.circuitLabel}>Status</Text>
              <Text style={[styles.circuitValue, { color: node.errorCount >= node.maxErrors ? theme.error : theme.success }]}>
                {node.errorCount >= node.maxErrors ? 'OPEN (Failed)' : 'CLOSED (Healthy)'}
              </Text>
            </View>
            <View style={styles.circuitRow}>
              <Text style={styles.circuitLabel}>Errors</Text>
              <View style={styles.errorBar}>
                <View style={[styles.errorFill, { width: `${(node.errorCount / node.maxErrors) * 100}%`, backgroundColor: node.errorCount > 0 ? theme.error : theme.success }]} />
              </View>
            </View>
            <View style={styles.circuitRow}>
              <Text style={styles.circuitLabel}>Tolerance</Text>
              <Text style={styles.circuitValue}>{node.maxErrors} consecutive errors</Text>
            </View>
            {node.errorCount > 0 ? (
              <Pressable
                style={styles.resetBtn}
                onPress={() => {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  resetNode(node.id);
                }}
              >
                <Ionicons name="refresh" size={16} color={theme.textInverse} />
                <Text style={styles.resetBtnText}>Reset Circuit Breaker</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '600', color: theme.textPrimary },
  heroSection: { alignItems: 'center', paddingVertical: 28 },
  heroIcon: { width: 72, height: 72, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  heroId: {
    fontSize: 32, fontWeight: '700', color: theme.textPrimary,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    marginBottom: 4,
  },
  heroRole: { fontSize: 15, color: theme.textSecondary, marginBottom: 16 },
  heroBadges: { flexDirection: 'row', gap: 8 },
  geoBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 100 },
  geoBadgeText: { fontSize: 12, fontWeight: '600' },
  healthBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 100 },
  healthIndicator: { width: 6, height: 6, borderRadius: 3 },
  healthBadgeText: { fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  layerBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 100, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.borderLight },
  layerBadgeText: { fontSize: 12, fontWeight: '600', color: theme.textSecondary },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: theme.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.borderLight,
    marginBottom: 20,
  },
  toggleLabel: { fontSize: 15, fontWeight: '600', color: theme.textPrimary },
  toggleDesc: { fontSize: 12, color: theme.textSecondary, marginTop: 2 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 11, fontWeight: '600', color: theme.textSecondary, letterSpacing: 0.5, marginBottom: 10 },
  configGrid: { backgroundColor: theme.surface, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.borderLight, overflow: 'hidden' },
  configItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
  },
  configLabel: { fontSize: 13, color: theme.textSecondary },
  configValue: {
    fontSize: 13, fontWeight: '600', color: theme.textPrimary,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  langChip: {
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: theme.radius.full,
    backgroundColor: theme.surface,
    borderWidth: 1, borderColor: theme.borderLight,
  },
  langChipText: { fontSize: 12, fontWeight: '600', color: theme.textPrimary },
  specChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: theme.radius.full },
  specChipText: { fontSize: 12, fontWeight: '600' },
  responseBox: {
    backgroundColor: '#0A0E14',
    borderRadius: theme.radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  responseText: {
    fontSize: 12, color: theme.textSecondary, lineHeight: 18,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
  },
  circuitCard: {
    backgroundColor: theme.surface,
    borderRadius: theme.radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.borderLight,
    gap: 12,
  },
  circuitRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  circuitLabel: { fontSize: 13, color: theme.textSecondary },
  circuitValue: { fontSize: 13, fontWeight: '600', color: theme.textPrimary },
  errorBar: {
    width: 120, height: 6, borderRadius: 3,
    backgroundColor: theme.borderLight,
    overflow: 'hidden',
  },
  errorFill: { height: '100%', borderRadius: 3 },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: theme.primary,
    borderRadius: theme.radius.sm,
    paddingVertical: 10,
    marginTop: 4,
  },
  resetBtnText: { fontSize: 13, fontWeight: '600', color: theme.textInverse },
});
