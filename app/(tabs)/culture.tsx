import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, Alert, TextInput, Button } from 'react-native';
import { FileUpload } from '@/components/common/FileUpload';
import { MapPin, Music, UtensilsCrossed, Calendar, Volume2, Share2 } from 'lucide-react-native';
import { Header } from '@/components/common/Header';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { ApiService } from '@/services/api';
import { StorageService } from '@/services/storage';
import * as Speech from 'expo-speech';
import * as Sharing from 'expo-sharing';

const countries = [
  { id: 'ghana', name: 'Ghana', flag: '🇬🇭', color: Colors.primary },
  { id: 'nigeria', name: 'Nigeria', flag: '🇳🇬', color: Colors.secondary },
  { id: 'kenya', name: 'Kenya', flag: '🇰🇪', color: Colors.accent },
  { id: 'south-africa', name: 'South Africa', flag: '🇿🇦', color: Colors.info },
  { id: 'egypt', name: 'Egypt', flag: '🇪🇬', color: Colors.warning },
  { id: 'morocco', name: 'Morocco', flag: '🇲🇦', color: Colors.earth },
];

const culturalCategories = [
  { id: 'tradition', name: 'Traditions', icon: Calendar, description: 'Cultural practices and customs' },
  { id: 'language', name: 'Languages', icon: Volume2, description: 'Native languages and dialects' },
  { id: 'food', name: 'Food', icon: UtensilsCrossed, description: 'Traditional dishes and recipes' },
  { id: 'music', name: 'Music & Dance', icon: Music, description: 'Traditional music and dances' },
  { id: 'festival', name: 'Festivals', icon: Calendar, description: 'Cultural celebrations and events' },
  { id: 'art', name: 'Arts & Crafts', icon: MapPin, description: 'Traditional arts and crafts' },
];

