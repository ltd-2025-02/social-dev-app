import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Clipboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CodePreviewProps {
  code: string;
  language?: string;
}

const SYNTAX_COLORS = {
  keyword: '#8b5cf6',
  string: '#10b981', 
  comment: '#6b7280',
  function: '#3b82f6',
  variable: '#f59e0b',
  number: '#ef4444',
  operator: '#6366f1',
  default: '#1f2937'
};

const KEYWORDS = {
  javascript: [
    'function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'do', 'switch',
    'case', 'break', 'continue', 'return', 'class', 'extends', 'import', 'export',
    'default', 'async', 'await', 'try', 'catch', 'finally', 'new', 'this', 'typeof',
    'instanceof', 'null', 'undefined', 'true', 'false'
  ],
  python: [
    'def', 'class', 'if', 'elif', 'else', 'for', 'while', 'try', 'except', 'finally',
    'import', 'from', 'as', 'return', 'yield', 'with', 'pass', 'break', 'continue',
    'lambda', 'and', 'or', 'not', 'in', 'is', 'True', 'False', 'None'
  ],
  typescript: [
    'function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'do', 'switch',
    'case', 'break', 'continue', 'return', 'class', 'extends', 'import', 'export',
    'default', 'async', 'await', 'try', 'catch', 'finally', 'new', 'this', 'typeof',
    'instanceof', 'null', 'undefined', 'true', 'false', 'interface', 'type', 'enum'
  ]
};

export default function CodePreview({ code, language = 'javascript' }: CodePreviewProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    Clipboard.setString(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightSyntax = (codeString: string, lang: string) => {
    const keywords = KEYWORDS[lang as keyof typeof KEYWORDS] || KEYWORDS.javascript;
    const lines = codeString.split('\n');
    
    return lines.map((line, lineIndex) => {
      if (!line.trim()) {
        return { key: lineIndex, content: [{ text: '\n', style: SYNTAX_COLORS.default }] };
      }

      const tokens: Array<{ text: string; style: string }> = [];
      let currentIndex = 0;

      // Simple tokenizer
      const patterns = [
        // Comments
        { regex: /(\/\/.*|\/\*[\s\S]*?\*\/|#.*)/g, style: SYNTAX_COLORS.comment },
        // Strings
        { regex: /(['"`])(?:(?!\1)[^\\]|\\[\s\S])*\1/g, style: SYNTAX_COLORS.string },
        // Numbers
        { regex: /\b\d+\.?\d*\b/g, style: SYNTAX_COLORS.number },
        // Keywords
        { regex: new RegExp(`\\b(${keywords.join('|')})\\b`, 'g'), style: SYNTAX_COLORS.keyword },
        // Functions (simple pattern)
        { regex: /\b(\w+)(?=\s*\()/g, style: SYNTAX_COLORS.function },
        // Operators
        { regex: /[+\-*\/=<>!&|]+/g, style: SYNTAX_COLORS.operator },
      ];

      const matches: Array<{ start: number; end: number; style: string }> = [];
      
      patterns.forEach(pattern => {
        let match;
        while ((match = pattern.regex.exec(line)) !== null) {
          matches.push({
            start: match.index,
            end: match.index + match[0].length,
            style: pattern.style
          });
        }
      });

      // Sort matches by start position
      matches.sort((a, b) => a.start - b.start);

      // Merge overlapping matches (keep first)
      const mergedMatches: typeof matches = [];
      matches.forEach(match => {
        const lastMatch = mergedMatches[mergedMatches.length - 1];
        if (!lastMatch || match.start >= lastMatch.end) {
          mergedMatches.push(match);
        }
      });

      // Build tokens
      mergedMatches.forEach(match => {
        // Add text before match
        if (match.start > currentIndex) {
          tokens.push({
            text: line.slice(currentIndex, match.start),
            style: SYNTAX_COLORS.default
          });
        }
        
        // Add matched text
        tokens.push({
          text: line.slice(match.start, match.end),
          style: match.style
        });
        
        currentIndex = match.end;
      });

      // Add remaining text
      if (currentIndex < line.length) {
        tokens.push({
          text: line.slice(currentIndex),
          style: SYNTAX_COLORS.default
        });
      }

      return { key: lineIndex, content: tokens.length ? tokens : [{ text: line, style: SYNTAX_COLORS.default }] };
    });
  };

  const highlightedLines = highlightSyntax(code, language);

  const getLanguageDisplayName = (lang: string) => {
    const names: Record<string, string> = {
      javascript: 'JavaScript',
      typescript: 'TypeScript',
      python: 'Python',
      jsx: 'React JSX',
      tsx: 'React TSX',
      html: 'HTML',
      css: 'CSS',
      json: 'JSON'
    };
    return names[lang] || lang.toUpperCase();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.languageTag}>
          <Ionicons name="code-slash" size={14} color="#6366f1" />
          <Text style={styles.languageText}>{getLanguageDisplayName(language)}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.copyButton}
          onPress={copyToClipboard}
        >
          <Ionicons 
            name={copied ? "checkmark" : "copy-outline"} 
            size={16} 
            color={copied ? "#10b981" : "#6b7280"} 
          />
          <Text style={[styles.copyText, copied && styles.copiedText]}>
            {copied ? "Copiado!" : "Copiar"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Code Content */}
      <ScrollView 
        style={styles.codeContainer}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.codeContent}>
          {highlightedLines.map((line, index) => (
            <View key={line.key} style={styles.codeLine}>
              <Text style={styles.lineNumber}>{index + 1}</Text>
              <View style={styles.lineContent}>
                {line.content.map((token, tokenIndex) => (
                  <Text 
                    key={tokenIndex}
                    style={[styles.codeText, { color: token.style }]}
                  >
                    {token.text}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  languageTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  languageText: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '600',
    marginLeft: 4,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#334155',
  },
  copyText: {
    fontSize: 11,
    color: '#6b7280',
    marginLeft: 4,
    fontWeight: '500',
  },
  copiedText: {
    color: '#10b981',
  },
  codeContainer: {
    maxHeight: 300,
  },
  codeContent: {
    paddingVertical: 12,
  },
  codeLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 20,
  },
  lineNumber: {
    width: 40,
    fontSize: 12,
    color: '#64748b',
    textAlign: 'right',
    fontFamily: 'monospace',
    paddingRight: 12,
    paddingLeft: 8,
    userSelect: 'none',
  },
  lineContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    paddingRight: 16,
  },
  codeText: {
    fontSize: 13,
    fontFamily: 'monospace',
    lineHeight: 20,
  },
});