import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  FlatList,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  TECHNOLOGY_ICONS, 
  TechnologyIcon, 
  getTechnologyCategories, 
  getTechnologyIconsByCategory,
  searchTechnologyIcons,
  CATEGORY_NAMES,
  getCategoryColor
} from '../utils/technologyIcons';

const { width } = Dimensions.get('window');

interface TechnologySelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelectTechnology: (technology: TechnologyIcon, level: SkillLevel) => void;
  selectedTechnologies?: string[]; // IDs das tecnologias já selecionadas
}

type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

const SKILL_LEVELS: { value: SkillLevel; label: string; color: string }[] = [
  { value: 'beginner', label: 'Iniciante', color: '#10b981' },
  { value: 'intermediate', label: 'Intermediário', color: '#3b82f6' },
  { value: 'advanced', label: 'Avançado', color: '#f59e0b' },
  { value: 'expert', label: 'Expert', color: '#ef4444' },
];

export default function TechnologySelector({ 
  visible, 
  onClose, 
  onSelectTechnology,
  selectedTechnologies = []
}: TechnologySelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTechnology, setSelectedTechnology] = useState<TechnologyIcon | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel>('intermediate');

  const categories = getTechnologyCategories();
  
  const getFilteredTechnologies = (): TechnologyIcon[] => {
    let technologies: TechnologyIcon[] = [];
    
    if (searchQuery.trim()) {
      technologies = searchTechnologyIcons(searchQuery);
    } else if (selectedCategory) {
      technologies = getTechnologyIconsByCategory(selectedCategory as any);
    } else {
      technologies = TECHNOLOGY_ICONS;
    }
    
    // Filtrar tecnologias já selecionadas
    return technologies.filter(tech => !selectedTechnologies.includes(tech.id));
  };

  const handleTechnologyPress = (technology: TechnologyIcon) => {
    setSelectedTechnology(technology);
  };

  const handleConfirmSelection = () => {
    if (!selectedTechnology) {
      Alert.alert('Atenção', 'Selecione uma tecnologia primeiro');
      return;
    }

    onSelectTechnology(selectedTechnology, selectedLevel);
    
    // Reset state
    setSelectedTechnology(null);
    setSelectedLevel('intermediate');
    setSearchQuery('');
    setSelectedCategory(null);
    onClose();
  };

  const handleClose = () => {
    setSelectedTechnology(null);
    setSelectedLevel('intermediate');
    setSearchQuery('');
    setSelectedCategory(null);
    onClose();
  };

  const renderTechnologyItem = ({ item }: { item: TechnologyIcon }) => {
    const isSelected = selectedTechnology?.id === item.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.technologyItem,
          isSelected && styles.technologyItemSelected,
          { borderColor: isSelected ? item.color : '#e5e7eb' }
        ]}
        onPress={() => handleTechnologyPress(item)}
      >
        <View style={[styles.technologyIcon, { backgroundColor: `${item.color}15` }]}>
          <Ionicons name={item.icon as any} size={24} color={item.color} />
        </View>
        <Text style={[
          styles.technologyName,
          isSelected && styles.technologyNameSelected
        ]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderCategoryChip = (category: string) => {
    const isSelected = selectedCategory === category;
    const categoryColor = getCategoryColor(category as any);
    
    return (
      <TouchableOpacity
        key={category}
        style={[
          styles.categoryChip,
          isSelected && styles.categoryChipSelected,
          { backgroundColor: isSelected ? categoryColor : '#f3f4f6' }
        ]}
        onPress={() => setSelectedCategory(isSelected ? null : category)}
      >
        <Text style={[
          styles.categoryText,
          isSelected && styles.categoryTextSelected
        ]}>
          {CATEGORY_NAMES[category as keyof typeof CATEGORY_NAMES]}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderLevelSelector = () => {
    return (
      <View style={styles.levelSelectorContainer}>
        <Text style={styles.levelSelectorTitle}>Nível de conhecimento:</Text>
        <View style={styles.levelSelectorButtons}>
          {SKILL_LEVELS.map((level) => (
            <TouchableOpacity
              key={level.value}
              style={[
                styles.levelButton,
                selectedLevel === level.value && styles.levelButtonSelected,
                selectedLevel === level.value && { backgroundColor: level.color }
              ]}
              onPress={() => setSelectedLevel(level.value)}
            >
              <Text style={[
                styles.levelButtonText,
                selectedLevel === level.value && styles.levelButtonTextSelected
              ]}>
                {level.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <Ionicons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Adicionar Tecnologia</Text>
          <TouchableOpacity
            onPress={handleConfirmSelection}
            disabled={!selectedTechnology}
            style={[
              styles.confirmButton,
              !selectedTechnology && styles.confirmButtonDisabled
            ]}
          >
            <Text style={[
              styles.confirmButtonText,
              !selectedTechnology && styles.confirmButtonTextDisabled
            ]}>
              Adicionar
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#9ca3af" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar tecnologia..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Categories */}
        {!searchQuery && (
          <View style={styles.categoriesContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContent}
            >
              <TouchableOpacity
                style={[
                  styles.categoryChip,
                  !selectedCategory && styles.categoryChipSelected,
                  !selectedCategory && { backgroundColor: '#3b82f6' }
                ]}
                onPress={() => setSelectedCategory(null)}
              >
                <Text style={[
                  styles.categoryText,
                  !selectedCategory && styles.categoryTextSelected
                ]}>
                  Todas
                </Text>
              </TouchableOpacity>
              {categories.map(renderCategoryChip)}
            </ScrollView>
          </View>
        )}

        {/* Technology Grid */}
        <View style={styles.technologiesContainer}>
          <FlatList
            data={getFilteredTechnologies()}
            keyExtractor={(item) => item.id}
            renderItem={renderTechnologyItem}
            numColumns={2}
            columnWrapperStyle={styles.technologyRow}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.technologiesContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="search" size={48} color="#9ca3af" />
                <Text style={styles.emptyText}>
                  {searchQuery 
                    ? `Nenhuma tecnologia encontrada para "${searchQuery}"` 
                    : 'Nenhuma tecnologia disponível'
                  }
                </Text>
              </View>
            }
          />
        </View>

        {/* Level Selector - shown when technology is selected */}
        {selectedTechnology && (
          <View style={styles.bottomContainer}>
            <View style={styles.selectedTechnologyPreview}>
              <View style={[
                styles.selectedTechnologyIcon, 
                { backgroundColor: `${selectedTechnology.color}15` }
              ]}>
                <Ionicons 
                  name={selectedTechnology.icon as any} 
                  size={20} 
                  color={selectedTechnology.color} 
                />
              </View>
              <Text style={styles.selectedTechnologyName}>
                {selectedTechnology.name}
              </Text>
            </View>
            {renderLevelSelector()}
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  confirmButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
  },
  confirmButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  confirmButtonTextDisabled: {
    color: '#f3f4f6',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    marginLeft: 8,
  },
  categoriesContainer: {
    paddingVertical: 8,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  categoryChipSelected: {
    backgroundColor: '#3b82f6',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  categoryTextSelected: {
    color: 'white',
  },
  technologiesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  technologiesContent: {
    paddingBottom: 20,
  },
  technologyRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  technologyItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  technologyItemSelected: {
    backgroundColor: '#f8fafc',
    borderWidth: 2,
  },
  technologyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  technologyName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    flex: 1,
  },
  technologyNameSelected: {
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 12,
    textAlign: 'center',
  },
  bottomContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f9fafb',
  },
  selectedTechnologyPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  selectedTechnologyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedTechnologyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  levelSelectorContainer: {
    marginTop: 8,
  },
  levelSelectorTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  levelSelectorButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  levelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  levelButtonSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  levelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  levelButtonTextSelected: {
    color: 'white',
  },
});