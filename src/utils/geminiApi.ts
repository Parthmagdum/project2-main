import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyC3aAimye39R6Ei4Vi7VQu9-ZMgruDHFBc';
const genAI = new GoogleGenerativeAI(API_KEY);

interface ClassificationResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number;
  topics: Array<{
    topic: 'teaching_style' | 'course_content' | 'infrastructure' | 'assessment_methods' | 'classroom_environment' | 'support_services';
    confidence: number;
    keywords: string[];
  }>;
}

/**
 * Classify feedback using Gemini API
 */
export async function classifyFeedbackWithGemini(feedbackText: string): Promise<ClassificationResult> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Analyze the following student feedback and classify it into categories. Respond ONLY with valid JSON, no markdown formatting or code blocks.

Feedback: "${feedbackText}"

Analyze and return JSON with this exact structure:
{
  "sentiment": "positive" or "negative" or "neutral",
  "sentimentScore": number between -1 and 1,
  "topics": [
    {
      "topic": one of ["teaching_style", "course_content", "infrastructure", "assessment_methods", "classroom_environment", "support_services"],
      "confidence": number between 0 and 1,
      "keywords": [array of relevant keywords found in the text]
    }
  ]
}

Categories explanation:
- teaching_style: Teaching methods, professor behavior, explanation quality, communication
- course_content: Course material, syllabus, curriculum, relevance, topics covered
- infrastructure: Facilities, classrooms, labs, equipment, wifi, furniture, buildings
- assessment_methods: Exams, tests, grading, assignments, evaluation methods
- classroom_environment: Class atmosphere, student interactions, discipline, behavior
- support_services: Library, counseling, placement, medical, hostel, administrative support

Return multiple topics if applicable, with confidence scores. Higher confidence for more relevant topics.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response - remove markdown code blocks if present
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n?/g, '');
    }
    
    const classification = JSON.parse(cleanedText);
    
    // Validate and ensure topics array exists
    if (!classification.topics || classification.topics.length === 0) {
      classification.topics = [{
        topic: 'course_content',
        confidence: 0.5,
        keywords: []
      }];
    }
    
    console.log('🤖 Gemini API Classification:', classification);
    return classification;
    
  } catch (error) {
    console.error('❌ Gemini API Error:', error);
    // Fallback to basic classification if API fails
    return fallbackClassification(feedbackText);
  }
}

/**
 * Fallback classification if API fails
 */
function fallbackClassification(text: string): ClassificationResult {
  const lowerText = text.toLowerCase();
  
  // Simple sentiment analysis
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'helpful', 'clear', 'best'];
  const negativeWords = ['bad', 'poor', 'terrible', 'unclear', 'confusing', 'worst', 'useless'];
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) positiveCount++;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativeCount++;
  });
  
  let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
  let score = 0;
  
  if (positiveCount > negativeCount) {
    sentiment = 'positive';
    score = 0.5;
  } else if (negativeCount > positiveCount) {
    sentiment = 'negative';
    score = -0.5;
  }
  
  // Simple topic detection
  const topics = [];
  
  if (lowerText.includes('teach') || lowerText.includes('professor') || lowerText.includes('instructor')) {
    topics.push({ topic: 'teaching_style' as const, confidence: 0.7, keywords: ['teaching'] });
  }
  
  if (lowerText.includes('infrastructure') || lowerText.includes('classroom') || lowerText.includes('lab')) {
    topics.push({ topic: 'infrastructure' as const, confidence: 0.7, keywords: ['infrastructure'] });
  }
  
  if (lowerText.includes('exam') || lowerText.includes('test') || lowerText.includes('assignment')) {
    topics.push({ topic: 'assessment_methods' as const, confidence: 0.7, keywords: ['exam'] });
  }
  
  if (topics.length === 0) {
    topics.push({ topic: 'course_content' as const, confidence: 0.5, keywords: [] });
  }
  
  return { sentiment, sentimentScore: score, topics };
}
