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
        }
        Insert: {
          comment: string
          created_at?: string | null
          customer_id?: string | null
          customer_name: string
          id?: string
          rating: number
        }
        Update: {
          comment?: string
          created_at?: string | null
          customer_id?: string | null
          customer_name?: string
          id?: string
          rating?: number
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
          id: string
          is_active: boolean | null
          release_date: string | null
          version: string
        }
        Insert: {
          changes?: Json | null
          id?: string
          is_active?: boolean | null
          release_date?: string | null
          version: string
        }
        Update: {
          changes?: Json | null
          id?: string
          is_active?: boolean | null
          release_date?: string | null
          version?: string
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
          basket_ticket_number: string | null
          cancel_reason: string | null
          created_at: string | null
          customer_id: string | null
          date: string | null
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
          basket_ticket_number?: string | null
          cancel_reason?: string | null
          created_at?: string | null
          customer_id?: string | null
          date?: string | null
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
          basket_ticket_number?: string | null
          cancel_reason?: string | null
          created_at?: string | null
          customer_id?: string | null
          date?: string | null
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
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_basket_ticket_number: {
        Args: {
          ticket_id: string
        }
        Returns: undefined
      }
      get_next_ticket_number: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      reset_ticket_sequence: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
