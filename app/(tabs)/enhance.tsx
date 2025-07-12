import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Dimensions } from 'react-native';
import { Wand as Wand2, Copy, Download, RotateCcw, Zap, Brain, Sparkles, Bot, Send, FileText, ChartBar as BarChart3 } from 'lucide-react-native';
import { Header } from '@/components/common/Header';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { PromptAnalyzer } from '@/components/common/PromptAnalyzer';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import * as Clipboard from 'expo-clipboard';
import { ApiService } from '@/services/api';
import * as Sharing from 'expo-sharing';

const { width: screenWidth } = Dimensions.get('window');

interface AIModel {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  available: boolean;
}

interface EnhancementResult {
  originalPrompt: string;
  enhancedPrompt: string;
  qualityScore: number;
  improvements: string[];
  wordCount: number;
  characterCount: number;
  model: string;
  timestamp: Date;
}

interface PromptAnalysis {
  clarity: number;
  specificity: number;
  actionability: number;
  engagement: number;
}

const availableModels: AIModel[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Advanced reasoning and creativity',
    icon: Brain,
    color: '#10B981',
    available: true,
  },
  {
    id: 'claude-3.5',
    name: 'Claude 3.5',
    description: 'Excellent for analysis and writing',
    icon: Sparkles,
    color: '#8B5CF6',
    available: true,
  },
  {
    id: 'deepseek-v2',
    name: 'DeepSeek V2',
    description: 'Efficient and fast processing',
    icon: Zap,
    color: '#F59E0B',
    available: true,
  },
  {
    id: 'owen-2.5',
    name: 'Owen 2.5',
    description: 'Specialized for creative tasks',
    icon: Bot,
    color: '#EF4444',
    available: true,
  },
];

