// CSI² Sovereign Nucleus Weave v3.0 — 10-Platform Constellation
// Golden Thread: 7F3A-C8B2

export type Geography = 'USA' | 'China' | 'Local';
export type VerdictLevel = 'CRITICAL' | 'ALERT' | 'CAUTION' | 'SECURE';
export type NodeHealth = 'healthy' | 'degraded' | 'offline';

export interface ConstellationNode {
  id: string;
  role: string;
  modelId: string;
  layer: 1 | 2;
  geography: Geography;
  weight: number;
  languages: string[];
  specialties: string[];
  enabled: boolean;
  health: NodeHealth;
  errorCount: number;
  maxErrors: number;
  color: string;
  icon: string;
  latencyMs: number | null;
  lastResponse: string | null;
}

export interface NodeResult {
  nodeId: string;
  role: string;
  geography: Geography;
  response: string;
  weight: number;
  latencyMs: number;
  languages: string[];
  success: boolean;
  alerting: boolean;
  error?: string;
}

export interface ConstellationVerdict {
  id: string;
  verdict: VerdictLevel;
  weightedScore: number;
  totalWeight: number;
  alertNodes: string[];
  secureNodes: string[];
  synthesis: string;
  nodeResults: NodeResult[];
  timestamp: string;
  query: string;
  geographicBreakdown: Record<Geography, number>;
  multilingualFlags: string[];
}

export interface FraudMarker {
  language: string;
  code: string;
  markers: { term: string; translation: string; context: string }[];
}

// ─── 10-NODE CONSTELLATION MAP ────────────────────

