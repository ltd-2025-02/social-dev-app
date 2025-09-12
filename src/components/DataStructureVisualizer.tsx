import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Tree Node Interface
interface TreeNode {
  value: number;
  left?: TreeNode;
  right?: TreeNode;
  x?: number;
  y?: number;
  id: string;
}

// Array Visualization Component
interface ArrayVisualizerProps {
  title: string;
  data: number[];
  highlightIndex?: number;
  onInsert?: (value: number, index?: number) => void;
  onDelete?: (index: number) => void;
  onUpdate?: (index: number, value: number) => void;
}

function ArrayVisualizer({ 
  title, 
  data, 
  highlightIndex, 
  onInsert, 
  onDelete, 
  onUpdate 
}: ArrayVisualizerProps) {
  const [inputValue, setInputValue] = useState('');
  const [inputIndex, setInputIndex] = useState('');

  const handleInsert = () => {
    const value = parseInt(inputValue);
    const index = inputIndex ? parseInt(inputIndex) : undefined;
    
    if (isNaN(value)) {
      Alert.alert('Erro', 'Digite um número válido');
      return;
    }
    
    if (index !== undefined && (index < 0 || index > data.length)) {
      Alert.alert('Erro', 'Índice inválido');
      return;
    }

    onInsert?.(value, index);
    setInputValue('');
    setInputIndex('');
  };

  return (
    <View style={styles.structureContainer}>
      <Text style={styles.structureTitle}>{title}</Text>
      
      {/* Array Visualization */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.arrayContainer}>
          {data.map((value, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.arrayElement,
                highlightIndex === index && styles.highlightedElement,
              ]}
              onPress={() => onDelete?.(index)}
            >
              <Text style={styles.arrayValue}>{value}</Text>
              <Text style={styles.arrayIndex}>{index}</Text>
            </TouchableOpacity>
          ))}
          
          {data.length === 0 && (
            <View style={styles.emptyArray}>
              <Text style={styles.emptyText}>Array vazio</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Controls */}
      <View style={styles.controls}>
        <TextInput
          style={styles.input}
          placeholder="Valor"
          value={inputValue}
          onChangeText={setInputValue}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Índice (opcional)"
          value={inputIndex}
          onChangeText={setInputIndex}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.actionButton} onPress={handleInsert}>
          <Text style={styles.actionButtonText}>Inserir</Text>
        </TouchableOpacity>
      </View>

      {/* Complexity Info */}
      <View style={styles.complexityInfo}>
        <Text style={styles.complexityText}>Acesso: O(1)</Text>
        <Text style={styles.complexityText}>Busca: O(n)</Text>
        <Text style={styles.complexityText}>Inserção: O(n)</Text>
        <Text style={styles.complexityText}>Remoção: O(n)</Text>
      </View>
    </View>
  );
}

// Binary Search Tree Visualizer
interface BSTVisualizerProps {
  title: string;
  root?: TreeNode;
  onInsert?: (value: number) => void;
  onDelete?: (value: number) => void;
  onSearch?: (value: number) => void;
  highlightedNode?: string;
}

