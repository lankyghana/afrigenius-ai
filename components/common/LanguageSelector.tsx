import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Languages, ChevronDown, ChevronUp } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  available: boolean;
}

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageSelect: (languageCode: string) => void;
  languages: Language[];
}

export function LanguageSelector({ selectedLanguage, onLanguageSelect, languages }: LanguageSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const selectedLanguageData = languages.find(lang => lang.code === selectedLanguage);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View style={styles.selectorLeft}>
          <Languages size={20} color={Colors.secondary} />
          <View style={styles.selectorText}>
            <Text style={styles.selectorTitle}>Language</Text>
            <Text style={styles.selectorSubtitle}>
              {selectedLanguageData?.flag} {selectedLanguageData?.name || 'Select Language'}
            </Text>
          </View>
        </View>
        
        {isExpanded ? (
          <ChevronUp size={20} color={Colors.textSecondary} />
        ) : (
          <ChevronDown size={20} color={Colors.textSecondary} />
        )}
      </TouchableOpacity>

      {isExpanded && (
        <ScrollView style={styles.dropdown} showsVerticalScrollIndicator={false}>
          {languages.map((language) => (
            <TouchableOpacity
              key={language.code}
              style={[
                styles.languageOption,
                selectedLanguage === language.code && styles.selectedOption,
                !language.available && styles.unavailableOption,
              ]}
              onPress={() => {
                if (language.available) {
                  onLanguageSelect(language.code);
                  setIsExpanded(false);
                }
              }}
              disabled={!language.available}
            >
              <View style={styles.languageInfo}>
                <Text style={styles.flag}>{language.flag}</Text>
                <View style={styles.languageText}>
                  <Text style={[
                    styles.languageName,
                    selectedLanguage === language.code && styles.selectedText,
                    !language.available && styles.unavailableText,
                  ]}>
                    {language.name}
                  </Text>
                  <Text style={[
                    styles.nativeName,
                    !language.available && styles.unavailableText,
                  ]}>
                    {language.nativeName}
                  </Text>
                </View>
              </View>
              
              {!language.available && (
                <Text style={styles.unavailableLabel}>Coming Soon</Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectorText: {
    marginLeft: 12,
    flex: 1,
  },
  selectorTitle: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
  },
  selectorSubtitle: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
    color: Colors.text,
    marginTop: 2,
  },
  dropdown: {
    maxHeight: 200,
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 8,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  selectedOption: {
    backgroundColor: Colors.secondary + '10',
  },
  unavailableOption: {
    opacity: 0.5,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageText: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
    color: Colors.text,
  },
  selectedText: {
    color: Colors.secondary,
  },
  unavailableText: {
    color: Colors.textSecondary,
  },
  nativeName: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  unavailableLabel: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
});