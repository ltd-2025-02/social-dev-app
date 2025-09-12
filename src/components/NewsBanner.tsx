import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { newsService, NewsArticle } from '../services/news.service';

const { width } = Dimensions.get('window');

interface NewsBannerProps {
  navigation: any;
}

export default function NewsBanner({ navigation }: NewsBannerProps) {
  const { colors } = useTheme();
  const [featuredNews, setFeaturedNews] = useState<NewsArticle>({
    id: 'mock-1',
    title: 'As últimas novidades do mundo tech',
    description: 'Fique por dentro das principais notícias de tecnologia, programação e inovação.',
    content: '',
    url: '#',
    urlToImage: '',
    publishedAt: new Date().toISOString(),
    source: { id: 'tech-news', name: 'Tech News' },
    author: 'Equipe SocialDev',
    category: 'tecnologia',
    language: 'pt'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFeaturedNews();
  }, []);

  const loadFeaturedNews = async () => {
    try {
      setLoading(true);
      const response = await newsService.getTopTechStories();
      if (response && Array.isArray(response.articles) && response.articles.length > 0) {
        setFeaturedNews(response.articles[0]);
      }
    } catch (error) {
      console.error('Error loading featured news:', error);
      // Keep mock data
    } finally {
      setLoading(false);
    }
  };

  const handleNewsPress = () => {
    navigation.navigate('News');
  };

  const handleJobsPress = async () => {
    try {
      const url = 'https://socialdev.com.br/vagas'; // URL do site de vagas
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Erro', 'Não foi possível abrir o link');
      }
    } catch (error) {
      console.error('Error opening jobs URL:', error);
      Alert.alert('Erro', 'Não foi possível abrir o link');
    }
  };

  // Debug sempre mostrar banner
  console.log('NewsBanner render - loading:', loading, 'featuredNews:', !!featuredNews);

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        style={styles.carousel}
      >
        {/* First Banner - News */}
        <View style={styles.bannerContainer}>
          <View style={styles.headerContainer}>
            <View style={styles.newsLabel}>
              <Ionicons name="newspaper-outline" size={16} color={colors.primary} />
              <Text style={[styles.newsLabelText, { color: colors.primary }]}>TECH NEWS</Text>
            </View>
            
            <Text style={[styles.bannerTitle, { color: colors.text }]} numberOfLines={2}>
              {featuredNews.title}
            </Text>
            
            <Text style={[styles.bannerDescription, { color: colors.textMuted }]} numberOfLines={2}>
              {featuredNews.description}
            </Text>
            
            <View style={styles.bannerMeta}>
              <Text style={[styles.bannerSource, { color: colors.textMuted }]}>{featuredNews.source.name}</Text>
              <Text style={[styles.bannerTime, { color: colors.textMuted }]}>
                {newsService.formatTimeAgo(featuredNews.publishedAt)}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.banner}
            onPress={handleNewsPress}
            activeOpacity={0.9}
          >
            <Image 
              source={require('../../assets/banner/banner2.jpg')}
              style={styles.bannerImage}
              resizeMode="cover"
            />
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NOVO</Text>
            </View>
            <View style={styles.readMoreButton}>
              <Text style={styles.readMoreText}>Ler mais</Text>
              <Ionicons name="chevron-forward" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Second Banner - Jobs */}
        <View style={styles.bannerContainer}>
          <View style={styles.headerContainer}>
            <View style={[styles.newsLabel, { backgroundColor: 'rgba(34, 197, 94, 0.1)' }]}>
              <Ionicons name="briefcase-outline" size={16} color="#22c55e" />
              <Text style={[styles.newsLabelText, { color: '#22c55e' }]}>VISITE NOSSO SITE</Text>
            </View>
            
            <Text style={[styles.bannerTitle, { color: colors.text }]} numberOfLines={2}>
              Encontre as melhores oportunidades
            </Text>
            
            <Text style={[styles.bannerDescription, { color: colors.textMuted }]} numberOfLines={2}>
              Acesse nosso site e descubra vagas exclusivas para desenvolvedores e profissionais de tech.
            </Text>
            
            <View style={styles.bannerMeta}>
              <Text style={[styles.bannerSource, { color: colors.textMuted }]}>SocialDev</Text>
              <Text style={[styles.bannerTime, { color: colors.textMuted }]}>
                Portal de Vagas
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.banner}
            onPress={handleJobsPress}
            activeOpacity={0.9}
          >
            <Image 
              source={require('../../assets/banner/banner1.jpg')}
              style={styles.bannerImage}
              resizeMode="cover"
            />
            <View style={[styles.newBadge, { backgroundColor: '#22c55e' }]}>
              <Text style={styles.newBadgeText}>SITE</Text>
            </View>
            <View style={styles.readMoreButton}>
              <Text style={styles.readMoreText}>Visitar</Text>
              <Ionicons name="open-outline" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Page Indicators */}
      <View style={styles.pageIndicators}>
        <View style={[styles.indicator, { backgroundColor: colors.primary }]} />
        <View style={[styles.indicator, { backgroundColor: colors.border }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  carousel: {
    flexGrow: 0,
  },
  bannerContainer: {
    width: width,
    paddingHorizontal: 16,
  },
  headerContainer: {
    paddingBottom: 12,
  },
  banner: {
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  newsLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  newsLabelText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 22,
    marginBottom: 6,
  },
  bannerDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  bannerMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerSource: {
    fontSize: 11,
    fontWeight: '600',
  },
  bannerTime: {
    fontSize: 10,
  },
  readMoreButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  readMoreText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },
  newBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  newBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  pageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});