export default function PromptEnhanceScreen() {
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [selectedModels, setSelectedModels] = useState<string[]>(['gpt-4']);
  const [loading, setLoading] = useState(false);
  const [qualityScore, setQualityScore] = useState(0);
  const [improvements, setImprovements] = useState<string[]>([]);
  const [history, setHistory] = useState<EnhancementResult[]>([]);
  const [promptAnalysis, setPromptAnalysis] = useState<PromptAnalysis | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const { isMobile, isTablet } = useResponsiveLayout();

  const wordCount = originalPrompt.trim().split(/\s+/).filter(word => word.length > 0).length;
  const characterCount = originalPrompt.length;

  const handleModelToggle = (modelId: string) => {
    setSelectedModels(prev => {
      if (prev.includes(modelId)) {
        return prev.filter(id => id !== modelId);
      } else if (prev.length < 2) {
        return [...prev, modelId];
      } else {
        // Replace the first model if already at limit
        return [prev[1], modelId];
      }
    });
  };

  const enhancePrompt = async () => {
    if (!originalPrompt.trim()) {
      Alert.alert('Error', 'Please enter a prompt to enhance');
      return;
    }

    if (selectedModels.length === 0) {
      Alert.alert('Error', 'Please select at least one AI model');
      return;
    }

    setLoading(true);
    try {
      const result = await ApiService.enhancePrompt(originalPrompt, selectedModels);
      
      setEnhancedPrompt(result.enhancedPrompt);
      setQualityScore(result.qualityScore);
      setImprovements(result.improvements);
      setPromptAnalysis(result.analysis);
      setShowAnalysis(true);

      // Add to history
      const historyResult: EnhancementResult = {
        originalPrompt,
        enhancedPrompt: result.enhancedPrompt,
        qualityScore: result.qualityScore,
        improvements: result.improvements,
        wordCount,
        characterCount,
        model: selectedModels[0],
        timestamp: new Date(),
      };

      setHistory(prev => [historyResult, ...prev.slice(0, 9)]); // Keep last 10 results

    } catch (error) {
      console.error('Enhancement error:', error);
      Alert.alert('Error', 'Failed to enhance prompt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateMockEnhancement = (prompt: string, model: string) => {
    const enhancements: Record<string, {
      enhancedPrompt: string;
      qualityScore: number;
      improvements: string[];
      analysis: PromptAnalysis;
    }> = {
      'gpt-4': {
        enhancedPrompt: `Enhanced version of "${prompt}": Please provide a comprehensive and detailed response that includes specific examples, step-by-step explanations, and practical applications. Consider multiple perspectives and ensure the information is accurate, relevant, and actionable for the intended audience.`,
        qualityScore: 85,
        improvements: [
          'Added specificity and clarity',
          'Included request for examples',
          'Enhanced structure and flow',
          'Improved actionability',
        ],
        analysis: {
          clarity: 85,
          specificity: 80,
          actionability: 90,
          engagement: 85,
        },
      },
      'claude-3.5': {
        enhancedPrompt: `Refined prompt based on "${prompt}": I need a thorough analysis that breaks down complex concepts into digestible parts, provides real-world applications, and offers multiple viewpoints. Please structure your response with clear headings and include relevant examples that demonstrate practical implementation.`,
        qualityScore: 88,
        improvements: [
          'Better structure and organization',
          'Added analytical depth',
          'Improved clarity and precision',
          'Enhanced practical focus',
        ],
        analysis: {
          clarity: 90,
          specificity: 85,
          actionability: 88,
          engagement: 87,
        },
      },
      'deepseek-v2': {
        enhancedPrompt: `Optimized prompt for "${prompt}": Deliver a well-researched response with concrete examples, actionable insights, and clear explanations. Focus on practical applications and provide step-by-step guidance where applicable. Ensure the content is accessible and valuable for implementation.`,
        qualityScore: 82,
        improvements: [
          'Optimized for efficiency',
          'Added practical focus',
          'Improved accessibility',
          'Enhanced implementation guidance',
        ],
        analysis: {
          clarity: 82,
          specificity: 80,
          actionability: 85,
          engagement: 80,
        },
      },
      'owen-2.5': {
        enhancedPrompt: `Creative enhancement of "${prompt}": Provide an innovative and engaging response that combines creativity with practical value. Include unique perspectives, creative examples, and imaginative solutions while maintaining accuracy and usefulness. Make the content both informative and inspiring.`,
        qualityScore: 90,
        improvements: [
          'Enhanced creativity and engagement',
          'Added unique perspectives',
          'Improved inspirational value',
          'Balanced innovation with practicality',
        ],
        analysis: {
          clarity: 88,
          specificity: 85,
          actionability: 90,
          engagement: 95,
        },
      },
    };

    return enhancements[model] || enhancements['gpt-4'];
  };

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied', 'Text copied to clipboard');
  };

  const sharePrompt = async (text: string) => {
    try {
      await Sharing.shareAsync(text);
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const clearAll = () => {
    setOriginalPrompt('');
    setEnhancedPrompt('');
    setQualityScore(0);
    setImprovements([]);
    setShowAnalysis(false);
    setPromptAnalysis(null);
  };

  const getQualityColor = (score: number) => {
    if (score >= 80) return Colors.success;
    if (score >= 60) return Colors.warning;
    return Colors.error;
  };

  const renderModelSelector = () => (
    <View style={styles.modelSelector}>
      <Text style={styles.sectionTitle}>Select AI Models (Max 2)</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.modelList}>
        {availableModels.map((model) => (
          <TouchableOpacity
            key={model.id}
            style={[
              styles.modelCard,
              selectedModels.includes(model.id) && styles.selectedModel,
              { borderColor: model.color },
            ]}
            onPress={() => handleModelToggle(model.id)}
            disabled={!model.available}
          >
            <model.icon 
              size={24} 
              color={selectedModels.includes(model.id) ? Colors.background : model.color} 
            />
            <Text style={[
              styles.modelName,
              selectedModels.includes(model.id) && styles.selectedModelText,
            ]}>
              {model.name}
            </Text>
            <Text style={[
              styles.modelDescription,
              selectedModels.includes(model.id) && styles.selectedModelDescText,
            ]}>
              {model.description}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderInputSection = () => (
    <View style={[styles.inputSection, isMobile && styles.mobileInputSection]}>
      <View style={styles.inputHeader}>
        <View style={styles.inputTitleContainer}>
          <Text style={styles.sectionTitle}>Original Prompt</Text>
          {originalPrompt.length > 0 && (
            <View style={styles.promptQualityIndicator}>
              <View style={[
                styles.qualityDot,
                { backgroundColor: originalPrompt.length > 50 ? Colors.success : originalPrompt.length > 20 ? Colors.warning : Colors.error }
              ]} />
              <Text style={styles.qualityText}>
                {originalPrompt.length > 50 ? 'Good length' : originalPrompt.length > 20 ? 'Could be longer' : 'Too short'}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.inputStats}>
          <Text style={styles.statText}>{wordCount} words</Text>
          <Text style={styles.statText}>{characterCount} chars</Text>
        </View>
      </View>
      
      <TextInput
        style={styles.promptInput}
        placeholder="Enter your prompt here..."
        placeholderTextColor={Colors.textSecondary}
        multiline
        value={originalPrompt}
        onChangeText={setOriginalPrompt}
        textAlignVertical="top"
      />
      
      <View style={styles.inputActions}>
        <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
          <RotateCcw size={16} color={Colors.textSecondary} />
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.enhanceButton, loading && styles.disabledButton]}
          onPress={enhancePrompt}
          disabled={loading || !originalPrompt.trim()}
        >
          {loading ? (
            <LoadingSpinner size={16} color={Colors.background} />
          ) : (
            <Wand2 size={16} color={Colors.background} />
          )}
          <Text style={styles.enhanceButtonText}>
            {loading ? 'Enhancing...' : 'Enhance Prompt'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderOutputSection = () => (
    <View style={[styles.outputSection, isMobile && styles.mobileOutputSection]}>
      <View style={styles.outputHeader}>
        <Text style={styles.sectionTitle}>Enhanced Prompt</Text>
        {qualityScore > 0 && (
          <View style={styles.qualityBadge}>
            <BarChart3 size={16} color={getQualityColor(qualityScore)} />
            <Text style={[styles.qualityScore, { color: getQualityColor(qualityScore) }]}>
              {qualityScore}%
            </Text>
          </View>
        )}
      </View>
      
      {enhancedPrompt ? (
        <>
          <ScrollView style={styles.promptOutput}>
            <Text style={styles.outputText}>{enhancedPrompt}</Text>
          </ScrollView>
          
          <View style={styles.outputActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => copyToClipboard(enhancedPrompt)}
            >
              <Copy size={16} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Copy</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => sharePrompt(enhancedPrompt)}
            >
              <Send size={16} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyOutput}>
          <FileText size={48} color={Colors.textSecondary} />
          <Text style={styles.emptyText}>Enhanced prompt will appear here</Text>
          <Text style={styles.emptySubtext}>
            Enter a prompt and select AI models to get started
          </Text>
        </View>
      )}
    </View>
  );

  const renderImprovements = () => (
    improvements.length > 0 && (
      <View style={styles.improvementsSection}>
        <Text style={styles.sectionTitle}>Improvements Made</Text>
        <View style={styles.improvementsList}>
          {improvements.map((improvement, index) => (
            <View key={index} style={styles.improvementItem}>
              <View style={styles.improvementDot} />
              <Text style={styles.improvementText}>{improvement}</Text>
            </View>
          ))}
        </View>
      </View>
    )
  );

  const renderHistory = () => (
    history.length > 0 && (
      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>Recent Enhancements</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {history.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.historyCard}
              onPress={() => {
                setOriginalPrompt(item.originalPrompt);
                setEnhancedPrompt(item.enhancedPrompt);
                setQualityScore(item.qualityScore);
                setImprovements(item.improvements);
              }}
            >
              <Text style={styles.historyPrompt} numberOfLines={2}>
                {item.originalPrompt}
              </Text>
              <View style={styles.historyMeta}>
                <Text style={styles.historyModel}>{item.model}</Text>
                <Text style={[styles.historyScore, { color: getQualityColor(item.qualityScore) }]}>
                  {item.qualityScore}%
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    )
  );

  return (
    <ScrollView style={styles.container}>
      <Header title="Prompt Enhancer" />
      
      <View style={styles.content}>
        <Text style={styles.description}>
          Enhance your AI prompts with advanced models for better results
        </Text>

        {renderModelSelector()}

        <View style={[styles.mainContent, isMobile && styles.mobileMainContent]}>
          {renderInputSection()}
          {renderOutputSection()}
        </View>

        {renderImprovements()}
        
        <PromptAnalyzer
          prompt={originalPrompt}
          analysis={promptAnalysis || undefined}
          visible={showAnalysis}
        />
        
        {renderHistory()}
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
    marginBottom: 24,
    lineHeight: 22,
  },
  modelSelector: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.semibold,
    color: Colors.text,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  modelList: {
    paddingHorizontal: 20,
  },
  modelCard: {
    alignItems: 'center',
    padding: 16,
    marginRight: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    minWidth: 140,
  },
  selectedModel: {
    backgroundColor: Colors.primary,
  },
  modelName: {
    fontSize: 14,
    fontFamily: Fonts.semibold,
    color: Colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  selectedModelText: {
    color: Colors.background,
  },
  modelDescription: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  selectedModelDescText: {
    color: Colors.background + 'CC',
  },
  mainContent: {
    flexDirection: 'row',
    marginHorizontal: 20,
    gap: 16,
    marginBottom: 24,
  },
  mobileMainContent: {
    flexDirection: 'column',
  },
  inputSection: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  mobileInputSection: {
    marginBottom: 16,
  },
  inputHeader: {
    marginBottom: 12,
  },
  inputTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  promptQualityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  qualityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  qualityText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
  },
  inputStats: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  statText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
  },
  promptInput: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.text,
    minHeight: 200,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  inputActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 6,
  },
  clearButtonText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
  },
  enhanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: Colors.textSecondary,
  },
  enhanceButtonText: {
    fontSize: 14,
    fontFamily: Fonts.semibold,
    color: Colors.background,
  },
  outputSection: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  mobileOutputSection: {
    marginBottom: 16,
  },
  outputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  qualityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  qualityScore: {
    fontSize: 12,
    fontFamily: Fonts.bold,
  },
  promptOutput: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    minHeight: 200,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  outputText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.text,
    lineHeight: 24,
  },
  outputActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.primary,
  },
  emptyOutput: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: Fonts.semibold,
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  improvementsSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  improvementsList: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  improvementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  improvementDot: {
    width: 6,
    height: 6,
    backgroundColor: Colors.success,
    borderRadius: 3,
    marginTop: 8,
  },
  improvementText: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.text,
    lineHeight: 20,
  },
  historySection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  historyCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 200,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  historyPrompt: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.text,
    marginBottom: 12,
    lineHeight: 20,
  },
  historyMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyModel: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
  },
  historyScore: {
    fontSize: 12,
    fontFamily: Fonts.bold,
  },
});