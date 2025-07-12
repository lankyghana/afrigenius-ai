import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Bot, ChevronDown, ChevronUp, Zap, Brain, Sparkles } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

interface AIModel {
  id: string;
  name: string;
  description: string;
  available: boolean;
  speed: 'fast' | 'medium' | 'slow';
  accuracy: 'high' | 'medium' | 'low';
  icon: React.ComponentType<any>;
}

interface AIModelSelectorProps {
  selectedModel: string;
  onModelSelect: (modelId: string) => void;
  models: AIModel[];
}

const defaultModels: AIModel[] = [
  { 
    id: 'gpt-4', 
    name: 'GPT-4', 
    description: 'OpenAI\'s most capable model with excellent reasoning',
    available: true,
    speed: 'medium',
    accuracy: 'high',
    icon: Brain
  },
  { 
    id: 'claude-3', 
    name: 'Claude 3', 
    description: 'Anthropic\'s advanced AI with strong analytical skills',
    available: true,
    speed: 'fast',
    accuracy: 'high',
    icon: Sparkles
  },
  { 
    id: 'gemini', 
    name: 'Gemini Pro', 
    description: 'Google\'s multimodal AI with broad knowledge',
    available: true,
    speed: 'fast',
    accuracy: 'medium',
    icon: Zap
  },
  { 
    id: 'gpt-3.5', 
    name: 'GPT-3.5 Turbo', 
    description: 'Fast and efficient for most tasks',
    available: true,
    speed: 'fast',
    accuracy: 'medium',
    icon: Bot
  },
];

export function AIModelSelector({ selectedModel, onModelSelect, models = defaultModels }: AIModelSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const selectedModelData = models.find(model => model.id === selectedModel);

  const getSpeedColor = (speed: string) => {
    switch (speed) {
      case 'fast': return Colors.success;
      case 'medium': return Colors.warning;
      case 'slow': return Colors.error;
      default: return Colors.textSecondary;
    }
  };

  const getAccuracyColor = (accuracy: string) => {
    switch (accuracy) {
      case 'high': return Colors.success;
      case 'medium': return Colors.warning;
      case 'low': return Colors.error;
      default: return Colors.textSecondary;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View style={styles.selectorLeft}>
          {selectedModelData?.icon && (
            <selectedModelData.icon size={20} color={Colors.primary} />
          )}
          <View style={styles.selectorText}>
            <Text style={styles.selectorTitle}>AI Model</Text>
            <Text style={styles.selectorSubtitle}>
              {selectedModelData?.name || 'Select Model'}
            </Text>
          </View>
        </View>
        
        {isExpanded ? (
          <ChevronUp size={20} color={Colors.textSecondary} />
        ) : (
          <ChevronDown size={20} color={Colors.textSecondary} />
        )}
      </TouchableOpacity>

      {isExpanded && (
        <ScrollView style={styles.dropdown} showsVerticalScrollIndicator={false}>
          {models.map((model) => (
            <TouchableOpacity
              key={model.id}
              style={[
                styles.modelOption,
                selectedModel === model.id && styles.selectedOption,
                !model.available && styles.unavailableOption,
              ]}
              onPress={() => {
                if (model.available) {
                  onModelSelect(model.id);
                  setIsExpanded(false);
                }
              }}
              disabled={!model.available}
            >
              <View style={styles.modelHeader}>
                <View style={styles.modelLeft}>
                  <View style={[styles.modelIconContainer, selectedModel === model.id && styles.selectedIconContainer]}>
                    <model.icon 
                      size={20} 
                      color={selectedModel === model.id ? Colors.background : Colors.primary} 
                    />
                  </View>
                  <View style={styles.modelInfo}>
                    <Text style={[
                      styles.modelName,
                      selectedModel === model.id && styles.selectedText,
                      !model.available && styles.unavailableText,
                    ]}>
                      {model.name}
                    </Text>
                    <Text style={[
                      styles.modelDescription,
                      !model.available && styles.unavailableText,
                    ]}>
                      {model.description}
                    </Text>
                  </View>
                </View>
                
                {!model.available && (
                  <Text style={styles.unavailableLabel}>Coming Soon</Text>
                )}
              </View>

              {model.available && (
                <View style={styles.modelStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Speed:</Text>
                    <View style={[styles.statBadge, { backgroundColor: getSpeedColor(model.speed) + '20' }]}>
                      <Text style={[styles.statValue, { color: getSpeedColor(model.speed) }]}>
                        {model.speed}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Accuracy:</Text>
                    <View style={[styles.statBadge, { backgroundColor: getAccuracyColor(model.accuracy) + '20' }]}>
                      <Text style={[styles.statValue, { color: getAccuracyColor(model.accuracy) }]}>
                        {model.accuracy}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectorText: {
    marginLeft: 12,
    flex: 1,
  },
  selectorTitle: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
  },
  selectorSubtitle: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
    color: Colors.text,
    marginTop: 2,
  },
  dropdown: {
    maxHeight: 300,
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 8,
  },
  modelOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  selectedOption: {
    backgroundColor: Colors.primary + '10',
  },
  unavailableOption: {
    opacity: 0.5,
  },
  modelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modelIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectedIconContainer: {
    backgroundColor: Colors.primary,
  },
  modelInfo: {
    flex: 1,
  },
  modelName: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
    color: Colors.text,
  },
  selectedText: {
    color: Colors.primary,
  },
  unavailableText: {
    color: Colors.textSecondary,
  },
  modelDescription: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  unavailableLabel: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  modelStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
  },
  statBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statValue: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    textTransform: 'capitalize',
  },
});