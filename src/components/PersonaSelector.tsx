import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  Dimensions,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PERSONAS, PERSONAS_BY_CATEGORY, Persona } from '../utils/personas';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 80) / 3; // 3 colunas com padding

interface PersonaSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelectPersona: (persona: Persona) => void;
  currentPersonaId?: string | null;
}

export default function PersonaSelector({
  visible,
  onClose,
  onSelectPersona,
  currentPersonaId,
}: PersonaSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  
  const categories = ['Todos', ...Object.keys(PERSONAS_BY_CATEGORY).sort()];
  
  // Filtrar personas baseado na busca e categoria
  const filteredPersonas = PERSONAS.filter(persona => {
    const matchesSearch = persona.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || persona.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectPersona = (persona: Persona) => {
    onSelectPersona(persona);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header com gradiente */}
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.headerContent}>
              <Text style={styles.title}>Escolha sua Persona</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.subtitle}>
              Selecione um animal que representará seu perfil
            </Text>
          </LinearGradient>

          {/* Barra de pesquisa */}
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#9ca3af" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar animal..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>

          {/* Categorias */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
            contentContainerStyle={styles.categoriesContent}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.selectedCategoryButton
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category && styles.selectedCategoryText
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Grid de personas */}
          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.personasGrid}>
              {filteredPersonas.map((persona) => (
                <TouchableOpacity
                  key={persona.id}
                  style={[
                    styles.personaItem,
                    currentPersonaId === persona.id && styles.selectedPersona,
                  ]}
                  onPress={() => handleSelectPersona(persona)}
                  activeOpacity={0.8}
                >
                  <View style={styles.personaImageContainer}>
                    <Image source={persona.path} style={styles.personaImage} />
                    {currentPersonaId === persona.id && (
                      <View style={styles.selectedIndicator}>
                        <Ionicons name="checkmark" size={16} color="white" />
                      </View>
                    )}
                  </View>
                  <Text style={styles.personaName}>{persona.name}</Text>
                  <Text style={styles.personaCategory}>{persona.category}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {filteredPersonas.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={48} color="#9ca3af" />
                <Text style={styles.emptyStateText}>
                  Nenhum animal encontrado
                </Text>
              </View>
            )}
            
            <View style={styles.bottomSpacing} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    minHeight: '60%',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#1f2937',
  },
  categoriesContainer: {
    maxHeight: 50,
    marginBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedCategoryButton: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  selectedCategoryText: {
    color: 'white',
  },
  scrollContainer: {
    flex: 1,
  },
  personasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
    justifyContent: 'space-between',
  },
  personaItem: {
    width: ITEM_SIZE,
    alignItems: 'center',
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedPersona: {
    borderColor: '#667eea',
    backgroundColor: '#f0f4ff',
    shadowColor: '#667eea',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  personaImageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  personaImage: {
    width: ITEM_SIZE - 48,
    height: ITEM_SIZE - 48,
    borderRadius: (ITEM_SIZE - 48) / 2,
    borderWidth: 2,
    borderColor: '#f1f5f9',
  },
  personaName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 2,
  },
  personaCategory: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6b7280',
    textAlign: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 16,
  },
  bottomSpacing: {
    height: 20,
  },
});