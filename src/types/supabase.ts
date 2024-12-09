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
          certificate_status: boolean | null
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
          certificate_status?: boolean | null
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
          certificate_status?: boolean | null
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
      certificate_v1_v2_mapping: {
        Row: {
          id: number
          user_id: string | null
          v1_certificate_id: string | null
          v2_certificate_id: string | null
        }
        Insert: {
          id?: number
          user_id?: string | null
          v1_certificate_id?: string | null
          v2_certificate_id?: string | null
        }
        Update: {
          id?: number
          user_id?: string | null
          v1_certificate_id?: string | null
          v2_certificate_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificate_v1_v2_mapping_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificate_v1_v2_mapping_v1_certificate_id_fkey"
            columns: ["v1_certificate_id"]
            isOneToOne: false
            referencedRelation: "upload_certificate"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificate_v1_v2_mapping_v2_certificate_id_fkey"
            columns: ["v2_certificate_id"]
            isOneToOne: false
            referencedRelation: "certificate_master"
            referencedColumns: ["id"]
          },
        ]
      }
      clubs: {
        Row: {
          club_name: string | null
          club_id: number
          created_at: string
        }
        Insert: {
          club_name?: string | null
          club_id?: number
          created_at?: string
        }
        Update: {
          club_name?: string | null
          club_id?: number
          created_at?: string
        }
        Relationships: []
      }
       coupons: {
        Row: {
          club_id: number | null
          coupon_duration: string | null
          coupon_id: number
          created_at: string
          program_id: number | null
          start_date: string | null
          start_period: string | null
          student_id: string | null
          number_of_coupons: number | null
        }
        Insert: {
          club_id?: number | null
          coupon_duration?: string | null
          coupon_id?: number
          created_at?: string
          program_id?: number | null
          start_date?: string | null
          start_period?: string | null
          student_id?: string | null
          number_of_coupons?: number | null
          
        }
        Update: {
          club_id?: number | null
          coupon_duration?: string | null
          coupon_id?: number
          created_at?: string
          program_id?: number | null
          start_date?: string | null
          start_period?: string | null
          student_id?: string | null
          number_of_coupons?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "coupons_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["club_id"]
          },
          {
            foreignKeyName: "coupons_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "coupons_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
       }
        coupon_codes: {
        Row: {
          coupon_code: string | null
          coupon_id: number | null
          created_at: string
          id: number
        }
        Insert: {
          coupon_code?: string | null
          coupon_id?: number | null
          created_at?: string
          id?: number
        }
        Update: {
          coupon_code?: string | null
          coupon_id?: number | null
          created_at?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "coupon_codes_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["coupon_id"]
          },
        ]
      }
      donation: {
        Row: {
          amount: number | null
          bank_charges: number | null
          created_at: string | null
          date: string | null
          donation_description: string | null
          donation_id: number
          remaining_amount: number | null
          source_of_amount: string | null
          sponsor_id: number
        }
        Insert: {
          amount?: number | null
          bank_charges?: number | null
          created_at?: string | null
          date?: string | null
          donation_description?: string | null
          donation_id?: number
          remaining_amount?: number | null
          source_of_amount?: string | null
          sponsor_id: number
        }
        Update: {
          amount?: number | null
          bank_charges?: number | null
          created_at?: string | null
          date?: string | null
          donation_description?: string | null
          donation_id?: number
          remaining_amount?: number | null
          source_of_amount?: string | null
          sponsor_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "donation_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsor"
            referencedColumns: ["sponsor_id"]
          },
        ]
      }
      donation_allocation: {
        Row: {
          amount: number | null
          created_at: string
          id: number
          program_id: number | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          id?: number
          program_id?: number | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          id?: number
          program_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "donation_allocation_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["program_id"]
          },
        ]
      }
      player_data_testing: {
        Row: {
          eliminated: string | null
          id: number
          lap_time: number | null
          player_id: string
          position: number | null
          race_date: string | null
          race_time: number | null
          race_type: string | null
          reaction_time: number | null
          speed: number | null
          track_distance: number | null
        }
        Insert: {
          eliminated?: string | null
          id?: number
          lap_time?: number | null
          player_id: string
          position?: number | null
          race_date?: string | null
          race_time?: number | null
          race_type?: string | null
          reaction_time?: number | null
          speed?: number | null
          track_distance?: number | null
        }
        Update: {
          eliminated?: string | null
          id?: number
          lap_time?: number | null
          player_id?: string
          position?: number | null
          race_date?: string | null
          race_time?: number | null
          race_type?: string | null
          reaction_time?: number | null
          speed?: number | null
          track_distance?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "player_data_testing_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "register_player"
            referencedColumns: ["player_id"]
          },
        ]
      }
      player_race_stats: {
        Row: {
          best_reaction_time: number | null
          city_rank: number | null
          country_rank: number | null
          id: number
          last_updated: string | null
          num_races: number | null
          player_id: string
          race_type: string
          top_speed: number | null
          world_rank: number | null
        }
        Insert: {
          best_reaction_time?: number | null
          city_rank?: number | null
          country_rank?: number | null
          id?: number
          last_updated?: string | null
          num_races?: number | null
          player_id: string
          race_type: string
          top_speed?: number | null
          world_rank?: number | null
        }
        Update: {
          best_reaction_time?: number | null
          city_rank?: number | null
          country_rank?: number | null
          id?: number
          last_updated?: string | null
          num_races?: number | null
          player_id?: string
          race_type?: string
          top_speed?: number | null
          world_rank?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "player_race_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "register_player"
            referencedColumns: ["player_id"]
          },
        ]
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
        Relationships: []
      }
      programs: {
        Row: {
          club: string | null
          club_id: number | null
          created_at: string
          period: string | null
          program_arabic_name: string | null
          program_english_name: string | null
          program_id: number
          subscription_value: string | null
          total_allocated_donation: number
          total_remaining_donation: number
        }
        Insert: {
          club?: string | null
          club_id?: number | null
          created_at?: string
          period?: string | null
          program_arabic_name?: string | null
          program_english_name?: string | null
          program_id?: number
          subscription_value?: string | null
          total_allocated_donation?: number
          total_remaining_donation?: number
        }
        Update: {
          club?: string | null
          club_id?: number | null
          created_at?: string
          period?: string | null
          program_arabic_name?: string | null
          program_english_name?: string | null
          program_id?: number
          subscription_value?: string | null
          total_allocated_donation?: number
          total_remaining_donation?: number
        }
        Relationships: [
          {
            foreignKeyName: "programs_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["club_id"]
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
      register_player: {
        Row: {
          city: string | null
          country: string | null
          player_id: string
          user_id: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          player_id: string
          user_id?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          player_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "register_player_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      sponsor: {
        Row: {
          email: string | null
          name: string | null
          phone_number: string | null
          sponsor_id: number
          user_id: string | null
        }
        Insert: {
          email?: string | null
          name?: string | null
          phone_number?: string | null
          sponsor_id?: number
          user_id?: string | null
        }
        Update: {
          email?: string | null
          name?: string | null
          phone_number?: string | null
          sponsor_id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsor_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
          certificate_asserted: string | null
          certificate_image_url: string | null
          id: string
          skill_id: number
          user_id: string
        }
        Insert: {
          certificate_asserted?: string | null
          certificate_image_url?: string | null
          id: string
          skill_id: number
          user_id: string
        }
        Update: {
          certificate_asserted?: string | null
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
      calculate_best_reaction_time: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      calculate_city_rank: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      calculate_country_rank: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      calculate_num_races: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      calculate_top_speed: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      calculate_world_rank: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
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
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      operation: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
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
