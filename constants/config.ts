export const config = {
  appName: 'DevForge',
  tagline: 'Local AI-Powered Dev Workspace',
  version: '1.0.0',

  // AI Models available via Ollama
  models: [
    { id: 'mistral', name: 'Mistral 7B', description: 'Fast general-purpose', size: '4.1 GB', speed: 'Fast' },
    { id: 'codellama', name: 'CodeLlama 7B', description: 'Code generation specialist', size: '3.8 GB', speed: 'Fast' },
    { id: 'llama3', name: 'Llama 3 8B', description: 'Meta\'s latest model', size: '4.7 GB', speed: 'Medium' },
    { id: 'deepseek-coder', name: 'DeepSeek Coder', description: 'Code completion & debugging', size: '3.5 GB', speed: 'Fast' },
    { id: 'qwen2', name: 'Qwen 2.5 Coder', description: 'Alibaba\'s coding model', size: '4.4 GB', speed: 'Medium' },
    { id: 'phi3', name: 'Phi-3 Mini', description: 'Microsoft\'s compact model', size: '2.3 GB', speed: 'Very Fast' },
    { id: 'starcoder2', name: 'StarCoder2 3B', description: 'Code-specific, small footprint', size: '1.7 GB', speed: 'Very Fast' },
  ],

  // Default Ollama connection
  ollamaDefaults: {
    host: 'http://localhost:11434',
    timeout: 30000,
  },

  // Command categories
  commandCategories: [
    'File Management',
    'Text Processing',
    'System Info',
    'Network',
    'Process Management',
    'Package Management',
    'Permissions',
    'Disk & Storage',
    'Search & Find',
    'Compression',
    'User Management',
    'Shell Scripting',
  ],
};
