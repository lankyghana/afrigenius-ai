import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Lightbulb, Zap, Target, TrendingUp, Share2, Download } from 'lucide-react-native';
import { Header } from '@/components/common/Header';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { ApiService } from '@/services/api';
import { StorageService } from '@/services/storage';
import { SubscriptionService } from '@/services/subscription';
import { SubscriptionGate } from '@/components/subscription/SubscriptionGate';
import * as Sharing from 'expo-sharing';

const businessTypes = [
  { id: 'retail', name: 'Retail', icon: '🛒', color: Colors.primary },
  { id: 'food', name: 'Food & Beverage', icon: '🍽️', color: Colors.secondary },
  { id: 'service', name: 'Services', icon: '🔧', color: Colors.accent },
  { id: 'tech', name: 'Technology', icon: '💻', color: Colors.info },
  { id: 'beauty', name: 'Beauty & Fashion', icon: '💄', color: Colors.sunset },
  { id: 'agriculture', name: 'Agriculture', icon: '🌱', color: Colors.forest },
];

const assetTypes = [
  { id: 'name', name: 'Business Name', icon: Lightbulb, description: 'Generate catchy business names' },
  { id: 'tagline', name: 'Tagline', icon: Zap, description: 'Create memorable slogans' },
  { id: 'description', name: 'Description', icon: Target, description: 'Write compelling descriptions' },
  { id: 'marketing', name: 'Marketing Content', icon: TrendingUp, description: 'Generate social media posts' },
];

