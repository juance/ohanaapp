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
      customer_feedback: {
        Row: {
          comment: string
          created_at: string | null
          customer_id: string | null
          customer_name: string
          id: string
          rating: number
          source: string | null
        }
        Insert: {
          comment: string
          created_at?: string | null
          customer_id?: string | null
          customer_name: string
          id?: string
          rating: number
          source?: string | null
        }
        Update: {
          comment?: string
          created_at?: string | null
          customer_id?: string | null
          customer_name?: string
          id?: string
          rating?: number
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_feedback_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_types: {
        Row: {
          description: string | null
          id: string
          name: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          created_at: string | null
          free_valets: number | null
          id: string
          last_visit: string | null
          loyalty_points: number | null
          name: string | null
          phone: string
          valets_count: number | null
          valets_redeemed: number | null
        }
        Insert: {
          created_at?: string | null
          free_valets?: number | null
          id?: string
          last_visit?: string | null
          loyalty_points?: number | null
          name?: string | null
          phone: string
          valets_count?: number | null
          valets_redeemed?: number | null
        }
        Update: {
          created_at?: string | null
          free_valets?: number | null
          id?: string
          last_visit?: string | null
          loyalty_points?: number | null
          name?: string | null
          phone?: string
          valets_count?: number | null
          valets_redeemed?: number | null
        }
        Relationships: []
      }
      dashboard_stats: {
        Row: {
          created_at: string | null
          id: string
          stats_data: Json
          stats_date: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          stats_data?: Json
          stats_date: string
        }
        Update: {
          created_at?: string | null
          id?: string
          stats_data?: Json
          stats_date?: string
        }
        Relationships: []
      }
      dry_cleaning_items: {
        Row: {
          created_at: string | null
          id: string
          name: string
          price: number
          quantity: number
          ticket_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          price?: number
          quantity?: number
          ticket_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          price?: number
          quantity?: number
          ticket_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dry_cleaning_items_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      error_logs: {
        Row: {
          browser_info: Json | null
          component: string | null
          created_at: string
          error_context: Json | null
          error_message: string
          error_stack: string | null
          id: string
          resolved: boolean
          updated_at: string
          user_id: string | null
        }
        Insert: {
          browser_info?: Json | null
          component?: string | null
          created_at?: string
          error_context?: Json | null
          error_message: string
          error_stack?: string | null
          id?: string
          resolved?: boolean
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          browser_info?: Json | null
          component?: string | null
          created_at?: string
          error_context?: Json | null
          error_message?: string
          error_stack?: string | null
          id?: string
          resolved?: boolean
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "error_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          created_at: string | null
          date: string | null
          description: string
          id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          date?: string | null
          description: string
          id?: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          date?: string | null
          description?: string
          id?: string
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          created_at: string | null
          id: string
          name: string
          notes: string | null
          quantity: number
          threshold: number | null
          unit: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          notes?: string | null
          quantity?: number
          threshold?: number | null
          unit?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          notes?: string | null
          quantity?: number
          threshold?: number | null
          unit?: string | null
        }
        Relationships: []
      }
      system_version: {
        Row: {
          changes: Json | null
          commit_sha: string | null
          created_at: string | null
          github_url: string | null
          id: string
          is_active: boolean | null
          release_date: string | null
          updated_at: string | null
          version: string
        }
        Insert: {
          changes?: Json | null
          commit_sha?: string | null
          created_at?: string | null
          github_url?: string | null
          id?: string
          is_active?: boolean | null
          release_date?: string | null
          updated_at?: string | null
          version: string
        }
        Update: {
          changes?: Json | null
          commit_sha?: string | null
          created_at?: string | null
          github_url?: string | null
          id?: string
          is_active?: boolean | null
          release_date?: string | null
          updated_at?: string | null
          version?: string
        }
        Relationships: []
      }
      test_table: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id?: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      ticket_laundry_options: {
        Row: {
          created_at: string | null
          id: string
          option_type: string
          ticket_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          option_type: string
          ticket_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          option_type?: string
          ticket_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_laundry_options_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_sequence: {
        Row: {
          id: number
          last_number: number | null
        }
        Insert: {
          id?: number
          last_number?: number | null
        }
        Update: {
          id?: number
          last_number?: number | null
        }
        Relationships: []
      }
      ticket_sequence_resets: {
        Row: {
          id: string
          notes: string | null
          previous_value: number | null
          reset_by: string
          reset_date: string | null
        }
        Insert: {
          id?: string
          notes?: string | null
          previous_value?: number | null
          reset_by: string
          reset_date?: string | null
        }
        Update: {
          id?: string
          notes?: string | null
          previous_value?: number | null
          reset_by?: string
          reset_date?: string | null
        }
        Relationships: []
      }
      tickets: {
        Row: {
          cancel_reason: string | null
          created_at: string | null
          customer_id: string | null
          date: string | null
          delivered_date: string | null
          id: string
          is_canceled: boolean | null
          is_paid: boolean | null
          payment_amount: number | null
          payment_method: string | null
          payment_status: string | null
          status: string | null
          ticket_number: string
          total: number
          updated_at: string | null
          valet_quantity: number | null
        }
        Insert: {
          cancel_reason?: string | null
          created_at?: string | null
          customer_id?: string | null
          date?: string | null
          delivered_date?: string | null
          id?: string
          is_canceled?: boolean | null
          is_paid?: boolean | null
          payment_amount?: number | null
          payment_method?: string | null
          payment_status?: string | null
          status?: string | null
          ticket_number: string
          total?: number
          updated_at?: string | null
          valet_quantity?: number | null
        }
        Update: {
          cancel_reason?: string | null
          created_at?: string | null
          customer_id?: string | null
          date?: string | null
          delivered_date?: string | null
          id?: string
          is_canceled?: boolean | null
          is_paid?: boolean | null
          payment_amount?: number | null
          payment_method?: string | null
          payment_status?: string | null
          status?: string | null
          ticket_number?: string
          total?: number
          updated_at?: string | null
          valet_quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_tickets_customers"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string
          password: string
          phone_number: string
          role: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          password: string
          phone_number: string
          role?: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          password?: string
          phone_number?: string
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_basket_ticket_number: {
        Args: { ticket_id: string }
        Returns: undefined
      }
      check_relation_exists: {
        Args: { table_name: string; foreign_table: string }
        Returns: boolean
      }
      create_user: {
        Args: {
          user_name: string
          user_phone: string
          user_password: string
          user_role?: string
          user_email?: string
        }
        Returns: {
          id: string
          name: string
          email: string
          phone_number: string
          role: string
          created_at: string
        }[]
      }
      delete_user: {
        Args: { user_id: string }
        Returns: undefined
      }
      get_all_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          email: string
          phone_number: string
          role: string
          created_at: string
        }[]
      }
      get_column_exists: {
        Args: { table_name: string; column_name: string }
        Returns: boolean
      }
      get_next_ticket_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_by_id: {
        Args: { user_id: string }
        Returns: {
          id: string
          name: string
          email: string
          phone_number: string
          role: string
          created_at: string
        }[]
      }
      get_user_by_phone: {
        Args: { phone: string }
        Returns: {
          id: string
          name: string
          email: string
          phone_number: string
          password: string
          role: string
          created_at: string
        }[]
      }
      recalculate_customer_visits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      reset_ticket_sequence: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_user: {
        Args: {
          user_id: string
          user_name: string
          user_phone: string
          user_email?: string
          user_role?: string
          user_password?: string
        }
        Returns: {
          id: string
          name: string
          email: string
          phone_number: string
          role: string
          created_at: string
        }[]
      }
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
