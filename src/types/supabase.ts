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
      certificate_master: {
        Row: {
          certificate_country: string | null
          certificate_name_arabic: string | null
          certificate_name_english: string | null
          id: string
          inserted_at: string
          issue_authority: string | null
          issue_year: string | null
          number_of_hours: string | null
          skill_level: string | null
          skill_type: string | null
          tags: string[] | null
        }
        Insert: {
          certificate_country?: string | null
          certificate_name_arabic?: string | null
          certificate_name_english?: string | null
          id?: string
          inserted_at?: string
          issue_authority?: string | null
          issue_year?: string | null
          number_of_hours?: string | null
          skill_level?: string | null
          skill_type?: string | null
          tags?: string[] | null
        }
        Update: {
          certificate_country?: string | null
          certificate_name_arabic?: string | null
          certificate_name_english?: string | null
          id?: string
          inserted_at?: string
          issue_authority?: string | null
          issue_year?: string | null
          number_of_hours?: string | null
          skill_level?: string | null
          skill_type?: string | null
          tags?: string[] | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: string | null
          email: string | null
          gender: string | null
          id: string
          mobile: string | null
          name: string | null
          profile_image_url: string | null
          updated_at: string | null
        }
        Insert: {
          age?: string | null
          email?: string | null
          gender?: string | null
          id: string
          mobile?: string | null
          name?: string | null
          profile_image_url?: string | null
          updated_at?: string | null
        }
        Update: {
          age?: string | null
          email?: string | null
          gender?: string | null
          id?: string
          mobile?: string | null
          name?: string | null
          profile_image_url?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      skill_category: {
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
      skill_hashtags: {
        Row: {
          id: number
          skill_category_id: number | null
          skill_hashtag: string | null
        }
        Insert: {
          id?: number
          skill_category_id?: number | null
          skill_hashtag?: string | null
        }
        Update: {
          id?: number
          skill_category_id?: number | null
          skill_hashtag?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skill_hashtags_skill_category_id_fkey"
            columns: ["skill_category_id"]
            isOneToOne: false
            referencedRelation: "skill_category"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_types: {
        Row: {
          id: number
          skill_type_name: string | null
        }
        Insert: {
          id?: number
          skill_type_name?: string | null
        }
        Update: {
          id?: number
          skill_type_name?: string | null
        }
        Relationships: []
      }
      skills: {
        Row: {
          id: number
          name: string | null
          skill_hashtag_id: number | null
        }
        Insert: {
          id?: number
          name?: string | null
          skill_hashtag_id?: number | null
        }
        Update: {
          id?: number
          name?: string | null
          skill_hashtag_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "skills_skill_hashtag_id_fkey"
            columns: ["skill_hashtag_id"]
            isOneToOne: false
            referencedRelation: "skill_hashtags"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription: {
        Row: {
          project_id: number
          subscription: number | null
          user_id: string
        }
        Insert: {
          project_id: number
          subscription?: number | null
          user_id: string
        }
        Update: {
          project_id?: number
          subscription?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          id: number
          skill_type_id: number | null
          tag: string | null
        }
        Insert: {
          id?: number
          skill_type_id?: number | null
          tag?: string | null
        }
        Update: {
          id?: number
          skill_type_id?: number | null
          tag?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tags_skill_type_id_fkey"
            columns: ["skill_type_id"]
            isOneToOne: false
            referencedRelation: "skill_types"
            referencedColumns: ["id"]
          },
        ]
      }
      upload_certificate: {
        Row: {
          certificate_image_url: string | null
          id: string
          skill_id: number
          user_id: string
        }
        Insert: {
          certificate_image_url?: string | null
          id: string
          skill_id: number
          user_id: string
        }
        Update: {
          certificate_image_url?: string | null
          id?: string
          skill_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "upload_certificate_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "upload_certificate_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_user: {
        Args: Record<PropertyKey, never>
        Returns: string
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
