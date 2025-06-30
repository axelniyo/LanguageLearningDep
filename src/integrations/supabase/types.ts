export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      courses: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          language_id: string | null
          level_requirement: number | null
          name: string
          order_index: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          language_id?: string | null
          level_requirement?: number | null
          name: string
          order_index?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          language_id?: string | null
          level_requirement?: number | null
          name?: string
          order_index?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          correct_answer: string
          created_at: string | null
          difficulty_level: string | null
          exercise_type: string
          explanation: string | null
          hints: Json | null
          id: string
          lesson_id: string | null
          options: Json | null
          order_index: number | null
          points: number | null
          question: string
        }
        Insert: {
          correct_answer: string
          created_at?: string | null
          difficulty_level?: string | null
          exercise_type: string
          explanation?: string | null
          hints?: Json | null
          id?: string
          lesson_id?: string | null
          options?: Json | null
          order_index?: number | null
          points?: number | null
          question: string
        }
        Update: {
          correct_answer?: string
          created_at?: string | null
          difficulty_level?: string | null
          exercise_type?: string
          explanation?: string | null
          hints?: Json | null
          id?: string
          lesson_id?: string | null
          options?: Json | null
          order_index?: number | null
          points?: number | null
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercises_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      grammar_rules: {
        Row: {
          created_at: string | null
          difficulty_level: string | null
          examples: Json | null
          explanation: string
          id: string
          lesson_id: string | null
          order_index: number | null
          title: string
        }
        Insert: {
          created_at?: string | null
          difficulty_level?: string | null
          examples?: Json | null
          explanation: string
          id?: string
          lesson_id?: string | null
          order_index?: number | null
          title: string
        }
        Update: {
          created_at?: string | null
          difficulty_level?: string | null
          examples?: Json | null
          explanation?: string
          id?: string
          lesson_id?: string | null
          order_index?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "grammar_rules_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      languages: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          flag_emoji: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          flag_emoji?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          flag_emoji?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          lesson_type: string | null
          name: string
          order_index: number | null
          unit_id: string | null
          xp_reward: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          lesson_type?: string | null
          name: string
          order_index?: number | null
          unit_id?: string | null
          xp_reward?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          lesson_type?: string | null
          name?: string
          order_index?: number | null
          unit_id?: string | null
          xp_reward?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      phrases: {
        Row: {
          audio_url: string | null
          context: string | null
          created_at: string | null
          difficulty_level: string | null
          id: string
          lesson_id: string | null
          order_index: number | null
          phrase: string
          pronunciation: string | null
          translation: string
        }
        Insert: {
          audio_url?: string | null
          context?: string | null
          created_at?: string | null
          difficulty_level?: string | null
          id?: string
          lesson_id?: string | null
          order_index?: number | null
          phrase: string
          pronunciation?: string | null
          translation: string
        }
        Update: {
          audio_url?: string | null
          context?: string | null
          created_at?: string | null
          difficulty_level?: string | null
          id?: string
          lesson_id?: string | null
          order_index?: number | null
          phrase?: string
          pronunciation?: string | null
          translation?: string
        }
        Relationships: [
          {
            foreignKeyName: "phrases_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          id: string
          last_lesson_date: string | null
          level: number | null
          streak_count: number | null
          updated_at: string | null
          username: string | null
          xp: number | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          last_lesson_date?: string | null
          level?: number | null
          streak_count?: number | null
          updated_at?: string | null
          username?: string | null
          xp?: number | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_lesson_date?: string | null
          level?: number | null
          streak_count?: number | null
          updated_at?: string | null
          username?: string | null
          xp?: number | null
        }
        Relationships: []
      }
      units: {
        Row: {
          course_id: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          order_index: number | null
          xp_reward: number | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          order_index?: number | null
          xp_reward?: number | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          order_index?: number | null
          xp_reward?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "units_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_enrollments: {
        Row: {
          course_id: string | null
          current_unit_id: string | null
          enrolled_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          course_id?: string | null
          current_unit_id?: string | null
          enrolled_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          course_id?: string | null
          current_unit_id?: string | null
          enrolled_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_enrollments_current_unit_id_fkey"
            columns: ["current_unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          attempts: number | null
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          lesson_id: string | null
          score: number | null
          user_id: string | null
        }
        Insert: {
          attempts?: number | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          score?: number | null
          user_id?: string | null
        }
        Update: {
          attempts?: number | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          score?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      vocabulary: {
        Row: {
          audio_url: string | null
          created_at: string | null
          difficulty_level: string | null
          example_sentence: string | null
          example_translation: string | null
          id: string
          lesson_id: string | null
          order_index: number | null
          pronunciation: string | null
          translation: string
          word: string
          word_type: string | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string | null
          difficulty_level?: string | null
          example_sentence?: string | null
          example_translation?: string | null
          id?: string
          lesson_id?: string | null
          order_index?: number | null
          pronunciation?: string | null
          translation: string
          word: string
          word_type?: string | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string | null
          difficulty_level?: string | null
          example_sentence?: string | null
          example_translation?: string | null
          id?: string
          lesson_id?: string | null
          order_index?: number | null
          pronunciation?: string | null
          translation?: string
          word?: string
          word_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vocabulary_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
