import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Lock, Crown } from 'lucide-react-native';
import { PaywallModal } from './PaywallModal';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

interface SubscriptionGateProps {
  children: React.ReactNode;
  feature: string;
  title?: string;
  description?: string;
  isSubscribed?: boolean;
  onSubscribe?: (planId: string) => void;
}

export function SubscriptionGate({ 
  children, 
  feature, 
  title, 
  description, 
  isSubscribed = false,
  onSubscribe = () => {}
}: SubscriptionGateProps) {
  const [showPaywall, setShowPaywall] = useState(false);

  if (isSubscribed) {
    return <>{children}</>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.gateContent}>
        <View style={styles.iconContainer}>
          <Lock size={32} color={Colors.textSecondary} />
        </View>
        
        <Text style={styles.gateTitle}>Premium Feature</Text>
        <Text style={styles.gateDescription}>
          {description || `Upgrade to access ${feature} and unlock all premium features`}
        </Text>
        
        <TouchableOpacity 
          style={styles.upgradeButton}
          onPress={() => setShowPaywall(true)}
        >
          <Crown size={20} color={Colors.background} />
          <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
        </TouchableOpacity>
      </View>

      <PaywallModal
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        onSubscribe={onSubscribe}
        feature={feature}
        title={title}
        description={description}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  gateContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: Colors.surface,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  gateTitle: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  gateDescription: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 8,
  },
  upgradeButtonText: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.background,
  },
});