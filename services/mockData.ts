export interface Workspace {
  id: string;
  name: string;
  language: string;
  description: string;
  lastModified: string;
  files: WorkspaceFile[];
  terminalHistory: string[];
}

export interface WorkspaceFile {
  id: string;
  name: string;
  content: string;
  language: string;
}

export interface LinuxCommand {
  id: string;
  name: string;
  category: string;
  synopsis: string;
  description: string;
  syntax: string;
  examples: { command: string; explanation: string }[];
  flags: { flag: string; description: string }[];
  relatedCommands: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  model?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  model: string;
  messages: ChatMessage[];
  createdAt: string;
}

// ===================== WORKSPACES =====================

export const mockWorkspaces: Workspace[] = [
  {
    id: 'ws-1',
    name: 'api-server',
    language: 'typescript',
    description: 'REST API with Express and TypeScript',
    lastModified: '2 hours ago',
    files: [
      {
        id: 'f1',
        name: 'index.ts',
        language: 'typescript',
        content: `import express from 'express';
import cors from 'cors';
import { router } from './routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api', router);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`,
      },
      {
        id: 'f2',
        name: 'routes.ts',
        language: 'typescript',
        content: `import { Router } from 'express';
import { getUsers, createUser } from './controllers';

export const router = Router();

router.get('/users', getUsers);
router.post('/users', createUser);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);`,
      },
      {
        id: 'f3',
        name: 'package.json',
        language: 'json',
        content: `{
  "name": "api-server",
  "version": "1.0.0",
  "scripts": {
    "dev": "ts-node-dev --respawn index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
}`,
      },
    ],
    terminalHistory: [
      '$ npm install',
      'added 57 packages in 3.2s',
      '$ npm run dev',
      'Server running on port 3000',
    ],
  },
  {
    id: 'ws-2',
    name: 'ml-pipeline',
    language: 'python',
    description: 'Machine learning data pipeline with pandas',
    lastModified: '5 hours ago',
    files: [
      {
        id: 'f4',
        name: 'main.py',
        language: 'python',
        content: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

def load_data(filepath: str) -> pd.DataFrame:
    """Load and preprocess the dataset."""
    df = pd.read_csv(filepath)
    df = df.dropna()
    df = df.drop_duplicates()
    return df

def train_model(X_train, y_train):
    """Train a Random Forest classifier."""
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42
    )
    model.fit(X_train, y_train)
    return model

if __name__ == '__main__':
    df = load_data('data/dataset.csv')
    X = df.drop('target', axis=1)
    y = df['target']
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    model = train_model(X_train, y_train)
    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)
    print(f'Model Accuracy: {accuracy:.4f}')`,
      },
      {
        id: 'f5',
        name: 'requirements.txt',
        language: 'shell',
        content: `pandas==2.1.4
numpy==1.26.2
scikit-learn==1.3.2
matplotlib==3.8.2
seaborn==0.13.0`,
      },
    ],
    terminalHistory: [
      '$ pip install -r requirements.txt',
      'Successfully installed pandas-2.1.4',
      '$ python main.py',
      'Model Accuracy: 0.9423',
    ],
  },
  {
    id: 'ws-3',
    name: 'rust-cli',
    language: 'rust',
    description: 'Command-line file manager in Rust',
    lastModified: '1 day ago',
    files: [
      {
        id: 'f6',
        name: 'main.rs',
        language: 'rust',
        content: `use std::env;
use std::fs;
use std::path::Path;

fn main() {
    let args: Vec<String> = env::args().collect();
    
    match args.get(1).map(|s| s.as_str()) {
        Some("list") => list_files(&args),
        Some("create") => create_file(&args),
        Some("delete") => delete_file(&args),
        Some("info") => file_info(&args),
        _ => print_usage(),
    }
}

fn list_files(args: &[String]) {
    let dir = args.get(2).map(|s| s.as_str()).unwrap_or(".");
    let entries = fs::read_dir(dir).expect("Cannot read directory");
    
    for entry in entries {
        let entry = entry.unwrap();
        let metadata = entry.metadata().unwrap();
        let size = metadata.len();
        let name = entry.file_name();
        println!("{:>10} bytes  {}", size, name.to_string_lossy());
    }
}

fn print_usage() {
    println!("Usage: rcli <command> [args]");
    println!("Commands: list, create, delete, info");
}`,
      },
    ],
    terminalHistory: [
      '$ cargo build --release',
      'Compiling rust-cli v0.1.0',
      'Finished release [optimized]',
      '$ ./target/release/rcli list .',
    ],
  },
  {
    id: 'ws-4',
    name: 'go-microservice',
    language: 'go',
    description: 'gRPC microservice with Go',
    lastModified: '2 days ago',
    files: [
      {
        id: 'f7',
        name: 'main.go',
        language: 'go',
        content: `package main

import (
    "fmt"
    "log"
    "net/http"
    "encoding/json"
)

type Response struct {
    Status  string \`json:"status"\`
    Message string \`json:"message"\`
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(Response{
        Status:  "healthy",
        Message: "Service is running",
    })
}

func main() {
    http.HandleFunc("/health", healthHandler)
    fmt.Println("Server starting on :8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}`,
      },
    ],
    terminalHistory: ['$ go run main.go', 'Server starting on :8080'],
  },
  {
    id: 'ws-5',
    name: 'docker-compose-lab',
    language: 'shell',
    description: 'Multi-container Docker environment',
    lastModified: '3 days ago',
    files: [
      {
        id: 'f8',
        name: 'docker-compose.yml',
        language: 'shell',
        content: `version: '3.8'
services:
  web:
    build: ./web
    ports:
      - "3000:3000"
    depends_on:
      - api
      - db
  api:
    build: ./api
    ports:
      - "8080:8080"
    environment:
      - DB_HOST=db
      - DB_PORT=5432
    depends_on:
      - db
  db:
    image: postgres:15
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=devforge
      - POSTGRES_PASSWORD=secret

volumes:
  pgdata:`,
      },
    ],
    terminalHistory: [
      '$ docker-compose up -d',
      'Creating network "lab_default"',
      'Creating lab_db_1  ... done',
      'Creating lab_api_1 ... done',
      'Creating lab_web_1 ... done',
    ],
  },
  {
    id: 'ws-6',
    name: 'react-dashboard',
    language: 'javascript',
    description: 'Analytics dashboard with React and D3',
    lastModified: '4 days ago',
    files: [
      {
        id: 'f9',
        name: 'App.jsx',
        language: 'javascript',
        content: `import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Sidebar } from './components/Sidebar';
import { fetchAnalytics } from './services/api';

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalytics(timeRange)
      .then(setData)
      .finally(() => setLoading(false));
  }, [timeRange]);

  return (
    <div className="app">
      <Sidebar onTimeRangeChange={setTimeRange} />
      <Dashboard data={data} loading={loading} />
    </div>
  );
}`,
      },
    ],
    terminalHistory: ['$ npm run dev', 'VITE v5.0.8 ready in 321ms', '➜ Local: http://localhost:5173/'],
  },
];

