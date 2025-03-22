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
          created_at: string
          customer_id: string
          customer_name: string
          id: string
          rating: number
        }
        Insert: {
          comment: string
          created_at?: string
          customer_id: string
          customer_name: string
          id?: string
          rating: number
        }
        Update: {
          comment?: string
          created_at?: string
          customer_id?: string
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
      customers: {
        Row: {
          created_at: string
          free_valets: number
          id: string
          loyalty_points: number
          name: string
          phone: string
          valets_count: number
        }
        Insert: {
          created_at?: string
          free_valets?: number
          id?: string
          loyalty_points?: number
          name: string
          phone: string
          valets_count?: number
        }
        Update: {
          created_at?: string
          free_valets?: number
          id?: string
          loyalty_points?: number
          name?: string
          phone?: string
          valets_count?: number
        }
        Relationships: []
      }
      dry_cleaning_items: {
        Row: {
          created_at: string
          id: string
          name: string
          price: number
          quantity: number
          ticket_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          price: number
          quantity?: number
          ticket_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          price?: number
          quantity?: number
          ticket_id?: string
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
          created_at: string
          date: string
          description: string
          id: string
        }
        Insert: {
          amount: number
          created_at?: string
          date?: string
          description: string
          id?: string
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          description?: string
          id?: string
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          created_at: string
          id: string
          name: string
          quantity: number
          threshold: number
          unit: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          quantity?: number
          threshold?: number
          unit: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          quantity?: number
          threshold?: number
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      ticket_laundry_options: {
        Row: {
          created_at: string
          id: string
          option_type: Database["public"]["Enums"]["laundry_option"]
          ticket_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          option_type: Database["public"]["Enums"]["laundry_option"]
          ticket_id: string
        }
        Update: {
          created_at?: string
          id?: string
          option_type?: Database["public"]["Enums"]["laundry_option"]
          ticket_id?: string
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
          last_number: number
        }
        Insert: {
          id?: number
          last_number?: number
        }
        Update: {
          id?: number
          last_number?: number
        }
        Relationships: []
      }
      tickets: {
        Row: {
          basket_ticket_number: number | null
          created_at: string
          customer_id: string
          date: string
          delivered_date: string | null
          id: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          status: string
          ticket_number: string | null
          total: number
          updated_at: string
          valet_quantity: number
        }
        Insert: {
          basket_ticket_number?: number | null
          created_at?: string
          customer_id: string
          date?: string
          delivered_date?: string | null
          id?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          status?: string
          ticket_number?: string | null
          total: number
          updated_at?: string
          valet_quantity?: number
        }
        Update: {
          basket_ticket_number?: number | null
          created_at?: string
          customer_id?: string
          date?: string
          delivered_date?: string | null
          id?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          status?: string
          ticket_number?: string | null
          total?: number
          updated_at?: string
          valet_quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "tickets_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
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
        Returns: number
      }
      create_feedback_table_if_not_exists: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_metrics: {
        Args: {
          start_date: string
          end_date: string
        }
        Returns: {
          total_valets: number
          total_sales: number
          cash_payments: number
          debit_payments: number
          mercadopago_payments: number
          cuentadni_payments: number
        }[]
      }
      get_next_basket_ticket_number: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_next_ticket_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      laundry_option:
        | "separateByColor"
        | "delicateDry"
        | "stainRemoval"
        | "bleach"
        | "noFragrance"
        | "noDry"
      payment_method: "cash" | "debit" | "mercadopago" | "cuentadni"
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
