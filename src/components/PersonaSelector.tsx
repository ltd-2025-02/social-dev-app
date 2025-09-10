import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PERSONAS, Persona } from '../utils/personas';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 60) / 3; // 3 colunas com padding

interface PersonaSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelectPersona: (persona: Persona) => void;
  selectedPersonaId?: string | null;
}

export default function PersonaSelector({
  visible,
  onClose,
  onSelectPersona,
  selectedPersonaId,
}: PersonaSelectorProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Escolha sua Persona</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Selecione uma imagem que representará seu perfil
          </Text>

          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.personasGrid}>
              {PERSONAS.map((persona) => (
                <TouchableOpacity
                  key={persona.id}
                  style={[
                    styles.personaItem,
                    selectedPersonaId === persona.id && styles.selectedPersona,
                  ]}
                  onPress={() => onSelectPersona(persona)}
                >
                  <Image source={persona.path} style={styles.personaImage} />
                  <Text style={styles.personaName}>{persona.name}</Text>
                  {selectedPersonaId === persona.id && (
                    <View style={styles.selectedIndicator}>
                      <Ionicons name="checkmark" size={16} color="white" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    padding: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  scrollContainer: {
    flex: 1,
  },
  personasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 15,
  },
  personaItem: {
    width: ITEM_SIZE,
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedPersona: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  personaImage: {
    width: ITEM_SIZE - 40,
    height: ITEM_SIZE - 40,
    borderRadius: (ITEM_SIZE - 40) / 2,
    marginBottom: 8,
  },
  personaName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
});