const mockCulturalData = {
  ghana: {
    tradition: {
      title: 'Akan Naming Ceremony',
      description: 'Traditional naming ceremony for newborns in Akan culture',
      content: 'The Akan people of Ghana have a rich tradition of naming ceremonies called "Abadintow" or "Outdooring". This ceremony takes place eight days after a child is born and involves the entire community. The child is presented to the ancestors and given both a day name (based on the day of the week they were born) and a personal name.',
      images: ['https://images.pexels.com/photos/8110457/pexels-photo-8110457.jpeg'],
      relatedTopics: ['Akan Culture', 'Traditional Ceremonies', 'Community Practices'],
    },
    language: {
      title: 'Twi Language',
      description: 'The most widely spoken indigenous language in Ghana',
      content: 'Twi is part of the Akan language family and is spoken by over 9 million people in Ghana. It has several dialects including Asante Twi and Akuapem Twi. Common greetings include "Maakye" (Good morning) and "Wo ho te sɛn?" (How are you?). Learning Twi helps connect with Ghanaian culture and facilitates business and social interactions.',
      images: ['https://images.pexels.com/photos/5062849/pexels-photo-5062849.jpeg'],
      relatedTopics: ['Akan Languages', 'Ghanaian Culture', 'Local Communication'],
    },
    food: {
      title: 'Jollof Rice',
      description: 'Ghana\'s version of the famous West African dish',
      content: 'Ghanaian Jollof rice is a beloved one-pot dish made with rice, tomatoes, onions, and spices. It\'s often served with chicken, beef, or fish and accompanied by plantains or salad. The dish represents the heart of Ghanaian hospitality and is served at celebrations, family gatherings, and special occasions.',
      images: ['https://images.pexels.com/photos/7625047/pexels-photo-7625047.jpeg'],
      relatedTopics: ['West African Cuisine', 'Traditional Recipes', 'Ghanaian Food'],
    },
    music: {
      title: 'Highlife Music',
      description: 'Ghana\'s signature music genre',
      content: 'Highlife originated in Ghana in the early 20th century, blending traditional Akan music with Western instruments and harmonies. Pioneers like E.T. Mensah and Ebo Taylor helped shape the genre. Modern artists like Amakye Dede and Daddy Lumba continue the tradition, making Highlife a cornerstone of Ghanaian cultural identity.',
      images: ['https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg'],
      relatedTopics: ['Ghanaian Music', 'Traditional Instruments', 'Cultural Heritage'],
    },
    festival: {
      title: 'Homowo Festival',
      description: 'Harvest festival of the Ga people',
      content: 'Homowo, meaning "hooting at hunger," is an annual harvest festival celebrated by the Ga people of Greater Accra. The festival involves traditional rituals, drumming, dancing, and the preparation of special foods like kpekple (steamed corn meal) and palm nut soup. It celebrates the end of the farming season and abundance of food.',
      images: ['https://images.pexels.com/photos/8471830/pexels-photo-8471830.jpeg'],
      relatedTopics: ['Ga Culture', 'Harvest Celebrations', 'Traditional Festivals'],
    },
    art: {
      title: 'Kente Cloth',
      description: 'Traditional handwoven textile of Ghana',
      content: 'Kente is a colorful, intricately woven cloth that originates from the Ashanti Kingdom. Each pattern and color combination has symbolic meaning - gold represents royalty, green symbolizes vegetation, and red represents political and spiritual moods. Originally worn by royalty, Kente has become a symbol of African pride worldwide.',
      images: ['https://images.pexels.com/photos/5728297/pexels-photo-5728297.jpeg'],
      relatedTopics: ['Ashanti Culture', 'Traditional Textiles', 'African Art'],
    },
  },
  nigeria: {
    tradition: {
      title: 'Yoruba Greetings',
      description: 'Traditional greeting customs in Yoruba culture',
      content: 'Yoruba greetings are elaborate and respect-based, varying by time of day and social status. Morning greetings include "Ẹ káàárọ̀" (Good morning) with responses like "Ẹ káàárọ̀ oo" (Good morning too). The culture emphasizes prostrating for men and kneeling for women when greeting elders, showing deep respect for age and wisdom.',
      images: ['https://images.pexels.com/photos/8422088/pexels-photo-8422088.jpeg'],
      relatedTopics: ['Yoruba Culture', 'Social Customs', 'Traditional Respect'],
    },
    language: {
      title: 'Yoruba Language',
      description: 'One of Nigeria\'s major indigenous languages',
      content: 'Yoruba is spoken by over 50 million people worldwide, primarily in southwestern Nigeria. It\'s a tonal language with three tones: high, mid, and low. Common phrases include "Báwo ni?" (How are you?) and "Mo dúpẹ́" (Thank you). The language has influenced African diaspora cultures in the Americas through the transatlantic slave trade.',
      images: ['https://images.pexels.com/photos/5427812/pexels-photo-5427812.jpeg'],
      relatedTopics: ['Nigerian Languages', 'Tonal Languages', 'African Diaspora'],
    },
    food: {
      title: 'Pounded Yam and Egusi',
      description: 'Traditional Nigerian staple dish',
      content: 'Pounded yam (Iyan) is a smooth, stretchy staple made from boiled yam. It\'s typically served with Egusi soup, made from ground melon seeds, leafy vegetables, and meat or fish. This combination is central to Nigerian cuisine and represents the rich agricultural heritage of the region.',
      images: ['https://images.pexels.com/photos/9209522/pexels-photo-9209522.jpeg'],
      relatedTopics: ['Nigerian Cuisine', 'Traditional Foods', 'West African Dishes'],
    },
    music: {
      title: 'Afrobeats',
      description: 'Nigeria\'s global music phenomenon',
      content: 'Afrobeats, pioneered by Fela Kuti and evolved by artists like Burna Boy, Wizkid, and Davido, blends traditional Nigerian music with jazz, funk, and other genres. The genre has gained international recognition, with Nigerian artists collaborating with global superstars and influencing worldwide music trends.',
      images: ['https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg'],
      relatedTopics: ['Nigerian Music', 'Global Music', 'Cultural Export'],
    },
    festival: {
      title: 'Osun-Osogbo Festival',
      description: 'Sacred festival honoring the river goddess',
      content: 'The Osun-Osogbo Festival is an annual celebration in Osogbo, honoring Osun, the Yoruba goddess of fertility and water. The festival includes rituals, traditional dances, and a procession to the Osun Sacred Grove, a UNESCO World Heritage site. It attracts thousands of devotees and tourists from around the world.',
      images: ['https://images.pexels.com/photos/8471830/pexels-photo-8471830.jpeg'],
      relatedTopics: ['Yoruba Religion', 'Cultural Festivals', 'Sacred Sites'],
    },
    art: {
      title: 'Benin Bronze',
      description: 'Ancient bronze plaques and sculptures',
      content: 'The Benin Bronzes are a collection of bronze plaques and sculptures that decorated the royal palace of the Kingdom of Benin (present-day Nigeria). Created from the 16th century onwards, these masterpieces showcase sophisticated metalworking techniques and depict historical events, court life, and religious ceremonies.',
      images: ['https://images.pexels.com/photos/6076244/pexels-photo-6076244.jpeg'],
      relatedTopics: ['Ancient African Art', 'Benin Kingdom', 'Bronze Craftsmanship'],
    },
  },
};

