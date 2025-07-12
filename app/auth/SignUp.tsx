import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Switch, Alert, KeyboardTypeOptions } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

type Question = {
  key: string;
  label: string;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
};

const questions: Question[] = [
  { key: 'fullName', label: 'Full Name', placeholder: 'Enter your full name' },
  { key: 'age', label: 'Age', placeholder: 'Enter your age', keyboardType: 'numeric' },
  { key: 'country', label: 'Country', placeholder: 'Enter your country' },
  { key: 'interests', label: 'Interests', placeholder: 'What are your interests?' },
  { key: 'learningGoals', label: 'Learning Goals', placeholder: 'What do you want to achieve?' },
];

type FormState = {
  email: string;
  password: string;
  fullName: string;
  age: string;
  country: string;
  interests: string;
  learningGoals: string;
  [key: string]: string;
};

export default function SignUpScreen({ navigation }: any) {
  const [form, setForm] = useState<FormState>({
    email: '',
    password: '',
    fullName: '',
    age: '',
    country: '',
    interests: '',
    learningGoals: '',
  });
  const [agree, setAgree] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSignUp = () => {
    if (!form.email || !form.password) {
      Alert.alert('Error', 'Email and password are required.');
      return;
    }
    // Add more validation as needed
    // Save user profile and navigate to main app
    Alert.alert('Success', 'Account created!');
    navigation.replace('Main');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={Colors.textSecondary}
        value={form.email}
        onChangeText={text => handleChange('email', text)}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={Colors.textSecondary}
        value={form.password}
        onChangeText={text => handleChange('password', text)}
        secureTextEntry
      />
      {questions.map(q => (
        <TextInput
          key={q.key}
          style={styles.input}
          placeholder={q.placeholder}
          placeholderTextColor={Colors.textSecondary}
          value={form[q.key]}
          onChangeText={text => handleChange(q.key, text)}
          keyboardType={q.keyboardType || 'default'}
        />
      ))}
      <View style={styles.agreeRow}>
        <Switch value={agree} onValueChange={setAgree} thumbColor={agree ? Colors.primary : Colors.border} />
        <Text style={styles.agreeText}>I agree to the Terms and Privacy Policy</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={!agree}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 24 },
  title: { fontSize: 28, fontFamily: Fonts.bold, color: Colors.primary, marginBottom: 24, textAlign: 'center' },
  input: { backgroundColor: Colors.surface, borderRadius: 8, padding: 14, fontSize: 16, fontFamily: Fonts.regular, color: Colors.text, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  agreeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  agreeText: { marginLeft: 12, color: Colors.textSecondary, fontFamily: Fonts.regular },
  button: { backgroundColor: Colors.primary, borderRadius: 8, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { color: Colors.background, fontSize: 18, fontFamily: Fonts.bold },
});
