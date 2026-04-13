import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Workspace,
  WorkspaceFile,
  ChatSession,
  ChatMessage,
  mockWorkspaces,
  mockChatSessions,
  suggestedPrompts,
} from '../services/mockData';

interface AppState {
  // Workspaces
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  activeFile: WorkspaceFile | null;
  setActiveWorkspace: (ws: Workspace | null) => void;
  setActiveFile: (file: WorkspaceFile | null) => void;
  createWorkspace: (name: string, language: string, description: string) => void;
  deleteWorkspace: (id: string) => void;
  updateFileContent: (workspaceId: string, fileId: string, content: string) => void;
  addFileToWorkspace: (workspaceId: string, file: WorkspaceFile) => void;
  addTerminalEntry: (workspaceId: string, entry: string) => void;

  // AI Chat
  chatSessions: ChatSession[];
  activeChatSession: ChatSession | null;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  setActiveChatSession: (session: ChatSession | null) => void;
  sendMessage: (content: string) => void;
  createChatSession: (title: string) => void;
  deleteChatSession: (id: string) => void;

  // Command search
  commandSearchQuery: string;
  setCommandSearchQuery: (query: string) => void;
  commandCategoryFilter: string;
  setCommandCategoryFilter: (cat: string) => void;

  // Ollama config
  ollamaHost: string;
  setOllamaHost: (host: string) => void;
  ollamaConnected: boolean;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(mockWorkspaces);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  const [activeFile, setActiveFile] = useState<WorkspaceFile | null>(null);

  const [chatSessions, setChatSessions] = useState<ChatSession[]>(mockChatSessions);
  const [activeChatSession, setActiveChatSession] = useState<ChatSession | null>(null);
  const [selectedModel, setSelectedModel] = useState('mistral');

  const [commandSearchQuery, setCommandSearchQuery] = useState('');
  const [commandCategoryFilter, setCommandCategoryFilter] = useState('All');

  const [ollamaHost, setOllamaHost] = useState('http://localhost:11434');
  const [ollamaConnected] = useState(false);

