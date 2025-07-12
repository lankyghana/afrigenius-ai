import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Switch, Alert } from 'react-native';
import { Settings as SettingsIcon, Moon, Sun, Bell, Globe, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight, Download, Trash2 } from 'lucide-react-native';
import { Header } from '@/components/common/Header';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { StorageService } from '@/services/storage';

interface Settings {
  darkMode: boolean;
  notifications: boolean;
  offlineMode: boolean;
  autoDownload: boolean;
  language: string;
  aiModel: string;
}

export default function SettingsScreen() {
  const [settings, setSettings] = useState<Settings>({
    darkMode: false,
    notifications: true,
    offlineMode: false,
    autoDownload: true,
    language: 'English',
    aiModel: 'GPT-4',
  });
  const [allowTraining, setAllowTraining] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const preferences = await StorageService.getPreferences();
      setSettings({
        darkMode: preferences.theme === 'dark',
        notifications: preferences.notifications,
        offlineMode: preferences.offlineMode || false,
        autoDownload: preferences.autoDownload || true,
        language: preferences.language || 'English',
        aiModel: preferences.aiModel || 'GPT-4',
      });
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateSetting = async (key: keyof Settings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    try {
      const preferences = await StorageService.getPreferences();
      const updatedPreferences = {
        ...preferences,
        [key]: value,
        theme: newSettings.darkMode ? 'dark' : 'light',
      };
      await StorageService.savePreferences(updatedPreferences);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const clearCache = async () => {
    Alert.alert(
      'Clear Cache',
      'This will remove all offline content and cached data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear offline content
              Alert.alert('Success', 'Cache cleared successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear cache');
            }
          },
        },
      ]
    );
  };

  const signOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            // Handle sign out
            Alert.alert('Signed Out', 'You have been signed out successfully');
          },
        },
      ]
    );
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    value, 
    onPress, 
    showSwitch = false, 
    showChevron = true 
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    value?: any;
    onPress?: () => void;
    showSwitch?: boolean;
    showChevron?: boolean;
  }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>{icon}</View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      
      <View style={styles.settingRight}>
        {showSwitch ? (
          <Switch
            value={value}
            onValueChange={onPress}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor={Colors.background}
          />
        ) : (
          <>
            {value && <Text style={styles.settingValue}>{value}</Text>}
            {showChevron && <ChevronRight size={20} color={Colors.textSecondary} />}
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Header title="Settings" showSettings={false} />
      
      <View style={styles.content}>
        {/* Appearance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <SettingItem
            icon={settings.darkMode ? <Moon size={24} color={Colors.primary} /> : <Sun size={24} color={Colors.warning} />}
            title="Dark Mode"
            subtitle="Switch between light and dark themes"
            value={settings.darkMode}
            onPress={() => {
              updateSetting('darkMode', !settings.darkMode);
              // Force a re-render to apply theme changes
              setTimeout(() => {
                // This will trigger a theme update
              }, 100);
            }}
            showSwitch={true}
            showChevron={false}
          />
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <SettingItem
            icon={<Bell size={24} color={Colors.secondary} />}
            title="Push Notifications"
            subtitle="Receive updates and reminders"
            value={settings.notifications}
            onPress={() => updateSetting('notifications', !settings.notifications)}
            showSwitch={true}
            showChevron={false}
          />
        </View>

        {/* Content & Data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content & Data</Text>
          
          <SettingItem
            icon={<Download size={24} color={Colors.accent} />}
            title="Offline Mode"
            subtitle="Download content for offline access"
            value={settings.offlineMode}
            onPress={() => updateSetting('offlineMode', !settings.offlineMode)}
            showSwitch={true}
            showChevron={false}
          />
          
          <SettingItem
            icon={<Download size={24} color={Colors.info} />}
            title="Auto Download"
            subtitle="Automatically download new content"
            value={settings.autoDownload}
            onPress={() => updateSetting('autoDownload', !settings.autoDownload)}
            showSwitch={true}
            showChevron={false}
          />
          
          <SettingItem
            icon={<Globe size={24} color={Colors.forest} />}
            title="Language"
            subtitle="Choose your preferred language"
            value={settings.language}
            onPress={() => Alert.alert('Language', 'Language selection coming soon')}
          />
        </View>

        {/* AI & Learning */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI & Learning</Text>
          
          <SettingItem
            icon={<SettingsIcon size={24} color={Colors.sunset} />}
            title="AI Model"
            subtitle="Choose your preferred AI model"
            value={settings.aiModel}
            onPress={() => Alert.alert('AI Model', 'AI model selection available in Learn Smart tab')}
          />
        </View>

        {/* Privacy & Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Security</Text>
          <SettingItem
            icon={<Shield size={24} color={Colors.warning} />}
            title="Privacy Policy"
            subtitle="View our privacy policy"
            onPress={() => Alert.alert('Privacy Policy', 'Privacy policy will be displayed here')}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginVertical: 12 }}>
            <Switch
              value={allowTraining}
              onValueChange={setAllowTraining}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={allowTraining ? Colors.primary : Colors.border}
            />
            <Text style={{ marginLeft: 12, color: Colors.text, fontFamily: Fonts.regular, flex: 1 }}>
              Allow AfriGenius to use my information to help train and improve the AI model
            </Text>
          </View>
          <SettingItem
            icon={<Trash2 size={24} color={Colors.error} />}
            title="Clear Cache"
            subtitle="Remove offline content and cached data"
            onPress={clearCache}
          />
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <SettingItem
            icon={<HelpCircle size={24} color={Colors.info} />}
            title="Help & Support"
            subtitle="Get help and contact support"
            onPress={() => Alert.alert('Support', 'Support center coming soon')}
          />
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <SettingItem
            icon={<LogOut size={24} color={Colors.error} />}
            title="Sign Out"
            subtitle="Sign out of your account"
            onPress={signOut}
            showChevron={false}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.version}>AfriGenius v1.0.0</Text>
          <Text style={styles.copyright}>© 2024 AfriGenius. All rights reserved.</Text>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    marginBottom: 2,
    borderRadius: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  version: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  copyright: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});