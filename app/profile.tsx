import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, Alert, Image } from 'react-native';
import { User, CreditCard as Edit3, Save, Camera, Award, BookOpen, Target, Globe } from 'lucide-react-native';
import { Header } from '@/components/common/Header';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { StorageService } from '@/services/storage';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  country: string;
  preferredLanguage: string;
  learningGoals: string[];
  businessInterests: string[];
  joinDate: Date;
  totalSessions: number;
  skillsLearned: number;
  culturalTopicsExplored: number;
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile>({
    id: 'user_1',
    name: 'John Doe',
    email: 'john@example.com',
    country: 'Ghana',
    preferredLanguage: 'English',
    learningGoals: ['Business Development', 'Technology Skills'],
    businessInterests: ['E-commerce', 'Digital Marketing'],
    joinDate: new Date('2024-01-15'),
    totalSessions: 47,
    skillsLearned: 8,
    culturalTopicsExplored: 12,
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userData = await StorageService.getUserData();
      if (userData) {
        setProfile(userData);
        setEditedProfile(userData);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const saveProfile = async () => {
    try {
      await StorageService.saveUserData(editedProfile);
      setProfile(editedProfile);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const achievements = [
    { id: 1, title: 'First Steps', description: 'Completed first learning session', icon: '🎯', earned: true },
    { id: 2, title: 'Business Builder', description: 'Generated 10 business assets', icon: '💼', earned: true },
    { id: 3, title: 'Cultural Explorer', description: 'Explored 5 different countries', icon: '🌍', earned: true },
    { id: 4, title: 'Skill Master', description: 'Completed 5 skill guides', icon: '🏆', earned: false },
    { id: 5, title: 'Language Learner', description: 'Used 3 different languages', icon: '🗣️', earned: false },
  ];

  return (
    <ScrollView style={styles.container}>
      <Header title="Profile" showProfile={false} />
      
      <View style={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: profile.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.cameraButton}>
              <Camera size={16} color={Colors.background} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfo}>
            {isEditing ? (
              <TextInput
                style={styles.nameInput}
                value={editedProfile.name}
                onChangeText={(text) => setEditedProfile({...editedProfile, name: text})}
                placeholder="Your name"
              />
            ) : (
              <Text style={styles.name}>{profile.name}</Text>
            )}
            
            <Text style={styles.email}>{profile.email}</Text>
            <Text style={styles.joinDate}>
              Member since {profile.joinDate.toLocaleDateString()}
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              if (isEditing) {
                saveProfile();
              } else {
                setIsEditing(true);
              }
            }}
          >
            {isEditing ? (
              <Save size={20} color={Colors.primary} />
            ) : (
              <Edit3 size={20} color={Colors.primary} />
            )}
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <BookOpen size={24} color={Colors.primary} />
            <Text style={styles.statNumber}>{profile.totalSessions}</Text>
            <Text style={styles.statLabel}>Learning Sessions</Text>
          </View>
          
          <View style={styles.statCard}>
            <Target size={24} color={Colors.secondary} />
            <Text style={styles.statNumber}>{profile.skillsLearned}</Text>
            <Text style={styles.statLabel}>Skills Learned</Text>
          </View>
          
          <View style={styles.statCard}>
            <Globe size={24} color={Colors.accent} />
            <Text style={styles.statNumber}>{profile.culturalTopicsExplored}</Text>
            <Text style={styles.statLabel}>Cultural Topics</Text>
          </View>
        </View>

        {/* Profile Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Details</Text>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Country</Text>
            {isEditing ? (
              <TextInput
                style={styles.detailInput}
                value={editedProfile.country}
                onChangeText={(text) => setEditedProfile({...editedProfile, country: text})}
              />
            ) : (
              <Text style={styles.detailValue}>{profile.country}</Text>
            )}
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Preferred Language</Text>
            {isEditing ? (
              <TextInput
                style={styles.detailInput}
                value={editedProfile.preferredLanguage}
                onChangeText={(text) => setEditedProfile({...editedProfile, preferredLanguage: text})}
              />
            ) : (
              <Text style={styles.detailValue}>{profile.preferredLanguage}</Text>
            )}
          </View>
        </View>

        {/* Learning Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Goals</Text>
          <View style={styles.tagsContainer}>
            {profile.learningGoals.map((goal, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{goal}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Business Interests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Interests</Text>
          <View style={styles.tagsContainer}>
            {profile.businessInterests.map((interest, index) => (
              <View key={index} style={[styles.tag, styles.businessTag]}>
                <Text style={[styles.tagText, styles.businessTagText]}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsContainer}>
            {achievements.map((achievement) => (
              <View key={achievement.id} style={[
                styles.achievementCard,
                !achievement.earned && styles.lockedAchievement
              ]}>
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <View style={styles.achievementInfo}>
                  <Text style={[
                    styles.achievementTitle,
                    !achievement.earned && styles.lockedText
                  ]}>
                    {achievement.title}
                  </Text>
                  <Text style={[
                    styles.achievementDescription,
                    !achievement.earned && styles.lockedText
                  ]}>
                    {achievement.description}
                  </Text>
                </View>
                {achievement.earned && (
                  <Award size={20} color={Colors.success} />
                )}
              </View>
            ))}
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 6,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  nameInput: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.text,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  editButton: {
    padding: 8,
    backgroundColor: Colors.background,
    borderRadius: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailLabel: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.text,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  detailInput: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.text,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
    minWidth: 120,
    textAlign: 'right',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  businessTag: {
    backgroundColor: Colors.secondary + '20',
  },
  tagText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.primary,
  },
  businessTagText: {
    color: Colors.secondary,
  },
  achievementsContainer: {
    gap: 12,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  lockedAchievement: {
    opacity: 0.5,
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
    color: Colors.text,
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  lockedText: {
    color: Colors.textSecondary,
  },
});