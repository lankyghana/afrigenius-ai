import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.afrigenius.ai';
const ALLE_AI_API_URL = 'https://api.alle-ai.com/api/v1';
const ALLE_AI_API_KEY = process.env.EXPO_PUBLIC_ALLE_AI_API_KEY || 'alle-OwXvocj6Hw1AYHSdG1Dx7WR2rO9QfrYYko8E';

export class ApiService {
  private static async getHeaders() {
    const token = await AsyncStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      'X-API-Key': ALLE_AI_API_KEY || '',
    };
  }

  private static async getAlleAIHeaders() {
    return {
      'Content-Type': 'application/json',
      'X-API-KEY': ALLE_AI_API_KEY,
    };
  }

  static async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = await this.getHeaders();
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Alle AI API Integration
  static async alleAIRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${ALLE_AI_API_URL}${endpoint}`;
    const headers = await this.getAlleAIHeaders();
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Alle AI API Error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  // Enhanced Prompt Enhancement using Alle AI
  static async enhancePrompt(prompt: string, models: string[], options: any = {}) {
    try {
      console.log('Starting prompt enhancement with Alle AI...');
      console.log('Original prompt:', prompt);
      console.log('Selected models:', models);

      // Map our model names to Alle AI model names
      const modelMapping = {
        'gpt-4': 'gpt-4o',
        'claude-3.5': 'claude-3-5-sonnet-20241022',
        'deepseek-v2': 'deepseek-r1',
        'owen-2.5': 'gpt-4o', // Fallback to GPT-4o if Owen not available
      };

      const alleModels = models.map(model => (modelMapping as Record<string, string>)[model] || 'gpt-4o');
      console.log('Mapped models for Alle AI:', alleModels);

      const requestBody = {
        models: alleModels,
        messages: [
          {
            "user": [
              {
                "type": "text",
                "text": `You are an expert prompt engineer. Your task is to enhance the given prompt to make it more effective, clear, and actionable. 

Guidelines for enhancement:
1. Add specificity and clarity
2. Include requests for examples and step-by-step explanations
3. Improve structure and flow
4. Make the prompt more actionable
5. Consider the context and intended audience
6. Maintain the original intent while improving effectiveness

Original prompt: "${prompt}"