function BSTVisualizer({ 
  title, 
  root, 
  onInsert, 
  onDelete, 
  onSearch, 
  highlightedNode 
}: BSTVisualizerProps) {
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      Alert.alert('Erro', 'Digite um número válido');
      return;
    }
    onInsert?.(value);
    setInputValue('');
  };

  const handleSearch = () => {
    const value = parseInt(searchValue);
    if (isNaN(value)) {
      Alert.alert('Erro', 'Digite um número válido');
      return;
    }
    onSearch?.(value);
  };

  const calculateNodePositions = (
    node: TreeNode | undefined,
    x: number,
    y: number,
    horizontalSpacing: number
  ): TreeNode | undefined => {
    if (!node) return undefined;

    const newNode = { ...node, x, y };

    if (node.left) {
      newNode.left = calculateNodePositions(
        node.left,
        x - horizontalSpacing,
        y + 60,
        horizontalSpacing / 2
      );
    }

    if (node.right) {
      newNode.right = calculateNodePositions(
        node.right,
        x + horizontalSpacing,
        y + 60,
        horizontalSpacing / 2
      );
    }

    return newNode;
  };

  const renderTree = () => {
    if (!root) {
      return (
        <View style={styles.emptyTree}>
          <Text style={styles.emptyText}>Árvore vazia</Text>
        </View>
      );
    }

    const positionedTree = calculateNodePositions(root, 150, 40, 80);
    const nodes: TreeNode[] = [];
    const edges: { from: TreeNode; to: TreeNode }[] = [];

    const collectNodes = (node: TreeNode | undefined) => {
      if (!node) return;
      nodes.push(node);
      
      if (node.left) {
        edges.push({ from: node, to: node.left });
        collectNodes(node.left);
      }
      
      if (node.right) {
        edges.push({ from: node, to: node.right });
        collectNodes(node.right);
      }
    };

    collectNodes(positionedTree);

    return (
      <View style={styles.treeContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.treeCanvas}>
            {/* Render edges first */}
            {edges.map((edge, index) => {
              const { from, to } = edge;
              if (!from.x || !from.y || !to.x || !to.y) return null;

              const length = Math.sqrt(
                Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2)
              );
              const angle = Math.atan2(to.y - from.y, to.x - from.x);

              return (
                <View
                  key={`edge-${index}`}
                  style={[
                    styles.edge,
                    {
                      left: from.x,
                      top: from.y + 15,
                      width: length,
                      transform: [
                        { translateX: 15 },
                        { rotate: `${angle}rad` },
                      ],
                    },
                  ]}
                />
              );
            })}

            {/* Render nodes */}
            {nodes.map((node) => (
              <TouchableOpacity
                key={node.id}
                style={[
                  styles.treeNode,
                  {
                    left: (node.x || 0) - 15,
                    top: (node.y || 0) - 15,
                  },
                  highlightedNode === node.id && styles.highlightedNode,
                ]}
                onPress={() => onDelete?.(node.value)}
              >
                <Text style={styles.nodeValue}>{node.value}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.structureContainer}>
      <Text style={styles.structureTitle}>{title}</Text>
      
      {renderTree()}

      {/* Controls */}
      <View style={styles.controls}>
        <TextInput
          style={styles.input}
          placeholder="Inserir valor"
          value={inputValue}
          onChangeText={setInputValue}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.actionButton} onPress={handleInsert}>
          <Text style={styles.actionButtonText}>Inserir</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.controls}>
        <TextInput
          style={styles.input}
          placeholder="Buscar valor"
          value={searchValue}
          onChangeText={setSearchValue}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.actionButton} onPress={handleSearch}>
          <Text style={styles.actionButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {/* Complexity Info */}
      <View style={styles.complexityInfo}>
        <Text style={styles.complexityText}>Busca: O(log n)</Text>
        <Text style={styles.complexityText}>Inserção: O(log n)</Text>
        <Text style={styles.complexityText}>Remoção: O(log n)</Text>
        <Text style={styles.complexityText}>Espaço: O(n)</Text>
      </View>
    </View>
  );
}

// Stack Visualizer
interface StackVisualizerProps {
  title: string;
  data: number[];
  onPush?: (value: number) => void;
  onPop?: () => void;
}

function StackVisualizer({ title, data, onPush, onPop }: StackVisualizerProps) {
  const [inputValue, setInputValue] = useState('');

  const handlePush = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      Alert.alert('Erro', 'Digite um número válido');
      return;
    }
    onPush?.(value);
    setInputValue('');
  };

  return (
    <View style={styles.structureContainer}>
      <Text style={styles.structureTitle}>{title}</Text>
      
      {/* Stack Visualization */}
      <View style={styles.stackContainer}>
        {data.length === 0 ? (
          <View style={styles.emptyStack}>
            <Text style={styles.emptyText}>Stack vazia</Text>
          </View>
        ) : (
          data
            .slice()
            .reverse()
            .map((value, index) => (
              <View
                key={data.length - index - 1}
                style={[
                  styles.stackElement,
                  index === 0 && styles.topElement,
                ]}
              >
                <Text style={styles.stackValue}>{value}</Text>
                {index === 0 && (
                  <Text style={styles.topLabel}>← TOP</Text>
                )}
              </View>
            ))
        )}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TextInput
          style={styles.input}
          placeholder="Push valor"
          value={inputValue}
          onChangeText={setInputValue}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.actionButton} onPress={handlePush}>
          <Text style={styles.actionButtonText}>Push</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.popButton]} 
          onPress={onPop}
          disabled={data.length === 0}
        >
          <Text style={styles.actionButtonText}>Pop</Text>
        </TouchableOpacity>
      </View>

      {/* Complexity Info */}
      <View style={styles.complexityInfo}>
        <Text style={styles.complexityText}>Push: O(1)</Text>
        <Text style={styles.complexityText}>Pop: O(1)</Text>
        <Text style={styles.complexityText}>Top: O(1)</Text>
        <Text style={styles.complexityText}>Espaço: O(n)</Text>
      </View>
    </View>
  );
}