export const CONSTELLATION_NODES: ConstellationNode[] = [
  // Layer 1: Specialized Analysis
  {
    id: 'claude',
    role: 'Systematic Reasoning',
    modelId: 'anthropic/claude-3-5-sonnet-20241022',
    layer: 1,
    geography: 'USA',
    weight: 1.5,
    languages: ['EN'],
    specialties: ['reasoning', 'synthesis', 'ethics'],
    enabled: true,
    health: 'healthy',
    errorCount: 0,
    maxErrors: 2,
    color: '#D97706',
    icon: 'analytics',
    latencyMs: null,
    lastResponse: null,
  },
  {
    id: 'gemini',
    role: 'Pattern Recognition',
    modelId: 'gemini/gemini-1.5-pro',
    layer: 1,
    geography: 'USA',
    weight: 1.3,
    languages: ['EN', 'Multi'],
    specialties: ['patterns', 'multimodal', 'data'],
    enabled: true,
    health: 'healthy',
    errorCount: 0,
    maxErrors: 2,
    color: '#4285F4',
    icon: 'eye',
    latencyMs: null,
    lastResponse: null,
  },
  {
    id: 'gpt4',
    role: 'Natural Language',
    modelId: 'openai/gpt-4o',
    layer: 1,
    geography: 'USA',
    weight: 1.4,
    languages: ['EN', 'Multi'],
    specialties: ['language', 'compliance', 'contracts'],
    enabled: true,
    health: 'healthy',
    errorCount: 0,
    maxErrors: 2,
    color: '#10A37F',
    icon: 'chatbubbles',
    latencyMs: null,
    lastResponse: null,
  },
  {
    id: 'grok',
    role: 'Anomaly Detection',
    modelId: 'xai/grok-beta',
    layer: 1,
    geography: 'USA',
    weight: 1.2,
    languages: ['EN'],
    specialties: ['anomaly', 'real-time', 'rapid'],
    enabled: true,
    health: 'healthy',
    errorCount: 0,
    maxErrors: 2,
    color: '#FFFFFF',
    icon: 'flash',
    latencyMs: null,
    lastResponse: null,
  },
  {
    id: 'glm5',
    role: 'Multilingual + China Intelligence',
    modelId: 'glm-4',
    layer: 1,
    geography: 'China',
    weight: 1.4,
    languages: ['ZH', 'EN', 'JA', 'KO', 'AR', 'ES', 'FR', 'DE', 'RU', '100+'],
    specialties: ['chinese_contracts', 'supply_chain', 'multilingual_fraud', 'guanxi_analysis', 'geopolitical_risk', 'early_warning'],
    enabled: true,
    health: 'healthy',
    errorCount: 0,
    maxErrors: 2,
    color: '#FF6B35',
    icon: 'globe',
    latencyMs: null,
    lastResponse: null,
  },
  {
    id: 'deepseek',
    role: 'Technical Analysis',
    modelId: 'deepseek/deepseek-chat',
    layer: 1,
    geography: 'China',
    weight: 1.2,
    languages: ['ZH', 'EN'],
    specialties: ['code', 'technical', 'math', 'logic'],
    enabled: true,
    health: 'healthy',
    errorCount: 0,
    maxErrors: 2,
    color: '#6366F1',
    icon: 'code-slash',
    latencyMs: null,
    lastResponse: null,
  },
  {
    id: 'qwen',
    role: 'Pipeline Optimization',
    modelId: 'qwen2.5',
    layer: 1,
    geography: 'Local',
    weight: 1.0,
    languages: ['ZH', 'EN'],
    specialties: ['pipeline', 'optimization', 'multilingual'],
    enabled: true,
    health: 'healthy',
    errorCount: 0,
    maxErrors: 2,
    color: '#8B5CF6',
    icon: 'git-merge',
    latencyMs: null,
    lastResponse: null,
  },
  {
    id: 'perplexity',
    role: 'Real-Time Intelligence',
    modelId: 'perplexity/llama-3.1-sonar-large-128k-online',
    layer: 1,
    geography: 'USA',
    weight: 1.1,
    languages: ['EN'],
    specialties: ['real-time', 'web-search', 'current-events'],
    enabled: true,
    health: 'healthy',
    errorCount: 0,
    maxErrors: 2,
    color: '#22D3EE',
    icon: 'pulse',
    latencyMs: null,
    lastResponse: null,
  },
  // Layer 2: Integration & Execution
  {
    id: 'manus',
    role: 'Execution Layer',
    modelId: 'llama3.1',
    layer: 2,
    geography: 'Local',
    weight: 1.0,
    languages: ['EN'],
    specialties: ['execution', 'action', 'orchestration'],
    enabled: true,
    health: 'healthy',
    errorCount: 0,
    maxErrors: 2,
    color: '#F59E0B',
    icon: 'rocket',
    latencyMs: null,
    lastResponse: null,
  },
  {
    id: 'copilot',
    role: 'Compliance',
    modelId: 'deepseek-coder',
    layer: 2,
    geography: 'Local',
    weight: 1.0,
    languages: ['EN'],
    specialties: ['compliance', 'regulatory', 'audit'],
    enabled: true,
    health: 'healthy',
    errorCount: 0,
    maxErrors: 2,
    color: '#0EA5E9',
    icon: 'shield-checkmark',
    latencyMs: null,
    lastResponse: null,
  },
];

// ─── MULTILINGUAL FRAUD MARKERS ────────────────

export const FRAUD_MARKERS: FraudMarker[] = [
  {
    language: 'Chinese',
    code: 'ZH',
    markers: [
      { term: '关系回扣', translation: 'Guanxi kickback', context: 'Relationship-based kickback scheme' },
      { term: '虚开发票', translation: 'False invoicing', context: 'Fraudulent tax invoice issuance' },
      { term: '价格操纵', translation: 'Price manipulation', context: 'Bid-rigging and price fixing' },
      { term: '违规分包', translation: 'Illegal subcontracting', context: 'Unauthorized subcontract bypass' },
      { term: '走后门', translation: 'Back door dealing', context: 'Informal transaction bypassing controls' },
    ],
  },
  {
    language: 'Spanish',
    code: 'ES',
    markers: [
      { term: 'comision', translation: 'Commission/kickback', context: 'Hidden commission payment' },
      { term: 'soborno', translation: 'Bribe', context: 'Direct bribery payment' },
      { term: 'factura falsa', translation: 'False invoice', context: 'Fraudulent invoice creation' },
      { term: 'manipulacion', translation: 'Manipulation', context: 'Bid or price manipulation' },
    ],
  },
  {
    language: 'Arabic',
    code: 'AR',
    markers: [
      { term: 'رشوة', translation: 'Bribery', context: 'Direct bribe payment' },
      { term: 'غش', translation: 'Fraud/deception', context: 'General fraudulent activity' },
      { term: 'احتيال', translation: 'Embezzlement', context: 'Financial fraud and embezzlement' },
    ],
  },
  {
    language: 'Russian',
    code: 'RU',
    markers: [
      { term: 'откат', translation: 'Kickback', context: 'Kickback payment scheme' },
      { term: 'мошенничество', translation: 'Fraud', context: 'General fraud designation' },
      { term: 'взятка', translation: 'Bribe', context: 'Bribery payment' },
    ],
  },
  {
    language: 'English',
    code: 'EN',
    markers: [
      { term: 'kickback', translation: 'Kickback', context: 'Illicit payment for favorable treatment' },
      { term: 'bid-rigging', translation: 'Bid rigging', context: 'Collusion in bidding process' },
      { term: 'shell company', translation: 'Shell company', context: 'Front entity for laundering' },
      { term: 'phantom vendor', translation: 'Phantom vendor', context: 'Non-existent supplier fraud' },
    ],
  },
];