export default function HustleSmartScreen() {
  const [selectedBusinessType, setSelectedBusinessType] = useState('retail');
  const [selectedAssetType, setSelectedAssetType] = useState('name');
  const [businessDescription, setBusinessDescription] = useState('');
  const [generatedAssets, setGeneratedAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [remainingUsage, setRemainingUsage] = useState(0);

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    const subscribed = await SubscriptionService.isSubscribed();
    const remaining = await SubscriptionService.getRemainingUsage('business_assets');
    setIsSubscribed(subscribed);
    setRemainingUsage(remaining);
  };

  const handleGenerateAsset = async () => {
    if (!businessDescription.trim()) {
      Alert.alert('Error', 'Please provide a business description');
      return;
    }

    // Check usage limits for free users
    if (!isSubscribed) {
      try {
        await SubscriptionService.trackUsage('business_assets');
      } catch (error) {
        // Show paywall if limit reached
        return;
      }
    }

    setLoading(true);
    try {
      const result = await ApiService.generateBusinessAsset(
        selectedAssetType,
        selectedBusinessType,
        businessDescription
      );
      
      const asset = {
        id: Date.now().toString(),
        type: selectedAssetType,
        businessType: selectedBusinessType,
        content: result.content,
        createdAt: new Date(),
      };
      
      setGeneratedAssets([asset, ...generatedAssets]);
      
      // Save to storage
      await StorageService.saveBusinessAsset(asset);
      checkSubscriptionStatus(); // Update remaining usage
      
    } catch (error) {
      console.error('Error generating asset:', error);
      Alert.alert('Error', 'Failed to generate asset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const shareAsset = async (content: string) => {
    try {
      await Sharing.shareAsync(content);
    } catch (error) {
      console.error('Error sharing asset:', error);
    }
  };

  const handleSubscribe = async (planId: string) => {
    const success = await SubscriptionService.purchaseSubscription(planId);
    if (success) {
      checkSubscriptionStatus();
    }
  };

  const selectedBusinessTypeData = businessTypes.find(bt => bt.id === selectedBusinessType);
  const selectedAssetTypeData = assetTypes.find(at => at.id === selectedAssetType);

  return (
    <ScrollView style={styles.container}>
      <Header title="Hustle Smart" />
      
      <View style={styles.content}>
        <Text style={styles.description}>
          Generate business assets and marketing content to grow your African business
        </Text>

        {!isSubscribed && (
          <View style={styles.usageIndicator}>
            <Text style={styles.usageText}>
              {remainingUsage} free generations remaining
            </Text>
            {remainingUsage <= 2 && (
              <Text style={styles.upgradePrompt}>
                Upgrade for unlimited business tools
              </Text>
            )}
          </View>
        )}

        <View style={styles.businessTypeSelector}>
          <Text style={styles.sectionTitle}>Select Business Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.businessTypeList}>
            {businessTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.businessTypeCard,
                  selectedBusinessType === type.id && styles.selectedBusinessType,
                ]}
                onPress={() => setSelectedBusinessType(type.id)}
              >
                <Text style={styles.businessTypeIcon}>{type.icon}</Text>
                <Text style={[
                  styles.businessTypeName,
                  selectedBusinessType === type.id && styles.selectedBusinessTypeText,
                ]}>
                  {type.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.assetTypeSelector}>
          <Text style={styles.sectionTitle}>Choose Asset Type</Text>
          <View style={styles.assetTypeGrid}>
            {assetTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.assetTypeCard,
                  selectedAssetType === type.id && styles.selectedAssetType,
                ]}
                onPress={() => setSelectedAssetType(type.id)}
              >
                <type.icon 
                  size={32} 
                  color={selectedAssetType === type.id ? Colors.background : Colors.primary} 
                />
                <Text style={[
                  styles.assetTypeName,
                  selectedAssetType === type.id && styles.selectedAssetTypeText,
                ]}>
                  {type.name}
                </Text>
                <Text style={[
                  styles.assetTypeDescription,
                  selectedAssetType === type.id && styles.selectedAssetTypeDescText,
                ]}>
                  {type.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Describe Your Business</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Tell us about your business idea, target audience, and unique selling points..."
            placeholderTextColor={Colors.textSecondary}
            multiline
            value={businessDescription}
            onChangeText={setBusinessDescription}
          />
          
          <TouchableOpacity
            style={[styles.generateButton, loading && styles.disabledButton]}
            onPress={handleGenerateAsset}
            disabled={loading || !businessDescription.trim()}
          >
            {loading ? (
              <LoadingSpinner size={20} color={Colors.background} />
            ) : (
              <selectedAssetTypeData.icon size={20} color={Colors.background} />
            )}
            <Text style={styles.generateButtonText}>
              {loading ? 'Generating...' : `Generate ${selectedAssetTypeData.name}`}
            </Text>
          </TouchableOpacity>
        </View>

        {generatedAssets.length > 0 && !isSubscribed && remainingUsage === 0 ? (
          <SubscriptionGate
            feature="unlimited business asset generation"
            title="Upgrade Your Business Tools"
            description="You've reached your free limit. Upgrade to generate unlimited business names, taglines, descriptions, and marketing content."
            onSubscribe={handleSubscribe}
          >
            <View style={styles.resultsSection}>
              <Text style={styles.sectionTitle}>Generated Assets</Text>
              {generatedAssets.map((asset) => (
                <View key={asset.id} style={styles.assetCard}>
                  <View style={styles.assetHeader}>
                    <View style={styles.assetInfo}>
                      <Text style={styles.assetType}>{asset.type.toUpperCase()}</Text>
                      <Text style={styles.assetBusinessType}>
                        {businessTypes.find(bt => bt.id === asset.businessType)?.name}
                      </Text>
                    </View>
                    <View style={styles.assetActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => shareAsset(asset.content)}
                      >
                        <Share2 size={16} color={Colors.primary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <Text style={styles.assetContent}>{asset.content}</Text>
                </View>
              ))}
            </View>
          </SubscriptionGate>
        ) : null}
          <View style={styles.resultsSection}>
            <Text style={styles.sectionTitle}>Generated Assets</Text>
            {generatedAssets.map((asset) => (
              <View key={asset.id} style={styles.assetCard}>
                <View style={styles.assetHeader}>
                  <View style={styles.assetInfo}>
                    <Text style={styles.assetType}>{asset.type.toUpperCase()}</Text>
                    <Text style={styles.assetBusinessType}>
                      {businessTypes.find(bt => bt.id === asset.businessType)?.name}
                    </Text>
                  </View>
                  <View style={styles.assetActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => shareAsset(asset.content)}
                    >
                      <Share2 size={16} color={Colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <Text style={styles.assetContent}>{asset.content}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Business Tips</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>💡 Start Small, Think Big</Text>
            <Text style={styles.tipContent}>
              Begin with a minimal viable product (MVP) to test your market before scaling up.
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>📱 Leverage Social Media</Text>
            <Text style={styles.tipContent}>
              Use platforms like WhatsApp Business, Instagram, and Facebook to reach your audience.
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>🤝 Build Community</Text>
            <Text style={styles.tipContent}>
              Focus on building relationships with customers and other local businesses.
            </Text>
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
  description: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    lineHeight: 22,
  },
  usageIndicator: {
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
  },
  usageText: {
    fontSize: 14,
    fontFamily: Fonts.semibold,
    color: Colors.text,
    marginBottom: 4,
  },
  upgradePrompt: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.secondary,
  },
  businessTypeSelector: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.semibold,
    color: Colors.text,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  businessTypeList: {
    paddingHorizontal: 20,
  },
  businessTypeCard: {
    alignItems: 'center',
    padding: 16,
    marginRight: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    minWidth: 100,
  },
  selectedBusinessType: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  businessTypeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  businessTypeName: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
    textAlign: 'center',
  },
  selectedBusinessTypeText: {
    color: Colors.background,
  },
  assetTypeSelector: {
    marginBottom: 20,
  },
  assetTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  assetTypeCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  selectedAssetType: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  assetTypeName: {
    fontSize: 14,
    fontFamily: Fonts.semibold,
    color: Colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  selectedAssetTypeText: {
    color: Colors.background,
  },
  assetTypeDescription: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  selectedAssetTypeDescText: {
    color: Colors.background + 'CC',
  },
  inputSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  textInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.text,
    textAlignVertical: 'top',
    minHeight: 120,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 12,
  },
  disabledButton: {
    backgroundColor: Colors.textSecondary,
  },
  generateButtonText: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
    color: Colors.background,
    marginLeft: 8,
  },
  resultsSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  assetCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  assetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  assetInfo: {
    flex: 1,
  },
  assetType: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  assetBusinessType: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
  },
  assetActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    backgroundColor: Colors.background,
    borderRadius: 8,
  },
  assetContent: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.text,
    lineHeight: 24,
  },
  tipsSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  tipCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
  },
  tipTitle: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
    color: Colors.text,
    marginBottom: 8,
  },
  tipContent: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});