import React, { useState, useEffect } from 'react';
import { FileUpload } from '@/components/common/FileUpload';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, TextInput, Button } from 'react-native';
import { Play, CircleCheck as CheckCircle, Clock, DollarSign, BookOpen, Search } from 'lucide-react-native';
import { Header } from '@/components/common/Header';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { ApiService } from '@/services/api';
import { StorageService } from '@/services/storage';

const skillCategories = [
  { id: 'tech', name: 'Technology', icon: '💻', skills: ['Web Development', 'Mobile Apps', 'Digital Marketing', 'Data Analysis'] },
  { id: 'crafts', name: 'Crafts & Arts', icon: '🎨', skills: ['Photography', 'Graphic Design', 'Tailoring', 'Jewelry Making'] },
  { id: 'business', name: 'Business', icon: '💼', skills: ['E-commerce', 'Accounting', 'Customer Service', 'Sales'] },
  { id: 'agriculture', name: 'Agriculture', icon: '🌱', skills: ['Organic Farming', 'Poultry', 'Fish Farming', 'Crop Production'] },
  { id: 'health', name: 'Health & Wellness', icon: '🏥', skills: ['First Aid', 'Nutrition', 'Fitness Training', 'Mental Health'] },
  { id: 'education', name: 'Education', icon: '📚', skills: ['Tutoring', 'Language Teaching', 'Skill Training', 'Curriculum Design'] },
];

const difficultyLevels = [
  { id: 'beginner', name: 'Beginner', color: Colors.success, description: 'No prior experience needed' },
  { id: 'intermediate', name: 'Intermediate', color: Colors.warning, description: 'Some basic knowledge required' },
  { id: 'advanced', name: 'Advanced', color: Colors.error, description: 'Experienced practitioners' },
];

