import AsyncStorage from '@react-native-async-storage/async-storage';

export class StorageService {
  static async saveUserData(userData: any) {
    await AsyncStorage.setItem('user_data', JSON.stringify(userData));
  }

  static async getUserData() {
    const userData = await AsyncStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  static async saveLearningSession(session: any) {
    const sessions = await this.getLearningHistory();
    sessions.push(session);
    await AsyncStorage.setItem('learning_history', JSON.stringify(sessions));
  }

  static async getLearningHistory() {
    const history = await AsyncStorage.getItem('learning_history');
    return history ? JSON.parse(history) : [];
  }

  static async saveOfflineContent(key: string, content: any) {
    await AsyncStorage.setItem(`offline_${key}`, JSON.stringify(content));
  }

  static async getOfflineContent(key: string) {
    const content = await AsyncStorage.getItem(`offline_${key}`);
    return content ? JSON.parse(content) : null;
  }

  static async savePreferences(preferences: any) {
    await AsyncStorage.setItem('user_preferences', JSON.stringify(preferences));
  }

  static async getPreferences() {
    const preferences = await AsyncStorage.getItem('user_preferences');
    return preferences ? JSON.parse(preferences) : {
      language: 'en',
      aiModel: 'gpt-4',
      theme: 'light',
      notifications: true,
    };
  }
}