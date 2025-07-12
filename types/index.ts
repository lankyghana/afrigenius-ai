export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferredLanguage: string;
  country: string;
  learningGoals: string[];
  businessInterests: string[];
  createdAt: Date;
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  icon: string;
  available: boolean;
}

export interface LearningSession {
  id: string;
  userId: string;
  module: 'learn-smart' | 'hustle-smart' | 'learn-skill' | 'culture-class';
  topic: string;
  query: string;
  response: string;
  language: string;
  aiModel: string;
  createdAt: Date;
}

export interface BusinessAsset {
  id: string;
  userId: string;
  type: 'name' | 'tagline' | 'description' | 'logo' | 'poster';
  content: string;
  businessType: string;
  createdAt: Date;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: SkillStep[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  monetizationTips: string[];
}

export interface SkillStep {
  id: string;
  title: string;
  description: string;
  resources: string[];
  completionCriteria: string;
  order: number;
}

export interface CulturalContent {
  id: string;
  title: string;
  description: string;
  country: string;
  category: 'tradition' | 'language' | 'festival' | 'food' | 'music' | 'art';
  content: string;
  images: string[];
  audioFiles: string[];
  relatedTopics: string[];
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  available: boolean;
}