import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Crown, Check, Star, Zap, Shield, Infinity } from 'lucide-react-native';
import { Header } from '@/components/common/Header';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

const subscriptionPlans = [
  {
    id: 'basic',
    name: 'Basic',
    price: '$4.99',
    period: 'month',
    color: Colors.secondary,
    icon: Star,
    popular: false,
    features: [
      '50 AI explanations per month',
      'Basic language support',
      'Standard response time',
      'Email support',
      'Basic skill guides',
    ],
    limitations: [
      'Limited cultural content',
      'No offline access',
      'Basic business tools',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$9.99',
    period: 'month',
    color: Colors.primary,
    icon: Crown,
    popular: true,
    features: [
      'Unlimited AI explanations',
      'All African languages',
      'Priority response time',
      'Advanced skill guides',
      'Business asset generation',
      'Cultural content library',
      'Offline access',
      'Priority support',
    ],
    limitations: [],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$19.99',
    period: 'month',
    color: Colors.accent,
    icon: Infinity,
    popular: false,
    features: [
      'Everything in Pro',
      'Personal AI tutor',
      'Custom business plans',
      'Advanced analytics',
      'White-label options',
      'API access',
      'Dedicated support',
      'Early feature access',
    ],
    limitations: [],
  },
];

const yearlyDiscount = 0.2; // 20% discount for yearly

export default function SubscriptionScreen() {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [isYearly, setIsYearly] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);

  const calculateYearlyPrice = (monthlyPrice: string) => {
    const monthly = parseFloat(monthlyPrice.replace('$', ''));
    const yearly = monthly * 12 * (1 - yearlyDiscount);
    return `$${yearly.toFixed(2)}`;
  };

  const handleSubscribe = async (planId: string) => {
    // This will be implemented with RevenueCat
    Alert.alert(
      'Subscription',
      `This will integrate with RevenueCat when exported to a local development environment. Selected plan: ${planId} (${isYearly ? 'Yearly' : 'Monthly'})`
    );
  };

  const handleRestorePurchases = async () => {
    // RevenueCat restore purchases
    Alert.alert('Restore Purchases', 'This will restore purchases via RevenueCat');
  };

  return (
    <ScrollView style={styles.container}>
      <Header title="Subscription" />
      
      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Crown size={48} color={Colors.primary} />
          <Text style={styles.title}>Unlock Your Full Potential</Text>
          <Text style={styles.subtitle}>
            Get unlimited access to AI-powered learning, business tools, and cultural content
          </Text>
        </View>

        <View style={styles.billingToggle}>
          <TouchableOpacity
            style={[styles.toggleOption, !isYearly && styles.activeToggle]}
            onPress={() => setIsYearly(false)}
          >
            <Text style={[styles.toggleText, !isYearly && styles.activeToggleText]}>
              Monthly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleOption, isYearly && styles.activeToggle]}
            onPress={() => setIsYearly(true)}
          >
            <Text style={[styles.toggleText, isYearly && styles.activeToggleText]}>
              Yearly
            </Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>Save 20%</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.plansContainer}>
          {subscriptionPlans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.selectedPlan,
                plan.popular && styles.popularPlan,
              ]}
              onPress={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Star size={16} color={Colors.background} />
                  <Text style={styles.popularText}>Most Popular</Text>
                </View>
              )}

              <View style={styles.planHeader}>
                <View style={[styles.planIcon, { backgroundColor: plan.color + '20' }]}>
                  <plan.icon size={32} color={plan.color} />
                </View>
                <Text style={styles.planName}>{plan.name}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>
                    {isYearly ? calculateYearlyPrice(plan.price) : plan.price}
                  </Text>
                  <Text style={styles.period}>
                    /{isYearly ? 'year' : plan.period}
                  </Text>
                </View>
                {isYearly && (
                  <Text style={styles.monthlyEquivalent}>
                    ${(parseFloat(calculateYearlyPrice(plan.price).replace('$', '')) / 12).toFixed(2)}/month
                  </Text>
                )}
              </View>

              <View style={styles.featuresContainer}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Check size={16} color={Colors.success} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              {selectedPlan === plan.id && (
                <TouchableOpacity
                  style={[styles.subscribeButton, { backgroundColor: plan.color }]}
                  onPress={() => handleSubscribe(plan.id)}
                >
                  <Text style={styles.subscribeButtonText}>
                    {currentSubscription ? 'Switch Plan' : 'Subscribe Now'}
                  </Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.benefitsSection}>
          <Text style={styles.benefitsTitle}>Why Choose AfriGenius Pro?</Text>
          
          <View style={styles.benefitItem}>
            <Zap size={24} color={Colors.primary} />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Unlimited AI Learning</Text>
              <Text style={styles.benefitDescription}>
                Get unlimited explanations in multiple African languages with advanced AI models
              </Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <Shield size={24} color={Colors.secondary} />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Business Growth Tools</Text>
              <Text style={styles.benefitDescription}>
                Generate business names, marketing content, and growth strategies tailored for African markets
              </Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <Crown size={24} color={Colors.accent} />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Cultural Heritage Access</Text>
              <Text style={styles.benefitDescription}>
                Explore rich African cultures with comprehensive content, audio, and interactive experiences
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footerSection}>
          <TouchableOpacity style={styles.restoreButton} onPress={handleRestorePurchases}>
            <Text style={styles.restoreButtonText}>Restore Purchases</Text>
          </TouchableOpacity>
          
          <Text style={styles.termsText}>
            By subscribing, you agree to our Terms of Service and Privacy Policy. 
            Subscriptions auto-renew unless cancelled 24 hours before the end of the current period.
          </Text>
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
  headerSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: Colors.text,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  billingToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    position: 'relative',
  },
  activeToggle: {
    backgroundColor: Colors.primary,
  },
  toggleText: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
    color: Colors.textSecondary,
  },
  activeToggleText: {
    color: Colors.background,
  },
  discountBadge: {
    position: 'absolute',
    top: -8,
    right: 8,
    backgroundColor: Colors.success,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  discountText: {
    fontSize: 10,
    fontFamily: Fonts.bold,
    color: Colors.background,
  },
  plansContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  planCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
  },
  selectedPlan: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '05',
  },
  popularPlan: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '08',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    left: 20,
    right: 20,
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  popularText: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    color: Colors.background,
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  planIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  planName: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 32,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  period: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
  },
  monthlyEquivalent: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  featuresContainer: {
    gap: 12,
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.text,
    flex: 1,
  },
  subscribeButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  subscribeButtonText: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.background,
  },
  benefitsSection: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  benefitsTitle: {
    fontSize: 22,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    gap: 16,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 18,
    fontFamily: Fonts.semibold,
    color: Colors.text,
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  footerSection: {
    paddingHorizontal: 20,
    paddingTop: 30,
    alignItems: 'center',
  },
  restoreButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  restoreButtonText: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
    color: Colors.primary,
  },
  termsText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});