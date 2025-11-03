import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from '../config/supabase';

export const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

// Database types
export interface DatabaseFeedback {
  id: string;
  student_id: string;
  student_name?: string;
  course_name: string;
  instructor: string;
  department: string;
  semester: string;
  feedback_text: string;
  is_anonymous: boolean;
  sentiment: string;
  sentiment_score: number;
  sentiment_confidence: number;
  topics: any;
  urgency: string;
  flagged: boolean;
  created_at: string;
}

export interface DatabaseStudent {
  id: string;
  student_id: string;
  email: string;
  full_name: string;
  created_at: string;
}