// Queue Visualizer
interface QueueVisualizerProps {
  title: string;
  data: number[];
  onEnqueue?: (value: number) => void;
  onDequeue?: () => void;
}

function QueueVisualizer({ title, data, onEnqueue, onDequeue }: QueueVisualizerProps) {
  const [inputValue, setInputValue] = useState('');

  const handleEnqueue = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      Alert.alert('Erro', 'Digite um número válido');
      return;
    }
    onEnqueue?.(value);
    setInputValue('');
  };

  return (
    <View style={styles.structureContainer}>
      <Text style={styles.structureTitle}>{title}</Text>
      
      {/* Queue Visualization */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.queueContainer}>
          {data.length === 0 ? (
            <View style={styles.emptyQueue}>
              <Text style={styles.emptyText}>Queue vazia</Text>
            </View>
          ) : (
            data.map((value, index) => (
              <View
                key={index}
                style={[
                  styles.queueElement,
                  index === 0 && styles.frontElement,
                  index === data.length - 1 && styles.rearElement,
                ]}
              >
                <Text style={styles.queueValue}>{value}</Text>
                {index === 0 && (
                  <Text style={styles.frontLabel}>FRONT</Text>
                )}
                {index === data.length - 1 && (
                  <Text style={styles.rearLabel}>REAR</Text>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Controls */}
      <View style={styles.controls}>
        <TextInput
          style={styles.input}
          placeholder="Enqueue valor"
          value={inputValue}
          onChangeText={setInputValue}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.actionButton} onPress={handleEnqueue}>
          <Text style={styles.actionButtonText}>Enqueue</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.dequeueButton]} 
          onPress={onDequeue}
          disabled={data.length === 0}
        >
          <Text style={styles.actionButtonText}>Dequeue</Text>
        </TouchableOpacity>
      </View>

      {/* Complexity Info */}
      <View style={styles.complexityInfo}>
        <Text style={styles.complexityText}>Enqueue: O(1)</Text>
        <Text style={styles.complexityText}>Dequeue: O(1)</Text>
        <Text style={styles.complexityText}>Front: O(1)</Text>
        <Text style={styles.complexityText}>Espaço: O(n)</Text>
      </View>
    </View>
  );
}

// Main Data Structure Visualizer Component
interface DataStructureVisualizerProps {
  type: 'array' | 'bst' | 'stack' | 'queue';
  title: string;
}

export default function DataStructureVisualizer({ type, title }: DataStructureVisualizerProps) {
  // Array state
  const [arrayData, setArrayData] = useState<number[]>([1, 3, 5, 7, 9]);
  const [highlightIndex, setHighlightIndex] = useState<number | undefined>();

  // BST state
  const [bstRoot, setBstRoot] = useState<TreeNode | undefined>();
  const [highlightedNode, setHighlightedNode] = useState<string | undefined>();

  // Stack state
  const [stackData, setStackData] = useState<number[]>([]);

  // Queue state
  const [queueData, setQueueData] = useState<number[]>([]);

  // BST operations
  const insertToBST = (root: TreeNode | undefined, value: number): TreeNode => {
    if (!root) {
      return {
        value,
        id: `node-${value}-${Date.now()}`,
      };
    }

    if (value < root.value) {
      root.left = insertToBST(root.left, value);
    } else if (value > root.value) {
      root.right = insertToBST(root.right, value);
    }

    return root;
  };

  const searchInBST = (root: TreeNode | undefined, value: number): TreeNode | null => {
    if (!root) return null;
    
    if (value === root.value) {
      setHighlightedNode(root.id);
      setTimeout(() => setHighlightedNode(undefined), 2000);
      return root;
    }
    
    if (value < root.value) {
      return searchInBST(root.left, value);
    } else {
      return searchInBST(root.right, value);
    }
  };

  // Event handlers
  const handleArrayInsert = (value: number, index?: number) => {
    if (index === undefined) {
      setArrayData([...arrayData, value]);
    } else {
      const newArray = [...arrayData];
      newArray.splice(index, 0, value);
      setArrayData(newArray);
    }
  };

  const handleArrayDelete = (index: number) => {
    const newArray = arrayData.filter((_, i) => i !== index);
    setArrayData(newArray);
  };

  const handleBSTInsert = (value: number) => {
    setBstRoot(insertToBST(bstRoot, value));
  };

  const handleBSTSearch = (value: number) => {
    searchInBST(bstRoot, value);
  };

  const handleStackPush = (value: number) => {
    setStackData([...stackData, value]);
  };

  const handleStackPop = () => {
    setStackData(stackData.slice(0, -1));
  };

  const handleQueueEnqueue = (value: number) => {
    setQueueData([...queueData, value]);
  };

  const handleQueueDequeue = () => {
    setQueueData(queueData.slice(1));
  };

  // Initialize with sample data
  useEffect(() => {
    if (type === 'bst' && !bstRoot) {
      let root: TreeNode | undefined;
      [50, 30, 70, 20, 40, 60, 80].forEach(value => {
        root = insertToBST(root, value);
      });
      setBstRoot(root);
    }
    
    if (type === 'stack' && stackData.length === 0) {
      setStackData([10, 20, 30]);
    }
    
    if (type === 'queue' && queueData.length === 0) {
      setQueueData([10, 20, 30]);
    }
  }, [type]);

  const renderStructure = () => {
    switch (type) {
      case 'array':
        return (
          <ArrayVisualizer
            title={title}
            data={arrayData}
            highlightIndex={highlightIndex}
            onInsert={handleArrayInsert}
            onDelete={handleArrayDelete}
          />
        );
      case 'bst':
        return (
          <BSTVisualizer
            title={title}
            root={bstRoot}
            highlightedNode={highlightedNode}
            onInsert={handleBSTInsert}
            onSearch={handleBSTSearch}
          />
        );
      case 'stack':
        return (
          <StackVisualizer
            title={title}
            data={stackData}
            onPush={handleStackPush}
            onPop={handleStackPop}
          />
        );
      case 'queue':
        return (
          <QueueVisualizer
            title={title}
            data={queueData}
            onEnqueue={handleQueueEnqueue}
            onDequeue={handleQueueDequeue}
          />
        );
      default:
        return null;
    }
  };

  return <>{renderStructure()}</>;
}

const styles = StyleSheet.create({
  structureContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  structureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  
  // Array styles
  arrayContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  arrayElement: {
    width: 50,
    height: 60,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  highlightedElement: {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
  },
  arrayValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  arrayIndex: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 2,
  },
  emptyArray: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    paddingHorizontal: 20,
  },
  
  // BST styles
  treeContainer: {
    height: 250,
    marginBottom: 20,
  },
  treeCanvas: {
    width: 400,
    height: 250,
    position: 'relative',
  },
  treeNode: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlightedNode: {
    backgroundColor: '#ef4444',
  },
  nodeValue: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  edge: {
    position: 'absolute',
    height: 1,
    backgroundColor: '#6b7280',
    transformOrigin: '0 0',
  },
  emptyTree: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  
  // Stack styles
  stackContainer: {
    alignItems: 'center',
    marginBottom: 20,
    minHeight: 200,
  },
  stackElement: {
    width: 120,
    height: 40,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 2,
  },
  topElement: {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
  },
  stackValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  topLabel: {
    fontSize: 10,
    color: '#3b82f6',
    marginLeft: 8,
    fontWeight: '600',
  },
  emptyStack: {
    height: 100,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  
  // Queue styles
  queueContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingVertical: 20,
  },
  queueElement: {
    width: 50,
    height: 60,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  frontElement: {
    backgroundColor: '#dcfce7',
    borderColor: '#10b981',
  },
  rearElement: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
  },
  queueValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  frontLabel: {
    position: 'absolute',
    top: -20,
    fontSize: 8,
    color: '#10b981',
    fontWeight: '600',
  },
  rearLabel: {
    position: 'absolute',
    top: -20,
    fontSize: 8,
    color: '#f59e0b',
    fontWeight: '600',
  },
  emptyQueue: {
    height: 60,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  
  // Common styles
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
  },
  controls: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  actionButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
  },
  popButton: {
    backgroundColor: '#ef4444',
  },
  dequeueButton: {
    backgroundColor: '#f59e0b',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  complexityInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
  },
  complexityText: {
    fontSize: 12,
    color: '#4b5563',
    fontWeight: '500',
  },
});