// ─── VERDICT THRESHOLDS ────────────────────────

export const VERDICT_THRESHOLDS = {
  CRITICAL: 0.80,
  ALERT: 0.60,
  CAUTION: 0.35,
};

export const VERDICT_CONFIG: Record<VerdictLevel, { emoji: string; color: string; label: string }> = {
  CRITICAL: { emoji: '🔴', color: '#F85149', label: 'CRITICAL' },
  ALERT:    { emoji: '🟠', color: '#D29922', label: 'ALERT' },
  CAUTION:  { emoji: '🟡', color: '#E3B341', label: 'CAUTION' },
  SECURE:   { emoji: '🟢', color: '#3FB950', label: 'SECURE' },
};

// ─── MOCK CONSTELLATION QUERY ──────────────────

function getVerdictLevel(ratio: number): VerdictLevel {
  if (ratio >= VERDICT_THRESHOLDS.CRITICAL) return 'CRITICAL';
  if (ratio >= VERDICT_THRESHOLDS.ALERT) return 'ALERT';
  if (ratio >= VERDICT_THRESHOLDS.CAUTION) return 'CAUTION';
  return 'SECURE';
}

function generateNodeAnalysis(node: ConstellationNode, query: string): { response: string; alerting: boolean } {
  const q = query.toLowerCase();
  const isFraud = q.includes('kickback') || q.includes('fraud') || q.includes('brib') || q.includes('suspicious') || q.includes('vendor') || q.includes('invoice');
  const isChinese = q.includes('china') || q.includes('chinese') || q.includes('shenzhen') || q.includes('beijing') || q.includes('guanxi');

  // Simulate different node behaviors
  const rand = Math.random();
  let alerting = false;
  let response = '';

  switch (node.id) {
    case 'claude':
      alerting = isFraud && rand > 0.3;
      response = alerting
        ? `[ALERT] Systematic analysis reveals structural anomalies in vendor relationship patterns. The pricing variance of 34% exceeds normal threshold (15%). Recommend immediate audit of payment chain and subcontractor network.`
        : `[SECURE] Initial systematic review shows vendor relationships within normal parameters. Pricing aligns with market benchmarks. No immediate structural concerns identified.`;
      break;
    case 'gemini':
      alerting = isFraud && rand > 0.35;
      response = alerting
        ? `[ALERT] Pattern recognition detected recurring payment anomalies: 3 invoices share identical formatting with different vendor IDs. Cross-reference shows 78% pattern match with known bid-rigging templates.`
        : `[SECURE] Pattern analysis complete. Invoice and payment patterns show normal distribution. No significant anomalies in temporal or structural patterns.`;
      break;
    case 'gpt4':
      alerting = isFraud && rand > 0.25;
      response = alerting
        ? `[ALERT] Natural language analysis of contract terms reveals unusual liability clauses and vague deliverable definitions. Language patterns suggest template manipulation to obscure payment terms.`
        : `[SECURE] Contract language analysis shows standard commercial terms. Deliverables clearly defined. Payment terms consistent with industry norms.`;
      break;
    case 'grok':
      alerting = isFraud && rand > 0.4;
      response = alerting
        ? `[ALERT] Anomaly spike detected: vendor registration date within 30 days of contract award. Entity registration details show minimal corporate footprint — potential shell company indicator.`
        : `[SECURE] No anomalies detected in vendor timelines or registration patterns. Corporate footprint verified through multiple data sources.`;
      break;
    case 'glm5':
      alerting = (isFraud || isChinese) && rand > 0.2;
      response = alerting
        ? `[ALERT] 关系网络分析 (Guanxi Network Analysis): Detected overlapping ownership structures between primary vendor and 2 subcontractors. Cultural pattern analysis suggests 回扣 (kickback) arrangement via 走后门 (back door) transactions. Invoice amounts show 虚开发票 (false invoicing) indicators with 23% markup above verified costs.`
        : `[SECURE] 供应链分析 (Supply Chain Analysis): Chinese vendor relationships appear legitimate. No 关系回扣 patterns detected. Invoicing aligns with verified cost structures. Regulatory compliance with SAMR requirements confirmed.`;
      break;
    case 'deepseek':
      alerting = isFraud && rand > 0.45;
      response = alerting
        ? `[ALERT] Technical analysis of financial data reveals mathematical inconsistencies: sum of line items differs from invoice total by 2.3%. Hash comparison of document metadata shows post-signature modification timestamps.`
        : `[SECURE] Technical validation complete. Financial data internally consistent. Document integrity verified — no post-signature modifications detected.`;
      break;
    case 'qwen':
      alerting = isFraud && rand > 0.5;
      response = alerting
        ? `[ALERT] Pipeline optimization analysis flagged: procurement workflow shows 3 approval bypasses in last quarter. Decision tree analysis suggests systematic circumvention of dual-approval requirements.`
        : `[SECURE] Pipeline analysis shows standard procurement workflows. All approval chains intact. No process circumvention patterns detected.`;
      break;
    case 'perplexity':
      alerting = isFraud && rand > 0.35;
      response = alerting
        ? `[ALERT] Real-time intelligence: vendor company subject of regulatory investigation (filed 2 weeks ago). News sources in 3 languages report allegations of procurement fraud in adjacent market. Stock price declined 12% on disclosure.`
        : `[SECURE] Real-time scan complete. No adverse news, regulatory actions, or market signals for this vendor entity. Public profile consistent with declared business activities.`;
      break;
    case 'manus':
      alerting = isFraud && rand > 0.55;
      response = alerting
        ? `[ALERT] Execution layer recommends: Freeze pending payments. Initiate vendor audit protocol. Flag for compliance review. Generate evidence preservation notice.`
        : `[SECURE] No action items generated. Vendor cleared for standard processing. Recommend routine monitoring schedule.`;
      break;
    case 'copilot':
      alerting = isFraud && rand > 0.4;
      response = alerting
        ? `[ALERT] Compliance check: vendor transaction pattern matches 2 of 5 FCPA red flags. Missing beneficial ownership disclosure. Recommend enhanced due diligence under compliance protocol 7.3.`
        : `[SECURE] Compliance screening passed. No FCPA, UK Bribery Act, or local anti-corruption flags. Beneficial ownership verified. Standard risk classification.`;
      break;
    default:
      response = '[SECURE] No significant findings.';
  }

  return { response, alerting };
}

