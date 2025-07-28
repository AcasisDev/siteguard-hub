export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      credentials: {
        Row: {
          created_at: string | null
          host: string
          id: string
          notes: string | null
          password: string
          port: number | null
          type: Database["public"]["Enums"]["credential_type"]
          updated_at: string | null
          user_id: string
          username: string
          website_id: string
        }
        Insert: {
          created_at?: string | null
          host: string
          id?: string
          notes?: string | null
          password: string
          port?: number | null
          type: Database["public"]["Enums"]["credential_type"]
          updated_at?: string | null
          user_id: string
          username: string
          website_id: string
        }
        Update: {
          created_at?: string | null
          host?: string
          id?: string
          notes?: string | null
          password?: string
          port?: number | null
          type?: Database["public"]["Enums"]["credential_type"]
          updated_at?: string | null
          user_id?: string
          username?: string
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credentials_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      domains: {
        Row: {
          created_at: string | null
          domain_name: string
          expire_date: string
          id: string
          nameservers: string[] | null
          register_date: string
          registrar: string
          status: Database["public"]["Enums"]["domain_status"]
          updated_at: string | null
          user_id: string
          website_id: string
        }
        Insert: {
          created_at?: string | null
          domain_name: string
          expire_date: string
          id?: string
          nameservers?: string[] | null
          register_date: string
          registrar: string
          status?: Database["public"]["Enums"]["domain_status"]
          updated_at?: string | null
          user_id: string
          website_id: string
        }
        Update: {
          created_at?: string | null
          domain_name?: string
          expire_date?: string
          id?: string
          nameservers?: string[] | null
          register_date?: string
          registrar?: string
          status?: Database["public"]["Enums"]["domain_status"]
          updated_at?: string | null
          user_id?: string
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "domains_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      servers: {
        Row: {
          created_at: string | null
          id: string
          ip_address: string
          notes: string | null
          provider: string
          ssh_password: string | null
          ssh_username: string | null
          status: Database["public"]["Enums"]["server_status"]
          updated_at: string | null
          user_id: string
          website_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address: string
          notes?: string | null
          provider: string
          ssh_password?: string | null
          ssh_username?: string | null
          status?: Database["public"]["Enums"]["server_status"]
          updated_at?: string | null
          user_id: string
          website_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: string
          notes?: string | null
          provider?: string
          ssh_password?: string | null
          ssh_username?: string | null
          status?: Database["public"]["Enums"]["server_status"]
          updated_at?: string | null
          user_id?: string
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "servers_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      websites: {
        Row: {
          created_at: string | null
          domain: string
          id: string
          name: string
          notes: string | null
          provider: string
          server_ip: string
          status: Database["public"]["Enums"]["website_status"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          domain: string
          id?: string
          name: string
          notes?: string | null
          provider: string
          server_ip: string
          status?: Database["public"]["Enums"]["website_status"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          domain?: string
          id?: string
          name?: string
          notes?: string | null
          provider?: string
          server_ip?: string
          status?: Database["public"]["Enums"]["website_status"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "super_admin" | "editor"
      credential_type: "ftp" | "smtp" | "cpanel" | "database" | "ssh" | "other"
      domain_status: "active" | "expired" | "pending"
      server_status: "online" | "offline" | "maintenance"
      website_status: "active" | "inactive" | "maintenance"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "super_admin", "editor"],
      credential_type: ["ftp", "smtp", "cpanel", "database", "ssh", "other"],
      domain_status: ["active", "expired", "pending"],
      server_status: ["online", "offline", "maintenance"],
      website_status: ["active", "inactive", "maintenance"],
    },
  },
} as const
