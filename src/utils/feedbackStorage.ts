import { FeedbackItem } from '../types';
import { supabase } from '../lib/supabaseClient';
import { classifyFeedbackWithGemini } from './geminiApi';

const FEEDBACK_STORAGE_KEY = 'student_feedback_data';

export const feedbackStorage = {
  // Get all feedback from Supabase
  async getAllFeedback(): Promise<FeedbackItem[]> {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading feedback from Supabase:', error);
        // Fallback to localStorage
        return this.getAllFeedbackFromLocalStorage();
      }

      // Convert database format to FeedbackItem format
      return data.map((item: any) => ({
        id: item.id,
        studentId: item.student_id, // ✅ Always return real student ID
        courseId: 'N/A',
        courseName: item.course_name,
        instructor: item.instructor,
        department: item.department,
        semester: item.semester,
        year: item.year, // ✅ Include year
        className: item.class_name, // ✅ Include class/section
        submittedAt: new Date(item.created_at),
        text: item.feedback_text,
        sentiment: item.sentiment as 'positive' | 'negative' | 'neutral',
        sentimentScore: item.sentiment_score,
        sentimentConfidence: item.sentiment_confidence,
        topics: item.topics || [],
        flagged: item.flagged,
        processed: true,
        isAnonymous: item.is_anonymous || false, // ✅ Include anonymous flag
        ...(item.overall_rating && { overallRating: item.overall_rating }), // ✅ Include overall rating
        ...(item.student_name && { studentName: item.student_name }),
        ...(item.faculty_reply && { facultyReply: item.faculty_reply }),
        ...(item.reply_at && { replyAt: new Date(item.reply_at) }),
        ...(item.student_reply && { studentReply: item.student_reply }),
        ...(item.student_reply_at && { studentReplyAt: new Date(item.student_reply_at) })
      }));
    } catch (error) {
      console.error('Error in getAllFeedback:', error);
      return this.getAllFeedbackFromLocalStorage();
    }
  },

  // Fallback: Get feedback from localStorage
  getAllFeedbackFromLocalStorage(): FeedbackItem[] {
    try {
      const data = localStorage.getItem(FEEDBACK_STORAGE_KEY);
      if (!data) return [];
      
      const feedback = JSON.parse(data);
      return feedback.map((item: any) => ({
        ...item,
        submittedAt: new Date(item.submittedAt)
      }));
    } catch (error) {
      console.error('Error loading feedback from localStorage:', error);
      return [];
    }
  },

  // Save feedback to Supabase
  async saveFeedback(feedback: FeedbackItem): Promise<void> {
    console.log('💾 Attempting to save feedback:', {
      id: feedback.id,
      studentId: feedback.studentId,
      isAnonymous: feedback.isAnonymous,
      text: feedback.text.substring(0, 50) + '...'
    });
    
    try {
      const { error } = await supabase
        .from('feedback')
        .insert([{
          id: feedback.id,
          student_id: feedback.studentId, // ✅ Store real student ID (always)
          student_name: (feedback as any).studentName || null,
          course_name: feedback.courseName,
          instructor: feedback.instructor || 'N/A',
          department: feedback.department,
          semester: feedback.semester,
          year: feedback.year || null, // ✅ Store year
          class_name: feedback.className || null, // ✅ Store class/section
          feedback_text: feedback.text,
          is_anonymous: feedback.isAnonymous || false, // ✅ Use the flag from feedback
          overall_rating: (feedback as any).overallRating || null, // ✅ Store overall rating
          sentiment: feedback.sentiment,
          sentiment_score: feedback.sentimentScore,
          sentiment_confidence: feedback.sentimentConfidence,
          topics: feedback.topics,
          flagged: feedback.flagged,
          created_at: feedback.submittedAt.toISOString()
        }]);

      if (error) {
        console.error('❌ Error saving to Supabase:', error);
        console.log('⚠️ Falling back to localStorage...');
        // Fallback to localStorage
        this.saveFeedbackToLocalStorage(feedback);
      } else {
        console.log('✅ Feedback saved to Supabase successfully!');
      }
    } catch (error) {
      console.error('❌ Exception in saveFeedback:', error);
      console.log('⚠️ Falling back to localStorage...');
      this.saveFeedbackToLocalStorage(feedback);
    }
  },

  // Fallback: Save to localStorage
  saveFeedbackToLocalStorage(feedback: FeedbackItem): void {
    try {
      const existingFeedback = this.getAllFeedbackFromLocalStorage();
      const updatedFeedback = [...existingFeedback, feedback];
      localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updatedFeedback));
      console.log('✅ Feedback saved to localStorage successfully!');
      console.log(`📊 Total feedback in localStorage: ${updatedFeedback.length}`);
    } catch (error) {
      console.error('❌ Error saving feedback to localStorage:', error);
    }
  },

  // Register student
  async registerStudent(studentId: string, email: string, fullName: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('students')
        .insert([{
          student_id: studentId,
          email: email,
          full_name: fullName,
          created_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('Error registering student:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error in registerStudent:', error);
      return { success: false, error: error.message };
    }
  },

  // Verify student login
  async verifyStudent(studentId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('student_id')
        .eq('student_id', studentId)
        .single();

      if (error || !data) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error verifying student:', error);
      return false;
    }
  },

  // Calculate analytics from feedback
  calculateAnalytics(feedback: FeedbackItem[]) {
    const totalFeedback = feedback.length;
    const processedFeedback = feedback.filter(f => f.processed).length;
    
    // Calculate average sentiment
    const avgSentiment = totalFeedback > 0
      ? feedback.reduce((sum, f) => sum + f.sentimentScore, 0) / totalFeedback
      : 0;
    
    // Calculate average rating
    const feedbackWithRatings = feedback.filter(f => f.overallRating && f.overallRating > 0);
    const avgRating = feedbackWithRatings.length > 0
      ? feedbackWithRatings.reduce((sum, f) => sum + (f.overallRating || 0), 0) / feedbackWithRatings.length
      : 0;
    
    // Count alerts
    const alertsGenerated = feedback.filter(f => f.flagged).length;
    
    // Calculate topic distribution - Count each topic occurrence in feedback
    const topicDistribution: any = {
      teaching_style: 0,
      course_content: 0,
      infrastructure: 0,
      assessment_methods: 0,
      classroom_environment: 0,
      support_services: 0
    };
    
    // Count topics from all feedback
    feedback.forEach(f => {
      if (f.topics && Array.isArray(f.topics)) {
        f.topics.forEach(topic => {
          const topicKey = topic.topic;
          if (topicDistribution.hasOwnProperty(topicKey)) {
            topicDistribution[topicKey]++;
          }
        });
      }
    });
    
    console.log('📊 Topic Distribution:', topicDistribution);
    console.log('📝 Total Feedback Analyzed:', totalFeedback);
    
    return {
      totalFeedback,
      processedFeedback,
      averageSentiment: avgSentiment,
      averageRating: avgRating,
      totalRatings: feedbackWithRatings.length,
      alertsGenerated,
      topicDistribution,
      sentimentTrends: [],
      departmentComparison: []
    };
  },

  // Generate simple sentiment analysis
  analyzeSentiment(text: string): { sentiment: 'positive' | 'negative' | 'neutral'; score: number; confidence: number } {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'helpful', 'clear', 'best', 'love', 'enjoy', 'fantastic', 'outstanding'];
    const negativeWords = ['bad', 'poor', 'terrible', 'awful', 'worst', 'hate', 'confusing', 'difficult', 'unclear', 'boring', 'useless', 'disappointing'];
    
    const lowerText = text.toLowerCase();
    const words = lowerText.split(/\s+/);
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    words.forEach(word => {
      if (positiveWords.some(pw => word.includes(pw))) positiveCount++;
      if (negativeWords.some(nw => word.includes(nw))) negativeCount++;
    });
    
    const total = positiveCount + negativeCount;
    if (total === 0) {
      return { sentiment: 'neutral', score: 0, confidence: 0.5 };
    }
    
    const score = (positiveCount - negativeCount) / total;
    const confidence = Math.min(0.5 + (total * 0.1), 0.95);
    
    let sentiment: 'positive' | 'negative' | 'neutral';
    if (score > 0.2) sentiment = 'positive';
    else if (score < -0.2) sentiment = 'negative';
    else sentiment = 'neutral';
    
    return { sentiment, score, confidence };
  },

  // Generate topic classification
  classifyTopics(text: string) {
    const lowerText = text.toLowerCase();
    const topics = [];
    
    const topicKeywords = {
      teaching_style: [
        'teaching style', 'teaching', 'teacher', 'professor', 'instructor', 'faculty', 'sir', 'madam', 'mam', 'explain', 'explanation', 'lecture', 'presentation', 'teach', 'teaches', 'taught', 'method', 'methodology', 'approach', 'technique', 'communication', 'delivery', 'pedagogy', 'instructional', 'educator', 'guide', 'mentor', 'tutor', 'trainer',
        'clarity', 'clear', 'understandable', 'understanding', 'comprehension', 'knowledge', 'expertise', 'skilled', 'experienced', 'qualified', 'competent', 'proficient', 'capable', 'expert', 'knowledgeable', 'informed', 'learned', 'scholarly', 'academic', 'professional',
        'pace', 'speed', 'slow', 'fast', 'rushed', 'hurried', 'gradual', 'step by step', 'systematic', 'organized', 'structured', 'planned', 'prepared', 'unprepared', 'disorganized', 'confusing', 'confused', 'unclear',
        'interactive', 'engagement', 'engaging', 'interesting', 'boring', 'monotonous', 'dull', 'exciting', 'inspiring', 'motivating', 'encouraging', 'supportive', 'helpful', 'unhelpful', 'friendly', 'unfriendly', 'approachable', 'unapproachable', 'accessible', 'inaccessible',
        'patient', 'impatient', 'rude', 'polite', 'respectful', 'disrespectful', 'kind', 'harsh', 'strict', 'lenient', 'flexible', 'rigid', 'understanding', 'misunderstanding', 'cooperative', 'uncooperative',
        'enthusiastic', 'passionate', 'dedicated', 'committed', 'devoted', 'sincere', 'insincere', 'genuine', 'fake', 'authentic', 'honest', 'dishonest', 'transparent', 'opaque',
        'innovative', 'creative', 'traditional', 'conventional', 'modern', 'outdated', 'contemporary', 'old-fashioned', 'progressive', 'regressive', 'advanced', 'backward',
        'responsive', 'unresponsive', 'attentive', 'inattentive', 'focused', 'distracted', 'concentrated', 'scattered', 'organized', 'chaotic', 'disciplined', 'undisciplined',
        'punctual', 'late', 'on time', 'delayed', 'timely', 'untimely', 'regular', 'irregular', 'consistent', 'inconsistent', 'reliable', 'unreliable', 'dependable', 'undependable',
        'notes', 'handout', 'material', 'resource', 'reference', 'ppt', 'powerpoint', 'slides', 'demonstration', 'demo', 'example', 'illustration', 'practical example', 'real world', 'application',
        'voice', 'loud', 'soft', 'audible', 'inaudible', 'clear voice', 'unclear voice', 'pronunciation', 'accent', 'dialect', 'language', 'vocabulary', 'grammar', 'fluency', 'fluent',
        'body language', 'gesture', 'expression', 'facial expression', 'eye contact', 'posture', 'movement', 'energy', 'energetic', 'lethargic', 'active', 'passive', 'dynamic', 'static'
      ],
      course_content: [
        'course content', 'content', 'course', 'material', 'materials', 'syllabus', 'curriculum', 'topics', 'topic', 'subject', 'subjects', 'lesson', 'lessons', 'chapter', 'chapters', 'unit', 'units', 'module', 'modules', 'section', 'sections', 'theory', 'theories', 'concept', 'concepts', 'study', 'studies', 'textbook', 'book', 'books', 'reading',
        'relevant', 'irrelevant', 'useful', 'useless', 'practical', 'impractical', 'theoretical', 'applied', 'application', 'applicable', 'inapplicable', 'appropriate', 'inappropriate', 'suitable', 'unsuitable', 'fitting', 'unfitting',
        'updated', 'outdated', 'current', 'old', 'new', 'latest', 'recent', 'ancient', 'modern', 'contemporary', 'traditional', 'advanced', 'basic', 'fundamental', 'elementary', 'intermediate', 'complex', 'sophisticated', 'simple',
        'comprehensive', 'incomplete', 'complete', 'thorough', 'superficial', 'detailed', 'brief', 'extensive', 'limited', 'broad', 'narrow', 'wide', 'restricted', 'expansive', 'contracted',
        'organized', 'disorganized', 'structured', 'unstructured', 'systematic', 'random', 'logical', 'illogical', 'coherent', 'incoherent', 'consistent', 'inconsistent', 'sequential', 'scattered',
        'interesting', 'boring', 'engaging', 'dull', 'exciting', 'monotonous', 'fascinating', 'tedious', 'captivating', 'uninteresting', 'stimulating', 'unstimulating', 'compelling', 'repelling',
        'difficult', 'easy', 'hard', 'simple', 'challenging', 'unchallenging', 'tough', 'soft', 'complex', 'straightforward', 'complicated', 'uncomplicated', 'tricky', 'obvious',
        'balanced', 'imbalanced', 'proportionate', 'disproportionate', 'adequate', 'inadequate', 'sufficient', 'insufficient', 'enough', 'not enough', 'excessive', 'minimal',
        'quality', 'poor quality', 'high quality', 'low quality', 'standard', 'substandard', 'excellent', 'poor', 'good', 'bad', 'superior', 'inferior', 'premium', 'mediocre',
        'coverage', 'scope', 'range', 'depth', 'breadth', 'span', 'extent', 'reach', 'domain', 'field', 'area', 'realm', 'sphere', 'territory',
        'assignment', 'homework', 'project', 'task', 'exercise', 'practice', 'drill', 'activity', 'work', 'case study', 'problem', 'solution', 'answer', 'question',
        'research', 'study material', 'notes', 'handouts', 'references', 'bibliography', 'sources', 'citation', 'document', 'paper', 'article', 'journal', 'publication'
      ],
      infrastructure: [
        'infrastructure', 'facility', 'facilities', 'building', 'buildings', 'structure', 'construction', 'campus', 'premises', 'property', 'estate', 'compound',
        'classroom', 'class', 'room', 'hall', 'auditorium', 'lecture hall', 'seminar room', 'tutorial room', 'conference room', 'meeting room', 'assembly hall',
        'lab', 'laboratory', 'labs', 'laboratories', 'workshop', 'studio', 'practical room', 'computer lab', 'science lab', 'physics lab', 'chemistry lab', 'biology lab', 'language lab', 'research lab',
        'library', 'reading room', 'study room', 'book', 'books', 'journal', 'journals', 'magazine', 'magazines', 'newspaper', 'newspapers', 'digital library', 'e-library',
        'projector', 'screen', 'display', 'monitor', 'smart board', 'board', 'whiteboard', 'blackboard', 'greenboard', 'marker', 'chalk', 'duster', 'eraser',
        'computer', 'pc', 'laptop', 'desktop', 'workstation', 'terminal', 'system', 'machine', 'device', 'hardware', 'software', 'program', 'application',
        'wifi', 'wi-fi', 'internet', 'network', 'connectivity', 'connection', 'online', 'offline', 'broadband', 'lan', 'wan', 'ethernet', 'cable', 'wireless',
        'furniture', 'bench', 'benches', 'chair', 'chairs', 'table', 'tables', 'desk', 'desks', 'seat', 'seating', 'sitting', 'stool', 'stools',
        'ac', 'air conditioning', 'air conditioner', 'cooling', 'heating', 'hvac', 'temperature', 'climate', 'ventilation', 'fan', 'fans', 'cooler', 'coolers', 'heater', 'heaters',
        'light', 'lighting', 'lights', 'bulb', 'bulbs', 'tube', 'tubes', 'lamp', 'lamps', 'brightness', 'dim', 'dark', 'bright', 'illumination',
        'electricity', 'power', 'energy', 'electrical', 'electric', 'switch', 'socket', 'plug', 'outlet', 'wiring', 'voltage', 'current',
        'toilet', 'washroom', 'restroom', 'bathroom', 'lavatory', 'loo', 'wc', 'water closet', 'urinal', 'sink', 'tap', 'faucet', 'hygiene', 'sanitation', 'cleanliness',
        'water', 'drinking water', 'water cooler', 'water dispenser', 'aqua', 'hydration', 'purifier', 'filter', 'ro', 'reverse osmosis',
        'canteen', 'cafeteria', 'mess', 'food court', 'dining hall', 'restaurant', 'food', 'snacks', 'meals', 'lunch', 'breakfast', 'dinner', 'tea', 'coffee',
        'parking', 'parking lot', 'parking area', 'parking space', 'vehicle', 'car', 'bike', 'bicycle', 'two wheeler', 'four wheeler', 'transport', 'transportation',
        'lift', 'elevator', 'escalator', 'stairs', 'staircase', 'ramp', 'access', 'accessibility', 'entry', 'exit', 'entrance', 'door', 'gate', 'corridor', 'passage',
        'ground', 'playground', 'sports ground', 'field', 'court', 'gym', 'gymnasium', 'fitness', 'sports', 'athletics', 'recreation', 'play area',
        'equipment', 'apparatus', 'instrument', 'tool', 'tools', 'machinery', 'device', 'gadget', 'appliance', 'utensil',
        'maintenance', 'repair', 'fixing', 'broken', 'damaged', 'worn out', 'old', 'new', 'renovation', 'refurbishment', 'upgrade', 'improvement', 'clean', 'dirty', 'neat', 'messy',
        'space', 'spacious', 'cramped', 'crowded', 'congested', 'tight', 'narrow', 'wide', 'broad', 'big', 'small', 'large', 'tiny', 'huge', 'compact', 'roomy',
        'safety', 'security', 'safe', 'unsafe', 'dangerous', 'hazardous', 'risky', 'secure', 'insecure', 'protection', 'guard', 'surveillance', 'cctv', 'camera', 'alarm',
        'technology', 'tech', 'digital', 'electronic', 'automation', 'automated', 'manual', 'smart', 'intelligent', 'advanced', 'modern', 'latest', 'updated'
      ],
      assessment_methods: [
        'assessment methods', 'assessment', 'evaluation', 'examination', 'testing', 'grading', 'marking', 'scoring', 'rating', 'appraisal', 'review',
        'exam', 'exams', 'examination', 'examinations', 'test', 'tests', 'quiz', 'quizzes', 'mid term', 'midterm', 'end term', 'final', 'finals', 'prelim', 'preliminary',
        'internal', 'external', 'formative', 'summative', 'continuous', 'periodic', 'semester', 'annual', 'monthly', 'weekly', 'daily',
        'assignment', 'assignments', 'homework', 'project', 'projects', 'task', 'tasks', 'exercise', 'exercises', 'practical', 'practicals', 'lab work', 'field work', 'workshop',
        'viva', 'oral', 'verbal', 'interview', 'presentation', 'seminar', 'demonstration', 'exhibition', 'showcase', 'defense', 'thesis', 'dissertation',
        'paper', 'question paper', 'answer sheet', 'answer book', 'question', 'questions', 'answer', 'answers', 'solution', 'solutions', 'problem', 'problems',
        'objective', 'subjective', 'mcq', 'multiple choice', 'true false', 'fill in the blanks', 'match the following', 'short answer', 'long answer', 'essay', 'descriptive',
        'grade', 'grades', 'grading', 'mark', 'marks', 'marking', 'score', 'scores', 'scoring', 'point', 'points', 'percentage', 'gpa', 'cgpa', 'sgpa',
        'result', 'results', 'outcome', 'performance', 'achievement', 'attainment', 'success', 'failure', 'pass', 'fail', 'passed', 'failed',
        'fair', 'unfair', 'biased', 'unbiased', 'partial', 'impartial', 'just', 'unjust', 'reasonable', 'unreasonable', 'appropriate', 'inappropriate',
        'transparent', 'opaque', 'clear', 'unclear', 'visible', 'invisible', 'open', 'hidden', 'disclosed', 'undisclosed', 'revealed', 'concealed',
        'difficult', 'easy', 'hard', 'simple', 'tough', 'soft', 'challenging', 'unchallenging', 'complex', 'straightforward', 'complicated', 'basic',
        'pattern', 'format', 'structure', 'design', 'layout', 'arrangement', 'organization', 'scheme', 'plan', 'blueprint', 'framework',
        'syllabus based', 'out of syllabus', 'relevant', 'irrelevant', 'related', 'unrelated', 'connected', 'disconnected', 'linked', 'unlinked',
        'time', 'duration', 'period', 'length', 'timing', 'schedule', 'timetable', 'deadline', 'due date', 'submission', 'late', 'early', 'punctual',
        'sufficient', 'insufficient', 'adequate', 'inadequate', 'enough', 'not enough', 'too much', 'too little', 'excessive', 'minimal',
        'weightage', 'weight', 'distribution', 'allocation', 'division', 'proportion', 'ratio', 'balance', 'imbalance',
        'feedback', 'comment', 'remark', 'suggestion', 'advice', 'guidance', 'direction', 'instruction', 'correction', 'improvement',
        'retest', 're-test', 'reexam', 're-exam', 'retake', 'supplementary', 'backlog', 'arrear', 'kt', 'compartment',
        'internal marks', 'external marks', 'theory marks', 'practical marks', 'attendance marks', 'assignment marks', 'project marks',
        'cheating', 'copying', 'malpractice', 'unfair means', 'dishonesty', 'plagiarism', 'integrity', 'honesty', 'ethics', 'discipline'
      ],
      classroom_environment: [
        'classroom environment', 'environment', 'atmosphere', 'ambience', 'ambiance', 'climate', 'setting', 'surroundings', 'conditions', 'situation',
        'class size', 'strength', 'students', 'student', 'classmates', 'peers', 'batch', 'section', 'division', 'group', 'crowd', 'population',
        'overcrowded', 'crowded', 'packed', 'full', 'empty', 'spacious', 'cramped', 'congested', 'comfortable', 'uncomfortable',
        'discussion', 'debate', 'dialogue', 'conversation', 'talk', 'communication', 'interaction', 'exchange', 'sharing', 'collaboration',
        'participation', 'involvement', 'engagement', 'contribution', 'input', 'active', 'passive', 'interactive', 'non-interactive',
        'friendly', 'unfriendly', 'welcoming', 'unwelcoming', 'warm', 'cold', 'hospitable', 'inhospitable', 'cordial', 'hostile',
        'cooperative', 'uncooperative', 'helpful', 'unhelpful', 'supportive', 'unsupportive', 'collaborative', 'competitive', 'teamwork',
        'respect', 'disrespect', 'respectful', 'disrespectful', 'polite', 'impolite', 'rude', 'courteous', 'discourteous', 'civil', 'uncivil',
        'discipline', 'disciplined', 'undisciplined', 'orderly', 'disorderly', 'organized', 'disorganized', 'systematic', 'chaotic', 'controlled', 'uncontrolled',
        'behavior', 'behaviour', 'conduct', 'manner', 'attitude', 'approach', 'demeanor', 'disposition', 'temperament', 'character',
        'bullying', 'harassment', 'teasing', 'mocking', 'ragging', 'abuse', 'violence', 'aggression', 'fight', 'conflict', 'dispute',
        'diversity', 'diverse', 'varied', 'different', 'inclusive', 'exclusive', 'inclusive environment', 'discrimination', 'bias', 'prejudice',
        'motivation', 'motivating', 'demotivating', 'inspiring', 'uninspiring', 'encouraging', 'discouraging', 'positive', 'negative',
        'energy', 'energetic', 'lethargic', 'active', 'inactive', 'dynamic', 'static', 'lively', 'dull', 'vibrant', 'lifeless',
        'focus', 'focused', 'unfocused', 'concentrated', 'distracted', 'attentive', 'inattentive', 'alert', 'drowsy', 'awake', 'sleepy',
        'noise', 'noisy', 'loud', 'quiet', 'silent', 'peaceful', 'disturbing', 'disturbance', 'disruption', 'interruption',
        'punctuality', 'punctual', 'late', 'on time', 'delayed', 'timely', 'untimely', 'prompt', 'tardy',
        'attendance', 'present', 'absent', 'presence', 'absence', 'regularity', 'irregular', 'consistent', 'inconsistent',
        'pressure', 'stress', 'stressed', 'relaxed', 'tense', 'tension', 'anxiety', 'anxious', 'calm', 'peaceful', 'hectic',
        'competitive', 'competition', 'rivalry', 'race', 'contest', 'challenge', 'struggle', 'strain', 'burden', 'load',
        'culture', 'cultural', 'tradition', 'traditional', 'custom', 'practice', 'norm', 'standard', 'value', 'belief',
        'equality', 'inequality', 'equal', 'unequal', 'fair', 'unfair', 'justice', 'injustice', 'equity', 'inequity',
        'seating', 'seat', 'sitting', 'arrangement', 'position', 'place', 'location', 'front', 'back', 'middle', 'corner',
        'lighting', 'light', 'bright', 'dim', 'dark', 'visibility', 'visible', 'invisible', 'clear view', 'blocked view',
        'temperature', 'hot', 'cold', 'warm', 'cool', 'comfortable temperature', 'uncomfortable temperature', 'stuffy', 'fresh air'
      ],
      support_services: [
        'support services', 'support', 'service', 'services', 'help', 'helping', 'assistance', 'aid', 'backing', 'facilitation',
        'guidance', 'counseling', 'counselling', 'advising', 'mentoring', 'coaching', 'tutoring', 'training', 'orientation',
        'mentor', 'guide', 'advisor', 'counselor', 'coach', 'tutor', 'trainer', 'facilitator', 'coordinator',
        'office hours', 'consultation', 'meeting', 'appointment', 'session', 'interaction', 'discussion', 'talk', 'conversation',
        'doubt', 'doubts', 'query', 'queries', 'question', 'questions', 'clarification', 'explanation', 'solution', 'resolution',
        'available', 'unavailable', 'accessible', 'inaccessible', 'reachable', 'unreachable', 'approachable', 'unapproachable',
        'responsive', 'unresponsive', 'prompt', 'delayed', 'quick', 'slow', 'fast', 'timely', 'untimely', 'immediate',
        'helpful', 'unhelpful', 'useful', 'useless', 'effective', 'ineffective', 'efficient', 'inefficient', 'productive', 'unproductive',
        'library', 'library services', 'books', 'journals', 'magazines', 'resources', 'reference', 'material', 'reading material',
        'computer', 'computer services', 'lab', 'internet', 'wifi', 'printing', 'scanning', 'photocopy', 'xerox', 'copying',
        'placement', 'placement cell', 'career', 'job', 'employment', 'recruitment', 'hiring', 'interview', 'campus drive', 'internship',
        'training', 'skill development', 'workshop', 'seminar', 'conference', 'webinar', 'guest lecture', 'expert talk',
        'sports', 'sports facilities', 'gym', 'gymnasium', 'ground', 'playground', 'fitness', 'recreation', 'games', 'athletics',
        'medical', 'health', 'healthcare', 'clinic', 'dispensary', 'doctor', 'nurse', 'first aid', 'emergency', 'medicine', 'treatment',
        'hostel', 'accommodation', 'residence', 'housing', 'room', 'mess', 'food', 'boarding', 'lodging', 'stay',
        'transport', 'transportation', 'bus', 'vehicle', 'shuttle', 'conveyance', 'travel', 'commute', 'route', 'pickup', 'drop',
        'scholarship', 'financial aid', 'fee concession', 'grant', 'stipend', 'funding', 'sponsorship', 'loan', 'assistance',
        'grievance', 'complaint', 'redressal', 'grievance cell', 'complaint box', 'feedback', 'suggestion box', 'issue', 'problem',
        'administration', 'admin', 'office', 'department', 'section', 'cell', 'committee', 'management', 'staff', 'personnel',
        'certificate', 'document', 'transcript', 'marksheet', 'degree', 'diploma', 'provisional', 'original', 'bonafide', 'id card',
        'exam', 'exam related', 'hall ticket', 'admit card', 'result', 'revaluation', 'rechecking', 'photocopy', 'verification',
        'student welfare', 'student affairs', 'student council', 'union', 'association', 'club', 'society', 'committee',
        'extra curricular', 'co-curricular', 'cultural', 'technical', 'festival', 'event', 'competition', 'activity', 'program',
        'mentorship', 'peer support', 'buddy system', 'senior', 'junior', 'alumni', 'network', 'community', 'group'
      ]
    };
    
    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      const matches = keywords.filter(keyword => lowerText.includes(keyword));
      if (matches.length > 0) {
        topics.push({
          topic: topic as any,
          confidence: Math.min(0.5 + (matches.length * 0.15), 0.95),
          keywords: matches
        });
      }
    }
    
    return topics.length > 0 ? topics : [{ 
      topic: 'course_content' as any, 
      confidence: 0.5, 
      keywords: [] 
    }];
  },

  // Get feedback for a specific student
  async getStudentFeedback(studentId: string): Promise<FeedbackItem[]> {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading student feedback:', error);
        return [];
      }

      return data.map((item: any) => ({
        id: item.id,
        studentId: item.student_id, // ✅ Always return real student ID
        courseId: 'N/A',
        courseName: item.course_name,
        instructor: item.instructor,
        department: item.department,
        semester: item.semester,
        year: item.year, // ✅ Include year
        className: item.class_name, // ✅ Include class/section
        submittedAt: new Date(item.created_at),
        text: item.feedback_text,
        sentiment: item.sentiment as 'positive' | 'negative' | 'neutral',
        sentimentScore: item.sentiment_score,
        sentimentConfidence: item.sentiment_confidence,
        topics: item.topics || [],
        flagged: item.flagged,
        processed: true,
        isAnonymous: item.is_anonymous || false, // ✅ Include anonymous flag
        ...(item.overall_rating && { overallRating: item.overall_rating }), // ✅ Include overall rating
        ...(item.student_name && { studentName: item.student_name }),
        ...(item.faculty_reply && { facultyReply: item.faculty_reply }),
        ...(item.reply_at && { replyAt: new Date(item.reply_at) }),
        ...(item.student_reply && { studentReply: item.student_reply }),
        ...(item.student_reply_at && { studentReplyAt: new Date(item.student_reply_at) })
      }));
    } catch (error) {
      console.error('Error in getStudentFeedback:', error);
      return [];
    }
  },

  // Save faculty reply to feedback
  async saveFacultyReply(feedbackId: string, reply: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('feedback')
        .update({
          faculty_reply: reply,
          reply_at: new Date().toISOString()
        })
        .eq('id', feedbackId);

      if (error) {
        console.error('Error saving faculty reply:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error in saveFacultyReply:', error);
      return { success: false, error: error.message };
    }
  },

  // Save student reply to faculty response
  async saveStudentReply(feedbackId: string, reply: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('feedback')
        .update({
          student_reply: reply,
          student_reply_at: new Date().toISOString()
        })
        .eq('id', feedbackId);

      if (error) {
        console.error('Error saving student reply:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error in saveStudentReply:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete feedback
  async deleteFeedback(feedbackId: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🗑️ Deleting feedback:', feedbackId);
      
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', feedbackId);

      if (error) {
        console.error('Error deleting feedback from Supabase:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Feedback deleted successfully!');
      return { success: true };
    } catch (error: any) {
      console.error('Error in deleteFeedback:', error);
      return { success: false, error: error.message };
    }
  },

  // Update feedback text
  async updateFeedback(feedbackId: string, newText: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('✏️ Updating feedback with Gemini AI:', feedbackId);
      
      // Re-analyze sentiment and topics with Gemini AI
      const classification = await classifyFeedbackWithGemini(newText);
      
      const { error } = await supabase
        .from('feedback')
        .update({
          feedback_text: newText,
          sentiment: classification.sentiment,
          sentiment_score: classification.sentimentScore,
          sentiment_confidence: Math.abs(classification.sentimentScore),
          topics: classification.topics,
          flagged: classification.sentiment === 'negative' && classification.sentimentScore < -0.5
        })
        .eq('id', feedbackId);

      if (error) {
        console.error('Error updating feedback in Supabase:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Feedback updated successfully with AI classification!');
      return { success: true };
    } catch (error: any) {
      console.error('Error in updateFeedback:', error);
      return { success: false, error: error.message };
    }
  },

  // Clear all feedback (for testing)
  clearAllFeedback(): void {
    localStorage.removeItem(FEEDBACK_STORAGE_KEY);
  }
};
