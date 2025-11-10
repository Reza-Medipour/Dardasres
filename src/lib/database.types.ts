export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          avatar_url: string | null
          subscription_type: 'free' | 'premium'
          subscription_expires_at: string | null
          total_usage_mb: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          avatar_url?: string | null
          subscription_type?: 'free' | 'premium'
          subscription_expires_at?: string | null
          total_usage_mb?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          avatar_url?: string | null
          subscription_type?: 'free' | 'premium'
          subscription_expires_at?: string | null
          total_usage_mb?: number
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          user_id: string
          service_type: 'transcription' | 'subtitle' | 'summary' | 'title' | 'image' | 'video'
          input_type: 'audio' | 'video' | 'link' | 'text'
          input_url: string | null
          input_language: string
          output_language: string | null
          file_size_mb: number
          status: 'pending' | 'processing' | 'completed' | 'failed'
          progress: number
          result_data: Json | null
          error_message: string | null
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          service_type: 'transcription' | 'subtitle' | 'summary' | 'title' | 'image' | 'video'
          input_type: 'audio' | 'video' | 'link' | 'text'
          input_url?: string | null
          input_language?: string
          output_language?: string | null
          file_size_mb?: number
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          progress?: number
          result_data?: Json | null
          error_message?: string | null
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          service_type?: 'transcription' | 'subtitle' | 'summary' | 'title' | 'image' | 'video'
          input_type?: 'audio' | 'video' | 'link' | 'text'
          input_url?: string | null
          input_language?: string
          output_language?: string | null
          file_size_mb?: number
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          progress?: number
          result_data?: Json | null
          error_message?: string | null
          created_at?: string
          completed_at?: string | null
        }
      }
      usage_history: {
        Row: {
          id: string
          user_id: string
          service_id: string
          service_type: string
          file_size_mb: number
          cost_credits: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          service_id: string
          service_type: string
          file_size_mb?: number
          cost_credits?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          service_id?: string
          service_type?: string
          file_size_mb?: number
          cost_credits?: number
          created_at?: string
        }
      }
      subscription_plans: {
        Row: {
          id: string
          name: string
          name_fa: string
          price: number
          duration_days: number
          max_file_size_mb: number
          monthly_quota_mb: number
          features: Json
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          name_fa: string
          price?: number
          duration_days?: number
          max_file_size_mb?: number
          monthly_quota_mb?: number
          features?: Json
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_fa?: string
          price?: number
          duration_days?: number
          max_file_size_mb?: number
          monthly_quota_mb?: number
          features?: Json
          is_active?: boolean
          created_at?: string
        }
      }
    }
  }
}
