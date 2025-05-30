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
      agents: {
        Row: {
          client_id: string | null
          created_at: string | null
          department: string | null
          email: string | null
          id: string
          name: string
          phone: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          department?: string | null
          email?: string | null
          id?: string
          name: string
          phone: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          department?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          clicked_count: number
          completed_at: string | null
          content: string
          created_at: string
          delivered_count: number
          failed_count: number
          id: string
          name: string
          opened_count: number
          recipient_count: number
          scheduled_at: string | null
          sent_count: number
          started_at: string | null
          status: string
          subject: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          clicked_count?: number
          completed_at?: string | null
          content: string
          created_at?: string
          delivered_count?: number
          failed_count?: number
          id?: string
          name: string
          opened_count?: number
          recipient_count?: number
          scheduled_at?: string | null
          sent_count?: number
          started_at?: string | null
          status?: string
          subject?: string | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          clicked_count?: number
          completed_at?: string | null
          content?: string
          created_at?: string
          delivered_count?: number
          failed_count?: number
          id?: string
          name?: string
          opened_count?: number
          recipient_count?: number
          scheduled_at?: string | null
          sent_count?: number
          started_at?: string | null
          status?: string
          subject?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          address: string | null
          brand_color: string | null
          city: string | null
          contact_email: string
          contact_phone: string | null
          country: string | null
          created_at: string | null
          id: string
          logo_url: string | null
          name: string
          plan_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          brand_color?: string | null
          city?: string | null
          contact_email: string
          contact_phone?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
          plan_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          brand_color?: string | null
          city?: string | null
          contact_email?: string
          contact_phone?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          plan_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          client_id: string | null
          created_at: string | null
          due_date: string | null
          id: string
          issue_date: string | null
          items: Json | null
          paid_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          client_id?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          issue_date?: string | null
          items?: Json | null
          paid_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          client_id?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          issue_date?: string | null
          items?: Json | null
          paid_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      message_history: {
        Row: {
          campaign_id: string | null
          content: string
          created_at: string
          delivered_at: string | null
          error_message: string | null
          failed_at: string | null
          id: string
          provider_message_id: string | null
          recipient: string
          sent_at: string | null
          status: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          campaign_id?: string | null
          content: string
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          failed_at?: string | null
          id?: string
          provider_message_id?: string | null
          recipient: string
          sent_at?: string | null
          status?: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          campaign_id?: string | null
          content?: string
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          failed_at?: string | null
          id?: string
          provider_message_id?: string | null
          recipient?: string
          sent_at?: string | null
          status?: string
          type?: string
          updated_at?: string
          user_id?: string
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
      plans: {
        Row: {
          active: boolean | null
          airtime_amount: number
          created_at: string | null
          data_amount: number
          description: string | null
          features: Json | null
          id: string
          name: string
          price: number
          recipients_limit: number
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          airtime_amount: number
          created_at?: string | null
          data_amount: number
          description?: string | null
          features?: Json | null
          id?: string
          name: string
          price: number
          recipients_limit: number
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          airtime_amount?: number
          created_at?: string | null
          data_amount?: number
          description?: string | null
          features?: Json | null
          id?: string
          name?: string
          price?: number
          recipients_limit?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          full_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          role: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      scheduled_rewards: {
        Row: {
          amount: number
          client_id: string | null
          created_at: string | null
          id: string
          name: string
          recipients: Json
          schedule_type: string
          scheduled_date: string | null
          status: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          client_id?: string | null
          created_at?: string | null
          id?: string
          name: string
          recipients: Json
          schedule_type: string
          scheduled_date?: string | null
          status?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          client_id?: string | null
          created_at?: string | null
          id?: string
          name?: string
          recipients?: Json
          schedule_type?: string
          scheduled_date?: string | null
          status?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_rewards_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          agent_id: string | null
          amount: number
          client_id: string | null
          created_at: string | null
          id: string
          network: string | null
          phone_number: string
          reference: string | null
          status: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          agent_id?: string | null
          amount: number
          client_id?: string | null
          created_at?: string | null
          id?: string
          network?: string | null
          phone_number: string
          reference?: string | null
          status?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          agent_id?: string | null
          amount?: number
          client_id?: string | null
          created_at?: string | null
          id?: string
          network?: string | null
          phone_number?: string
          reference?: string | null
          status?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
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