export default function LearnSkillScreen() {
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
  const [selectedCategory, setSelectedCategory] = useState('tech');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('beginner');
  type SkillStep = {
    id: string;
    title: string;
    description: string;
    resources: string[];
    completionCriteria: string;
    order: number;
  };
  type SkillGuide = {
    name: string;
    description: string;
    category: string;
    difficulty: string;
    estimatedTime: string;
    steps: SkillStep[];
    monetizationTips: string[];
  };
  const [skillGuide, setSkillGuide] = useState<SkillGuide | null>(null);
  const [loading, setLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const handleGetSkillGuide = async (skillName: string) => {
    setLoading(true);
    setSelectedSkill(skillName);
    
    try {
      const result = await ApiService.getSkillGuide(skillName, selectedDifficulty);
      setSkillGuide(result as SkillGuide);
      setCompletedSteps(new Set());
    } catch (error) {
      console.error('Error loading skill guide:', error);
      // Generate mock data for demonstration
      const mockGuide: SkillGuide = {
        name: skillName,
        description: `Learn ${skillName} with step-by-step guidance tailored for African entrepreneurs`,
        category: selectedCategory,
        difficulty: selectedDifficulty,
        estimatedTime: '2-4 weeks',
        steps: [
          {
            id: '1',
            title: 'Foundation & Basics',
            description: `Understanding the fundamentals of ${skillName}`,
            resources: ['Video tutorials', 'Reading materials', 'Practice exercises'],
            completionCriteria: 'Complete foundation quiz',
            order: 1,
          },
          {
            id: '2',
            title: 'Hands-on Practice',
            description: `Practical application of ${skillName} concepts`,
            resources: ['Project templates', 'Tools & software', 'Community support'],
            completionCriteria: 'Complete first project',
            order: 2,
          },
          {
            id: '3',
            title: 'Advanced Techniques',
            description: `Advanced strategies and best practices`,
            resources: ['Expert interviews', 'Case studies', 'Advanced tools'],
            completionCriteria: 'Master advanced project',
            order: 3,
          },
          {
            id: '4',
            title: 'Business Application',
            description: `How to monetize your ${skillName} skills`,
            resources: ['Business planning', 'Marketing strategies', 'Pricing guides'],
            completionCriteria: 'Create business plan',
            order: 4,
          },
        ],
        monetizationTips: [
          'Start with freelance projects to build portfolio',
          'Join local business networks and communities',
          'Use social media to showcase your work',
          'Offer competitive pricing for the local market',
          'Provide excellent customer service for repeat business',
        ],
      };
      setSkillGuide(mockGuide);
    } finally {
      setLoading(false);
    }
  };

  const toggleStepCompletion = (stepId: string) => {
    const newCompletedSteps = new Set(completedSteps);
    if (newCompletedSteps.has(stepId)) {
      newCompletedSteps.delete(stepId);
    } else {
      newCompletedSteps.add(stepId);
    }
    setCompletedSteps(newCompletedSteps);
  };

  const selectedCategoryData = skillCategories.find(cat => cat.id === selectedCategory);
  const selectedDifficultyData = difficultyLevels.find(diff => diff.id === selectedDifficulty);

  return (
    <ScrollView style={styles.container}>
      <Header title="Learn a Skill" />
      <View style={styles.content}>
        <Text style={styles.description}>
          Master practical skills with step-by-step guides and monetization strategies
        </Text>

        {/* User question and resource request section */}
        <View style={{ marginVertical: 16 }}>
          <Text style={{ fontWeight: 'bold' }}>Ask for a specific skill, topic, or guidance:</Text>
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

        {/* Category selector section */}
        <View style={styles.categorySelector}>
          <Text style={styles.sectionTitle}>Choose Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryList}>
            {skillCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryCard, selectedCategory === category.id && styles.selectedCategory]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[styles.categoryName, selectedCategory === category.id && styles.selectedCategoryText]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.difficultySelector}>
          <Text style={styles.sectionTitle}>Difficulty Level</Text>
          <View style={styles.difficultyList}>
            {difficultyLevels.map((level) => (
              <TouchableOpacity
                key={level.id}
                style={[
                  styles.difficultyCard,
                  selectedDifficulty === level.id && styles.selectedDifficulty,
                ]}
                onPress={() => setSelectedDifficulty(level.id)}
              >
                <View style={[
                  styles.difficultyIndicator,
                  { backgroundColor: level.color },
                ]} />
                <View style={styles.difficultyInfo}>
                  <Text style={[
                    styles.difficultyName,
                    selectedDifficulty === level.id && styles.selectedDifficultyText,
                  ]}>
                    {level.name}
                  </Text>
                  <Text style={styles.difficultyDescription}>
                    {level.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.skillSelector}>
          <Text style={styles.sectionTitle}>Select Skill</Text>
          <View style={styles.skillGrid}>
            {selectedCategoryData?.skills.map((skill, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.skillCard,
                  selectedSkill === skill && styles.selectedSkill,
                ]}
                onPress={() => handleGetSkillGuide(skill)}
              >
                <Search size={20} color={selectedSkill === skill ? Colors.background : Colors.primary} />
                <Text style={[
                  styles.skillName,
                  selectedSkill === skill && styles.selectedSkillText,
                ]}>
                  {skill}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {loading && (
          <View style={styles.loadingSection}>
            <LoadingSpinner size={40} color={Colors.primary} />
            <Text style={styles.loadingText}>Loading skill guide...</Text>
          </View>
        )}

        {skillGuide && !loading && (
          <View style={styles.guideSection}>
            <View style={styles.guideHeader}>
              <Text style={styles.guideTitle}>{skillGuide.name}</Text>
              <Text style={styles.guideDescription}>{skillGuide.description}</Text>
              <View style={styles.guideInfo}>
                <View style={styles.infoItem}>
                  <Clock size={16} color={Colors.textSecondary} />
                  <Text style={styles.infoText}>{skillGuide.estimatedTime}</Text>
                </View>
                <View style={styles.infoItem}>
                  <BookOpen size={16} color={Colors.textSecondary} />
                  <Text style={styles.infoText}>{skillGuide.steps.length} Steps</Text>
                </View>
              </View>
            </View>
            <View style={styles.stepsSection}>
              <Text style={styles.sectionTitle}>Learning Steps</Text>
              {skillGuide.steps.map((step: SkillStep, index: number) => (
                <View key={step.id} style={styles.stepCard}>
                  <View style={styles.stepHeader}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>
                    <View style={styles.stepInfo}>
                      <Text style={styles.stepTitle}>{step.title}</Text>
                      <Text style={styles.stepDescription}>{step.description}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.completeButton}
                      onPress={() => toggleStepCompletion(step.id)}
                    >
                      <CheckCircle 
                        size={24} 
                        color={completedSteps.has(step.id) ? Colors.success : Colors.border} 
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.stepResources}>
                    <Text style={styles.resourcesTitle}>Resources:</Text>
                    {step.resources.map((resource: string, idx: number) => (
                      <Text key={idx} style={styles.resourceItem}>• {resource}</Text>
                    ))}
                  </View>
                  <View style={styles.stepCriteria}>
                    <Text style={styles.criteriaTitle}>Completion Criteria:</Text>
                    <Text style={styles.criteriaText}>{step.completionCriteria}</Text>
                  </View>
                </View>
              ))}
            </View>
            <View style={styles.monetizationSection}>
              <Text style={styles.sectionTitle}>💰 Monetization Tips</Text>
              {skillGuide.monetizationTips.map((tip: string, index: number) => (
                <View key={index} style={styles.tipCard}>
                  <DollarSign size={16} color={Colors.success} />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
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
  categorySelector: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.semibold,
    color: Colors.text,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  categoryList: {
    paddingHorizontal: 20,
  },
  categoryCard: {
    alignItems: 'center',
    padding: 16,
    marginRight: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    minWidth: 100,
  },
  selectedCategory: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: Colors.background,
  },
  difficultySelector: {
    marginBottom: 20,
  },
  difficultyList: {
    paddingHorizontal: 20,
  },
  difficultyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  selectedDifficulty: {
    backgroundColor: Colors.accent + '10',
    borderColor: Colors.accent,
  },
  difficultyIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  difficultyInfo: {
    flex: 1,
  },
  difficultyName: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
    color: Colors.text,
  },
  selectedDifficultyText: {
    color: Colors.accent,
  },
  difficultyDescription: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  skillSelector: {
    marginBottom: 20,
  },
  skillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  skillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  selectedSkill: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  skillName: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
    marginLeft: 8,
    flex: 1,
  },
  selectedSkillText: {
    color: Colors.background,
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
  guideSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  guideHeader: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  guideTitle: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: 8,
  },
  guideDescription: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  guideInfo: {
    flexDirection: 'row',
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
  },
  stepsSection: {
    marginBottom: 20,
  },
  stepCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: Colors.background,
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontFamily: Fonts.semibold,
    color: Colors.text,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  completeButton: {
    padding: 4,
  },
  stepResources: {
    marginBottom: 12,
  },
  resourcesTitle: {
    fontSize: 14,
    fontFamily: Fonts.semibold,
    color: Colors.text,
    marginBottom: 6,
  },
  resourceItem: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  stepCriteria: {
    backgroundColor: Colors.success + '10',
    borderRadius: 8,
    padding: 12,
  },
  criteriaTitle: {
    fontSize: 14,
    fontFamily: Fonts.semibold,
    color: Colors.success,
    marginBottom: 4,
  },
  criteriaText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.text,
  },
  monetizationSection: {
    marginBottom: 20,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
  },
  tipText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.text,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
});