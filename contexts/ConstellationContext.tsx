import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  ConstellationNode,
  ConstellationVerdict,
  CONSTELLATION_NODES,
  OperationalMode,
  OPERATIONAL_MODES,
  runConstellationQuery,
} from '../services/constellation';

interface ConstellationState {
  nodes: ConstellationNode[];
  verdicts: ConstellationVerdict[];
  activeVerdict: ConstellationVerdict | null;
  operationalMode: OperationalMode;
  isQuerying: boolean;
  goldenThread: string;

  setOperationalMode: (mode: OperationalMode) => void;
  toggleNode: (nodeId: string) => void;
  resetNode: (nodeId: string) => void;
  submitQuery: (query: string) => void;
  setActiveVerdict: (v: ConstellationVerdict | null) => void;
  clearVerdicts: () => void;
}

const ConstellationContext = createContext<ConstellationState | undefined>(undefined);

export function ConstellationProvider({ children }: { children: React.ReactNode }) {
  const [nodes, setNodes] = useState<ConstellationNode[]>(
    CONSTELLATION_NODES.map((n) => ({ ...n }))
  );
  const [verdicts, setVerdicts] = useState<ConstellationVerdict[]>([]);
  const [activeVerdict, setActiveVerdict] = useState<ConstellationVerdict | null>(null);
  const [operationalMode, setOperationalModeState] = useState<OperationalMode>('full');
  const [isQuerying, setIsQuerying] = useState(false);

  const setOperationalMode = useCallback((mode: OperationalMode) => {
    setOperationalModeState(mode);
    const modeConfig = OPERATIONAL_MODES[mode];
    setNodes((prev) =>
      prev.map((n) => ({
        ...n,
        enabled: modeConfig.nodeIds.includes(n.id),
      }))
    );
  }, []);

  const toggleNode = useCallback((nodeId: string) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId ? { ...n, enabled: !n.enabled } : n
      )
    );
  }, []);

  const resetNode = useCallback((nodeId: string) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId ? { ...n, errorCount: 0, health: 'healthy' as const } : n
      )
    );
  }, []);

  const submitQuery = useCallback((query: string) => {
    setIsQuerying(true);

    // Simulate async processing
    setTimeout(() => {
      const verdict = runConstellationQuery(query, nodes);

      // Update node latencies from results
      setNodes((prev) =>
        prev.map((n) => {
          const result = verdict.nodeResults.find((r) => r.nodeId === n.id);
          if (result) {
            return {
              ...n,
              latencyMs: result.latencyMs,
              lastResponse: result.response.slice(0, 80) + '...',
            };
          }
          return n;
        })
      );

      setVerdicts((prev) => [verdict, ...prev]);
      setActiveVerdict(verdict);
      setIsQuerying(false);
    }, 1500 + Math.random() * 2000);
  }, [nodes]);

  const clearVerdicts = useCallback(() => {
    setVerdicts([]);
    setActiveVerdict(null);
  }, []);

  return (
    <ConstellationContext.Provider
      value={{
        nodes,
        verdicts,
        activeVerdict,
        operationalMode,
        isQuerying,
        goldenThread: '7F3A-C8B2',
        setOperationalMode,
        toggleNode,
        resetNode,
        submitQuery,
        setActiveVerdict,
        clearVerdicts,
      }}
    >
      {children}
    </ConstellationContext.Provider>
  );
}

export const useConstellation = () => {
  const ctx = useContext(ConstellationContext);
  if (!ctx) throw new Error('useConstellation must be used within ConstellationProvider');
  return ctx;
};
