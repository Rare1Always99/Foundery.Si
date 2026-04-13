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
import { useConstellation } from '../../contexts/ConstellationContext';
import { VERDICT_CONFIG, FRAUD_MARKERS } from '../../services/constellation';

const GEOGRAPHY_COLORS: Record<string, string> = {
  USA: '#58A6FF',
  China: '#FF6B35',
  Local: '#3FB950',
};

export default function VerdictDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { verdicts } = useConstellation();

  const verdict = verdicts.find((v) => v.id === id);

  if (!verdict) {
    return (
      <SafeAreaView edges={['top']} style={styles.container}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: theme.textPrimary }}>Verdict not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const vConfig = VERDICT_CONFIG[verdict.verdict];

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => { Haptics.selectionAsync(); router.back(); }}
        >
          <Ionicons name="chevron-down" size={24} color={theme.textSecondary} />
        </Pressable>
        <Text style={styles.headerTitle}>Verdict Report</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Verdict Hero */}
        <View style={[styles.verdictHero, { borderColor: vConfig.color + '30' }]}>
          <Text style={styles.verdictEmoji}>{vConfig.emoji}</Text>
          <Text style={[styles.verdictLevel, { color: vConfig.color }]}>{verdict.verdict}</Text>
          <View style={styles.scoreRow}>
            <Text style={[styles.scoreValue, { color: vConfig.color }]}>{verdict.weightedScore}%</Text>
            <Text style={styles.scoreLabel}>Weighted Alert Ratio</Text>
          </View>
          <Text style={styles.verdictQuery}>{verdict.query}</Text>
          <Text style={styles.verdictTime}>
            {new Date(verdict.timestamp).toLocaleString()}
          </Text>
        </View>

        {/* Summary Stats */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={[styles.summaryValue, { color: theme.error }]}>{verdict.alertNodes.length}</Text>
            <Text style={styles.summaryLabel}>ALERTING</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={[styles.summaryValue, { color: theme.success }]}>{verdict.secureNodes.length}</Text>
            <Text style={styles.summaryLabel}>SECURE</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{verdict.nodeResults.length}</Text>
            <Text style={styles.summaryLabel}>NODES</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{verdict.totalWeight}</Text>
            <Text style={styles.summaryLabel}>WEIGHT</Text>
          </View>
        </View>

        {/* Synthesis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SYNTHESIS</Text>
          <View style={styles.synthesisBox}>
            <Text style={styles.synthesisText}>{verdict.synthesis}</Text>
          </View>
        </View>

        {/* Geographic Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GEOGRAPHIC BREAKDOWN — ALERTS</Text>
          <View style={styles.geoBreakdown}>
            {Object.entries(verdict.geographicBreakdown).map(([geo, count]) => (
              <View key={geo} style={styles.geoItem}>
                <View style={[styles.geoBar, { backgroundColor: GEOGRAPHY_COLORS[geo] + '15' }]}>
                  <View style={[styles.geoBarFill, {
                    backgroundColor: GEOGRAPHY_COLORS[geo],
                    width: count > 0 ? `${Math.max(15, (count / verdict.alertNodes.length) * 100)}%` : '0%',
                  }]} />
                </View>
                <View style={styles.geoItemInfo}>
                  <Text style={[styles.geoItemLabel, { color: GEOGRAPHY_COLORS[geo] }]}>{geo}</Text>
                  <Text style={styles.geoItemCount}>{count} alerts</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Multilingual Flags */}
        {verdict.multilingualFlags.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>MULTILINGUAL FLAGS</Text>
            {verdict.multilingualFlags.map((flag, i) => (
              <View key={i} style={styles.flagCard}>
                <Ionicons name="language" size={16} color={theme.warning} />
                <Text style={styles.flagText}>{flag}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Node Results */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NODE-BY-NODE ANALYSIS</Text>
          {verdict.nodeResults.map((result) => (
            <View key={result.nodeId} style={[styles.resultCard, {
              borderLeftColor: result.alerting ? theme.error : theme.success,
            }]}>
              <View style={styles.resultHeader}>
                <View style={styles.resultHeaderLeft}>
                  <Text style={styles.resultNodeId}>{result.nodeId}</Text>
                  <View style={[styles.resultBadge, {
                    backgroundColor: result.alerting ? theme.error + '15' : theme.success + '15',
                  }]}>
                    <Text style={[styles.resultBadgeText, {
                      color: result.alerting ? theme.error : theme.success,
                    }]}>
                      {result.alerting ? 'ALERT' : 'SECURE'}
                    </Text>
                  </View>
                </View>
                <View style={styles.resultHeaderRight}>
                  <View style={[styles.resultGeo, { backgroundColor: GEOGRAPHY_COLORS[result.geography] + '15' }]}>
                    <Text style={[styles.resultGeoText, { color: GEOGRAPHY_COLORS[result.geography] }]}>
                      {result.geography}
                    </Text>
                  </View>
                  <Text style={styles.resultLatency}>{result.latencyMs}ms</Text>
                </View>
              </View>
              <Text style={styles.resultRole}>{result.role} · Weight: {result.weight}x</Text>
              <View style={styles.resultResponseBox}>
                <Text style={styles.resultResponse}>{result.response}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Fraud Markers Reference */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FRAUD MARKER REFERENCE</Text>
          {FRAUD_MARKERS.slice(0, 3).map((fm) => (
            <View key={fm.code} style={styles.markerCard}>
              <View style={styles.markerHeader}>
                <Text style={styles.markerLang}>{fm.language}</Text>
                <Text style={styles.markerCode}>{fm.code}</Text>
              </View>
              {fm.markers.slice(0, 3).map((m, i) => (
                <View key={i} style={styles.markerRow}>
                  <Text style={styles.markerTerm}>{m.term}</Text>
                  <Text style={styles.markerTranslation}>{m.translation}</Text>
                </View>
              ))}
            </View>
          ))}
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
  verdictHero: {
    alignItems: 'center',
    paddingVertical: 28,
    marginTop: 8,
    backgroundColor: theme.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
  },
  verdictEmoji: { fontSize: 48, marginBottom: 8 },
  verdictLevel: { fontSize: 24, fontWeight: '700', letterSpacing: 2, marginBottom: 12 },
  scoreRow: { alignItems: 'center', marginBottom: 16 },
  scoreValue: { fontSize: 48, fontWeight: '700' },
  scoreLabel: { fontSize: 12, color: theme.textSecondary, marginTop: 2 },
  verdictQuery: { fontSize: 14, color: theme.textPrimary, textAlign: 'center', paddingHorizontal: 20, lineHeight: 20 },
  verdictTime: { fontSize: 11, color: theme.textMuted, marginTop: 8 },
  summaryRow: { flexDirection: 'row', gap: 8, marginTop: 16 },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: theme.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  summaryValue: { fontSize: 22, fontWeight: '700', color: theme.textPrimary },
  summaryLabel: { fontSize: 9, fontWeight: '600', color: theme.textMuted, letterSpacing: 0.5, marginTop: 2 },
  section: { marginTop: 24 },
  sectionTitle: { fontSize: 11, fontWeight: '600', color: theme.textSecondary, letterSpacing: 0.5, marginBottom: 10 },
  synthesisBox: {
    backgroundColor: theme.surface,
    borderRadius: theme.radius.md,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  synthesisText: { fontSize: 14, color: theme.textPrimary, lineHeight: 22 },
  geoBreakdown: { gap: 8 },
  geoItem: { gap: 6 },
  geoBar: { height: 8, borderRadius: 4, overflow: 'hidden' },
  geoBarFill: { height: '100%', borderRadius: 4 },
  geoItemInfo: { flexDirection: 'row', justifyContent: 'space-between' },
  geoItemLabel: { fontSize: 12, fontWeight: '600' },
  geoItemCount: { fontSize: 12, color: theme.textMuted },
  flagCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    backgroundColor: theme.warning + '08',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.warning + '20',
    marginBottom: 6,
  },
  flagText: { fontSize: 13, color: theme.textPrimary, flex: 1, lineHeight: 18 },
  resultCard: {
    backgroundColor: theme.surface,
    borderRadius: theme.radius.md,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.borderLight,
    borderLeftWidth: 3,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  resultHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  resultNodeId: {
    fontSize: 14, fontWeight: '700', color: theme.textPrimary,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
  },
  resultBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  resultBadgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  resultHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  resultGeo: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  resultGeoText: { fontSize: 9, fontWeight: '700' },
  resultLatency: { fontSize: 11, color: theme.textMuted },
  resultRole: { fontSize: 11, color: theme.textSecondary, marginBottom: 8 },
  resultResponseBox: {
    backgroundColor: '#0A0E14',
    borderRadius: theme.radius.sm,
    padding: 10,
  },
  resultResponse: {
    fontSize: 12, color: theme.textSecondary, lineHeight: 18,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
  },
  markerCard: {
    backgroundColor: theme.surface,
    borderRadius: theme.radius.md,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  markerHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  markerLang: { fontSize: 14, fontWeight: '600', color: theme.textPrimary },
  markerCode: { fontSize: 12, fontWeight: '600', color: theme.textMuted },
  markerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: theme.borderLight,
  },
  markerTerm: { fontSize: 13, fontWeight: '600', color: theme.accent },
  markerTranslation: { fontSize: 13, color: theme.textSecondary },
});
