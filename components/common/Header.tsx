import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { User, Settings, Bell, Moon, Sun, Search } from 'lucide-react-native';
import { Fonts } from '@/constants/Fonts';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';

interface HeaderProps {
  title: string;
  showProfile?: boolean;
  showSettings?: boolean;
  showNotifications?: boolean;
  showSearch?: boolean;
  showThemeToggle?: boolean;
  onProfilePress?: () => void;
  onSettingsPress?: () => void;
  onNotificationsPress?: () => void;
}

export function Header({
  title,
  showProfile = true,
  showSettings = true,
  showNotifications = true,
  showSearch = true,
  showThemeToggle = true,
  onProfilePress,
  onSettingsPress,
  onNotificationsPress,
}: HeaderProps) {
  const { isDarkMode, toggleTheme, colors } = useTheme();

  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    } else {
      router.push('/profile');
    }
  };

  const handleSettingsPress = () => {
    if (onSettingsPress) {
      onSettingsPress();
    } else {
      router.push('/settings');
    }
  };

  const handleNotificationsPress = () => {
    if (onNotificationsPress) {
      onNotificationsPress();
    } else {
      router.push('/notifications');
    }
  };

  const handleSearchPress = () => {
    router.push('/search');
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/')}>
          <Text style={styles.appName}>AfriGenius</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>
      
      <View style={styles.rightSection}>
        {showSearch && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleSearchPress}
          >
            <Search size={24} color={colors.text} />
          </TouchableOpacity>
        )}
        
        {showThemeToggle && (
          <TouchableOpacity
            style={[styles.iconButton, styles.themeButton]}
            onPress={toggleTheme}
          >
            {isDarkMode ? (
              <Sun size={24} color={colors.warning} />
            ) : (
              <Moon size={24} color={colors.text} />
            )}
          </TouchableOpacity>
        )}
        
        {showNotifications && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleNotificationsPress}
          >
            <Bell size={24} color={colors.text} />
          </TouchableOpacity>
        )}
        
        {showSettings && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleSettingsPress}
          >
            <Settings size={24} color={colors.text} />
          </TouchableOpacity>
        )}
        
        {showProfile && (
          <TouchableOpacity
            style={[styles.iconButton, styles.profileButton]}
            onPress={handleProfilePress}
          >
            <User size={24} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leftSection: {
    flex: 1,
  },
  appName: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: colors.primary,
    marginBottom: 2,
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: colors.textSecondary,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  themeButton: {
    backgroundColor: colors.surfaceVariant,
  },
  profileButton: {
    backgroundColor: colors.surface,
    borderColor: colors.primary,
  },
});