import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SavedResume, savedResumeService } from '../../services/savedResume.service';

interface PublicResumeScreenProps {
  navigation: any;
  route: { params: { resumeId: string; shareToken?: string } };
}

export default function PublicResumeScreen({ navigation, route }: PublicResumeScreenProps) {
  const { resumeId, shareToken } = route.params;
  
  const [resume, setResume] = useState<SavedResume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadResume();
  }, [resumeId]);

  const loadResume = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const resumeData = await savedResumeService.getResumeById(resumeId);
      
      if (!resumeData) {
        setError('Currículo não encontrado.');
        return;
      }

      // Verificar se o currículo é público
      if (!resumeData.is_public && !shareToken) {
        setError('Este currículo não está disponível publicamente.');
        return;
      }

      setResume(resumeData);
    } catch (error) {
      console.error('Error loading public resume:', error);
      setError('Erro ao carregar o currículo.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!resume) return;
    
    try {
      const shareUrl = shareToken 
        ? `https://socialdev.app/resume/${shareToken}`
        : `https://socialdev.app/resume/public/${resume.id}`;
      
      await Share.share({
        message: `Confira o currículo de ${resume.personal_info.fullName}: ${shareUrl}`,
        url: shareUrl,
        title: `Currículo - ${resume.personal_info.fullName}`,
      });
    } catch (error) {
      console.error('Error sharing resume:', error);
      Alert.alert('Erro', 'Não foi possível compartilhar o currículo.');
    }
  };

  const handleDownload = async () => {
    if (!resume) return;
    
    try {
      await savedResumeService.downloadResume(resume, 'html');
    } catch (error) {
      console.error('Error downloading resume:', error);
      Alert.alert('Erro', 'Não foi possível fazer o download do currículo.');
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Carregando currículo...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !resume) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="document-outline" size={64} color="#9ca3af" />
          <Text style={styles.errorTitle}>Currículo não encontrado</Text>
          <Text style={styles.errorText}>
            {error || 'O currículo solicitado não está disponível.'}
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#3b82f6', '#8b5cf6']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>{resume.title}</Text>
          
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={handleDownload}>
              <Ionicons name="download-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Personal Information */}
        <View style={styles.section}>
          <View style={styles.personalInfo}>
            <Text style={styles.fullName}>{resume.personal_info.fullName}</Text>
            <Text style={styles.contactInfo}>{resume.personal_info.email}</Text>
            <Text style={styles.contactInfo}>{resume.personal_info.phone}</Text>
            <Text style={styles.contactInfo}>{resume.personal_info.address}</Text>
            
            {resume.personal_info.linkedin && (
              <TouchableOpacity 
                style={styles.socialLink}
                onPress={() => {/* Abrir LinkedIn */}}
              >
                <Ionicons name="logo-linkedin" size={16} color="#0077b5" />
                <Text style={styles.socialLinkText}>LinkedIn</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Summary */}
        {resume.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumo Profissional</Text>
            <Text style={styles.summaryText}>{resume.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {resume.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experiência Profissional</Text>
            {resume.experience.map((exp, index) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.experiencePosition}>{exp.position}</Text>
                  <Text style={styles.experienceDate}>
                    {formatDate(exp.startDate)} - {exp.current ? 'Atual' : formatDate(exp.endDate || '')}
                  </Text>
                </View>
                <Text style={styles.experienceCompany}>{exp.company}</Text>
                <Text style={styles.experienceDescription}>{exp.description}</Text>
                {exp.achievements.length > 0 && (
                  <View style={styles.achievementsList}>
                    {exp.achievements.map((achievement, achIndex) => (
                      <View key={achIndex} style={styles.achievementItem}>
                        <Text style={styles.achievementBullet}>•</Text>
                        <Text style={styles.achievementText}>{achievement}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {resume.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Formação Acadêmica</Text>
            {resume.education.map((edu, index) => (
              <View key={index} style={styles.educationItem}>
                <View style={styles.educationHeader}>
                  <Text style={styles.educationDegree}>{edu.degree}</Text>
                  <Text style={styles.educationDate}>
                    {formatDate(edu.startDate)} - {edu.current ? 'Em andamento' : formatDate(edu.endDate || '')}
                  </Text>
                </View>
                <Text style={styles.educationField}>{edu.field}</Text>
                <Text style={styles.educationInstitution}>{edu.institution}</Text>
                {edu.gpa && (
                  <Text style={styles.educationGPA}>GPA: {edu.gpa}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Technical Skills */}
        {resume.technical_skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Habilidades Técnicas</Text>
            <View style={styles.skillsGrid}>
              {resume.technical_skills.map((skill, index) => (
                <View key={index} style={styles.skillItem}>
                  <Text style={styles.skillName}>{skill.name}</Text>
                  <Text style={styles.skillLevel}>{skill.level}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Projects */}
        {resume.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projetos</Text>
            {resume.projects.map((project, index) => (
              <View key={index} style={styles.projectItem}>
                <View style={styles.projectHeader}>
                  <Text style={styles.projectName}>{project.name}</Text>
                  <Text style={styles.projectDate}>
                    {formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : 'Atual'}
                  </Text>
                </View>
                <Text style={styles.projectDescription}>{project.description}</Text>
                <View style={styles.technologiesContainer}>
                  <Text style={styles.technologiesLabel}>Tecnologias: </Text>
                  <Text style={styles.technologiesText}>{project.technologies.join(', ')}</Text>
                </View>
                {project.url && (
                  <TouchableOpacity style={styles.projectLink}>
                    <Ionicons name="open-outline" size={16} color="#3b82f6" />
                    <Text style={styles.projectLinkText}>Ver projeto</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {resume.certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certificações</Text>
            {resume.certifications.map((cert, index) => (
              <View key={index} style={styles.certificationItem}>
                <View style={styles.certificationHeader}>
                  <Text style={styles.certificationName}>{cert.name}</Text>
                  <Text style={styles.certificationDate}>
                    {formatDate(cert.issueDate)}
                  </Text>
                </View>
                <Text style={styles.certificationIssuer}>{cert.issuer}</Text>
                {cert.credentialId && (
                  <Text style={styles.certificationId}>ID: {cert.credentialId}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Languages */}
        {resume.languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Idiomas</Text>
            <View style={styles.languagesGrid}>
              {resume.languages.map((lang, index) => (
                <View key={index} style={styles.languageItem}>
                  <Text style={styles.languageName}>{lang.language}</Text>
                  <Text style={styles.languageLevel}>{lang.proficiency}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Currículo gerado pelo SocialDev - {new Date().toLocaleDateString('pt-BR')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  personalInfo: {
    alignItems: 'center',
  },
  fullName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  contactInfo: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 4,
  },
  socialLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  socialLinkText: {
    fontSize: 14,
    color: '#0077b5',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
    paddingBottom: 8,
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4b5563',
  },
  experienceItem: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  experiencePosition: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  experienceDate: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  experienceCompany: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
    marginBottom: 8,
  },
  experienceDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4b5563',
    marginBottom: 8,
  },
  achievementsList: {
    marginTop: 8,
  },
  achievementItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  achievementBullet: {
    color: '#3b82f6',
    marginRight: 8,
    fontSize: 16,
  },
  achievementText: {
    flex: 1,
    fontSize: 14,
    color: '#4b5563',
  },
  educationItem: {
    marginBottom: 16,
  },
  educationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  educationDegree: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  educationDate: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  educationField: {
    fontSize: 15,
    color: '#4b5563',
    marginBottom: 2,
  },
  educationInstitution: {
    fontSize: 15,
    color: '#3b82f6',
    fontWeight: '500',
    marginBottom: 4,
  },
  educationGPA: {
    fontSize: 14,
    color: '#6b7280',
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  skillItem: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: '45%',
  },
  skillName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  skillLevel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  projectItem: {
    marginBottom: 20,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  projectName: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  projectDate: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  projectDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4b5563',
    marginBottom: 8,
  },
  technologiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  technologiesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  technologiesText: {
    fontSize: 14,
    color: '#6b7280',
  },
  projectLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  projectLinkText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  certificationItem: {
    marginBottom: 16,
  },
  certificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  certificationName: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  certificationDate: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  certificationIssuer: {
    fontSize: 15,
    color: '#3b82f6',
    fontWeight: '500',
    marginBottom: 4,
  },
  certificationId: {
    fontSize: 14,
    color: '#6b7280',
  },
  languagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  languageItem: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: '45%',
  },
  languageName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  languageLevel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
});