// ===================== LINUX COMMANDS =====================

export const linuxCommands: LinuxCommand[] = [
  // === FILE MANAGEMENT ===
  {
    id: 'cmd-1',
    name: 'ls',
    category: 'File Management',
    synopsis: 'List directory contents',
    description: 'List information about files and directories. By default, lists the current directory contents sorted alphabetically.',
    syntax: 'ls [OPTION]... [FILE]...',
    examples: [
      { command: 'ls -la', explanation: 'List all files including hidden, in long format' },
      { command: 'ls -lhS', explanation: 'List sorted by size, human-readable' },
      { command: 'ls -R', explanation: 'List recursively through subdirectories' },
      { command: 'ls --color=auto', explanation: 'Colorize output by file type' },
    ],
    flags: [
      { flag: '-l', description: 'Long listing format with permissions, owner, size' },
      { flag: '-a', description: 'Include hidden files (starting with .)' },
      { flag: '-h', description: 'Human-readable sizes (KB, MB, GB)' },
      { flag: '-R', description: 'Recursive listing of subdirectories' },
      { flag: '-S', description: 'Sort by file size, largest first' },
      { flag: '-t', description: 'Sort by modification time, newest first' },
    ],
    relatedCommands: ['dir', 'find', 'tree'],
    difficulty: 'beginner',
  },
  {
    id: 'cmd-2',
    name: 'cp',
    category: 'File Management',
    synopsis: 'Copy files and directories',
    description: 'Copy SOURCE to DEST, or multiple SOURCE(s) to DIRECTORY. Preserves file attributes with proper flags.',
    syntax: 'cp [OPTION]... SOURCE DEST',
    examples: [
      { command: 'cp file.txt backup/', explanation: 'Copy file to backup directory' },
      { command: 'cp -r src/ dest/', explanation: 'Copy directory recursively' },
      { command: 'cp -p file.txt file_backup.txt', explanation: 'Copy preserving attributes' },
      { command: 'cp -i *.log /var/log/', explanation: 'Interactive copy, prompt before overwrite' },
    ],
    flags: [
      { flag: '-r', description: 'Copy directories recursively' },
      { flag: '-p', description: 'Preserve mode, ownership, timestamps' },
      { flag: '-i', description: 'Prompt before overwrite' },
      { flag: '-v', description: 'Verbose: explain what is being done' },
      { flag: '-u', description: 'Copy only when source is newer' },
    ],
    relatedCommands: ['mv', 'rsync', 'scp'],
    difficulty: 'beginner',
  },
  {
    id: 'cmd-3',
    name: 'mv',
    category: 'File Management',
    synopsis: 'Move or rename files',
    description: 'Move SOURCE to DEST, or rename SOURCE to DEST. Can move across filesystems.',
    syntax: 'mv [OPTION]... SOURCE DEST',
    examples: [
      { command: 'mv old.txt new.txt', explanation: 'Rename a file' },
      { command: 'mv file.txt /home/user/docs/', explanation: 'Move file to another directory' },
      { command: 'mv -i *.jpg photos/', explanation: 'Move with overwrite confirmation' },
    ],
    flags: [
      { flag: '-i', description: 'Prompt before overwrite' },
      { flag: '-f', description: 'Force overwrite without prompting' },
      { flag: '-v', description: 'Verbose output' },
      { flag: '-n', description: 'Do not overwrite existing files' },
    ],
    relatedCommands: ['cp', 'rm', 'rename'],
    difficulty: 'beginner',
  },
  {
    id: 'cmd-4',
    name: 'rm',
    category: 'File Management',
    synopsis: 'Remove files or directories',
    description: 'Remove (unlink) files. With -r, can remove directories and their contents recursively. USE WITH CAUTION.',
    syntax: 'rm [OPTION]... FILE...',
    examples: [
      { command: 'rm file.txt', explanation: 'Remove a single file' },
      { command: 'rm -rf directory/', explanation: 'Force remove directory and all contents' },
      { command: 'rm -i *.tmp', explanation: 'Interactive removal with confirmation' },
    ],
    flags: [
      { flag: '-r', description: 'Remove directories and contents recursively' },
      { flag: '-f', description: 'Force removal, ignore nonexistent files' },
      { flag: '-i', description: 'Prompt before every removal' },
      { flag: '-v', description: 'Verbose: print files being removed' },
    ],
    relatedCommands: ['rmdir', 'shred', 'unlink'],
    difficulty: 'beginner',
  },
  {
    id: 'cmd-5',
    name: 'mkdir',
    category: 'File Management',
    synopsis: 'Create directories',
    description: 'Create the DIRECTORY(ies), if they do not already exist.',
    syntax: 'mkdir [OPTION]... DIRECTORY...',
    examples: [
      { command: 'mkdir projects', explanation: 'Create a single directory' },
      { command: 'mkdir -p a/b/c/d', explanation: 'Create nested directories at once' },
      { command: 'mkdir -m 755 public', explanation: 'Create with specific permissions' },
    ],
    flags: [
      { flag: '-p', description: 'Create parent directories as needed' },
      { flag: '-m', description: 'Set file mode (permissions)' },
      { flag: '-v', description: 'Print message for each created directory' },
    ],
    relatedCommands: ['rmdir', 'install', 'mktemp'],
    difficulty: 'beginner',
  },
  {
    id: 'cmd-6',
    name: 'chmod',
    category: 'Permissions',
    synopsis: 'Change file mode (permissions)',
    description: 'Change the access permissions of files and directories using numeric or symbolic notation.',
    syntax: 'chmod [OPTION]... MODE FILE...',
    examples: [
      { command: 'chmod 755 script.sh', explanation: 'rwxr-xr-x: owner all, others read+execute' },
      { command: 'chmod +x script.sh', explanation: 'Add execute permission for all' },
      { command: 'chmod -R 644 docs/', explanation: 'Recursively set permissions on directory' },
      { command: 'chmod u+w,g-w file.txt', explanation: 'Add write for user, remove for group' },
    ],
    flags: [
      { flag: '-R', description: 'Change files and directories recursively' },
      { flag: '-v', description: 'Output diagnostic for every file processed' },
      { flag: '-c', description: 'Report only when a change is made' },
    ],
    relatedCommands: ['chown', 'chgrp', 'umask'],
    difficulty: 'intermediate',
  },
  // === TEXT PROCESSING ===
  {
    id: 'cmd-7',
    name: 'grep',
    category: 'Text Processing',
    synopsis: 'Search text patterns in files',
    description: 'Search for PATTERN in each FILE. By default, prints matching lines. Supports regular expressions.',
    syntax: 'grep [OPTION]... PATTERN [FILE]...',
    examples: [
      { command: 'grep "error" log.txt', explanation: 'Find lines containing "error"' },
      { command: 'grep -rn "TODO" src/', explanation: 'Recursive search with line numbers' },
      { command: 'grep -i "warning" *.log', explanation: 'Case-insensitive search in log files' },
      { command: 'grep -E "^[0-9]+" data.txt', explanation: 'Extended regex: lines starting with numbers' },
      { command: 'grep -c "error" log.txt', explanation: 'Count matching lines' },
    ],
    flags: [
      { flag: '-i', description: 'Case-insensitive matching' },
      { flag: '-r', description: 'Recursive search through directories' },
      { flag: '-n', description: 'Print line numbers' },
      { flag: '-v', description: 'Invert match (non-matching lines)' },
      { flag: '-c', description: 'Count of matching lines only' },
      { flag: '-E', description: 'Extended regular expressions' },
      { flag: '-l', description: 'Print only filenames with matches' },
    ],
    relatedCommands: ['egrep', 'fgrep', 'ack', 'ripgrep'],
    difficulty: 'beginner',
  },
  {
    id: 'cmd-8',
    name: 'sed',
    category: 'Text Processing',
    synopsis: 'Stream editor for filtering and transforming text',
    description: 'A non-interactive stream editor used to perform basic text transformations on an input stream (file or pipe).',
    syntax: 'sed [OPTION]... SCRIPT [FILE]...',
    examples: [
      { command: "sed 's/old/new/g' file.txt", explanation: 'Replace all occurrences of old with new' },
      { command: "sed -i 's/foo/bar/' file.txt", explanation: 'In-place editing of file' },
      { command: "sed -n '5,10p' file.txt", explanation: 'Print only lines 5-10' },
      { command: "sed '/^#/d' config.txt", explanation: 'Delete comment lines' },
    ],
    flags: [
      { flag: '-i', description: 'Edit files in place' },
      { flag: '-n', description: 'Suppress automatic printing' },
      { flag: '-e', description: 'Add script commands' },
      { flag: '-E', description: 'Use extended regular expressions' },
    ],
    relatedCommands: ['awk', 'perl', 'tr'],
    difficulty: 'intermediate',
  },
  {
    id: 'cmd-9',
    name: 'awk',
    category: 'Text Processing',
    synopsis: 'Pattern scanning and text processing language',
    description: 'A powerful text processing language. Excellent for extracting and manipulating columnar data.',
    syntax: "awk 'PATTERN { ACTION }' [FILE]...",
    examples: [
      { command: "awk '{print $1, $3}' data.txt", explanation: 'Print 1st and 3rd columns' },
      { command: "awk -F: '{print $1}' /etc/passwd", explanation: 'Print usernames from passwd' },
      { command: "awk 'NR==5,NR==10' file.txt", explanation: 'Print lines 5-10' },
      { command: "awk '{sum += $2} END {print sum}' data.txt", explanation: 'Sum second column' },
    ],
    flags: [
      { flag: '-F', description: 'Set field separator' },
      { flag: '-v', description: 'Assign variable' },
      { flag: '-f', description: 'Read program from file' },
    ],
    relatedCommands: ['sed', 'cut', 'perl'],
    difficulty: 'advanced',
  },
  {
    id: 'cmd-10',
    name: 'cat',
    category: 'Text Processing',
    synopsis: 'Concatenate and display files',
    description: 'Concatenate FILE(s) to standard output. One of the most commonly used commands for viewing file contents.',
    syntax: 'cat [OPTION]... [FILE]...',
    examples: [
      { command: 'cat file.txt', explanation: 'Display file contents' },
      { command: 'cat file1.txt file2.txt > merged.txt', explanation: 'Merge files' },
      { command: 'cat -n file.txt', explanation: 'Display with line numbers' },
    ],
    flags: [
      { flag: '-n', description: 'Number all output lines' },
      { flag: '-b', description: 'Number non-blank lines only' },
      { flag: '-s', description: 'Squeeze multiple blank lines' },
      { flag: '-E', description: 'Display $ at end of each line' },
    ],
    relatedCommands: ['less', 'more', 'head', 'tail'],
    difficulty: 'beginner',
  },
  {
    id: 'cmd-11',
    name: 'sort',
    category: 'Text Processing',
    synopsis: 'Sort lines of text files',
    description: 'Sort lines of text from FILE(s) or standard input. Supports numeric, reverse, and custom sorting.',
    syntax: 'sort [OPTION]... [FILE]...',
    examples: [
      { command: 'sort names.txt', explanation: 'Alphabetical sort' },
      { command: 'sort -n numbers.txt', explanation: 'Numeric sort' },
      { command: 'sort -rn scores.txt', explanation: 'Reverse numeric (highest first)' },
      { command: 'sort -t: -k3 -n /etc/passwd', explanation: 'Sort by 3rd field with : delimiter' },
    ],
    flags: [
      { flag: '-n', description: 'Numeric sort' },
      { flag: '-r', description: 'Reverse order' },
      { flag: '-k', description: 'Sort by specific key/field' },
      { flag: '-t', description: 'Set field separator' },
      { flag: '-u', description: 'Output only unique lines' },
    ],
    relatedCommands: ['uniq', 'tsort', 'shuf'],
    difficulty: 'beginner',
  },
  // === SYSTEM INFO ===
  {
    id: 'cmd-12',
    name: 'ps',
    category: 'Process Management',
    synopsis: 'Report process status',
    description: 'Display information about active processes. Provides a snapshot of current running processes.',
    syntax: 'ps [OPTION]...',
    examples: [
      { command: 'ps aux', explanation: 'Show all processes with details' },
      { command: 'ps -ef | grep nginx', explanation: 'Find nginx processes' },
      { command: 'ps -eo pid,ppid,%mem,cmd --sort=-%mem', explanation: 'Sort by memory usage' },
    ],
    flags: [
      { flag: '-e', description: 'Select all processes' },
      { flag: '-f', description: 'Full-format listing' },
      { flag: '-u', description: 'Select by effective user' },
      { flag: 'aux', description: 'BSD style: all users, with details' },
    ],
    relatedCommands: ['top', 'htop', 'kill', 'pgrep'],
    difficulty: 'intermediate',
  },
  {
    id: 'cmd-13',
    name: 'top',
    category: 'System Info',
    synopsis: 'Display real-time system processes',
    description: 'Interactive real-time process viewer. Shows CPU, memory usage, and running processes sorted by resource consumption.',
    syntax: 'top [OPTION]...',
    examples: [
      { command: 'top', explanation: 'Launch interactive process viewer' },
      { command: 'top -u username', explanation: 'Show processes for specific user' },
      { command: 'top -bn1 | head -20', explanation: 'Batch mode, single snapshot' },
    ],
    flags: [
      { flag: '-d', description: 'Set update interval in seconds' },
      { flag: '-u', description: 'Filter by user' },
      { flag: '-p', description: 'Monitor specific PIDs' },
      { flag: '-b', description: 'Batch mode for scripting' },
    ],
    relatedCommands: ['htop', 'ps', 'vmstat', 'iostat'],
    difficulty: 'intermediate',
  },
  {
    id: 'cmd-14',
    name: 'df',
    category: 'Disk & Storage',
    synopsis: 'Report filesystem disk space usage',
    description: 'Display information about disk space usage on all mounted filesystems.',
    syntax: 'df [OPTION]... [FILE]...',
    examples: [
      { command: 'df -h', explanation: 'Human-readable disk usage' },
      { command: 'df -hT', explanation: 'Show filesystem types with sizes' },
      { command: 'df -i', explanation: 'Show inode information' },
    ],
    flags: [
      { flag: '-h', description: 'Human-readable sizes' },
      { flag: '-T', description: 'Print filesystem type' },
      { flag: '-i', description: 'Show inode information' },
      { flag: '-a', description: 'Include pseudo filesystems' },
    ],
    relatedCommands: ['du', 'mount', 'fdisk'],
    difficulty: 'beginner',
  },
  {
    id: 'cmd-15',
    name: 'du',
    category: 'Disk & Storage',
    synopsis: 'Estimate file space usage',
    description: 'Summarize disk usage of files and directories, recursively for directories.',
    syntax: 'du [OPTION]... [FILE]...',
    examples: [
      { command: 'du -sh *', explanation: 'Summary of each item in current dir' },
      { command: 'du -h --max-depth=1', explanation: 'Size of immediate subdirectories' },
      { command: 'du -sh /var/log/', explanation: 'Total size of log directory' },
    ],
    flags: [
      { flag: '-s', description: 'Display total for each argument only' },
      { flag: '-h', description: 'Human-readable sizes' },
      { flag: '--max-depth', description: 'Set maximum directory depth' },
      { flag: '-a', description: 'Write counts for all files' },
    ],
    relatedCommands: ['df', 'ncdu', 'ls'],
    difficulty: 'beginner',
  },
  // === NETWORK ===
  {
    id: 'cmd-16',
    name: 'curl',
    category: 'Network',
    synopsis: 'Transfer data with URLs',
    description: 'A versatile tool for transferring data using various protocols (HTTP, FTP, etc). Essential for API testing.',
    syntax: 'curl [OPTION]... URL',
    examples: [
      { command: 'curl https://api.example.com/data', explanation: 'Simple GET request' },
      { command: "curl -X POST -d '{\"name\":\"test\"}' -H 'Content-Type: application/json' url", explanation: 'POST with JSON' },
      { command: 'curl -o file.zip https://example.com/file.zip', explanation: 'Download file' },
      { command: 'curl -I https://example.com', explanation: 'Fetch headers only' },
      { command: 'curl -u user:pass https://api.example.com', explanation: 'Basic authentication' },
    ],
    flags: [
      { flag: '-X', description: 'Specify request method (GET, POST, PUT, DELETE)' },
      { flag: '-d', description: 'Send data in request body' },
      { flag: '-H', description: 'Set custom header' },
      { flag: '-o', description: 'Write output to file' },
      { flag: '-I', description: 'Fetch headers only (HEAD request)' },
      { flag: '-v', description: 'Verbose output for debugging' },
      { flag: '-s', description: 'Silent mode, suppress progress' },
    ],
    relatedCommands: ['wget', 'httpie', 'fetch'],
    difficulty: 'intermediate',
  },
  {
    id: 'cmd-17',
    name: 'ssh',
    category: 'Network',
    synopsis: 'Secure shell remote login',
    description: 'OpenSSH client for securely logging into remote machines and executing commands.',
    syntax: 'ssh [OPTION]... [user@]hostname [command]',
    examples: [
      { command: 'ssh user@192.168.1.100', explanation: 'Connect to remote host' },
      { command: 'ssh -p 2222 user@host', explanation: 'Connect on custom port' },
      { command: 'ssh -i ~/.ssh/key.pem user@host', explanation: 'Connect with specific key' },
      { command: "ssh user@host 'ls -la /var/log'", explanation: 'Run remote command' },
    ],
    flags: [
      { flag: '-p', description: 'Specify port number' },
      { flag: '-i', description: 'Identity file (private key)' },
      { flag: '-L', description: 'Local port forwarding' },
      { flag: '-v', description: 'Verbose mode for debugging' },
    ],
    relatedCommands: ['scp', 'sftp', 'ssh-keygen', 'rsync'],
    difficulty: 'intermediate',
  },
  {
    id: 'cmd-18',
    name: 'wget',
    category: 'Network',
    synopsis: 'Non-interactive network downloader',
    description: 'Download files from the web. Supports HTTP, HTTPS, and FTP. Can resume interrupted downloads.',
    syntax: 'wget [OPTION]... [URL]...',
    examples: [
      { command: 'wget https://example.com/file.tar.gz', explanation: 'Download a file' },
      { command: 'wget -c https://example.com/large.iso', explanation: 'Resume interrupted download' },
      { command: 'wget -r -np https://example.com/docs/', explanation: 'Recursive download' },
    ],
    flags: [
      { flag: '-c', description: 'Continue/resume partial download' },
      { flag: '-r', description: 'Recursive download' },
      { flag: '-O', description: 'Output to specified file' },
      { flag: '-q', description: 'Quiet mode' },
      { flag: '-b', description: 'Background download' },
    ],
    relatedCommands: ['curl', 'aria2c', 'axel'],
    difficulty: 'beginner',
  },
  {
    id: 'cmd-19',
    name: 'ping',
    category: 'Network',
    synopsis: 'Test network connectivity',
    description: 'Send ICMP ECHO_REQUEST packets to network hosts to test reachability and measure latency.',
    syntax: 'ping [OPTION]... DESTINATION',
    examples: [
      { command: 'ping google.com', explanation: 'Ping a hostname' },
      { command: 'ping -c 5 192.168.1.1', explanation: 'Send exactly 5 packets' },
      { command: 'ping -i 0.5 host', explanation: 'Ping every 0.5 seconds' },
    ],
    flags: [
      { flag: '-c', description: 'Stop after count packets' },
      { flag: '-i', description: 'Set interval between packets' },
      { flag: '-t', description: 'Set TTL (Time to Live)' },
      { flag: '-s', description: 'Set packet size' },
    ],
    relatedCommands: ['traceroute', 'mtr', 'nslookup'],
    difficulty: 'beginner',
  },
  // === SEARCH & FIND ===
  {
    id: 'cmd-20',
    name: 'find',
    category: 'Search & Find',
    synopsis: 'Search for files in a directory hierarchy',
    description: 'Search for files in a directory tree matching specified criteria. Extremely powerful with expressions.',
    syntax: 'find [path] [expression]',
    examples: [
      { command: "find . -name '*.py'", explanation: 'Find all Python files' },
      { command: 'find /var -size +100M', explanation: 'Files larger than 100MB' },
      { command: 'find . -mtime -7 -type f', explanation: 'Files modified in last 7 days' },
      { command: "find . -name '*.log' -delete", explanation: 'Find and delete log files' },
      { command: "find . -type f -exec grep -l 'TODO' {} +", explanation: 'Find files containing TODO' },
    ],
    flags: [
      { flag: '-name', description: 'Match by filename pattern' },
      { flag: '-type', description: 'Match by type (f=file, d=dir)' },
      { flag: '-size', description: 'Match by file size' },
      { flag: '-mtime', description: 'Match by modification time' },
      { flag: '-exec', description: 'Execute command on results' },
      { flag: '-maxdepth', description: 'Limit search depth' },
    ],
    relatedCommands: ['locate', 'fd', 'grep', 'xargs'],
    difficulty: 'intermediate',
  },
  // === COMPRESSION ===
  {
    id: 'cmd-21',
    name: 'tar',
    category: 'Compression',
    synopsis: 'Archive utility',
    description: 'Create and extract archive files. Often combined with compression (gzip, bzip2, xz).',
    syntax: 'tar [OPTION]... [FILE]...',
    examples: [
      { command: 'tar -czf archive.tar.gz directory/', explanation: 'Create gzipped archive' },
      { command: 'tar -xzf archive.tar.gz', explanation: 'Extract gzipped archive' },
      { command: 'tar -tvf archive.tar.gz', explanation: 'List archive contents' },
      { command: 'tar -cjf archive.tar.bz2 files/', explanation: 'Create bzip2 archive' },
    ],
    flags: [
      { flag: '-c', description: 'Create a new archive' },
      { flag: '-x', description: 'Extract files from archive' },
      { flag: '-z', description: 'Filter through gzip' },
      { flag: '-j', description: 'Filter through bzip2' },
      { flag: '-f', description: 'Specify archive filename' },
      { flag: '-v', description: 'Verbose: list files processed' },
      { flag: '-t', description: 'List archive contents' },
    ],
    relatedCommands: ['gzip', 'bzip2', 'zip', 'unzip'],
    difficulty: 'intermediate',
  },
  // === PACKAGE MANAGEMENT ===
  {
    id: 'cmd-22',
    name: 'apt',
    category: 'Package Management',
    synopsis: 'Debian/Ubuntu package manager',
    description: 'High-level command-line interface for the package management system on Debian-based systems.',
    syntax: 'apt [OPTION] COMMAND [PACKAGE]...',
    examples: [
      { command: 'sudo apt update', explanation: 'Update package index' },
      { command: 'sudo apt install nginx', explanation: 'Install a package' },
      { command: 'sudo apt upgrade', explanation: 'Upgrade all packages' },
      { command: 'apt search keyword', explanation: 'Search for packages' },
      { command: 'sudo apt autoremove', explanation: 'Remove unused dependencies' },
    ],
    flags: [
      { flag: '-y', description: 'Automatic yes to prompts' },
      { flag: '--fix-broken', description: 'Fix broken dependencies' },
      { flag: '--no-install-recommends', description: 'Skip recommended packages' },
    ],
    relatedCommands: ['apt-get', 'dpkg', 'snap'],
    difficulty: 'beginner',
  },
  {
    id: 'cmd-23',
    name: 'pip',
    category: 'Package Management',
    synopsis: 'Python package installer',
    description: 'Install and manage Python packages from PyPI (Python Package Index).',
    syntax: 'pip [COMMAND] [OPTION]... [PACKAGE]...',
    examples: [
      { command: 'pip install requests', explanation: 'Install a package' },
      { command: 'pip install -r requirements.txt', explanation: 'Install from requirements file' },
      { command: 'pip freeze > requirements.txt', explanation: 'Export installed packages' },
      { command: 'pip list --outdated', explanation: 'Show outdated packages' },
    ],
    flags: [
      { flag: '-r', description: 'Install from requirements file' },
      { flag: '--upgrade', description: 'Upgrade package to latest' },
      { flag: '--user', description: 'Install to user directory' },
    ],
    relatedCommands: ['conda', 'pipenv', 'poetry'],
    difficulty: 'beginner',
  },
  // === PROCESS MANAGEMENT ===
  {
    id: 'cmd-24',
    name: 'kill',
    category: 'Process Management',
    synopsis: 'Terminate processes',
    description: 'Send a signal to a process. By default sends SIGTERM. Use SIGKILL (-9) for unresponsive processes.',
    syntax: 'kill [OPTION] PID...',
    examples: [
      { command: 'kill 1234', explanation: 'Graceful termination (SIGTERM)' },
      { command: 'kill -9 1234', explanation: 'Force kill (SIGKILL)' },
      { command: 'kill -STOP 1234', explanation: 'Pause a process' },
      { command: 'killall nginx', explanation: 'Kill all processes by name' },
    ],
    flags: [
      { flag: '-9', description: 'SIGKILL: force terminate immediately' },
      { flag: '-15', description: 'SIGTERM: graceful termination (default)' },
      { flag: '-STOP', description: 'Pause the process' },
      { flag: '-CONT', description: 'Resume paused process' },
      { flag: '-l', description: 'List all signal names' },
    ],
    relatedCommands: ['killall', 'pkill', 'xkill'],
    difficulty: 'intermediate',
  },
  // === USER MANAGEMENT ===
  {
    id: 'cmd-25',
    name: 'chown',
    category: 'Permissions',
    synopsis: 'Change file owner and group',
    description: 'Change the owner and/or group of files and directories.',
    syntax: 'chown [OPTION]... [OWNER][:[GROUP]] FILE...',
    examples: [
      { command: 'chown user:group file.txt', explanation: 'Change owner and group' },
      { command: 'chown -R www-data:www-data /var/www/', explanation: 'Recursive ownership change' },
      { command: 'chown :developers project/', explanation: 'Change group only' },
    ],
    flags: [
      { flag: '-R', description: 'Operate recursively on directories' },
      { flag: '-v', description: 'Verbose output' },
      { flag: '--reference', description: 'Use reference file ownership' },
    ],
    relatedCommands: ['chmod', 'chgrp', 'id'],
    difficulty: 'intermediate',
  },
  {
    id: 'cmd-26',
    name: 'head',
    category: 'Text Processing',
    synopsis: 'Output the first part of files',
    description: 'Print the first 10 lines (by default) of each FILE to standard output.',
    syntax: 'head [OPTION]... [FILE]...',
    examples: [
      { command: 'head file.txt', explanation: 'Show first 10 lines' },
      { command: 'head -n 20 file.txt', explanation: 'Show first 20 lines' },
      { command: 'head -c 100 file.txt', explanation: 'Show first 100 bytes' },
    ],
    flags: [
      { flag: '-n', description: 'Print first N lines' },
      { flag: '-c', description: 'Print first N bytes' },
      { flag: '-q', description: 'Never print headers for filenames' },
    ],
    relatedCommands: ['tail', 'cat', 'less'],
    difficulty: 'beginner',
  },
  {
    id: 'cmd-27',
    name: 'tail',
    category: 'Text Processing',
    synopsis: 'Output the last part of files',
    description: 'Print the last 10 lines (by default). With -f, follow file changes in real-time (great for logs).',
    syntax: 'tail [OPTION]... [FILE]...',
    examples: [
      { command: 'tail -f /var/log/syslog', explanation: 'Follow log in real-time' },
      { command: 'tail -n 50 errors.log', explanation: 'Show last 50 lines' },
      { command: 'tail -f -n 100 app.log', explanation: 'Follow with last 100 lines context' },
    ],
    flags: [
      { flag: '-f', description: 'Follow file as it grows (live tail)' },
      { flag: '-n', description: 'Print last N lines' },
      { flag: '-c', description: 'Print last N bytes' },
      { flag: '--pid', description: 'Terminate after process ID dies' },
    ],
    relatedCommands: ['head', 'less', 'multitail'],
    difficulty: 'beginner',
  },
  {
    id: 'cmd-28',
    name: 'xargs',
    category: 'Shell Scripting',
    synopsis: 'Build and execute command lines from stdin',
    description: 'Read items from standard input and execute a command with those items as arguments. Powerful for piping.',
    syntax: 'xargs [OPTION]... COMMAND',
    examples: [
      { command: "find . -name '*.tmp' | xargs rm", explanation: 'Delete files found by find' },
      { command: 'cat urls.txt | xargs -n1 curl -O', explanation: 'Download each URL' },
      { command: "echo 'a b c' | xargs -n1 echo", explanation: 'Process each item separately' },
    ],
    flags: [
      { flag: '-n', description: 'Use at most N arguments per command' },
      { flag: '-I', description: 'Replace string in command' },
      { flag: '-P', description: 'Run up to N processes at once' },
      { flag: '-0', description: 'Items separated by null, not space' },
    ],
    relatedCommands: ['find', 'parallel', 'tee'],
    difficulty: 'advanced',
  },
  {
    id: 'cmd-29',
    name: 'rsync',
    category: 'Network',
    synopsis: 'Remote (and local) file sync',
    description: 'Fast, versatile file copying tool. Only transfers changed parts of files, making it efficient for backups and syncing.',
    syntax: 'rsync [OPTION]... SRC DEST',
    examples: [
      { command: 'rsync -avz src/ dest/', explanation: 'Archive mode with compression' },
      { command: 'rsync -avz -e ssh local/ user@host:/remote/', explanation: 'Sync to remote via SSH' },
      { command: 'rsync -avz --delete src/ backup/', explanation: 'Mirror: delete extra files in dest' },
    ],
    flags: [
      { flag: '-a', description: 'Archive mode (recursive, preserves all)' },
      { flag: '-v', description: 'Verbose output' },
      { flag: '-z', description: 'Compress during transfer' },
      { flag: '--delete', description: 'Delete extraneous files in dest' },
      { flag: '-n', description: 'Dry run (show what would change)' },
      { flag: '-e', description: 'Specify remote shell (e.g., ssh)' },
    ],
    relatedCommands: ['scp', 'cp', 'rclone'],
    difficulty: 'intermediate',
  },
  {
    id: 'cmd-30',
    name: 'systemctl',
    category: 'System Info',
    synopsis: 'Control systemd services',
    description: 'Control and inspect the systemd system and service manager. Essential for managing services on modern Linux.',
    syntax: 'systemctl [COMMAND] [UNIT]',
    examples: [
      { command: 'systemctl status nginx', explanation: 'Check service status' },
      { command: 'sudo systemctl start nginx', explanation: 'Start a service' },
      { command: 'sudo systemctl enable nginx', explanation: 'Enable service at boot' },
      { command: 'systemctl list-units --type=service', explanation: 'List all services' },
    ],
    flags: [
      { flag: '--type', description: 'Filter by unit type' },
      { flag: '--state', description: 'Filter by state' },
      { flag: '--no-pager', description: 'Do not pipe output to pager' },
    ],
    relatedCommands: ['service', 'journalctl', 'init'],
    difficulty: 'intermediate',
  },
];

