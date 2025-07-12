import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Send, Volume2, Share2, BookOpen, Calculator, Globe as Globe2, Microscope, Bot, Brain, Sparkles, Zap } from 'lucide-react-native';
import { Header } from '@/components/common/Header';
import { AIModelSelector } from '@/components/common/AIModelSelector';
import { LanguageSelector } from '@/components/common/LanguageSelector';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { ApiService } from '@/services/api';
import { StorageService } from '@/services/storage';
import { SubscriptionService } from '@/services/subscription';
import { SubscriptionGate } from '@/components/subscription/SubscriptionGate';
import * as Speech from 'expo-speech';
import * as Sharing from 'expo-sharing';

const subjects = [
  { id: 'math', name: 'Mathematics', icon: Calculator, color: Colors.primary },
  { id: 'science', name: 'Science', icon: Microscope, color: Colors.secondary },
  { id: 'english', name: 'English', icon: BookOpen, color: Colors.accent },
  { id: 'geography', name: 'Geography', icon: Globe2, color: Colors.info },
];

const aiModels = [
  { id: 'gpt-4', name: 'GPT-4', description: 'OpenAI\'s most capable model', available: true, icon: Bot, speed: 'fast' as const, accuracy: 'high' as const },
  { id: 'claude-3', name: 'Claude 3', description: 'Anthropic\'s advanced AI', available: true, icon: Brain, speed: 'medium' as const, accuracy: 'high' as const },
  { id: 'gemini', name: 'Gemini', description: 'Google\'s multimodal AI', available: true, icon: Sparkles, speed: 'fast' as const, accuracy: 'medium' as const },
];

const languages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', available: true },
  { code: 'tw', name: 'Twi', nativeName: 'Twi', flag: '🇬🇭', available: true },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', flag: '🇳🇬', available: true },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪', available: true },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', available: true },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', available: false },
];

