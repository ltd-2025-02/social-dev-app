import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CodePreview from './CodePreview';

interface MarkdownBlock {
  type: 'text' | 'code';
  content: string;
  language?: string;
}

interface MarkdownRendererProps {
  content: MarkdownBlock[];
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const renderTextContent = (text: string) => {
    // Simple markdown parsing for basic formatting
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      if (!line.trim()) {
        return <View key={index} style={styles.spacer} />;
      }

      // Headers
      if (line.startsWith('### ')) {
        return (
          <Text key={index} style={styles.h3}>
            {line.replace('### ', '')}
          </Text>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <Text key={index} style={styles.h2}>
            {line.replace('## ', '')}
          </Text>
        );
      }
      if (line.startsWith('# ')) {
        return (
          <Text key={index} style={styles.h1}>
            {line.replace('# ', '')}
          </Text>
        );
      }

      // Lists
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <View key={index} style={styles.listItem}>
            <Text style={styles.listBullet}>•</Text>
            <Text style={styles.listText}>
              {formatInlineText(line.replace(/^[*-]\s/, ''))}
            </Text>
          </View>
        );
      }

      // Numbered lists
      const numberedMatch = line.match(/^\d+\.\s(.+)$/);
      if (numberedMatch) {
        return (
          <View key={index} style={styles.listItem}>
            <Text style={styles.listNumber}>{line.match(/^\d+/)?.[0]}.</Text>
            <Text style={styles.listText}>
              {formatInlineText(numberedMatch[1])}
            </Text>
          </View>
        );
      }

      // Regular paragraph
      return (
        <Text key={index} style={styles.paragraph}>
          {formatInlineText(line)}
        </Text>
      );
    });
  };

  const formatInlineText = (text: string) => {
    // This is a simplified inline formatter
    // In a real app, you'd want to use a more robust markdown parser
    const parts = [];
    let currentText = text;
    let key = 0;

    // Bold text **text**
    currentText = currentText.replace(/\*\*(.*?)\*\*/g, (match, content) => {
      const placeholder = `__BOLD_${key}__`;
      parts.push({ key: key++, type: 'bold', content });
      return placeholder;
    });

    // Italic text *text*
    currentText = currentText.replace(/\*(.*?)\*/g, (match, content) => {
      const placeholder = `__ITALIC_${key}__`;
      parts.push({ key: key++, type: 'italic', content });
      return placeholder;
    });

    // Inline code `code`
    currentText = currentText.replace(/`([^`]+)`/g, (match, content) => {
      const placeholder = `__CODE_${key}__`;
      parts.push({ key: key++, type: 'code', content });
      return placeholder;
    });

    // Split by placeholders and render
    const segments = currentText.split(/(__[A-Z]+_\d+__)/);
    
    return segments.map((segment, index) => {
      const match = segment.match(/__([A-Z]+)_(\d+)__/);
      if (match) {
        const part = parts.find(p => p.key.toString() === match[2]);
        if (part) {
          switch (part.type) {
            case 'bold':
              return <Text key={index} style={styles.bold}>{part.content}</Text>;
            case 'italic':
              return <Text key={index} style={styles.italic}>{part.content}</Text>;
            case 'code':
              return <Text key={index} style={styles.inlineCode}>{part.content}</Text>;
          }
        }
      }
      return segment;
    });
  };

  return (
    <View style={styles.container}>
      {content.map((block, index) => {
        if (block.type === 'code') {
          return (
            <CodePreview
              key={index}
              code={block.content}
              language={block.language}
            />
          );
        } else {
          return (
            <View key={index} style={styles.textBlock}>
              {renderTextContent(block.content)}
            </View>
          );
        }
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textBlock: {
    marginBottom: 8,
  },
  spacer: {
    height: 8,
  },
  h1: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginVertical: 12,
  },
  h2: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginVertical: 10,
  },
  h3: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginVertical: 8,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: '#374151',
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
    paddingLeft: 8,
  },
  listBullet: {
    fontSize: 15,
    color: '#6b7280',
    marginRight: 8,
    marginTop: 1,
  },
  listNumber: {
    fontSize: 15,
    color: '#6b7280',
    marginRight: 8,
    marginTop: 1,
    minWidth: 20,
  },
  listText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#374151',
    flex: 1,
  },
  bold: {
    fontWeight: '600',
    color: '#1f2937',
  },
  italic: {
    fontStyle: 'italic',
  },
  inlineCode: {
    fontFamily: 'monospace',
    fontSize: 13,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
    color: '#e11d48',
  },
});