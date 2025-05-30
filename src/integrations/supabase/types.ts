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
      campaigns: {
        Row: {
          clicked_count: number | null
          completed_at: string | null
          content: string
          created_at: string | null
          delivered_count: number | null
          failed_count: number | null
          id: string
          name: string
          opened_count: number | null
          recipient_count: number | null
          scheduled_at: string | null
          sent_count: number | null
          started_at: string | null
          status: string
          subject: string | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          clicked_count?: number | null
          completed_at?: string | null
          content: string
          created_at?: string | null
          delivered_count?: number | null
          failed_count?: number | null
          id?: string
          name: string
          opened_count?: number | null
          recipient_count?: number | null
          scheduled_at?: string | null
          sent_count?: number | null
          started_at?: string | null
          status?: string
          subject?: string | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          clicked_count?: number | null
          completed_at?: string | null
          content?: string
          created_at?: string | null
          delivered_count?: number | null
          failed_count?: number | null
          id?: string
          name?: string
          opened_count?: number | null
          recipient_count?: number | null
          scheduled_at?: string | null
          sent_count?: number | null
          started_at?: string | null
          status?: string
          subject?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      message_history: {
        Row: {
          campaign_id: string | null
          content: string
          created_at: string | null
          delivered_at: string | null
          error_message: string | null
          failed_at: string | null
          id: string
          provider_message_id: string | null
          recipient: string
          sent_at: string | null
          status: string
          type: string
        }
        Insert: {
          campaign_id?: string | null
          content: string
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          failed_at?: string | null
          id?: string
          provider_message_id?: string | null
          recipient: string
          sent_at?: string | null
          status?: string
          type?: string
        }
        Update: {
          campaign_id?: string | null
          content?: string
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          failed_at?: string | null
          id?: string
          provider_message_id?: string | null
          recipient?: string
          sent_at?: string | null
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_history_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      service_status: {
        Row: {
          cpu_usage: number | null
          created_at: string | null
          id: string
          instances: number | null
          last_health_check: string | null
          memory_usage: number | null
          request_rate: string | null
          service_name: string
          status: string
          updated_at: string | null
          uptime_percentage: number | null
          version: string | null
        }
        Insert: {
          cpu_usage?: number | null
          created_at?: string | null
          id?: string
          instances?: number | null
          last_health_check?: string | null
          memory_usage?: number | null
          request_rate?: string | null
          service_name: string
          status?: string
          updated_at?: string | null
          uptime_percentage?: number | null
          version?: string | null
        }
        Update: {
          cpu_usage?: number | null
          created_at?: string | null
          id?: string
          instances?: number | null
          last_health_check?: string | null
          memory_usage?: number | null
          request_rate?: string | null
          service_name?: string
          status?: string
          updated_at?: string | null
          uptime_percentage?: number | null
          version?: string | null
        }
        Relationships: []
      }
      system_metrics: {
        Row: {
          id: string
          labels: Json | null
          metric_name: string
          metric_type: string
          metric_value: number
          recorded_at: string | null
        }
        Insert: {
          id?: string
          labels?: Json | null
          metric_name: string
          metric_type: string
          metric_value: number
          recorded_at?: string | null
        }
        Update: {
          id?: string
          labels?: Json | null
          metric_name?: string
          metric_type?: string
          metric_value?: number
          recorded_at?: string | null
        }
        Relationships: []
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