export default function CultureClassScreen() {
  // New state for user interaction features
  const [userQuestion, setUserQuestion] = useState('');
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showVoiceInput, setShowVoiceInput] = useState(false);

  // Handler for user question submission
  const handleUserQuestionSubmit = () => {
    Alert.alert('Question Submitted', userQuestion);
    setUserQuestion('');
  };

  // Handler for requesting more resources
  const handleRequestMoreResources = () => {
    Alert.alert('Request Submitted', 'We will provide more resources soon!');
  };
  const [selectedCountry, setSelectedCountry] = useState('ghana');
  const [selectedCategory, setSelectedCategory] = useState('tradition');
  type CulturalContent = {
    title: string;
    description: string;
    content: string;
    images: string[];
    relatedTopics: string[];
  };
  const [culturalContent, setCulturalContent] = useState<CulturalContent | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCulturalContent();
  }, [selectedCountry, selectedCategory]);

  const loadCulturalContent = async () => {
    setLoading(true);
    try {
      // Using mock data for demonstration
      const content = (mockCulturalData as any)[selectedCountry]?.[selectedCategory] as CulturalContent | undefined;
      if (content) {
        setCulturalContent(content as CulturalContent);
      }
    } catch (error) {
      console.error('Error loading cultural content:', error);
    } finally {
      setLoading(false);
    }
  };

  const speakContent = (text: string) => {
    Speech.speak(text, {
      language: 'en-US',
      rate: 0.8,
      pitch: 1.0,
    });
  };

  const shareContent = async () => {
    if (!culturalContent) return;
    
    try {
      const shareText = `${culturalContent.title}\n\n${culturalContent.content}`;
      await Sharing.shareAsync(shareText);
    } catch (error) {
      console.error('Error sharing content:', error);
    }
  };

  const selectedCountryData = countries.find(country => country.id === selectedCountry);
  const selectedCategoryData = culturalCategories.find(cat => cat.id === selectedCategory);

  return (
    <ScrollView style={styles.container}>
      <Header title="Culture Class" />
      
      <View style={styles.content}>
        <Text style={styles.description}>
          Discover and learn about the rich cultural heritage of Africa
        </Text>

        <View style={styles.countrySelector}>
          <Text style={styles.sectionTitle}>Select Country</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.countryList}>
            {countries.map((country) => (
              <TouchableOpacity
                key={country.id}
                style={[
                  styles.countryCard,
                  selectedCountry === country.id && styles.selectedCountry,
                ]}
                onPress={() => setSelectedCountry(country.id)}
              >
                <Text style={styles.countryFlag}>{country.flag}</Text>
                <Text style={[
                  styles.countryName,
                  selectedCountry === country.id && styles.selectedCountryText,
                ]}>
                  {country.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.categorySelector}>
          <Text style={styles.sectionTitle}>Choose Category</Text>
          <View style={styles.categoryGrid}>
            {culturalCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  selectedCategory === category.id && styles.selectedCategory,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <category.icon 
                  size={24} 
                  color={selectedCategory === category.id ? Colors.background : Colors.primary} 
                />
                <Text style={[
                  styles.categoryName,
                  selectedCategory === category.id && styles.selectedCategoryText,
                ]}>
                  {category.name}
                </Text>
                <Text style={[
                  styles.categoryDescription,
                  selectedCategory === category.id && styles.selectedCategoryDescText,
                ]}>
                  {category.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {loading && (
          <View style={styles.loadingSection}>
            <LoadingSpinner size={40} color={Colors.primary} />
            <Text style={styles.loadingText}>Loading cultural content...</Text>
          </View>
        )}

        {culturalContent && !loading && (
          <View style={styles.contentSection}>
            <View style={styles.contentHeader}>
              <View style={styles.contentInfo}>
                <Text style={styles.contentTitle}>{culturalContent.title}</Text>
                <Text style={styles.contentSubtitle}>
                  {selectedCountryData?.flag} {selectedCountryData?.name} • {selectedCategoryData?.name}
                </Text>
              </View>
              <View style={styles.contentActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => speakContent(culturalContent.content)}
                >
                  <Volume2 size={20} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={shareContent}
                >
                  <Share2 size={20} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>

            {culturalContent.images && culturalContent.images.length > 0 && (
              <View style={styles.imageSection}>
                <Image
                  source={{ uri: culturalContent.images[0] }}
                  style={styles.contentImage}
                  resizeMode="cover"
                />
              </View>
            )}

            <View style={styles.contentBody}>
      <View style={{ marginVertical: 16 }}>
        <Text style={{ fontWeight: 'bold' }}>Ask for a preferred topic or guidance:</Text>
        <TextInput
          value={userQuestion}
          onChangeText={setUserQuestion}
          placeholder="Type your question or request..."
          style={{ borderWidth: 1, borderColor: Colors.border, borderRadius: 8, padding: 8, marginVertical: 8 }}
        />
        <Button title="Submit Question" onPress={handleUserQuestionSubmit} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
        <Button title="Upload Image/Picture" onPress={() => setShowFileUpload(true)} />
        <Button title="Submit Voice" onPress={() => setShowVoiceInput(true)} />
      </View>
      {showFileUpload && (
        <FileUpload onFileSelect={(file) => Alert.alert('File Uploaded', file.name)} acceptedTypes={["image/*"]} />
      )}
      {showVoiceInput && (
        <Text>Voice input feature coming soon!</Text>
      )}
              <Text style={styles.contentDescription}>{culturalContent.description}</Text>
              <Text style={styles.contentText}>{culturalContent.content}</Text>
            </View>

            {culturalContent.relatedTopics && culturalContent.relatedTopics.length > 0 && (
              <View style={styles.relatedSection}>
                <Text style={styles.relatedTitle}>Related Topics</Text>
                <View style={styles.relatedTopics}>
          <Button title="Request More Resources" onPress={handleRequestMoreResources} />
                  {culturalContent.relatedTopics.map((topic: string, index: number) => (
                    <View key={index} style={styles.topicTag}>
                      <Text style={styles.topicText}>{topic}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        <View style={styles.exploreSection}>
          <Text style={styles.sectionTitle}>Cultural Insights</Text>
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>🌍 Cultural Diversity</Text>
            <Text style={styles.insightText}>
              Africa is home to over 3,000 distinct ethnic groups, each with unique traditions, languages, and customs that have been preserved for centuries.
            </Text>
          </View>
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>🎨 Art & Expression</Text>
            <Text style={styles.insightText}>
              African art forms have influenced global culture, from traditional sculptures to modern Afrobeats music that's taking the world by storm.
            </Text>
          </View>
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>🗣️ Languages</Text>
            <Text style={styles.insightText}>
              Africa has over 2,000 languages, making it the most linguistically diverse continent in the world.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingBottom: 20,
  },
  description: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    lineHeight: 22,
  },
  countrySelector: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.semibold,
    color: Colors.text,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  countryList: {
    paddingHorizontal: 20,
  },
  countryCard: {
    alignItems: 'center',
    padding: 16,
    marginRight: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    minWidth: 100,
  },
  selectedCountry: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  countryFlag: {
    fontSize: 32,
    marginBottom: 8,
  },
  countryName: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
    textAlign: 'center',
  },
  selectedCountryText: {
    color: Colors.background,
  },
  categorySelector: {
    marginBottom: 20,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  selectedCategory: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryName: {
    fontSize: 14,
    fontFamily: Fonts.semibold,
    color: Colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: Colors.background,
  },
  categoryDescription: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  selectedCategoryDescText: {
    color: Colors.background + 'CC',
  },
  loadingSection: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
    marginTop: 12,
  },
  contentSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  contentInfo: {
    flex: 1,
  },
  contentTitle: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  contentSubtitle: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
  },
  contentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    backgroundColor: Colors.surface,
    borderRadius: 8,
  },
  imageSection: {
    marginBottom: 16,
  },
  contentImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  contentBody: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  contentDescription: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
    color: Colors.primary,
    marginBottom: 12,
  },
  contentText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.text,
    lineHeight: 24,
  },
  relatedSection: {
    marginBottom: 16,
  },
  relatedTitle: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
    color: Colors.text,
    marginBottom: 8,
  },
  relatedTopics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  topicTag: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  topicText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.primary,
  },
  exploreSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  insightCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent,
  },
  insightTitle: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
    color: Colors.text,
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});