// ===================== CHAT SESSIONS =====================

export const mockChatSessions: ChatSession[] = [
  {
    id: 'chat-1',
    title: 'Docker Networking Help',
    model: 'mistral',
    createdAt: '2 hours ago',
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'How do I connect two Docker containers on the same network?',
        timestamp: '2:30 PM',
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: `To connect Docker containers, create a custom network:\n\n\`\`\`bash\n# Create a network\ndocker network create mynet\n\n# Run containers on that network\ndocker run -d --name db --network mynet postgres\ndocker run -d --name app --network mynet myapp\n\`\`\`\n\nContainers on the same network can reach each other by container name. From "app", you can connect to "db" using \`db:5432\` as the hostname.`,
        timestamp: '2:30 PM',
        model: 'mistral',
      },
    ],
  },
  {
    id: 'chat-2',
    title: 'Rust Ownership Explained',
    model: 'codellama',
    createdAt: '1 day ago',
    messages: [
      {
        id: 'msg-3',
        role: 'user',
        content: 'Can you explain Rust ownership rules simply?',
        timestamp: '4:15 PM',
      },
      {
        id: 'msg-4',
        role: 'assistant',
        content: `Rust ownership follows 3 core rules:\n\n1. **Each value has one owner** — a variable that \"owns\" the data\n2. **One owner at a time** — when ownership transfers (moves), the previous variable is invalid\n3. **Dropped when owner goes out of scope** — memory freed automatically\n\n\`\`\`rust\nlet s1 = String::from("hello");\nlet s2 = s1; // s1 is MOVED to s2\n// println!("{}", s1); // ERROR: s1 no longer valid\nprintln!("{}", s2); // OK\n\`\`\`\n\nUse \`&\` for borrowing (temporary access without ownership transfer).`,
        timestamp: '4:15 PM',
        model: 'codellama',
      },
    ],
  },
];

// ===================== SUGGESTED PROMPTS =====================

export const suggestedPrompts = [
  'Explain this error message and how to fix it',
  'Write a bash script to backup my databases',
  'How do I set up SSH key authentication?',
  'Convert this Python code to Rust',
  'Explain Docker volumes vs bind mounts',
  'Write a systemd service file for my app',
  'How to optimize this SQL query?',
  'Set up CI/CD pipeline with GitHub Actions',
];
