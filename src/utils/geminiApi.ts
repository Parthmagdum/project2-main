import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
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

Categories and Keywords:
1. teaching_style: 
   - Keywords: teacher, professor, instructor, teaching, explanation, lecture, presentation, communication, methodology, approach, pedagogy, clarity, delivery, interactive, engaging, boring, interesting, knowledge, expertise, guidance, mentor, tutor, faculty behavior, teaching quality, teaching method

2. course_content: 
   - Keywords: syllabus, curriculum, topics, material, content, course, subject, chapters, lessons, textbook, resources, notes, study material, course structure, modules, units, relevance, practical, theoretical, updated, outdated, comprehensive, depth, breadth

3. infrastructure: 
   - Keywords: classroom, lab, laboratory, facilities, equipment, wifi, internet, computer, projector, board, whiteboard, smartboard, furniture, desk, chair, building, room, air conditioning, AC, ventilation, lighting, cleanliness, maintenance, campus, library building, auditorium, seminar hall

4. assessment_methods: 
   - Keywords: exam, test, quiz, assignment, evaluation, grading, marks, scores, assessment, homework, project, practical exam, viva, presentation, internal marks, external exam, semester exam, continuous evaluation, fairness, difficulty level, question paper, answer sheet

5. classroom_environment: 
   - Keywords: atmosphere, environment, class culture, discipline, behavior, interaction, participation, discussion, peer learning, collaboration, respect, bullying, harassment, inclusivity, diversity, student engagement, attendance, punctuality, class timing, group work, teamwork

6. support_services: 
   - Keywords: library, books, journals, counseling, placement, career guidance, medical, health center, hostel, accommodation, mess, food, canteen, administration, office, staff, support, help desk, student services, extracurricular, sports, clubs, events, scholarships, financial aid

Instructions:
- Identify ALL relevant topics mentioned in the feedback
- Assign confidence scores based on how prominently each topic is discussed
- Higher confidence (0.7-1.0) for directly mentioned topics
- Medium confidence (0.4-0.6) for indirectly mentioned topics
- Extract actual keywords from the feedback text
- Sort topics by confidence (highest first)
- Include at least one topic, even if confidence is low`;

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
    
    // Sort topics by confidence (highest first)
    classification.topics.sort((a: any, b: any) => b.confidence - a.confidence);
    
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
  
  // Enhanced sentiment analysis
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'helpful', 'clear', 'best', 'love', 'fantastic', 'outstanding', 'brilliant', 'effective', 'engaging', 'interesting', 'useful', 'beneficial'];
  const negativeWords = ['bad', 'poor', 'terrible', 'awful', 'unclear', 'confusing', 'worst', 'useless', 'boring', 'disappointing', 'inadequate', 'insufficient', 'difficult', 'hard', 'complicated', 'outdated'];
  
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
    score = Math.min(positiveCount / (positiveCount + negativeCount + 1), 0.9);
  } else if (negativeCount > positiveCount) {
    sentiment = 'negative';
    score = -Math.min(negativeCount / (positiveCount + negativeCount + 1), 0.9);
  }
  
  // Enhanced topic detection with keywords
  const topics = [];
  
  // Teaching Style Detection
  const teachingKeywords = ['teach', 'professor', 'instructor', 'faculty', 'lecture', 'explanation', 'teaching method', 'pedagogy', 'delivery', 'communication', 'mentor', 'guide'];
  let teachingMatches = teachingKeywords.filter(keyword => lowerText.includes(keyword));
  if (teachingMatches.length > 0) {
    topics.push({ 
      topic: 'teaching_style' as const, 
      confidence: Math.min(0.5 + (teachingMatches.length * 0.1), 0.95), 
      keywords: teachingMatches 
    });
  }
  
  // Course Content Detection
  const contentKeywords = ['syllabus', 'curriculum', 'content', 'material', 'topics', 'course', 'subject', 'chapters', 'lessons', 'notes', 'textbook', 'modules'];
  let contentMatches = contentKeywords.filter(keyword => lowerText.includes(keyword));
  if (contentMatches.length > 0) {
    topics.push({ 
      topic: 'course_content' as const, 
      confidence: Math.min(0.5 + (contentMatches.length * 0.1), 0.95), 
      keywords: contentMatches 
    });
  }
  
  // Infrastructure Detection
  const infraKeywords = ['infrastructure', 'classroom', 'lab', 'laboratory', 'facilities', 'equipment', 'wifi', 'internet', 'computer', 'projector', 'board', 'furniture', 'building', 'ac', 'air conditioning'];
  let infraMatches = infraKeywords.filter(keyword => lowerText.includes(keyword));
  if (infraMatches.length > 0) {
    topics.push({ 
      topic: 'infrastructure' as const, 
      confidence: Math.min(0.5 + (infraMatches.length * 0.1), 0.95), 
      keywords: infraMatches 
    });
  }
  
  // Assessment Methods Detection
  const assessmentKeywords = ['exam', 'test', 'quiz', 'assignment', 'evaluation', 'grading', 'marks', 'assessment', 'homework', 'project', 'viva', 'practical'];
  let assessmentMatches = assessmentKeywords.filter(keyword => lowerText.includes(keyword));
  if (assessmentMatches.length > 0) {
    topics.push({ 
      topic: 'assessment_methods' as const, 
      confidence: Math.min(0.5 + (assessmentMatches.length * 0.1), 0.95), 
      keywords: assessmentMatches 
    });
  }
  
  // Classroom Environment Detection
  const environmentKeywords = ['atmosphere', 'environment', 'class culture', 'discipline', 'behavior', 'interaction', 'participation', 'discussion', 'engagement', 'attendance'];
  let environmentMatches = environmentKeywords.filter(keyword => lowerText.includes(keyword));
  if (environmentMatches.length > 0) {
    topics.push({ 
      topic: 'classroom_environment' as const, 
      confidence: Math.min(0.5 + (environmentMatches.length * 0.1), 0.95), 
      keywords: environmentMatches 
    });
  }
  
  // Support Services Detection
  const supportKeywords = ['library', 'counseling', 'placement', 'career', 'medical', 'hostel', 'mess', 'canteen', 'administration', 'support', 'services', 'extracurricular', 'sports'];
  let supportMatches = supportKeywords.filter(keyword => lowerText.includes(keyword));
  if (supportMatches.length > 0) {
    topics.push({ 
      topic: 'support_services' as const, 
      confidence: Math.min(0.5 + (supportMatches.length * 0.1), 0.95), 
      keywords: supportMatches 
    });
  }
  
  // If no topics detected, default to course_content
  if (topics.length === 0) {
    topics.push({ topic: 'course_content' as const, confidence: 0.5, keywords: [] });
  }
  
  // Sort topics by confidence (highest first)
  topics.sort((a, b) => b.confidence - a.confidence);
  
  return { sentiment, sentimentScore: score, topics };
}
