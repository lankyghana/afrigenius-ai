# AfriGenius AI 🌍🎓

[![GitHub Repository](https://img.shields.io/badge/GitHub-afrigenius--ai-blue?logo=github)](https://github.com/lankyghana/afrigenius-ai)
[![Platform](https://img.shields.io/badge/Platform-React%20Native-blue?logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2053-000020?logo=expo)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

AfriGenius AI is an innovative African-themed educational platform that leverages artificial intelligence to provide personalized learning experiences. Built with React Native and Expo, the app offers AI-powered explanations, cultural context, and skill development tools designed specifically for African learners.

## 🔗 Repository

**GitHub**: [https://github.com/lankyghana/afrigenius-ai](https://github.com/lankyghana/afrigenius-ai)

## 🌟 Features

### 🎓 AI-Powered Learning
- **Smart Explanations**: Get detailed explanations on any topic using advanced AI models
- **Multiple AI Models**: Choose from GPT-4, Claude, Gemini, and more
- **Multi-language Support**: Learn in English, French, Arabic, and local African languages
- **Subject Specialization**: Focused learning paths for Mathematics, Science, English, and more

### 🎨 Beautiful African-Themed Design
- **Cultural Aesthetics**: Warm earth tones inspired by African landscapes
- **Dark/Light Themes**: Comprehensive theming system with smooth transitions
- **Responsive Design**: Optimized for both mobile and web platforms
- **Accessibility**: High contrast ratios and inclusive design principles

### 🚀 Modern Architecture
- **React Native + Expo**: Cross-platform mobile development
- **TypeScript**: Type-safe development with excellent IDE support
- **Context API**: Efficient state management for themes and user data
- **Modular Components**: Reusable and maintainable component architecture

### 💡 Enhanced Features
- **Usage Tracking**: Monitor your learning progress and API usage
- **Offline Storage**: Save your learning history and preferences locally
- **Subscription System**: Premium features with usage limits
- **Speech Synthesis**: Listen to explanations with text-to-speech
- **Content Sharing**: Share learning content with others

## 🛠️ Technology Stack

- **Frontend**: React Native, Expo SDK 53
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **Styling**: StyleSheet with dynamic theming
- **State Management**: React Context API
- **Storage**: AsyncStorage for local data persistence
- **AI Integration**: Alle AI API with multiple model support
- **Icons**: Lucide React Native
- **Development**: Metro bundler, Expo CLI

## 📱 Supported Platforms

- ✅ iOS (via Expo Go or development build)
- ✅ Android (via Expo Go or development build)
- ✅ Web (Progressive Web App)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/lankyghana/afrigenius-ai.git
   cd afrigenius-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_ALLE_AI_API_KEY=your_alle_ai_api_key_here
   ```
   
   Get your API key from [Alle AI](https://alle-ai.com) and replace `your_alle_ai_api_key_here`.

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on your preferred platform**
   - **iOS**: Press `i` in the terminal or scan QR code with Camera app
   - **Android**: Press `a` in the terminal or scan QR code with Expo Go
   - **Web**: Press `w` in the terminal or open `http://localhost:8081`

## 📁 Project Structure

```
afrigenius-ai/
├── app/                    # Main application screens
│   ├── (tabs)/            # Tab-based navigation screens
│   │   ├── index.tsx      # Learn Smart (main learning screen)
│   │   ├── enhance.tsx    # Prompt Enhancement
│   │   ├── skills.tsx     # Skill Development
│   │   ├── culture.tsx    # Cultural Learning
│   │   ├── hustle.tsx     # Entrepreneurship
│   │   └── subscription.tsx # Subscription management
│   ├── auth/              # Authentication screens
│   ├── _layout.tsx        # Root layout with theme provider
│   └── +not-found.tsx     # 404 error page
├── components/            # Reusable UI components
│   ├── common/           # Generic components
│   │   ├── Header.tsx    # App header with theme toggle
│   │   ├── AIModelSelector.tsx
│   │   ├── LanguageSelector.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ...
│   └── subscription/     # Subscription-specific components
├── constants/            # App constants
│   ├── Colors.ts         # Comprehensive theme colors
│   └── Fonts.ts          # Typography definitions
├── contexts/             # React contexts
│   └── ThemeContext.tsx  # Theme management
├── services/             # External service integrations
│   ├── api.ts           # Alle AI API integration
│   ├── storage.ts       # Local storage utilities
│   └── subscription.ts  # Subscription logic
├── types/               # TypeScript type definitions
└── hooks/               # Custom React hooks
```

## 🎨 Theming System

AfriGenius AI features a comprehensive theming system inspired by African aesthetics:

### Color Palette
- **Primary**: Warm terracotta (#CD7F32)
- **Secondary**: Deep forest green (#228B22)
- **Accent**: Golden yellow (#DAA520)
- **Earth Tones**: Sahara sand, baobab brown, sunset orange
- **Natural Colors**: Acacia green, elephant gray, ivory white

### Theme Features
- ✅ Light and dark mode support
- ✅ Dynamic color adaptation
- ✅ Consistent shadows and elevations
- ✅ Accessibility-compliant contrast ratios
- ✅ Smooth theme transitions
- ✅ Persistent theme preferences

## 🤖 AI Integration

### Supported AI Models
- **GPT-4**: OpenAI's most advanced model
- **Claude**: Anthropic's conversational AI
- **Gemini**: Google's multimodal AI
- **GPT-3.5**: Faster responses for quick queries

### API Features
- ✅ Structured prompt enhancement
- ✅ Multi-language support
- ✅ Cultural context awareness
- ✅ Educational content optimization
- ✅ Error handling and retry logic
- ✅ Usage tracking and analytics

## 🏗️ Development

### Code Style
- ESLint and Prettier for code formatting
- TypeScript for type safety
- Functional components with hooks
- Modular component architecture

### Available Scripts
- `npm start` - Start Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run on web browser
- `npm run reset-project` - Reset project cache

### Building for Production
```bash
# Build for production
npx expo build

# Create development build
npx expo install --fix
npx expo run:android
npx expo run:ios
```

## 🔧 Configuration

### Expo Configuration (`app.json`)
```json
{
  "expo": {
    "name": "AfriGenius AI",
    "slug": "afrigenius-ai",
    "version": "1.0.0",
    "platforms": ["ios", "android", "web"],
    "userInterfaceStyle": "automatic"
  }
}
```

### Environment Variables
- `EXPO_PUBLIC_ALLE_AI_API_KEY` - Your Alle AI API key

## 🤝 Contributing

We welcome contributions to AfriGenius AI! Please follow these steps:

1. **Fork the repository**
   ```bash
   git clone https://github.com/lankyghana/afrigenius-ai.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```

4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Maintain component modularity
- Add proper documentation
- Test on multiple platforms
- Respect the African theme aesthetic

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Alle AI** for providing excellent AI API services
- **Expo Team** for the amazing development platform
- **React Native Community** for continuous innovation
- **African Developers** for inspiration and cultural insights
- **Open Source Contributors** who make projects like this possible

## 📞 Support & Contact

### Getting Help
- **GitHub Issues**: [Report bugs or request features](https://github.com/lankyghana/afrigenius-ai/issues)
- **Discussions**: [Community discussions](https://github.com/lankyghana/afrigenius-ai/discussions)
- **Wiki**: [Documentation wiki](https://github.com/lankyghana/afrigenius-ai/wiki)

### Contact Information
- **Project Maintainer**: [lankyghana](https://github.com/lankyghana)
- **Email**: support@afrigenius.ai

## 🗺️ Roadmap

### Phase 1: Foundation ✅ (Completed)
- ✅ Core learning functionality
- ✅ AI integration with multiple models
- ✅ Comprehensive theming system
- ✅ Cross-platform support
- ✅ Basic user interface

### Phase 2: Enhancement 🔄 (In Progress)
- 🔄 Voice input/output features
- 🔄 Offline learning capabilities
- 🔄 Advanced user profiles
- 🔄 Learning progress tracking
- 🔄 Enhanced AI prompt optimization

### Phase 3: Community 📅 (Q2 2025)
- 📅 User authentication system
- 📅 Learning community features
- 📅 Content sharing and collaboration
- 📅 Teacher/student portals
- 📅 Advanced analytics dashboard

---

## 🌍 Vision Statement

**"Empowering African minds through AI-driven education, celebrating our rich cultural heritage while building bridges to global knowledge."**

AfriGenius AI is more than just an educational app—it's a movement to democratize quality education across Africa, honoring our traditions while embracing technological advancement.

### Our Mission
- 🎓 **Democratize Education**: Make quality AI-powered learning accessible to every African student
- 🌍 **Cultural Preservation**: Integrate African values, languages, and perspectives into modern education
- 🚀 **Innovation Leadership**: Position Africa as a leader in educational technology and AI
- 🤝 **Community Building**: Foster a supportive learning community that transcends geographical boundaries

---

**Built with ❤️ for African learners, by African developers**

*"Ubuntu: I am because we are - Together we learn, together we grow"*