export function runConstellationQuery(
  query: string,
  nodes: ConstellationNode[],
): ConstellationVerdict {
  const activeNodes = nodes.filter((n) => n.enabled && n.health !== 'offline');
  const results: NodeResult[] = [];
  let alertWeight = 0;
  let totalWeight = 0;
  const multilingualFlags: string[] = [];
  const geoBreakdown: Record<Geography, number> = { USA: 0, China: 0, Local: 0 };

  for (const node of activeNodes) {
    const latency = 200 + Math.random() * 3000;
    const { response, alerting } = generateNodeAnalysis(node, query);

    results.push({
      nodeId: node.id,
      role: node.role,
      geography: node.geography,
      response,
      weight: node.weight,
      latencyMs: Math.round(latency),
      languages: node.languages,
      success: true,
      alerting,
    });

    totalWeight += node.weight;
    if (alerting) {
      alertWeight += node.weight;
      geoBreakdown[node.geography]++;
    }

    // Detect multilingual flags
    if (alerting && node.id === 'glm5') {
      const q = query.toLowerCase();
      if (q.includes('china') || q.includes('chinese')) {
        multilingualFlags.push('ZH: 关系回扣 (guanxi kickback) detected');
        multilingualFlags.push('ZH: 虚开发票 (false invoicing) pattern');
      }
      if (q.includes('spanish') || q.includes('spain') || q.includes('latin')) {
        multilingualFlags.push('ES: comision (hidden commission) flagged');
      }
    }
  }

  const ratio = totalWeight > 0 ? alertWeight / totalWeight : 0;
  const verdict = getVerdictLevel(ratio);

  const alertNodeIds = results.filter((r) => r.alerting).map((r) => r.nodeId);
  const secureNodeIds = results.filter((r) => !r.alerting).map((r) => r.nodeId);

  const synthesisParts: string[] = [];
  if (verdict === 'CRITICAL' || verdict === 'ALERT') {
    synthesisParts.push(`High-confidence fraud indicators detected across ${alertNodeIds.length} of ${activeNodes.length} nodes.`);
    if (multilingualFlags.length > 0) {
      synthesisParts.push(`Multilingual analysis flagged ${multilingualFlags.length} cross-cultural fraud patterns.`);
    }
    synthesisParts.push('Recommend immediate investigation and payment freeze pending audit completion.');
  } else if (verdict === 'CAUTION') {
    synthesisParts.push(`Mixed signals: ${alertNodeIds.length} nodes flagged concerns while ${secureNodeIds.length} cleared. Additional investigation recommended before proceeding.`);
  } else {
    synthesisParts.push(`Broad consensus: ${secureNodeIds.length} of ${activeNodes.length} nodes cleared this query. No significant fraud indicators detected. Standard monitoring recommended.`);
  }

  return {
    id: `v-${Date.now()}`,
    verdict,
    weightedScore: Math.round(ratio * 100),
    totalWeight: Math.round(totalWeight * 10) / 10,
    alertNodes: alertNodeIds,
    secureNodes: secureNodeIds,
    synthesis: synthesisParts.join(' '),
    nodeResults: results,
    timestamp: new Date().toISOString(),
    query,
    geographicBreakdown: geoBreakdown,
    multilingualFlags,
  };
}

