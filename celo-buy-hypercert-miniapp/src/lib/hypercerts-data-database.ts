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
      blueprints: {
        Row: {
          admin_id: string
          created_at: string
          display_size: number
          form_values: Json
          id: number
          minter_address: string
          registry_id: string
        }
        Insert: {
          admin_id: string
          created_at?: string
          display_size?: number
          form_values: Json
          id?: number
          minter_address: string
          registry_id: string
        }
        Update: {
          admin_id?: string
          created_at?: string
          display_size?: number
          form_values?: Json
          id?: number
          minter_address?: string
          registry_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blueprints_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["address"]
          },
          {
            foreignKeyName: "blueprints_registry_id_fkey"
            columns: ["registry_id"]
            isOneToOne: false
            referencedRelation: "registries"
            referencedColumns: ["id"]
          },
        ]
      }
      claims: {
        Row: {
          admin_id: string
          chain_id: number
          created_at: string
          display_size: number
          hypercert_id: string
          id: string
          owner_id: string
          registry_id: string
        }
        Insert: {
          admin_id: string
          chain_id: number
          created_at?: string
          display_size?: number
          hypercert_id: string
          id?: string
          owner_id: string
          registry_id: string
        }
        Update: {
          admin_id?: string
          chain_id?: number
          created_at?: string
          display_size?: number
          hypercert_id?: string
          id?: string
          owner_id?: string
          registry_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "claims_registry_id_fkey"
            columns: ["registry_id"]
            isOneToOne: false
            referencedRelation: "registries"
            referencedColumns: ["id"]
          },
        ]
      }
      default_sponsor_metadata: {
        Row: {
          address: string
          companyName: string | null
          created_at: string
          firstName: string | null
          image: string
          lastName: string | null
          type: string
        }
        Insert: {
          address: string
          companyName?: string | null
          created_at?: string
          firstName?: string | null
          image: string
          lastName?: string | null
          type: string
        }
        Update: {
          address?: string
          companyName?: string | null
          created_at?: string
          firstName?: string | null
          image?: string
          lastName?: string | null
          type?: string
        }
        Relationships: []
      }
      fraction_sponsor_metadata: {
        Row: {
          chain_id: number
          companyName: string | null
          created_at: string
          firstName: string | null
          fraction_id: string
          hypercert_id: string
          id: string
          image: string
          lastName: string | null
          strategy: string
          type: string
          value: string
        }
        Insert: {
          chain_id: number
          companyName?: string | null
          created_at?: string
          firstName?: string | null
          fraction_id: string
          hypercert_id: string
          id?: string
          image: string
          lastName?: string | null
          strategy: string
          type: string
          value: string
        }
        Update: {
          chain_id?: number
          companyName?: string | null
          created_at?: string
          firstName?: string | null
          fraction_id?: string
          hypercert_id?: string
          id?: string
          image?: string
          lastName?: string | null
          strategy?: string
          type?: string
          value?: string
        }
        Relationships: []
      }
      hyperboard_registries: {
        Row: {
          created_at: string | null
          hyperboard_id: string
          label: string | null
          registry_id: string
          render_method: string
        }
        Insert: {
          created_at?: string | null
          hyperboard_id: string
          label?: string | null
          registry_id: string
          render_method?: string
        }
        Update: {
          created_at?: string | null
          hyperboard_id?: string
          label?: string | null
          registry_id?: string
          render_method?: string
        }
        Relationships: [
          {
            foreignKeyName: "hyperboard_registries_hyperboard_id_fkey"
            columns: ["hyperboard_id"]
            isOneToOne: false
            referencedRelation: "hyperboards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hyperboard_registries_registries_id_fk"
            columns: ["registry_id"]
            isOneToOne: false
            referencedRelation: "registries"
            referencedColumns: ["id"]
          },
        ]
      }
      hyperboards: {
        Row: {
          admin_id: string
          background_image: string | null
          chain_id: number
          created_at: string | null
          grayscale_images: boolean
          id: string
          name: string
          tile_border_color: string | null
        }
        Insert: {
          admin_id: string
          background_image?: string | null
          chain_id: number
          created_at?: string | null
          grayscale_images?: boolean
          id?: string
          name: string
          tile_border_color?: string | null
        }
        Update: {
          admin_id?: string
          background_image?: string | null
          chain_id?: number
          created_at?: string | null
          grayscale_images?: boolean
          id?: string
          name?: string
          tile_border_color?: string | null
        }
        Relationships: []
      }
      marketplace_order_nonces: {
        Row: {
          address: string
          chain_id: number
          created_at: string
          nonce_counter: number
        }
        Insert: {
          address: string
          chain_id: number
          created_at?: string
          nonce_counter?: number
        }
        Update: {
          address?: string
          chain_id?: number
          created_at?: string
          nonce_counter?: number
        }
        Relationships: []
      }
      marketplace_orders: {
        Row: {
          additionalParameters: string
          amounts: number[]
          chainId: number
          collection: string
          collectionType: number
          createdAt: string
          currency: string
          endTime: number
          globalNonce: string
          id: string
          invalidated: boolean
          itemIds: string[]
          orderNonce: string
          price: string
          quoteType: number
          signature: string
          signer: string
          startTime: number
          strategyId: number
          subsetNonce: number
          validator_codes: number[] | null
        }
        Insert: {
          additionalParameters: string
          amounts: number[]
          chainId: number
          collection: string
          collectionType: number
          createdAt?: string
          currency: string
          endTime: number
          globalNonce: string
          id?: string
          invalidated?: boolean
          itemIds: string[]
          orderNonce: string
          price: string
          quoteType: number
          signature: string
          signer: string
          startTime: number
          strategyId: number
          subsetNonce: number
          validator_codes?: number[] | null
        }
        Update: {
          additionalParameters?: string
          amounts?: number[]
          chainId?: number
          collection?: string
          collectionType?: number
          createdAt?: string
          currency?: string
          endTime?: number
          globalNonce?: string
          id?: string
          invalidated?: boolean
          itemIds?: string[]
          orderNonce?: string
          price?: string
          quoteType?: number
          signature?: string
          signer?: string
          startTime?: number
          strategyId?: number
          subsetNonce?: number
          validator_codes?: number[] | null
        }
        Relationships: []
      }
      registries: {
        Row: {
          admin_id: string
          chain_id: number
          created_at: string
          description: string
          hidden: boolean
          id: string
          name: string
        }
        Insert: {
          admin_id: string
          chain_id: number
          created_at?: string
          description: string
          hidden?: boolean
          id?: string
          name: string
        }
        Update: {
          admin_id?: string
          chain_id?: number
          created_at?: string
          description?: string
          hidden?: boolean
          id?: string
          name?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          address: string
          auth: Json
          created_at: string
          email: string | null
          id: string | null
        }
        Insert: {
          address: string
          auth?: Json
          created_at?: string
          email?: string | null
          id?: string | null
        }
        Update: {
          address?: string
          auth?: Json
          created_at?: string
          email?: string | null
          id?: string | null
        }
        Relationships: []
      }
      zuconnect_voting: {
        Row: {
          allocation_hc01: number | null
          allocation_hc02: number | null
          allocation_hc03: number | null
          allocation_hc04: number | null
          allocation_hc05: number | null
          allocation_hc06: number | null
          allocation_hc07: number | null
          allocation_hc08: number | null
          created_at: string
          feedback: string | null
          fid: string | null
          id: number
          link_to_image: string | null
          percent_core_team: number | null
          percent_direct_allocation: number | null
          percent_matching_fund: number | null
        }
        Insert: {
          allocation_hc01?: number | null
          allocation_hc02?: number | null
          allocation_hc03?: number | null
          allocation_hc04?: number | null
          allocation_hc05?: number | null
          allocation_hc06?: number | null
          allocation_hc07?: number | null
          allocation_hc08?: number | null
          created_at?: string
          feedback?: string | null
          fid?: string | null
          id?: number
          link_to_image?: string | null
          percent_core_team?: number | null
          percent_direct_allocation?: number | null
          percent_matching_fund?: number | null
        }
        Update: {
          allocation_hc01?: number | null
          allocation_hc02?: number | null
          allocation_hc03?: number | null
          allocation_hc04?: number | null
          allocation_hc05?: number | null
          allocation_hc06?: number | null
          allocation_hc07?: number | null
          allocation_hc08?: number | null
          created_at?: string
          feedback?: string | null
          fid?: string | null
          id?: number
          link_to_image?: string | null
          percent_core_team?: number | null
          percent_direct_allocation?: number | null
          percent_matching_fund?: number | null
        }
        Relationships: []
      }
      zuzalu_donations: {
        Row: {
          address: string
          amount: string | null
          created_at: string
          email: string
          id: number
        }
        Insert: {
          address: string
          amount?: string | null
          created_at?: string
          email: string
          id?: number
        }
        Update: {
          address?: string
          amount?: string | null
          created_at?: string
          email?: string
          id?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_claim_from_blueprint: {
        Args: {
          registry_id: string
          hypercert_id: string
          chain_id: number
          admin_id: string
          owner_id: string
          blueprint_id: number
        }
        Returns: string
      }
      default_sponsor_metadata_by_address: {
        Args: {
          addresses: string[]
        }
        Returns: {
          address: string
          companyName: string | null
          created_at: string
          firstName: string | null
          image: string
          lastName: string | null
          type: string
        }[]
      }
      fraction_sponsor_metadata_by_fraction_id: {
        Args: {
          fractions: string[]
          chain: number
        }
        Returns: {
          chain_id: number
          companyName: string | null
          created_at: string
          firstName: string | null
          fraction_id: string
          hypercert_id: string
          id: string
          image: string
          lastName: string | null
          strategy: string
          type: string
          value: string
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