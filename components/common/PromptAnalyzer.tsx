import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { ChartBar as BarChart3, TrendingUp, Target, Zap } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

interface PromptAnalysis {
  clarity: number;
  specificity: number;
  actionability: number;
  engagement: number;
}

interface PromptAnalyzerProps {
  prompt: string;
  analysis?: PromptAnalysis;
  visible: boolean;
}

export function PromptAnalyzer({ prompt, analysis, visible }: PromptAnalyzerProps) {
  const [animatedValues] = useState({
    clarity: new Animated.Value(0),
    specificity: new Animated.Value(0),
    actionability: new Animated.Value(0),
    engagement: new Animated.Value(0),
  });

  useEffect(() => {
    if (visible && analysis) {
      // Animate bars to their target values
      Object.keys(analysis).forEach((key) => {
        Animated.timing(animatedValues[key], {
          toValue: analysis[key],
          duration: 1000,
          useNativeDriver: false,
        }).start();
      });
    } else {
      // Reset animations
      Object.values(animatedValues).forEach((value) => {
        value.setValue(0);
      });
    }
  }, [visible, analysis]);

  if (!visible || !analysis) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return Colors.success;
    if (score >= 60) return Colors.warning;
    return Colors.error;
  };

  const metrics = [
    {
      key: 'clarity',
      label: 'Clarity',
      icon: Target,
      description: 'How clear and understandable the prompt is',
    },
    {
      key: 'specificity',
      label: 'Specificity',
      icon: BarChart3,
      description: 'Level of detail and precision in the request',
    },
    {
      key: 'actionability',
      label: 'Actionability',
      icon: TrendingUp,
      description: 'How actionable and implementable the request is',
    },
    {
      key: 'engagement',
      label: 'Engagement',
      icon: Zap,
      description: 'Potential to generate engaging responses',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prompt Analysis</Text>
      
      <View style={styles.metricsContainer}>
        {metrics.map((metric) => {
          const score = analysis[metric.key];
          const animatedValue = animatedValues[metric.key];
          
          return (
            <View key={metric.key} style={styles.metricItem}>
              <View style={styles.metricHeader}>
                <View style={styles.metricIcon}>
                  <metric.icon size={16} color={getScoreColor(score)} />
                </View>
                <Text style={styles.metricLabel}>{metric.label}</Text>
                <Text style={[styles.metricScore, { color: getScoreColor(score) }]}>
                  {score}%
                </Text>
              </View>
              
              <View style={styles.progressBarContainer}>
                <Animated.View
                  style={[
                    styles.progressBar,
                    {
                      width: animatedValue.interpolate({
                        inputRange: [0, 100],
                        outputRange: ['0%', '100%'],
                        extrapolate: 'clamp',
                      }),
                      backgroundColor: getScoreColor(score),
                    },
                  ]}
                />
              </View>
              
              <Text style={styles.metricDescription}>{metric.description}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.overallScore}>
        <Text style={styles.overallLabel}>Overall Quality</Text>
        <Text style={[
          styles.overallValue,
          { color: getScoreColor(Math.round((analysis.clarity + analysis.specificity + analysis.actionability + analysis.engagement) / 4)) }
        ]}>
          {Math.round((analysis.clarity + analysis.specificity + analysis.actionability + analysis.engagement) / 4)}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.semibold,
    color: Colors.text,
    marginBottom: 16,
  },
  metricsContainer: {
    gap: 16,
    marginBottom: 20,
  },
  metricItem: {
    gap: 8,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
  },
  metricScore: {
    fontSize: 14,
    fontFamily: Fonts.bold,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  metricDescription: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  overallScore: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  overallLabel: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
    color: Colors.text,
  },
  overallValue: {
    fontSize: 20,
    fontFamily: Fonts.bold,
  },
});