// ─── OPERATIONAL MODES ─────────────────────────

export type OperationalMode = 'full' | 'local_only' | 'remote_only' | 'fast';

export const OPERATIONAL_MODES: Record<OperationalMode, { label: string; description: string; nodeIds: string[] }> = {
  full: {
    label: 'Full Constellation',
    description: 'All 10 nodes active — maximum intelligence',
    nodeIds: CONSTELLATION_NODES.map((n) => n.id),
  },
  local_only: {
    label: 'Local Only',
    description: 'Qwen, Manus, Copilot — no API keys needed',
    nodeIds: ['qwen', 'manus', 'copilot'],
  },
  remote_only: {
    label: 'Remote Only',
    description: 'All cloud APIs — maximum intelligence coverage',
    nodeIds: ['claude', 'gemini', 'gpt4', 'grok', 'glm5', 'deepseek', 'perplexity'],
  },
  fast: {
    label: 'Fast Verdict',
    description: 'Claude, GLM-5, Grok, DeepSeek — sub-60s',
    nodeIds: ['claude', 'glm5', 'grok', 'deepseek'],
  },
};

// ─── SAMPLE QUERIES ────────────────────────────

export const SAMPLE_QUERIES = [
  'Analyze vendor Shenzhen TechCom Ltd for kickback patterns in recent invoices',
  'Review this Spanish procurement contract for hidden commissions',
  'Cross-reference vendor registration dates against contract award timelines',
  'Investigate suspicious 34% price variance on component supplier bid',
  'Run geopolitical risk assessment on Chinese rare earth supply chain',
  'Detect phantom vendor patterns in Q4 procurement data',
];
