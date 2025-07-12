// This service will integrate with RevenueCat when exported to local development
// For now, it provides the structure and mock functionality

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
}

export interface UserSubscription {
  planId: string;
  status: 'active' | 'expired' | 'cancelled';
  expiresAt: Date;
  autoRenew: boolean;
}

export class SubscriptionService {
  private static currentSubscription: UserSubscription | null = null;

  // Mock subscription status - will be replaced with RevenueCat
  static async getCurrentSubscription(): Promise<UserSubscription | null> {
    // In production, this will call RevenueCat's getCustomerInfo()
    return this.currentSubscription;
  }

  static async isSubscribed(): Promise<boolean> {
    const subscription = await this.getCurrentSubscription();
    return subscription?.status === 'active' && subscription.expiresAt > new Date();
  }

  static async hasFeatureAccess(feature: string): Promise<boolean> {
    const isSubscribed = await this.isSubscribed();
    
    // Define feature access rules
    const freeFeatures = [
      'basic_explanations',
      'limited_languages',
      'basic_skills',
    ];

    const premiumFeatures = [
      'unlimited_explanations',
      'all_languages',
      'business_tools',
      'cultural_content',
      'offline_access',
      'advanced_skills',
      'priority_support',
    ];

    if (freeFeatures.includes(feature)) {
      return true;
    }

    return isSubscribed && premiumFeatures.includes(feature);
  }

  static async purchaseSubscription(planId: string): Promise<boolean> {
    try {
      // In production, this will call RevenueCat's purchasePackage()
      console.log(`Mock purchase for plan: ${planId}`);
      
      // Mock successful purchase
      this.currentSubscription = {
        planId,
        status: 'active',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        autoRenew: true,
      };

      return true;
    } catch (error) {
      console.error('Purchase failed:', error);
      return false;
    }
  }

  static async restorePurchases(): Promise<boolean> {
    try {
      // In production, this will call RevenueCat's restorePurchases()
      console.log('Mock restore purchases');
      return true;
    } catch (error) {
      console.error('Restore failed:', error);
      return false;
    }
  }

  static async cancelSubscription(): Promise<boolean> {
    try {
      // In production, this will handle cancellation through app stores
      if (this.currentSubscription) {
        this.currentSubscription.autoRenew = false;
      }
      return true;
    } catch (error) {
      console.error('Cancellation failed:', error);
      return false;
    }
  }

  // Usage tracking for free tier limits
  static async trackUsage(feature: string): Promise<void> {
    const usage = await this.getUsage(feature);
    const limits = this.getFeatureLimits();
    
    if (usage >= limits[feature] && !(await this.isSubscribed())) {
      throw new Error(`Feature limit reached for ${feature}`);
    }
  }

  static async getUsage(feature: string): Promise<number> {
    // Mock usage tracking - in production, store in AsyncStorage or backend
    const mockUsage = {
      'ai_explanations': 45, // out of 50 free
      'business_assets': 8,  // out of 10 free
      'skill_guides': 2,     // out of 3 free
    };
    
    return mockUsage[feature] || 0;
  }

  private static getFeatureLimits(): Record<string, number> {
    return {
      'ai_explanations': 50,
      'business_assets': 10,
      'skill_guides': 3,
      'cultural_content': 5,
    };
  }

  static async getRemainingUsage(feature: string): Promise<number> {
    if (await this.isSubscribed()) {
      return Infinity; // Unlimited for subscribers
    }
    
    const usage = await this.getUsage(feature);
    const limit = this.getFeatureLimits()[feature] || 0;
    return Math.max(0, limit - usage);
  }
}

// RevenueCat Integration Guide (for when exported to local development):
/*
1. Install RevenueCat SDK:
   npm install react-native-purchases

2. Configure RevenueCat in your app:
   - Create account at https://app.revenuecat.com
   - Set up your app and products
   - Get your API keys

3. Initialize RevenueCat in App.tsx:
   import Purchases from 'react-native-purchases';
   
   Purchases.setDebugLogsEnabled(true);
   Purchases.configure({
     apiKey: 'your_revenuecat_api_key',
   });

4. Replace mock methods with actual RevenueCat calls:
   - getCurrentSubscription() -> Purchases.getCustomerInfo()
   - purchaseSubscription() -> Purchases.purchasePackage()
   - restorePurchases() -> Purchases.restorePurchases()

5. Set up products in RevenueCat dashboard and update plan IDs

6. Test with sandbox accounts on iOS/Android devices
*/