Please provide an enhanced version of this prompt that follows the guidelines above. Respond with only the enhanced prompt, no additional commentary.`
              }
            ]
          }
        ],
        response_format: {
          type: "text"
        },
        max_tokens: options.maxTokens || 1000,
        temperature: 0.7,
        stream: false
      };

      console.log('API Request body:', JSON.stringify(requestBody, null, 2));

      const response = await this.alleAIRequest('/chat/completions', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      console.log('API Response:', response);

      // Handle the new API response format
      if (response.success && response.responses && response.responses.responses) {
        const firstModel = alleModels[0];
        const modelResponse = response.responses.responses[firstModel];
        
        console.log('Model response for', firstModel, ':', modelResponse);
        
        if (modelResponse && modelResponse.message && modelResponse.message.content) {
          const enhancedPrompt = modelResponse.message.content;
          console.log('Enhanced prompt:', enhancedPrompt);

          // Calculate quality metrics based on enhancement
          const qualityScore = this.calculateQualityScore(prompt, enhancedPrompt);
          const improvements = this.generateImprovements(prompt, enhancedPrompt);
          const analysis = this.analyzePrompt(enhancedPrompt);

          return {
            enhancedPrompt,
            qualityScore,
            improvements,
            analysis,
            model: firstModel,
            originalPrompt: prompt,
          };
        }
      }

      // If no valid response, fallback to mock
      console.warn('Invalid API response format, falling back to mock enhancement');
      throw new Error('Invalid API response format');

    } catch (error) {
      console.error('Alle AI enhancement error:', error);
      // Fallback to mock enhancement if API fails
      return this.getMockEnhancement(prompt, models[0]);
    }
  }

  // Educational Module using Alle AI
  static async generateExplanation(query: string, subject: string, language: string, model: string) {
    try {
      console.log('=== generateExplanation called ===');
      console.log('Query:', query);
      console.log('Subject:', subject);
      console.log('Language:', language);
      console.log('Model:', model);

      const modelMapping = {
        'gpt-4': 'gpt-4',
        'claude-3': 'claude-3-5-sonnet-20241022',
        'gemini': 'gemini-pro',
      };

      const alleModel = (modelMapping as Record<string, string>)[model] || 'gpt-4';
      console.log('Mapped model for Alle AI:', alleModel);

      // Improve prompt specificity
      const systemPrompt = `You are an expert ${subject} tutor specializing in education for African students. Provide detailed, specific explanations with practical examples. Always give concrete, actionable information rather than generic responses. Use real-world examples from African contexts. Respond in ${language === 'en' ? 'English' : language}.`;
      
      const userPrompt = query.toLowerCase().includes('this field') || query.toLowerCase().includes('this subject') 
        ? `Tell me about ${subject} as a field of study. What does it involve, what are the key concepts, career opportunities, and how is it relevant in African contexts?`
        : `I'm studying ${subject} and I need help with: "${query}". Please provide a detailed, specific explanation with practical examples and real-world applications.`;

      console.log('System prompt:', systemPrompt);
      console.log('User prompt:', userPrompt);

      try {
        const response = await this.alleAIRequest('/chat/completions', {
          method: 'POST',
          body: JSON.stringify({
            model: alleModel,
            messages: [
              {
                role: 'system',
                content: systemPrompt
              },
              {
                role: 'user',
                content: userPrompt
              }
            ],
            max_tokens: 1500,
            temperature: 0.7,
          }),
        });

        console.log('Alle AI response:', response);
        const explanation = response.choices?.[0]?.message?.content || 'Unable to generate explanation at this time.';
        console.log('Extracted explanation:', explanation);

        return {
          explanation,
          sources: ['Alle AI Educational Database', 'African Learning Resources'],
          relatedTopics: this.extractRelatedTopics(explanation),
          model: alleModel,
        };
      } catch (error: any) {
        // Log the error for debugging
        console.error('Alle AI API error details:', error);
        console.error('Error message:', error?.message || error);
        throw new Error('Failed to get a response from Alle AI API. Please check your API key, endpoint, and network connection.');
      }

    } catch (error) {
      console.error('Alle AI explanation error:', error);
      // Fallback to mock response
      console.log('Falling back to mock response');
      return this.getMockExplanation(query, subject, language, model);
    }
  }

  // Business Asset Generation using Alle AI
  static async generateBusinessAsset(type: string, businessType: string, description: string) {
    try {
      const prompts = {
        name: `Generate 5 creative and memorable business names for a ${businessType} business. The business description: ${description}. Names should be:
- Easy to pronounce and remember
- Culturally appropriate for African markets
- Professional yet approachable
- Available as domain names (suggest .com alternatives)
- Reflect the business values and mission

Format as a numbered list.`,
        
        tagline: `Create 5 compelling taglines for a ${businessType} business. Business description: ${description}. Taglines should be:
- Memorable and catchy
- Reflect African values and culture
- Under 10 words
- Action-oriented
- Emotionally resonant

Format as a numbered list.`,
        
        description: `Write a comprehensive business description for a ${businessType} business. Details: ${description}. Include:
- Mission and vision
- Target audience
- Unique value proposition
- Services/products offered
- Cultural relevance to African markets
- Competitive advantages

Write in a professional yet approachable tone.`,
        
        marketing: `Create engaging social media content for a ${businessType} business. Business details: ${description}. Include:
- Attention-grabbing headline
- Key benefits
- Call to action
- Relevant hashtags
- Emojis for visual appeal
- Cultural sensitivity

Format for multiple social media platforms.`
      };

      const response = await this.alleAIRequest('/chat/completions', {
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert business consultant specializing in African markets. Create professional, culturally relevant business content that resonates with African entrepreneurs and customers.'
            },
            {
              role: 'user',
              content: (prompts as Record<string, string>)[type] || prompts.description
            }
          ],
          max_tokens: 1000,
          temperature: 0.9,
        }),
      });

      const content = response.choices[0]?.message?.content || 'Unable to generate business asset at this time.';

      return {
        content,
        type,
        businessType,
        suggestions: [
          'Consider local market preferences',
          'Incorporate cultural elements',
          'Focus on community impact',
          'Test with target audience',
        ],
      };

    } catch (error) {
      console.error('Alle AI business asset error:', error);
      return this.getMockBusinessAsset(type, businessType, description);
    }
  }

  // Helper methods for quality analysis
  private static calculateQualityScore(original: string, enhanced: string): number {
    let score = 50; // Base score
    
    // Length improvement
    if (enhanced.length > original.length * 1.2) score += 15;
    
    // Specificity indicators
    const specificityWords = ['specific', 'detailed', 'step-by-step', 'example', 'comprehensive'];
    const specificityCount = specificityWords.filter(word => 
      enhanced.toLowerCase().includes(word)
    ).length;
    score += specificityCount * 5;
    
    // Structure indicators
    if (enhanced.includes('•') || enhanced.includes('-') || enhanced.includes('1.')) score += 10;
    
    // Action words
    const actionWords = ['provide', 'include', 'explain', 'demonstrate', 'show'];
    const actionCount = actionWords.filter(word => 
      enhanced.toLowerCase().includes(word)
    ).length;
    score += actionCount * 3;
    
    return Math.min(100, score);
  }

  private static generateImprovements(original: string, enhanced: string): string[] {
    const improvements = [];
    
    if (enhanced.length > original.length * 1.2) {
      improvements.push('Added specificity and detail');
    }
    
    if (enhanced.toLowerCase().includes('example')) {
      improvements.push('Included request for examples');
    }
    
    if (enhanced.includes('•') || enhanced.includes('-')) {
      improvements.push('Enhanced structure and organization');
    }
    
    if (enhanced.toLowerCase().includes('step')) {
      improvements.push('Added step-by-step guidance');
    }
    
    if (improvements.length === 0) {
      improvements.push('Improved clarity and flow');
    }
    
    return improvements;
  }

  private static analyzePrompt(prompt: string) {
    const wordCount = prompt.split(' ').length;
    const hasStructure = prompt.includes('•') || prompt.includes('-') || prompt.includes('1.');
    const hasExamples = prompt.toLowerCase().includes('example');
    const hasAction = ['provide', 'explain', 'show', 'demonstrate'].some(word => 
      prompt.toLowerCase().includes(word)
    );
    
    return {
      clarity: hasStructure ? 90 : 75,
      specificity: wordCount > 50 ? 85 : 70,
      actionability: hasAction ? 90 : 75,
      engagement: hasExamples ? 85 : 75,
    };
  }

  private static extractRelatedTopics(content: string): string[] {
    // Simple extraction based on common patterns
    const topics: string[] = [];
    const sentences = content.split('.');
    
    sentences.forEach(sentence => {
      if (sentence.toLowerCase().includes('related') || 
          sentence.toLowerCase().includes('similar') ||
          sentence.toLowerCase().includes('also')) {
        // Extract potential topics (simplified)
        const words = sentence.split(' ').filter(word => 
          word.length > 5 && /^[A-Z]/.test(word)
        );
        topics.push(...words.slice(0, 2));
      }
    });
    
    return topics.slice(0, 3);
  }

  // Fallback methods (existing mock implementations)
  static getMockEnhancement(prompt: string, model: string) {
    const enhancements = {
      'gpt-4': {
        enhancedPrompt: `Enhanced version of "${prompt}": Please provide a comprehensive and detailed response that includes specific examples, step-by-step explanations, and practical applications. Consider multiple perspectives and ensure the information is accurate, relevant, and actionable for the intended audience.`,
        qualityScore: 85,
        improvements: [
          'Added specificity and clarity',
          'Included request for examples',
          'Enhanced structure and flow',
          'Improved actionability',
        ],
        analysis: {
          clarity: 85,
          specificity: 80,
          actionability: 90,
          engagement: 85,
        },
      },
      'claude-3.5': {
        enhancedPrompt: `Refined prompt based on "${prompt}": I need a thorough analysis that breaks down complex concepts into digestible parts, provides real-world applications, and offers multiple viewpoints. Please structure your response with clear headings and include relevant examples that demonstrate practical implementation.`,
        qualityScore: 88,
        improvements: [
          'Better structure and organization',
          'Added analytical depth',
          'Improved clarity and precision',
          'Enhanced practical focus',
        ],
        analysis: {
          clarity: 90,
          specificity: 85,
          actionability: 88,
          engagement: 87,
        },
      },
      'deepseek-v2': {
        enhancedPrompt: `Optimized prompt for "${prompt}": Deliver a well-researched response with concrete examples, actionable insights, and clear explanations. Focus on practical applications and provide step-by-step guidance where applicable. Ensure the content is accessible and valuable for implementation.`,
        qualityScore: 82,
        improvements: [
          'Optimized for efficiency',
          'Added practical focus',
          'Improved accessibility',
          'Enhanced implementation guidance',
        ],
        analysis: {
          clarity: 82,
          specificity: 80,
          actionability: 85,
          engagement: 80,
        },
      },
      'owen-2.5': {
        enhancedPrompt: `Creative enhancement of "${prompt}": Provide an innovative and engaging response that combines creativity with practical value. Include unique perspectives, creative examples, and imaginative solutions while maintaining accuracy and usefulness. Make the content both informative and inspiring.`,
        qualityScore: 90,
        improvements: [
          'Enhanced creativity and engagement',
          'Added unique perspectives',
          'Improved inspirational value',
          'Balanced innovation with practicality',
        ],
        analysis: {
          clarity: 88,
          specificity: 85,
          actionability: 90,
          engagement: 95,
        },
      },
    };

    return (enhancements as Record<string, typeof enhancements[keyof typeof enhancements]>)[model] || enhancements['gpt-4'];
  }

  static getMockExplanation(query: string, subject: string, language: string, model: string) {
    // Handle generic queries about fields of study
    if (query.toLowerCase().includes('this field') || query.toLowerCase().includes('this subject')) {
      const fieldDescriptions = {
        math: 'Mathematics is the study of numbers, shapes, patterns, and logical reasoning. It includes areas like algebra, geometry, calculus, and statistics. In African contexts, mathematics is used in architecture (like the Great Pyramids), traditional crafts, agriculture planning, and modern technology development.',
        science: 'Science is the systematic study of the natural world through observation and experimentation. It includes physics, chemistry, biology, and earth sciences. African contributions to science include ancient astronomical observations, traditional medicine, and modern innovations in renewable energy and biotechnology.',
        english: 'English Language studies focus on communication, literature, grammar, and writing skills. In Africa, English serves as a bridge language connecting diverse communities and opens doors to global opportunities in business, education, and international relations.',
        geography: 'Geography is the study of places, environments, and the relationships between people and their surroundings. African geography is incredibly diverse, from the Sahara Desert to tropical rainforests, and understanding it is crucial for sustainable development and environmental conservation.'
      };

      return {
        explanation: fieldDescriptions[subject as keyof typeof fieldDescriptions] || `${subject} is an important field of study that offers many opportunities for learning and career development. It involves understanding key concepts, practical applications, and real-world problem solving.

Key aspects of ${subject}:
• Core principles and fundamental concepts
• Practical applications in everyday life
• Career opportunities and pathways
• Relevance to African development and innovation
• Connection to traditional knowledge and modern practices

This field offers exciting opportunities for African students to contribute to their communities while building successful careers.`,
        sources: ['Educational Database', 'African Learning Resources'],
        relatedTopics: ['Career Opportunities', 'Study Methods', 'Practical Applications'],
      };
    }

    // Handle specific queries
    return {
      explanation: `Here's a comprehensive explanation about "${query}" in ${subject}:

This is a detailed explanation that addresses your specific question about ${query}. The content is tailored for African learners and provides practical, culturally relevant examples.

Key points:
• Fundamental concepts explained clearly
• Real-world applications in African contexts
• Step-by-step breakdown of complex topics
• Practical examples you can relate to

This explanation is provided in ${language} and covers the essential aspects of your question about ${query} in the context of ${subject}.

Remember: Learning is a journey, and every question you ask brings you closer to mastering new skills and knowledge!`,
      sources: ['Educational Database', 'African Learning Resources'],
      relatedTopics: ['Related Topic 1', 'Related Topic 2', 'Related Topic 3'],
    };
  }

  static getMockBusinessAsset(type: string, businessType: string, description: string) {
    const mockAssets = {
      name: [
        'AfriTech Solutions',
        'Sahara Innovations',
        'Ubuntu Enterprises',
        'Baobab Digital',
        'Kente Creations',
      ],
      tagline: [
        'Empowering Africa Through Innovation',
        'Where Tradition Meets Technology',
        'Building Tomorrow, Today',
        'Your Success, Our Mission',
        'Connecting Communities, Creating Opportunities',
      ],
      description: `${businessType} business focused on ${description}. We combine traditional African values with modern innovation to deliver exceptional value to our customers. Our mission is to empower local communities while building sustainable business solutions.`,
      marketing: `🌍 Exciting News! We're revolutionizing ${businessType} in Africa! 

${description}

Join thousands of satisfied customers who trust us for quality and innovation. 

#AfricanBusiness #Innovation #${businessType} #CommunityFirst`,
    };

    const content = Array.isArray((mockAssets as Record<string, any>)[type])
      ? (mockAssets as Record<string, any>)[type][Math.floor(Math.random() * (mockAssets as Record<string, any>)[type].length)]
      : (mockAssets as Record<string, any>)[type];

    return {
      content,
      type,
      businessType,
      suggestions: [
        'Consider local market preferences',
        'Incorporate cultural elements',
        'Focus on community impact',
      ],
    };
  }

  static async translateContent(content: string, targetLanguage: string) {
    return this.request('/ai/translate', {
      method: 'POST',
      body: JSON.stringify({
        content,
        targetLanguage,
      }),
    });
  }

  static async generateMarketingContent(businessType: string, platform: string, tone: string) {
    return this.request('/ai/marketing-content', {
      method: 'POST',
      body: JSON.stringify({
        businessType,
        platform,
        tone,
      }),
    });
  }

  // Skills Module APIs
  static async getSkillGuide(skillName: string, level: string) {
    return this.request(`/skills/${skillName}?level=${level}`);
  }

  static async generateSkillSteps(skillName: string, userContext: string) {
    return this.request('/ai/skill-steps', {
      method: 'POST',
      body: JSON.stringify({
        skillName,
        userContext,
      }),
    });
  }

  // Cultural Module APIs
  static async getCulturalContent(topic: string, country: string) {
    return this.request(`/culture/${topic}?country=${country}`);
  }

  static async generateCulturalExplanation(topic: string, language: string) {
    return this.request('/ai/cultural-explanation', {
      method: 'POST',
      body: JSON.stringify({
        topic,
        language,
      }),
    });
  }

  // Search API
  static async searchContent(query: string, filters: any = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockResults = [
          {
            id: '1',
            type: 'explanation',
            title: `Understanding ${query}`,
            content: `Comprehensive explanation about ${query}...`,
            module: 'learn-smart',
            relevance: 0.95,
          },
          {
            id: '2',
            type: 'skill',
            title: `${query} Skills Guide`,
            content: `Step-by-step guide to master ${query}...`,
            module: 'learn-skill',
            relevance: 0.88,
          },
          {
            id: '3',
            type: 'cultural',
            title: `${query} in African Culture`,
            content: `Cultural perspective on ${query}...`,
            module: 'culture-class',
            relevance: 0.82,
          },
        ];

        resolve({
          results: mockResults,
          total: mockResults.length,
          query,
          filters,
        });
      }, 1000);
    });
  }
}