import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { theme } from '../../constants/theme';
import { useConstellation } from '../../contexts/ConstellationContext';
import {
  VERDICT_CONFIG,
  OPERATIONAL_MODES,
  SAMPLE_QUERIES,
  OperationalMode,
} from '../../services/constellation';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const GEOGRAPHY_COLORS: Record<string, string> = {
  USA: '#58A6FF',
  China: '#FF6B35',
  Local: '#3FB950',
};

export default function ConstellationScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    nodes,
    verdicts,
    activeVerdict,
    operationalMode,
    isQuerying,
    goldenThread,
    setOperationalMode,
    submitQuery,
    setActiveVerdict,
  } = useConstellation();

  const [queryText, setQueryText] = useState('');
  const [showModes, setShowModes] = useState(false);
  const [viewMode, setViewMode] = useState<'dashboard' | 'verdicts'>('dashboard');
  const scrollRef = useRef<ScrollView>(null);

  const activeNodeCount = nodes.filter((n) => n.enabled).length;
  const totalWeight = nodes.filter((n) => n.enabled).reduce((a, b) => a + b.weight, 0);
  const geoDistribution = useMemo(() => {
    const dist: Record<string, number> = {};
    nodes.filter((n) => n.enabled).forEach((n) => {
      dist[n.geography] = (dist[n.geography] || 0) + 1;
    });
    return dist;
  }, [nodes]);

  const handleSubmitQuery = () => {
    if (!queryText.trim() || isQuerying) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    submitQuery(queryText.trim());
    setQueryText('');
    setViewMode('dashboard');
  };

  const handleSampleQuery = (q: string) => {
    Haptics.selectionAsync();
    setQueryText(q);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoRow}>
            <View style={styles.shieldIcon}>
              <Ionicons name="shield-checkmark" size={20} color="#00D4AA" />
            </View>
            <View>
              <Text style={styles.headerTitle}>
                CSI<Text style={{ color: theme.accent }}>²</Text>
              </Text>
              <Text style={styles.headerSub}>GT::{goldenThread}</Text>
            </View>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Pressable
            style={[styles.viewToggle, viewMode === 'dashboard' && styles.viewToggleActive]}
            onPress={() => { Haptics.selectionAsync(); setViewMode('dashboard'); }}
          >
            <Ionicons name="grid" size={14} color={viewMode === 'dashboard' ? theme.textInverse : theme.textSecondary} />
          </Pressable>
          <Pressable
            style={[styles.viewToggle, viewMode === 'verdicts' && styles.viewToggleActive]}
            onPress={() => { Haptics.selectionAsync(); setViewMode('verdicts'); }}
          >
            <Ionicons name="list" size={14} color={viewMode === 'verdicts' ? theme.textInverse : theme.textSecondary} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {viewMode === 'dashboard' ? (
          <>
            {/* Stats Bar */}
            <View style={styles.statsBar}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{activeNodeCount}</Text>
                <Text style={styles.statLabel}>NODES</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{totalWeight.toFixed(1)}</Text>
                <Text style={styles.statLabel}>WEIGHT</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{verdicts.length}</Text>
                <Text style={styles.statLabel}>VERDICTS</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <View style={{ flexDirection: 'row', gap: 3 }}>
                  {Object.entries(geoDistribution).map(([geo, count]) => (
                    <View key={geo} style={[styles.geoDot, { backgroundColor: GEOGRAPHY_COLORS[geo] || '#666' }]}>
                      <Text style={styles.geoDotText}>{count}</Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.statLabel}>GEO</Text>
              </View>
            </View>

            {/* Operational Mode */}
            <Pressable
              style={styles.modeSelector}
              onPress={() => { Haptics.selectionAsync(); setShowModes(!showModes); }}
            >
              <View style={styles.modeLeft}>
                <Ionicons name="speedometer" size={16} color={theme.accent} />
                <View>
                  <Text style={styles.modeLabel}>{OPERATIONAL_MODES[operationalMode].label}</Text>
                  <Text style={styles.modeDesc}>{OPERATIONAL_MODES[operationalMode].description}</Text>
                </View>
              </View>
              <Ionicons name={showModes ? 'chevron-up' : 'chevron-down'} size={16} color={theme.textMuted} />
            </Pressable>

            {showModes && (
              <View style={styles.modesPanel}>
                {(Object.keys(OPERATIONAL_MODES) as OperationalMode[]).map((mode) => (
                  <Pressable
                    key={mode}
                    style={[styles.modeOption, operationalMode === mode && styles.modeOptionActive]}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setOperationalMode(mode);
                      setShowModes(false);
                    }}
                  >
                    <Text style={[styles.modeOptionLabel, operationalMode === mode && { color: theme.primary }]}>
                      {OPERATIONAL_MODES[mode].label}
                    </Text>
                    <Text style={styles.modeOptionDesc}>{OPERATIONAL_MODES[mode].description}</Text>
                    <Text style={styles.modeOptionNodes}>{OPERATIONAL_MODES[mode].nodeIds.length} nodes</Text>
                  </Pressable>
                ))}
              </View>
            )}

            {/* Active Verdict Banner */}
            {activeVerdict && (
              <Pressable
                style={[styles.verdictBanner, { borderColor: VERDICT_CONFIG[activeVerdict.verdict].color + '40' }]}
                onPress={() => {
                  Haptics.selectionAsync();
                  router.push(`/verdict/${activeVerdict.id}`);
                }}
              >
                <View style={[styles.verdictBadge, { backgroundColor: VERDICT_CONFIG[activeVerdict.verdict].color + '20' }]}>
                  <Text style={styles.verdictEmoji}>{VERDICT_CONFIG[activeVerdict.verdict].emoji}</Text>
                  <Text style={[styles.verdictLevel, { color: VERDICT_CONFIG[activeVerdict.verdict].color }]}>
                    {activeVerdict.verdict}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.verdictQuery} numberOfLines={1}>{activeVerdict.query}</Text>
                  <Text style={styles.verdictMeta}>
                    Score: {activeVerdict.weightedScore}% · {activeVerdict.alertNodes.length} alerts · {activeVerdict.nodeResults.length} nodes
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
              </Pressable>
            )}

            {/* Node Grid */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>CONSTELLATION NODES</Text>
              <Text style={styles.sectionCount}>{activeNodeCount}/10 active</Text>
            </View>

            {/* Layer 1 */}
            <Text style={styles.layerLabel}>LAYER 1 — SPECIALIZED ANALYSIS</Text>
            <View style={styles.nodeGrid}>
              {nodes.filter((n) => n.layer === 1).map((node) => (
                <Pressable
                  key={node.id}
                  style={({ pressed }) => [
                    styles.nodeCard,
                    !node.enabled && styles.nodeCardDisabled,
                    pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] },
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    router.push(`/node/${node.id}`);
                  }}
                >
                  <View style={styles.nodeCardTop}>
                    <View style={[styles.nodeIcon, { backgroundColor: node.color + '20' }]}>
                      <Ionicons name={node.icon as any} size={18} color={node.enabled ? node.color : theme.textMuted} />
                    </View>
                    <View style={[styles.healthDot, {
                      backgroundColor: !node.enabled ? theme.textMuted
                        : node.health === 'healthy' ? theme.success
                        : node.health === 'degraded' ? theme.warning
                        : theme.error,
                    }]} />
                  </View>
                  <Text style={[styles.nodeId, !node.enabled && { color: theme.textMuted }]}>{node.id}</Text>
                  <Text style={styles.nodeRole} numberOfLines={1}>{node.role}</Text>
                  <View style={styles.nodeFooter}>
                    <View style={[styles.geoTag, { backgroundColor: GEOGRAPHY_COLORS[node.geography] + '15' }]}>
                      <Text style={[styles.geoTagText, { color: GEOGRAPHY_COLORS[node.geography] }]}>
                        {node.geography}
                      </Text>
                    </View>
                    <Text style={styles.nodeWeight}>{node.weight}x</Text>
                  </View>
                  {node.latencyMs !== null ? (
                    <Text style={styles.nodeLatency}>{node.latencyMs}ms</Text>
                  ) : null}
                </Pressable>
              ))}
            </View>

            {/* Layer 2 */}
            <Text style={styles.layerLabel}>LAYER 2 — INTEGRATION & EXECUTION</Text>
            <View style={styles.nodeGrid}>
              {nodes.filter((n) => n.layer === 2).map((node) => (
                <Pressable
                  key={node.id}
                  style={({ pressed }) => [
                    styles.nodeCard,
                    !node.enabled && styles.nodeCardDisabled,
                    pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] },
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    router.push(`/node/${node.id}`);
                  }}
                >
                  <View style={styles.nodeCardTop}>
                    <View style={[styles.nodeIcon, { backgroundColor: node.color + '20' }]}>
                      <Ionicons name={node.icon as any} size={18} color={node.enabled ? node.color : theme.textMuted} />
                    </View>
                    <View style={[styles.healthDot, {
                      backgroundColor: !node.enabled ? theme.textMuted
                        : node.health === 'healthy' ? theme.success
                        : theme.error,
                    }]} />
                  </View>
                  <Text style={[styles.nodeId, !node.enabled && { color: theme.textMuted }]}>{node.id}</Text>
                  <Text style={styles.nodeRole} numberOfLines={1}>{node.role}</Text>
                  <View style={styles.nodeFooter}>
                    <View style={[styles.geoTag, { backgroundColor: GEOGRAPHY_COLORS[node.geography] + '15' }]}>
                      <Text style={[styles.geoTagText, { color: GEOGRAPHY_COLORS[node.geography] }]}>
                        {node.geography}
                      </Text>
                    </View>
                    <Text style={styles.nodeWeight}>{node.weight}x</Text>
                  </View>
                </Pressable>
              ))}
            </View>

            {/* Sample Queries */}
            <View style={[styles.sectionHeader, { marginTop: 24 }]}>
              <Text style={styles.sectionTitle}>SAMPLE QUERIES</Text>
            </View>
            {SAMPLE_QUERIES.map((q, i) => (
              <Pressable
                key={i}
                style={({ pressed }) => [styles.sampleQuery, pressed && { opacity: 0.7 }]}
                onPress={() => handleSampleQuery(q)}
              >
                <Ionicons name="search" size={14} color={theme.accent} />
                <Text style={styles.sampleQueryText} numberOfLines={2}>{q}</Text>
                <Ionicons name="arrow-forward" size={14} color={theme.textMuted} />
              </Pressable>
            ))}
          </>
        ) : (
          /* Verdicts List */
          <>
            <View style={[styles.sectionHeader, { paddingHorizontal: 16, paddingTop: 16 }]}>
              <Text style={styles.sectionTitle}>VERDICT HISTORY</Text>
              <Text style={styles.sectionCount}>{verdicts.length} total</Text>
            </View>
            {verdicts.length === 0 ? (
              <View style={styles.emptyVerdicts}>
                <Image
                  source={require('../../assets/images/csi2-icon.png')}
                  style={{ width: 80, height: 80, opacity: 0.5 }}
                  contentFit="contain"
                />
                <Text style={styles.emptyTitle}>No verdicts yet</Text>
                <Text style={styles.emptyDesc}>Submit a query to run the constellation analysis</Text>
              </View>
            ) : (
              verdicts.map((v) => (
                <Pressable
                  key={v.id}
                  style={({ pressed }) => [styles.verdictCard, pressed && { opacity: 0.8 }]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setActiveVerdict(v);
                    router.push(`/verdict/${v.id}`);
                  }}
                >
                  <View style={[styles.verdictCardBadge, { backgroundColor: VERDICT_CONFIG[v.verdict].color + '15' }]}>
                    <Text style={{ fontSize: 20 }}>{VERDICT_CONFIG[v.verdict].emoji}</Text>
                    <Text style={[styles.verdictCardLevel, { color: VERDICT_CONFIG[v.verdict].color }]}>
                      {v.verdict}
                    </Text>
                    <Text style={styles.verdictCardScore}>{v.weightedScore}%</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.verdictCardQuery} numberOfLines={2}>{v.query}</Text>
                    <View style={styles.verdictCardMeta}>
                      <Text style={styles.verdictCardMetaText}>
                        {v.alertNodes.length} alerts · {v.nodeResults.length} nodes
                      </Text>
                      <Text style={styles.verdictCardTime}>
                        {new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                    {v.multilingualFlags.length > 0 ? (
                      <View style={styles.flagsRow}>
                        <Ionicons name="language" size={12} color={theme.warning} />
                        <Text style={styles.flagsText}>{v.multilingualFlags.length} multilingual flags</Text>
                      </View>
                    ) : null}
                  </View>
                </Pressable>
              ))
            )}
          </>
        )}
      </ScrollView>

      {/* Query Input */}
      <View style={[styles.queryArea, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        {isQuerying ? (
          <View style={styles.queryingBar}>
            <ActivityIndicator size="small" color={theme.accent} />
            <Text style={styles.queryingText}>Constellation analyzing... {activeNodeCount} nodes active</Text>
          </View>
        ) : (
          <View style={styles.queryRow}>
            <TextInput
              style={styles.queryInput}
              value={queryText}
              onChangeText={setQueryText}
              placeholder="Query the constellation..."
              placeholderTextColor={theme.textMuted}
              multiline
              maxLength={500}
              keyboardAppearance="dark"
            />
            <Pressable
              style={[styles.queryBtn, !queryText.trim() && styles.queryBtnDisabled]}
              onPress={handleSubmitQuery}
              disabled={!queryText.trim()}
            >
              <Ionicons name="shield-checkmark" size={18} color={queryText.trim() ? theme.textInverse : theme.textMuted} />
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  shieldIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: theme.primary + '15',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: theme.textPrimary },
  headerSub: {
    fontSize: 10, fontWeight: '600', color: theme.textMuted,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    marginTop: 1,
  },
  headerRight: { flexDirection: 'row', gap: 4 },
  viewToggle: {
    width: 34, height: 34, borderRadius: theme.radius.sm,
    backgroundColor: theme.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  viewToggleActive: { backgroundColor: theme.primary },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: theme.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '700', color: theme.primary },
  statLabel: { fontSize: 9, fontWeight: '600', color: theme.textMuted, letterSpacing: 1, marginTop: 2 },
  statDivider: { width: 1, height: 28, backgroundColor: theme.borderLight },
  geoDot: {
    width: 20, height: 20, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  geoDotText: { fontSize: 10, fontWeight: '700', color: '#fff' },
  modeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    backgroundColor: theme.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  modeLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  modeLabel: { fontSize: 14, fontWeight: '600', color: theme.textPrimary },
  modeDesc: { fontSize: 11, color: theme.textSecondary, marginTop: 1 },
  modesPanel: { marginHorizontal: 16, marginTop: 4, gap: 4 },
  modeOption: {
    padding: 12, borderRadius: theme.radius.md,
    backgroundColor: theme.surface,
    borderWidth: 1, borderColor: theme.borderLight,
  },
  modeOptionActive: { borderColor: theme.primary, backgroundColor: theme.primary + '08' },
  modeOptionLabel: { fontSize: 14, fontWeight: '600', color: theme.textPrimary },
  modeOptionDesc: { fontSize: 12, color: theme.textSecondary, marginTop: 2 },
  modeOptionNodes: { fontSize: 11, color: theme.textMuted, marginTop: 4 },
  verdictBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: theme.radius.md,
    backgroundColor: theme.surface,
    borderWidth: 1,
  },
  verdictBadge: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.sm,
    gap: 2,
  },
  verdictEmoji: { fontSize: 20 },
  verdictLevel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  verdictQuery: { fontSize: 13, fontWeight: '500', color: theme.textPrimary },
  verdictMeta: { fontSize: 11, color: theme.textSecondary, marginTop: 3 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 11, fontWeight: '600', color: theme.textSecondary, letterSpacing: 0.5 },
  sectionCount: { fontSize: 11, color: theme.textMuted },
  layerLabel: {
    fontSize: 10, fontWeight: '600', color: theme.accent, letterSpacing: 0.5,
    paddingHorizontal: 16, marginTop: 12, marginBottom: 8,
  },
  nodeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
  },
  nodeCard: {
    width: (SCREEN_WIDTH - 40) / 2,
    backgroundColor: theme.surface,
    borderRadius: theme.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  nodeCardDisabled: { opacity: 0.4 },
  nodeCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nodeIcon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  healthDot: { width: 8, height: 8, borderRadius: 4 },
  nodeId: {
    fontSize: 15, fontWeight: '700', color: theme.textPrimary,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    marginBottom: 2,
  },
  nodeRole: { fontSize: 11, color: theme.textSecondary, marginBottom: 8 },
  nodeFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  geoTag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  geoTagText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  nodeWeight: { fontSize: 11, fontWeight: '600', color: theme.textMuted },
  nodeLatency: { fontSize: 10, color: theme.textMuted, marginTop: 4 },
  sampleQuery: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
  },
  sampleQueryText: { flex: 1, fontSize: 13, color: theme.textSecondary, lineHeight: 18 },
  emptyVerdicts: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: theme.textPrimary },
  emptyDesc: { fontSize: 13, color: theme.textSecondary },
  verdictCard: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 16,
    padding: 14,
    marginBottom: 8,
    backgroundColor: theme.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  verdictCardBadge: {
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: theme.radius.sm,
    minWidth: 60,
    gap: 2,
  },
  verdictCardLevel: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  verdictCardScore: { fontSize: 16, fontWeight: '700', color: theme.textPrimary },
  verdictCardQuery: { fontSize: 14, fontWeight: '500', color: theme.textPrimary, lineHeight: 20 },
  verdictCardMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  verdictCardMetaText: { fontSize: 11, color: theme.textSecondary },
  verdictCardTime: { fontSize: 11, color: theme.textMuted },
  flagsRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  flagsText: { fontSize: 11, color: theme.warning },
  queryArea: {
    paddingHorizontal: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    backgroundColor: theme.backgroundSecondary,
  },
  queryingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.accent + '10',
    borderWidth: 1,
    borderColor: theme.accent + '30',
  },
  queryingText: { fontSize: 13, color: theme.accent, fontWeight: '500' },
  queryRow: {
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
  queryInput: { flex: 1, fontSize: 14, color: theme.textPrimary, maxHeight: 80, lineHeight: 20 },
  queryBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: theme.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  queryBtnDisabled: { backgroundColor: theme.surface },
});