  // Persist workspaces
  useEffect(() => {
    AsyncStorage.getItem('workspaces').then((data) => {
      if (data) {
        try { setWorkspaces(JSON.parse(data)); } catch {}
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('workspaces', JSON.stringify(workspaces));
  }, [workspaces]);

  // Persist chat sessions
  useEffect(() => {
    AsyncStorage.getItem('chatSessions').then((data) => {
      if (data) {
        try { setChatSessions(JSON.parse(data)); } catch {}
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('chatSessions', JSON.stringify(chatSessions));
  }, [chatSessions]);

  const createWorkspace = useCallback((name: string, language: string, description: string) => {
    const newWs: Workspace = {
      id: `ws-${Date.now()}`,
      name,
      language,
      description,
      lastModified: 'Just now',
      files: [
        {
          id: `f-${Date.now()}`,
          name: language === 'python' ? 'main.py' : language === 'rust' ? 'main.rs' : language === 'go' ? 'main.go' : 'index.ts',
          language,
          content: `// ${name}\n// Created with DevForge\n\n`,
        },
      ],
      terminalHistory: [`$ # Welcome to ${name}`, '$ # Type your commands here'],
    };
    setWorkspaces((prev) => [newWs, ...prev]);
  }, []);

  const deleteWorkspace = useCallback((id: string) => {
    setWorkspaces((prev) => prev.filter((ws) => ws.id !== id));
    if (activeWorkspace?.id === id) {
      setActiveWorkspace(null);
      setActiveFile(null);
    }
  }, [activeWorkspace]);

  const updateFileContent = useCallback((workspaceId: string, fileId: string, content: string) => {
    setWorkspaces((prev) =>
      prev.map((ws) =>
        ws.id === workspaceId
          ? {
              ...ws,
              lastModified: 'Just now',
              files: ws.files.map((f) => (f.id === fileId ? { ...f, content } : f)),
            }
          : ws
      )
    );
  }, []);

  const addFileToWorkspace = useCallback((workspaceId: string, file: WorkspaceFile) => {
    setWorkspaces((prev) =>
      prev.map((ws) =>
        ws.id === workspaceId ? { ...ws, files: [...ws.files, file], lastModified: 'Just now' } : ws
      )
    );
  }, []);

  const addTerminalEntry = useCallback((workspaceId: string, entry: string) => {
    setWorkspaces((prev) =>
      prev.map((ws) =>
        ws.id === workspaceId
          ? { ...ws, terminalHistory: [...ws.terminalHistory, entry] }
          : ws
      )
    );
  }, []);

  // AI Chat functions
  const createChatSession = useCallback((title: string) => {
    const session: ChatSession = {
      id: `chat-${Date.now()}`,
      title,
      model: selectedModel,
      createdAt: 'Just now',
      messages: [],
    };
    setChatSessions((prev) => [session, ...prev]);
    setActiveChatSession(session);
  }, [selectedModel]);

  const deleteChatSession = useCallback((id: string) => {
    setChatSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeChatSession?.id === id) setActiveChatSession(null);
  }, [activeChatSession]);

  const sendMessage = useCallback((content: string) => {
    if (!activeChatSession) {
      // Create new session
      const session: ChatSession = {
        id: `chat-${Date.now()}`,
        title: content.slice(0, 40) + (content.length > 40 ? '...' : ''),
        model: selectedModel,
        createdAt: 'Just now',
        messages: [],
      };
      
      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: generateMockResponse(content, selectedModel),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: selectedModel,
      };

      const updatedSession = { ...session, messages: [userMsg, assistantMsg] };
      setChatSessions((prev) => [updatedSession, ...prev]);
      setActiveChatSession(updatedSession);
      return;
    }

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const assistantMsg: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      role: 'assistant',
      content: generateMockResponse(content, selectedModel),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: selectedModel,
    };

    const updatedSession = {
      ...activeChatSession,
      messages: [...activeChatSession.messages, userMsg, assistantMsg],
    };

    setChatSessions((prev) =>
      prev.map((s) => (s.id === activeChatSession.id ? updatedSession : s))
    );
    setActiveChatSession(updatedSession);
  }, [activeChatSession, selectedModel]);

  return (
    <AppContext.Provider
      value={{
        workspaces,
        activeWorkspace,
        activeFile,
        setActiveWorkspace,
        setActiveFile,
        createWorkspace,
        deleteWorkspace,
        updateFileContent,
        addFileToWorkspace,
        addTerminalEntry,
        chatSessions,
        activeChatSession,
        selectedModel,
        setSelectedModel,
        setActiveChatSession,
        sendMessage,
        createChatSession,
        deleteChatSession,
        commandSearchQuery,
        setCommandSearchQuery,
        commandCategoryFilter,
        setCommandCategoryFilter,
        ollamaHost,
        setOllamaHost,
        ollamaConnected,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

// Mock AI response generator
function generateMockResponse(query: string, model: string): string {
  const q = query.toLowerCase();

  if (q.includes('docker') || q.includes('container')) {
    return `Here's how to work with Docker:\n\n\`\`\`bash\n# Build an image\ndocker build -t myapp .\n\n# Run a container\ndocker run -d -p 8080:80 --name myapp myapp\n\n# View running containers\ndocker ps\n\n# View logs\ndocker logs -f myapp\n\`\`\`\n\n**Key concepts:**\n- **Image**: Blueprint for containers\n- **Container**: Running instance of an image\n- **Volume**: Persistent data storage\n- **Network**: Container communication\n\n_Response generated locally via ${model}_`;
  }

  if (q.includes('git') || q.includes('commit') || q.includes('branch')) {
    return `Here's a Git workflow guide:\n\n\`\`\`bash\n# Create and switch to new branch\ngit checkout -b feature/new-feature\n\n# Stage changes\ngit add -A\n\n# Commit with message\ngit commit -m "feat: add new feature"\n\n# Push to remote\ngit push -u origin feature/new-feature\n\n# Create pull request\ngh pr create --title "New Feature" --body "Description"\n\`\`\`\n\n**Conventional Commits:**\n- \`feat:\` New feature\n- \`fix:\` Bug fix\n- \`docs:\` Documentation\n- \`refactor:\` Code refactoring\n\n_Response generated locally via ${model}_`;
  }

  if (q.includes('bash') || q.includes('script') || q.includes('shell')) {
    return `Here's a bash scripting template:\n\n\`\`\`bash\n#!/bin/bash\nset -euo pipefail\n\n# Variables\nLOG_DIR="/var/log/myapp"\nDATE=$(date +%Y-%m-%d)\n\n# Functions\nlog() {\n  echo "[$(date '+%H:%M:%S')] $1"\n}\n\ncleanup() {\n  log "Cleaning up..."\n  rm -f /tmp/myapp_*.tmp\n}\n\ntrap cleanup EXIT\n\n# Main logic\nlog "Script started"\nmkdir -p "$LOG_DIR"\nlog "Processing complete"\n\`\`\`\n\n**Best practices:**\n- Always use \`set -euo pipefail\`\n- Quote variables: \`"$var"\`\n- Use functions for reusability\n- Trap for cleanup\n\n_Response generated locally via ${model}_`;
  }

  if (q.includes('python') || q.includes('pip') || q.includes('django') || q.includes('flask')) {
    return `Here's a Python setup guide:\n\n\`\`\`bash\n# Create virtual environment\npython -m venv .venv\nsource .venv/bin/activate\n\n# Install dependencies\npip install -r requirements.txt\n\n# Run your application\npython main.py\n\`\`\`\n\n\`\`\`python\n# Example: HTTP server\nfrom http.server import HTTPServer, SimpleHTTPRequestHandler\n\nserver = HTTPServer(('localhost', 8000), SimpleHTTPRequestHandler)\nprint('Server running on http://localhost:8000')\nserver.serve_forever()\n\`\`\`\n\n_Response generated locally via ${model}_`;
  }

  return `I can help with that! Here's what I'd suggest:\n\n\`\`\`bash\n# First, check your system\nuname -a\ndf -h\nfree -m\n\n# Then proceed with your task\n# Modify commands based on your specific needs\n\`\`\`\n\n**General tips:**\n1. Always back up important data before making changes\n2. Use \`man <command>\` for detailed documentation\n3. Test commands with \`--dry-run\` when available\n4. Check \`/var/log/\` for system logs if issues arise\n\nWould you like me to elaborate on any specific part?\n\n_Response generated locally via ${model}_`;
}
