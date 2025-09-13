import React, { useState, useEffect, useRef } from 'react';
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
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const banners = [
    {
      type: 'news',
      image: require('../../assets/banner/banner2.jpg'),
      title: featuredNews.title,
      description: featuredNews.description,
      source: featuredNews.source.name,
      time: newsService.formatTimeAgo(featuredNews.publishedAt),
      badgeText: 'NOVO',
      badgeColor: '#ef4444',
      actionText: 'Ler mais',
      actionIcon: 'chevron-forward',
      onPress: () => navigation.navigate('News'),
    },
    {
      type: 'jobs',
      image: require('../../assets/banner/banner1.jpg'),
      title: 'Encontre as melhores oportunidades',
      description: 'Acesse nosso site e descubra vagas exclusivas para desenvolvedores e profissionais de tech.',
      source: 'SocialDev',
      time: 'Portal de Vagas',
      badgeText: 'SITE',
      badgeColor: '#22c55e',
      actionText: 'Visitar',
      actionIcon: 'open-outline',
      onPress: async () => {
        try {
          const url = 'https://socialdev.com.br/vagas';
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
      },
    },
  ];

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

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / width);
    setActiveIndex(newIndex);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        ref={scrollViewRef}
        horizontal 
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={handleScroll}
        scrollEventThrottle={16} // Adjust as needed for performance
        style={styles.carousel}
      >
        {banners.map((banner, index) => (
          <View key={index} style={styles.bannerWrapper}>
            <View style={styles.headerContainer}>
              <View style={[styles.newsLabel, { backgroundColor: `${banner.badgeColor}15` }]}>
                <Ionicons name={banner.type === 'news' ? 'newspaper-outline' : 'briefcase-outline'} size={16} color={banner.badgeColor} />
                <Text style={[styles.newsLabelText, { color: banner.badgeColor }]}>{banner.type === 'news' ? 'TECH NEWS' : 'VISITE NOSSO SITE'}</Text>
              </View>
              
              <Text style={[styles.bannerTitle, { color: colors.text }]} numberOfLines={2}>
                {banner.title}
              </Text>
              
              <Text style={[styles.bannerDescription, { color: colors.textMuted }]} numberOfLines={2}>
                {banner.description}
              </Text>
              
              <View style={styles.bannerMeta}>
                <Text style={[styles.bannerSource, { color: colors.textMuted }]}>{banner.source}</Text>
                <Text style={[styles.bannerTime, { color: colors.textMuted }]}>{banner.time}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.banner}
              onPress={banner.onPress}
              activeOpacity={0.9}
            >
              <Image 
                source={banner.image}
                style={styles.bannerImage}
                resizeMode="cover"
              />
              <View style={[styles.newBadge, { backgroundColor: banner.badgeColor }]}>
                <Text style={styles.newBadgeText}>{banner.badgeText}</Text>
              </View>
              <View style={styles.readMoreButton}>
                <Text style={styles.readMoreText}>{banner.actionText}</Text>
                <Ionicons name={banner.actionIcon as any} size={16} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Page Indicators */}
      <View style={styles.pageIndicators}>
        {banners.map((_, index) => (
          <View 
            key={index}
            style={[
              styles.indicator,
              { backgroundColor: index === activeIndex ? colors.primary : colors.border },
              index === activeIndex && styles.activeIndicator,
            ]}
          />
        ))}
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
  bannerWrapper: {
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
  activeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