export default function LearnSmartScreen() {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  
  const [query, setQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('math');
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [remainingUsage, setRemainingUsage] = useState(0);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    const subscribed = await SubscriptionService.isSubscribed();
    const remaining = await SubscriptionService.getRemainingUsage('ai_explanations');
    setIsSubscribed(subscribed);
    setRemainingUsage(remaining);
  };

  const loadHistory = async () => {
    try {
      const savedHistory = await StorageService.getLearningHistory();
      setHistory(savedHistory.filter((item: { module: string }) => item.module === 'learn-smart'));
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const handleSubmit = async () => {
    if (!query.trim()) return;

    // Check usage limits for free users
    if (!isSubscribed) {
      try {
        await SubscriptionService.trackUsage('ai_explanations');
      } catch (error) {
        // Show paywall if limit reached
        return;
      }
    }

    setLoading(true);
    try {
      const result = await ApiService.generateExplanation(
        query,
        selectedSubject,
        selectedLanguage,
        selectedModel
      );
      
      setResponse(result.explanation);
      
      // Save to history
      const session = {
        id: Date.now().toString(),
        userId: 'user_1',
        module: 'learn-smart',
        topic: selectedSubject,
        query,
        response: result.explanation,
        language: selectedLanguage,
        aiModel: selectedModel,
        createdAt: new Date(),
      };
      
      await StorageService.saveLearningSession(session);
      loadHistory();
      checkSubscriptionStatus(); // Update remaining usage
      
    } catch (error) {
      console.error('Error generating explanation:', error);
      setResponse('Sorry, I encountered an error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text: string) => {
    Speech.speak(text, {
      language: selectedLanguage,
      rate: 0.8,
      pitch: 1.0,
    });
  };

  const shareResponse = async () => {
    if (!response) return;
    
    try {
      await Sharing.shareAsync(response);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleSubscribe = async (planId: string) => {
    const success = await SubscriptionService.purchaseSubscription(planId);
    if (success) {
      checkSubscriptionStatus();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Header title="Learn Smart" />
      
      <View style={styles.content}>
        <Text style={styles.description}>
          Get AI-powered explanations for any academic topic in multiple languages
        </Text>

        {!isSubscribed && (
          <View style={styles.usageIndicator}>
            <Text style={styles.usageText}>
              {remainingUsage} free explanations remaining
            </Text>
            {remainingUsage <= 5 && (
              <Text style={styles.upgradePrompt}>
                Upgrade for unlimited access
              </Text>
            )}
          </View>
        )}

        <View style={styles.subjectSelector}>
          <Text style={styles.sectionTitle}>Select Subject</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subjectList}>
            {subjects.map((subject) => (
              <TouchableOpacity
                key={subject.id}
                style={[
                  styles.subjectCard,
                  selectedSubject === subject.id && styles.selectedSubject,
                ]}
                onPress={() => setSelectedSubject(subject.id)}
              >
                <subject.icon 
                  size={32} 
                  color={selectedSubject === subject.id ? colors.background : subject.color} 
                />
                <Text style={[
                  styles.subjectName,
                  selectedSubject === subject.id && styles.selectedSubjectText,
                ]}>
                  {subject.name}
                </Text>
              </TouchableOpacity>
            ))}
            {/* Request a Subject Tab/Button */}
            <TouchableOpacity
              style={[styles.subjectCard, { borderStyle: 'dashed', borderColor: colors.primary, borderWidth: 2, justifyContent: 'center', alignItems: 'center' }]}
              onPress={() => Alert.alert('Request a Subject', 'Feature coming soon!')}
            >
              <Text style={{ fontSize: 32, color: colors.primary }}>+</Text>
              <Text style={[styles.subjectName, { color: colors.primary, marginTop: 4 }]}>Request a Subject</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <AIModelSelector
          selectedModel={selectedModel}
          onModelSelect={setSelectedModel}
          models={aiModels}
        />

        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onLanguageSelect={setSelectedLanguage}
          languages={languages}
        />

        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Ask Your Question</Text>
          <TextInput
            style={styles.textInput}
            placeholder="What would you like to learn about?"
            placeholderTextColor={colors.textSecondary}
            multiline
            value={query}
            onChangeText={setQuery}
          />
          
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={loading || !query.trim()}
          >
            {loading ? (
              <LoadingSpinner size={20} color={colors.background} />
            ) : (
              <Send size={20} color={colors.background} />
            )}
            <Text style={styles.submitButtonText}>
              {loading ? 'Generating...' : 'Get Explanation'}
            </Text>
          </TouchableOpacity>
        </View>

        {response && !isSubscribed && remainingUsage === 0 ? (
          <SubscriptionGate
            feature="unlimited AI explanations"
            title="Upgrade for Unlimited Learning"
            description="You've reached your free limit. Upgrade to continue getting AI-powered explanations in all subjects and languages."
            onSubscribe={handleSubscribe}
          >
            <View style={styles.responseSection}>
              <View style={styles.responseHeader}>
                <Text style={styles.sectionTitle}>AI Explanation</Text>
                <View style={styles.responseActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => speakText(response)}
                  >
                    <Volume2 size={20} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={shareResponse}
                  >
                    <Share2 size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.responseContent}>
                <Text style={styles.responseText}>{response}</Text>
              </View>
            </View>
          </SubscriptionGate>
        ) : response ? (
          <View style={styles.responseSection}>
            <View style={styles.responseHeader}>
              <Text style={styles.sectionTitle}>AI Explanation</Text>
              <View style={styles.responseActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => speakText(response)}
                >
                  <Volume2 size={20} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={shareResponse}
                >
                  <Share2 size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.responseContent}>
              <Text style={styles.responseText}>{response}</Text>
            </View>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingBottom: 20,
  },
  description: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    lineHeight: 22,
  },
  usageIndicator: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  usageText: {
    fontSize: 14,
    fontFamily: Fonts.semibold,
    color: colors.text,
    marginBottom: 4,
  },
  upgradePrompt: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: colors.primary,
  },
  subjectSelector: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.semibold,
    color: colors.text,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  subjectList: {
    paddingHorizontal: 20,
  },
  subjectCard: {
    alignItems: 'center',
    padding: 16,
    marginRight: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    minWidth: 100,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedSubject: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
  },
  subjectName: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  selectedSubjectText: {
    color: colors.background,
  },
  inputSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  textInput: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: colors.text,
    textAlignVertical: 'top',
    minHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 12,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    backgroundColor: colors.textSecondary,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
    color: colors.background,
    marginLeft: 8,
  },
  responseSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  responseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  responseActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  responseContent: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  responseText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: colors.text,
    lineHeight: 24,
  },
});