import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import UniversalHeader from '../../components/UniversalHeader';
import { newsService, NewsArticle, NewsResponse } from '../../services/news.service';

const { width } = Dimensions.get('window');

interface NewsScreenProps {
  navigation: any;
}

export default function NewsScreen({ navigation }: NewsScreenProps) {
  const { colors } = useTheme();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('Tecnologia');
  const [topics] = useState(newsService.getAvailableTopics());

  useEffect(() => {
    loadNews();
  }, [selectedTopic]);

  const loadNews = async () => {
    try {
      setLoading(true);
      const response = await newsService.getTechNews(selectedTopic.toLowerCase());
      setNews(response.articles);
    } catch (error) {
      console.error('Error loading news:', error);
      Alert.alert('Erro', 'Não foi possível carregar as notícias');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadNews();
  };

  const handleOpenArticle = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Erro', 'Não foi possível abrir o link');
      }
    } catch (error) {
      console.error('Error opening URL:', error);
      Alert.alert('Erro', 'Não foi possível abrir o link');
    }
  };

  const renderTopicSelector = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={styles.topicsContainer}
      contentContainerStyle={styles.topicsContent}
    >
      {topics.map((topic, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.topicChip,
            { 
              backgroundColor: selectedTopic === topic ? colors.primary : colors.surface,
              borderColor: selectedTopic === topic ? colors.primary : colors.border 
            }
          ]}
          onPress={() => setSelectedTopic(topic)}
        >
          <Text
            style={[
              styles.topicText,
              { color: selectedTopic === topic ? '#fff' : colors.text }
            ]}
          >
            {topic}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderFeaturedArticle = (article: NewsArticle) => (
    <TouchableOpacity
      style={[styles.featuredCard, { backgroundColor: colors.surface }]}
      onPress={() => handleOpenArticle(article.url)}
    >
      <Image 
        source={{ uri: article.urlToImage || 'https://picsum.photos/800/400?random=featured' }}
        style={styles.featuredImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.featuredOverlay}
      />
      <View style={styles.featuredContent}>
        <View style={styles.featuredMeta}>
          <View style={[styles.categoryBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.categoryText}>{article.category}</Text>
          </View>
          <Text style={styles.featuredTime}>
            {newsService.formatTimeAgo(article.publishedAt)}
          </Text>
        </View>
        <Text style={styles.featuredTitle} numberOfLines={3}>
          {article.title}
        </Text>
        <Text style={styles.featuredDescription} numberOfLines={2}>
          {article.description}
        </Text>
        <View style={styles.featuredFooter}>
          <Text style={styles.featuredSource}>{article.source.name}</Text>
          <View style={styles.featuredAuthor}>
            <Ionicons name="person-outline" size={12} color="#fff" />
            <Text style={styles.featuredAuthorText}>{article.author}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderArticleCard = (article: NewsArticle, index: number) => (
    <TouchableOpacity
      key={article.id}
      style={[styles.articleCard, { backgroundColor: colors.surface }]}
      onPress={() => handleOpenArticle(article.url)}
    >
      <Image 
        source={{ uri: article.urlToImage || `https://picsum.photos/300/200?random=${index}` }}
        style={styles.articleImage}
        resizeMode="cover"
      />
      <View style={styles.articleContent}>
        <View style={styles.articleMeta}>
          <Text style={[styles.articleCategory, { color: colors.primary }]}>
            {article.category}
          </Text>
          <Text style={[styles.articleTime, { color: colors.textMuted }]}>
            {newsService.formatTimeAgo(article.publishedAt)}
          </Text>
        </View>
        
        <Text style={[styles.articleTitle, { color: colors.text }]} numberOfLines={2}>
          {article.title}
        </Text>
        
        <Text style={[styles.articleDescription, { color: colors.textMuted }]} numberOfLines={2}>
          {article.description}
        </Text>
        
        <View style={styles.articleFooter}>
          <View style={styles.articleSource}>
            <Ionicons name="newspaper-outline" size={14} color={colors.textMuted} />
            <Text style={[styles.articleSourceText, { color: colors.textMuted }]}>
              {article.source.name}
            </Text>
          </View>
          {article.author && (
            <View style={styles.articleAuthor}>
              <Ionicons name="person-outline" size={14} color={colors.textMuted} />
              <Text style={[styles.articleAuthorText, { color: colors.textMuted }]}>
                {article.author}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <UniversalHeader title="Notícias Tech" showBackButton={true} minimal={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
            Carregando notícias...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <UniversalHeader title="Notícias Tech" showBackButton={true} minimal={true} />
      
      {renderTopicSelector()}
      
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Featured Article */}
        {news.length > 0 && (
          <View style={styles.featuredSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Destaque</Text>
            {renderFeaturedArticle(news[0])}
          </View>
        )}

        {/* Latest News */}
        <View style={styles.latestSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Últimas Notícias</Text>
            <TouchableOpacity onPress={onRefresh}>
              <Ionicons name="refresh-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.articlesList}>
            {news.slice(1).map((article, index) => renderArticleCard(article, index + 1))}
          </View>
        </View>

        {/* Stats */}
        <View style={[styles.statsCard, { backgroundColor: colors.surface }]}>
          <View style={styles.statsContent}>
            <View style={styles.statItem}>
              <Ionicons name="newspaper-outline" size={24} color={colors.primary} />
              <Text style={[styles.statNumber, { color: colors.text }]}>{news.length}</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Artigos</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={24} color={colors.success} />
              <Text style={[styles.statNumber, { color: colors.text }]}>24h</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Atualizações</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="globe-outline" size={24} color={colors.warning} />
              <Text style={[styles.statNumber, { color: colors.text }]}>{topics.length}</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Tópicos</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  topicsContainer: {
    maxHeight: 60,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  topicsContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  topicChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  topicText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  featuredSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  featuredCard: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
  },
  featuredContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  featuredMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  featuredTime: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  featuredTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 26,
    marginBottom: 8,
  },
  featuredDescription: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredSource: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  featuredAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featuredAuthorText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  latestSection: {
    padding: 16,
  },
  articlesList: {
    gap: 16,
  },
  articleCard: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  articleImage: {
    width: 120,
    height: 120,
  },
  articleContent: {
    flex: 1,
    padding: 16,
  },
  articleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  articleCategory: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  articleTime: {
    fontSize: 12,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 22,
    marginBottom: 8,
  },
  articleDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  articleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  articleSource: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  articleSourceText: {
    fontSize: 12,
    fontWeight: '500',
  },
  articleAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  articleAuthorText: {
    fontSize: 12,
  },
  statsCard: {
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 20,
  },
});