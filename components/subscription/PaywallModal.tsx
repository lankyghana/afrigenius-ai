import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { X, Crown, Star, Zap } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  onSubscribe: (planId: string) => void;
  feature?: string;
  title?: string;
  description?: string;
}

const quickPlans = [
  {
    id: 'pro',
    name: 'Pro Monthly',
    price: '$9.99',
    period: 'month',
    color: Colors.primary,
    icon: Crown,
    features: ['Unlimited AI explanations', 'All languages', 'Business tools', 'Cultural content'],
  },
  {
    id: 'pro-yearly',
    name: 'Pro Yearly',
    price: '$95.99',
    period: 'year',
    color: Colors.secondary,
    icon: Star,
    features: ['Everything in Pro', '20% savings', 'Priority support', 'Early access'],
    savings: 'Save $23.89',
  },
];

export function PaywallModal({ 
  visible, 
  onClose, 
  onSubscribe, 
  feature = 'this feature',
  title = 'Upgrade to Continue',
  description = 'Unlock unlimited access to all AfriGenius features'
}: PaywallModalProps) {
  const [selectedPlan, setSelectedPlan] = useState('pro');

  const handleSubscribe = () => {
    onSubscribe(selectedPlan);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.heroSection}>
            <View style={styles.iconContainer}>
              <Crown size={48} color={Colors.primary} />
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
            
            <View style={styles.featureHighlight}>
              <Zap size={20} color={Colors.warning} />
              <Text style={styles.featureText}>
                You've reached the limit for {feature}
              </Text>
            </View>
          </View>

          <View style={styles.plansSection}>
            <Text style={styles.plansTitle}>Choose Your Plan</Text>
            
            {quickPlans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planOption,
                  selectedPlan === plan.id && styles.selectedPlanOption,
                ]}
                onPress={() => setSelectedPlan(plan.id)}
              >
                <View style={styles.planHeader}>
                  <View style={[styles.planIconSmall, { backgroundColor: plan.color + '20' }]}>
                    <plan.icon size={24} color={plan.color} />
                  </View>
                  <View style={styles.planInfo}>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <View style={styles.priceRow}>
                      <Text style={styles.planPrice}>{plan.price}</Text>
                      <Text style={styles.planPeriod}>/{plan.period}</Text>
                      {plan.savings && (
                        <View style={styles.savingsBadge}>
                          <Text style={styles.savingsText}>{plan.savings}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={[
                    styles.radioButton,
                    selectedPlan === plan.id && styles.selectedRadio,
                  ]}>
                    {selectedPlan === plan.id && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                </View>

                <View style={styles.planFeatures}>
                  {plan.features.map((feature, index) => (
                    <Text key={index} style={styles.planFeature}>• {feature}</Text>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.benefitsSection}>
            <Text style={styles.benefitsTitle}>What You'll Get:</Text>
            <View style={styles.benefitsList}>
              <Text style={styles.benefit}>✨ Unlimited AI-powered explanations</Text>
              <Text style={styles.benefit}>🌍 Support for all African languages</Text>
              <Text style={styles.benefit}>💼 Advanced business tools & generators</Text>
              <Text style={styles.benefit}>🎨 Complete cultural content library</Text>
              <Text style={styles.benefit}>📱 Offline access to all content</Text>
              <Text style={styles.benefit}>🚀 Priority customer support</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
            <Text style={styles.subscribeButtonText}>Start Free Trial</Text>
          </TouchableOpacity>
          
          <Text style={styles.trialText}>
            7-day free trial, then {quickPlans.find(p => p.id === selectedPlan)?.price}/{quickPlans.find(p => p.id === selectedPlan)?.period}
          </Text>
          
          <Text style={styles.termsText}>
            Cancel anytime. Terms apply.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: Colors.primary + '20',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  featureHighlight: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warning + '20',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.warning,
  },
  plansSection: {
    paddingVertical: 30,
  },
  plansTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  planOption: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  selectedPlanOption: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '05',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  planIconSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 18,
    fontFamily: Fonts.semibold,
    color: Colors.text,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planPrice: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  planPeriod: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
  },
  savingsBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  savingsText: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    color: Colors.background,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadio: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  planFeatures: {
    gap: 4,
  },
  planFeature: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  benefitsSection: {
    paddingBottom: 20,
  },
  benefitsTitle: {
    fontSize: 18,
    fontFamily: Fonts.semibold,
    color: Colors.text,
    marginBottom: 16,
  },
  benefitsList: {
    gap: 8,
  },
  benefit: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.text,
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  subscribeButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  subscribeButtonText: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.background,
  },
  trialText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  termsText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});