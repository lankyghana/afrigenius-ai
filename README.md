# AfriGenius AI - COMPSSA x Alle AI Hackathon Project

## 🌍 Project Overview

AfriGenius AI is an advanced AI-powered educational platform designed specifically for African learners and entrepreneurs. Built for the COMPSSA x Alle AI Hackathon, it leverages cutting-edge AI models to provide culturally relevant explanations, business tools, and learning resources tailored to African contexts and languages.

## ✨ Key Features

### 🎓 **Smart Learning Module**
- **AI-Powered Explanations:** Get clear, practical, and culturally relevant answers for academic topics
- **Subject Selection:** Mathematics, Science, English, Geography, and custom topics
- **Multi-Model Support:** Choose from GPT-4, Claude 3.5, DeepSeek V2, and Owen 2.5
- **Language Support:** English, Twi, Yoruba, Swahili, French, and more African languages
- **Voice & Sharing:** Listen to AI responses or share them easily

### 🚀 **Prompt Enhancement Tool**
- **Advanced Prompt Engineering:** Enhance your prompts for better AI responses
- **Quality Analysis:** Get quality scores and improvement suggestions
- **Multi-Model Enhancement:** Use different AI models for prompt optimization
- **Real-time Feedback:** Instant analysis of prompt clarity, specificity, and actionability

### 💼 **Business Asset Generator**
- **Business Names:** Generate culturally appropriate business names for African markets
- **Taglines & Descriptions:** Create compelling marketing content
- **Social Media Content:** Generate platform-specific marketing materials
- **African Market Focus:** All content optimized for African business contexts

### 🎨 **Cultural Explorer**
- **African Heritage:** Explore rich African cultural traditions and history
- **Interactive Learning:** Ask questions about African cultures, languages, and customs
- **Visual Content:** Image and multimedia support for cultural learning

### 🛡️ **Premium Features**
- **Subscription System:** Free tier with limited access, premium for unlimited usage
- **History Tracking:** Save and review all your learning sessions
- **Advanced Analytics:** Detailed insights into your learning progress

## 🛠️ Technical Stack

- **Framework:** React Native with Expo Router (SDK 53)
- **Language:** TypeScript/JavaScript
- **AI Integration:** Alle AI API with multiple model support
- **UI/UX:** Custom responsive design with modern African-inspired aesthetics
- **State Management:** React Context API and hooks
- **Storage:** AsyncStorage for offline capabilities
- **Platforms:** Web, Android (iOS ready)
- **Authentication:** Custom authentication system

## 🔧 API Integration

### Alle AI Integration
- **Base URL:** `https://api.alle-ai.com/api/v1`
- **Authentication:** X-API-KEY header
- **Models Supported:**
  - GPT-4o (mapped from gpt-4)
  - Claude 3.5 Sonnet
  - DeepSeek R1
  - Gemini Pro

### Environment Setup
Create a `.env` file in the root directory:
```
EXPO_PUBLIC_ALLE_AI_API_KEY=your_api_key_here
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Android Studio (for Android development)
- Expo CLI
- Alle AI API key

### Installation
```bash
# Clone the repository
git clone [repository-url]
cd AfriGenius-AI

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running the App

#### Web Development
```bash
npx expo start --web
# Opens at http://localhost:8081
```

#### Android Development
```bash
npx expo start --android
# Requires Android Studio emulator or physical device
```

#### iOS Development
```bash
npx expo start --ios
# Requires Xcode (macOS only)
```

## 📁 Project Structure

```
AfriGenius AI/
├── app/                    # Main application screens
│   ├── (tabs)/            # Tab-based navigation screens
│   │   ├── index.tsx      # Smart Learning module
│   │   ├── enhance.tsx    # Prompt Enhancement tool
│   │   ├── hustle.tsx     # Business Asset generator
│   │   ├── culture.tsx    # Cultural Explorer
│   │   ├── skills.tsx     # Skills Learning
│   │   └── subscription.tsx # Premium features
│   ├── _layout.tsx        # Root layout with navigation
│   └── auth/              # Authentication screens
├── components/            # Reusable UI components
│   ├── common/           # Shared components
│   └── subscription/     # Premium feature components
├── services/             # API and business logic
│   ├── api.ts           # Alle AI integration
│   ├── storage.ts       # Local storage management
│   └── subscription.ts  # Premium feature logic
├── constants/           # App constants (colors, fonts)
├── contexts/            # React Context providers
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
└── assets/              # Images, icons, and media
```

## 🎯 How to Use

### Smart Learning
1. Navigate to the "Learn Smart" tab
2. Select your subject (Math, Science, English, Geography)
3. Choose your preferred AI model
4. Select your language
5. Ask any academic question
6. Get instant, culturally relevant explanations

### Prompt Enhancement
1. Go to the "Enhance" tab
2. Enter your original prompt
3. Select AI models for enhancement (up to 2)
4. Click "Enhance Prompt"
5. Review the enhanced version with quality metrics

### Business Tools
1. Visit the "Hustle" tab
2. Choose asset type (name, tagline, description, marketing)
3. Enter your business details
4. Get AI-generated business assets optimized for African markets

## 🔍 Debugging & Troubleshooting

### Common Issues
1. **White Screen on Web:** Ensure expo-router is properly configured
2. **API Errors:** Check your Alle AI API key in the `.env` file
3. **Build Failures:** Clear cache with `npx expo start --clear`

### Debug Logging
The app includes comprehensive logging for API calls. Check browser console (web) or Metro logs for detailed debug information.

## 👥 Team

- **Daniel Kwadwo Takyi** - Lead Developer
- **Abena Boah** - Co-Developer

## 🏆 Hackathon Information

**COMPSSA x Alle AI Hackathon**
- Event: [Hackathon Details](https://valuable-shadow-830.notion.site/compssa-x-alle-ai-hackathon)
- Focus: AI-powered solutions for African education and business

## 🌟 Recent Updates

### Version 2.0 Features
- ✅ Fixed white screen issues on web
- ✅ Integrated Alle AI API with proper authentication
- ✅ Added prompt enhancement functionality
- ✅ Improved error handling and fallbacks
- ✅ Enhanced UI/UX with responsive design
- ✅ Added comprehensive logging and debugging
- ✅ Implemented quality analysis for enhanced prompts

## 📄 License

This project is developed for educational and hackathon purposes. Please respect the terms of use for the Alle AI API and other integrated services.

## 🤝 Contributing

This is a hackathon project, but we welcome feedback and suggestions for future improvements!

---

**Built with ❤️ for Africa by African developers**
