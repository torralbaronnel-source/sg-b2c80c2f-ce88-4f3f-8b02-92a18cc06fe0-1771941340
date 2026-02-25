/* eslint-disable @typescript-eslint/no-empty-object-type */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      app_pages: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          module: string
          name: string
          route: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          module: string
          name: string
          route: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          module?: string
          name?: string
          route?: string
        }
        Relationships: []
      }
      call_sheets: {
        Row: {
          created_at: string | null
          event_id: string | null
          general_call_time: string | null
          id: string
          nearest_hospital: string | null
          parking_info: string | null
          status: string | null
          version: number | null
          weather_forecast: Json | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          general_call_time?: string | null
          id?: string
          nearest_hospital?: string | null
          parking_info?: string | null
          status?: string | null
          version?: number | null
          weather_forecast?: Json | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          general_call_time?: string | null
          id?: string
          nearest_hospital?: string | null
          parking_info?: string | null
          status?: string | null
          version?: number | null
          weather_forecast?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "call_sheets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          city: string | null
          company_name: string | null
          coordinator_id: string
          country: string | null
          created_at: string | null
          current_stage: string | null
          email: string | null
          full_name: string
          id: string
          last_contact_date: string | null
          lifecycle_history: Json | null
          next_followup_date: string | null
          notes: string | null
          phone: string | null
          server_id: string
          source: string | null
          status: string
          total_events: number | null
          total_spent: number | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_name?: string | null
          coordinator_id: string
          country?: string | null
          created_at?: string | null
          current_stage?: string | null
          email?: string | null
          full_name: string
          id?: string
          last_contact_date?: string | null
          lifecycle_history?: Json | null
          next_followup_date?: string | null
          notes?: string | null
          phone?: string | null
          server_id: string
          source?: string | null
          status?: string
          total_events?: number | null
          total_spent?: number | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          company_name?: string | null
          coordinator_id?: string
          country?: string | null
          created_at?: string | null
          current_stage?: string | null
          email?: string | null
          full_name?: string
          id?: string
          last_contact_date?: string | null
          lifecycle_history?: Json | null
          next_followup_date?: string | null
          notes?: string | null
          phone?: string | null
          server_id?: string
          source?: string | null
          status?: string
          total_events?: number | null
          total_spent?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_coordinator_id_fkey"
            columns: ["coordinator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      communications: {
        Row: {
          category: string | null
          contact_name: string
          contact_type: string | null
          coordinator_id: string
          created_at: string | null
          event_id: string | null
          id: string
          last_message: string | null
          metadata: Json | null
          pinned_message_id: string | null
          platform: string
          priority: string | null
          server_id: string | null
          status: string | null
          type: string | null
          unread_count: number | null
          updated_at: string | null
          vendor: string | null
        }
        Insert: {
          category?: string | null
          contact_name: string
          contact_type?: string | null
          coordinator_id: string
          created_at?: string | null
          event_id?: string | null
          id?: string
          last_message?: string | null
          metadata?: Json | null
          pinned_message_id?: string | null
          platform: string
          priority?: string | null
          server_id?: string | null
          status?: string | null
          type?: string | null
          unread_count?: number | null
          updated_at?: string | null
          vendor?: string | null
        }
        Update: {
          category?: string | null
          contact_name?: string
          contact_type?: string | null
          coordinator_id?: string
          created_at?: string | null
          event_id?: string | null
          id?: string
          last_message?: string | null
          metadata?: Json | null
          pinned_message_id?: string | null
          platform?: string
          priority?: string | null
          server_id?: string | null
          status?: string | null
          type?: string | null
          unread_count?: number | null
          updated_at?: string | null
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communications_coordinator_id_fkey"
            columns: ["coordinator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          client_id: string
          contract_number: string
          created_at: string | null
          created_by: string | null
          event_id: string
          file_url: string | null
          id: string
          notes: string | null
          server_id: string
          signed_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          client_id: string
          contract_number: string
          created_at?: string | null
          created_by?: string | null
          event_id: string
          file_url?: string | null
          id?: string
          notes?: string | null
          server_id: string
          signed_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          contract_number?: string
          created_at?: string | null
          created_by?: string | null
          event_id?: string
          file_url?: string | null
          id?: string
          notes?: string | null
          server_id?: string
          signed_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment: {
        Row: {
          category: string
          condition: string | null
          created_at: string | null
          id: string
          name: string
          notes: string | null
          quantity_total: number
          server_id: string
          updated_at: string | null
        }
        Insert: {
          category: string
          condition?: string | null
          created_at?: string | null
          id?: string
          name: string
          notes?: string | null
          quantity_total: number
          server_id: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          condition?: string | null
          created_at?: string | null
          id?: string
          name?: string
          notes?: string | null
          quantity_total?: number
          server_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_assignments: {
        Row: {
          assigned_staff_id: string | null
          created_at: string | null
          equipment_id: string
          event_id: string
          id: string
          notes: string | null
          quantity: number
          return_status: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_staff_id?: string | null
          created_at?: string | null
          equipment_id: string
          event_id: string
          id?: string
          notes?: string | null
          quantity: number
          return_status?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_staff_id?: string | null
          created_at?: string | null
          equipment_id?: string
          event_id?: string
          id?: string
          notes?: string | null
          quantity?: number
          return_status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_assignments_assigned_staff_id_fkey"
            columns: ["assigned_staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_assignments_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_assignments_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_services: {
        Row: {
          assigned_staff_id: string | null
          created_at: string | null
          event_id: string
          id: string
          notes: string | null
          price: number | null
          quantity: number | null
          service_id: string
          status: string | null
        }
        Insert: {
          assigned_staff_id?: string | null
          created_at?: string | null
          event_id: string
          id?: string
          notes?: string | null
          price?: number | null
          quantity?: number | null
          service_id: string
          status?: string | null
        }
        Update: {
          assigned_staff_id?: string | null
          created_at?: string | null
          event_id?: string
          id?: string
          notes?: string | null
          price?: number | null
          quantity?: number | null
          service_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_services_assigned_staff_id_fkey"
            columns: ["assigned_staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_services_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      event_timeline: {
        Row: {
          assigned_staff_id: string | null
          created_at: string | null
          description: string | null
          end_time: string | null
          event_id: string
          id: string
          location: string | null
          notes: string | null
          sequence_order: number | null
          start_time: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_staff_id?: string | null
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          event_id: string
          id?: string
          location?: string | null
          notes?: string | null
          sequence_order?: number | null
          start_time: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_staff_id?: string | null
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          event_id?: string
          id?: string
          location?: string | null
          notes?: string | null
          sequence_order?: number | null
          start_time?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_timeline_assigned_staff_id_fkey"
            columns: ["assigned_staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_timeline_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_vendors: {
        Row: {
          contract_amount: number | null
          created_at: string | null
          event_id: string
          id: string
          notes: string | null
          status: string | null
          vendor_id: string
        }
        Insert: {
          contract_amount?: number | null
          created_at?: string | null
          event_id: string
          id?: string
          notes?: string | null
          status?: string | null
          vendor_id: string
        }
        Update: {
          contract_amount?: number | null
          created_at?: string | null
          event_id?: string
          id?: string
          notes?: string | null
          status?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_vendors_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_vendors_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          billing_status: string | null
          budget: number | null
          call_time: string | null
          client_email: string | null
          client_name: string
          client_phone: string | null
          coordinator_id: string
          created_at: string | null
          delivery_status: string | null
          description: string | null
          event_date: string
          id: string
          location: string | null
          package_type: string | null
          production_status: string | null
          server_id: string | null
          status: string | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          billing_status?: string | null
          budget?: number | null
          call_time?: string | null
          client_email?: string | null
          client_name: string
          client_phone?: string | null
          coordinator_id: string
          created_at?: string | null
          delivery_status?: string | null
          description?: string | null
          event_date: string
          id?: string
          location?: string | null
          package_type?: string | null
          production_status?: string | null
          server_id?: string | null
          status?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          billing_status?: string | null
          budget?: number | null
          call_time?: string | null
          client_email?: string | null
          client_name?: string
          client_phone?: string | null
          coordinator_id?: string
          created_at?: string | null
          delivery_status?: string | null
          description?: string | null
          event_date?: string
          id?: string
          location?: string | null
          package_type?: string | null
          production_status?: string | null
          server_id?: string | null
          status?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_coordinator_id_fkey"
            columns: ["coordinator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      files: {
        Row: {
          category: string | null
          client_id: string | null
          event_id: string | null
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          server_id: string
          uploaded_at: string | null
          uploaded_by: string
        }
        Insert: {
          category?: string | null
          client_id?: string | null
          event_id?: string | null
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          server_id: string
          uploaded_at?: string | null
          uploaded_by: string
        }
        Update: {
          category?: string | null
          client_id?: string | null
          event_id?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          server_id?: string
          uploaded_at?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "files_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      guests: {
        Row: {
          contact: string | null
          created_at: string | null
          event_id: string
          id: string
          meal_preference: string | null
          name: string
          notes: string | null
          rsvp_status: string | null
          seat_number: number | null
          table_number: number | null
          updated_at: string | null
        }
        Insert: {
          contact?: string | null
          created_at?: string | null
          event_id: string
          id?: string
          meal_preference?: string | null
          name: string
          notes?: string | null
          rsvp_status?: string | null
          seat_number?: number | null
          table_number?: number | null
          updated_at?: string | null
        }
        Update: {
          contact?: string | null
          created_at?: string | null
          event_id?: string
          id?: string
          meal_preference?: string | null
          name?: string
          notes?: string | null
          rsvp_status?: string | null
          seat_number?: number | null
          table_number?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guests_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          client_id: string
          created_at: string | null
          created_by: string | null
          discount: number | null
          due_date: string | null
          event_id: string
          id: string
          invoice_number: string
          server_id: string
          status: string | null
          subtotal: number
          tax: number | null
          total: number
          updated_at: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          created_by?: string | null
          discount?: number | null
          due_date?: string | null
          event_id: string
          id?: string
          invoice_number: string
          server_id: string
          status?: string | null
          subtotal?: number
          tax?: number | null
          total?: number
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          created_by?: string | null
          discount?: number | null
          due_date?: string | null
          event_id?: string
          id?: string
          invoice_number?: string
          server_id?: string
          status?: string | null
          subtotal?: number
          tax?: number | null
          total?: number
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
          {
            foreignKeyName: "invoices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      nano_history: {
        Row: {
          command: string
          executed_at: string | null
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          command: string
          executed_at?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          command?: string
          executed_at?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      organization_members: {
        Row: {
          created_at: string | null
          id: string
          organization_id: string | null
          profile_id: string | null
          role: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          organization_id?: string | null
          profile_id?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          organization_id?: string | null
          profile_id?: string | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          id: string
          logo_url: string | null
          name: string
          subscription_status: string | null
          subscription_tier: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      package_items: {
        Row: {
          created_at: string | null
          id: string
          package_id: string
          quantity: number | null
          service_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          package_id: string
          quantity?: number | null
          service_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          package_id?: string
          quantity?: number | null
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "package_items_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_items_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          price: number
          server_id: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          price: number
          server_id: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          price?: number
          server_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "packages_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          invoice_id: string
          notes: string | null
          payment_date: string | null
          payment_method: string
          recorded_by: string | null
          transaction_reference: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          invoice_id: string
          notes?: string | null
          payment_date?: string | null
          payment_method: string
          recorded_by?: string | null
          transaction_reference?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          invoice_id?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string
          recorded_by?: string | null
          transaction_reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_stages: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          sequence_order: number | null
          server_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          sequence_order?: number | null
          server_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          sequence_order?: number | null
          server_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_stages_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      private_concierge_requests: {
        Row: {
          company_name: string | null
          created_at: string | null
          customization_details: string | null
          email: string
          full_name: string
          id: string
          interested_modules: string[] | null
          phone: string | null
          priority: string | null
          request_type: string
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          customization_details?: string | null
          email: string
          full_name: string
          id?: string
          interested_modules?: string[] | null
          phone?: string | null
          priority?: string | null
          request_type: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          customization_details?: string | null
          email?: string
          full_name?: string
          id?: string
          interested_modules?: string[] | null
          phone?: string | null
          priority?: string | null
          request_type?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          cover_url: string | null
          created_at: string | null
          current_server_id: string | null
          email: string | null
          full_name: string | null
          id: string
          reports_to: string | null
          role: string | null
          role_id: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          cover_url?: string | null
          created_at?: string | null
          current_server_id?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          reports_to?: string | null
          role?: string | null
          role_id?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          cover_url?: string | null
          created_at?: string | null
          current_server_id?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          reports_to?: string | null
          role?: string | null
          role_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_current_server_id_fkey"
            columns: ["current_server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_reports_to_fkey"
            columns: ["reports_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_items: {
        Row: {
          created_at: string | null
          description: string
          id: string
          price: number
          quantity: number | null
          quote_id: string
          service_id: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          price: number
          quantity?: number | null
          quote_id: string
          service_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          price?: number
          quantity?: number | null
          quote_id?: string
          service_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_items_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          client_id: string
          created_at: string | null
          created_by: string | null
          discount: number | null
          event_id: string | null
          id: string
          quote_number: string
          server_id: string
          status: string | null
          subtotal: number
          tax: number | null
          total: number
          updated_at: string | null
          valid_until: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          created_by?: string | null
          discount?: number | null
          event_id?: string | null
          id?: string
          quote_number: string
          server_id: string
          status?: string | null
          subtotal?: number
          tax?: number | null
          total?: number
          updated_at?: string | null
          valid_until?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          created_by?: string | null
          discount?: number | null
          event_id?: string | null
          id?: string
          quote_number?: string
          server_id?: string
          status?: string | null
          subtotal?: number
          tax?: number | null
          total?: number
          updated_at?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_allocations: {
        Row: {
          created_at: string | null
          end_time: string | null
          event_id: string | null
          id: string
          notes: string | null
          resource_name: string
          resource_type: string
          role_or_purpose: string | null
          start_time: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          end_time?: string | null
          event_id?: string | null
          id?: string
          notes?: string | null
          resource_name: string
          resource_type: string
          role_or_purpose?: string | null
          start_time?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          end_time?: string | null
          event_id?: string | null
          id?: string
          notes?: string | null
          resource_name?: string
          resource_type?: string
          role_or_purpose?: string | null
          start_time?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resource_allocations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      role_page_permissions: {
        Row: {
          can_delete: boolean | null
          can_edit: boolean | null
          can_view: boolean | null
          data_scope: string | null
          id: string
          page_id: string | null
          role_id: string | null
        }
        Insert: {
          can_delete?: boolean | null
          can_edit?: boolean | null
          can_view?: boolean | null
          data_scope?: string | null
          id?: string
          page_id?: string | null
          role_id?: string | null
        }
        Update: {
          can_delete?: boolean | null
          can_edit?: boolean | null
          can_view?: boolean | null
          data_scope?: string | null
          id?: string
          page_id?: string | null
          role_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_page_permissions_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "app_pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_page_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          can_create: boolean | null
          can_delete: boolean | null
          can_update: boolean | null
          can_view: boolean | null
          id: string
          module: string
          role_id: string | null
        }
        Insert: {
          can_create?: boolean | null
          can_delete?: boolean | null
          can_update?: boolean | null
          can_view?: boolean | null
          id?: string
          module: string
          role_id?: string | null
        }
        Update: {
          can_create?: boolean | null
          can_delete?: boolean | null
          can_update?: boolean | null
          can_view?: boolean | null
          id?: string
          module?: string
          role_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          hierarchy_level: number | null
          id: string
          is_system: boolean | null
          is_system_role: boolean | null
          name: string
          role_type: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          hierarchy_level?: number | null
          id?: string
          is_system?: boolean | null
          is_system_role?: boolean | null
          name: string
          role_type?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          hierarchy_level?: number | null
          id?: string
          is_system?: boolean | null
          is_system_role?: boolean | null
          name?: string
          role_type?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      run_of_show: {
        Row: {
          created_at: string | null
          dependencies: Json | null
          description: string | null
          end_time: string | null
          event_id: string | null
          id: string
          location: string | null
          responsible_team: string | null
          start_time: string
          status: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          dependencies?: Json | null
          description?: string | null
          end_time?: string | null
          event_id?: string | null
          id?: string
          location?: string | null
          responsible_team?: string | null
          start_time: string
          status?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          dependencies?: Json | null
          description?: string | null
          end_time?: string | null
          event_id?: string | null
          id?: string
          location?: string | null
          responsible_team?: string | null
          start_time?: string
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "run_of_show_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      server_members: {
        Row: {
          created_at: string | null
          id: string
          profile_id: string | null
          role: string
          server_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          profile_id?: string | null
          role?: string
          server_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          profile_id?: string | null
          role?: string
          server_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "server_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "server_members_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      servers: {
        Row: {
          blueprint: Json | null
          created_at: string | null
          id: string
          industry: string | null
          invite_code: string | null
          invite_expires_at: string | null
          is_invite_active: boolean | null
          logo_url: string | null
          name: string
          owner_id: string | null
          server_handle: string
          updated_at: string | null
        }
        Insert: {
          blueprint?: Json | null
          created_at?: string | null
          id?: string
          industry?: string | null
          invite_code?: string | null
          invite_expires_at?: string | null
          is_invite_active?: boolean | null
          logo_url?: string | null
          name: string
          owner_id?: string | null
          server_handle: string
          updated_at?: string | null
        }
        Update: {
          blueprint?: Json | null
          created_at?: string | null
          id?: string
          industry?: string | null
          invite_code?: string | null
          invite_expires_at?: string | null
          is_invite_active?: boolean | null
          logo_url?: string | null
          name?: string
          owner_id?: string | null
          server_handle?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "servers_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          active: boolean | null
          base_price: number
          category: string
          created_at: string | null
          description: string | null
          duration: number | null
          id: string
          name: string
          server_id: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          base_price: number
          category: string
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          name: string
          server_id: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          base_price?: number
          category?: string
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          name?: string
          server_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          availability_status: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          rate_per_event: number | null
          role: string
          server_id: string
          skills: string | null
          updated_at: string | null
        }
        Insert: {
          availability_status?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          rate_per_event?: number | null
          role: string
          server_id: string
          skills?: string | null
          updated_at?: string | null
        }
        Update: {
          availability_status?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          rate_per_event?: number | null
          role?: string
          server_id?: string
          skills?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_assignments: {
        Row: {
          call_time: string | null
          created_at: string | null
          end_time: string | null
          event_id: string
          id: string
          notes: string | null
          role: string
          staff_id: string
          status: string | null
        }
        Insert: {
          call_time?: string | null
          created_at?: string | null
          end_time?: string | null
          event_id: string
          id?: string
          notes?: string | null
          role: string
          staff_id: string
          status?: string | null
        }
        Update: {
          call_time?: string | null
          created_at?: string | null
          end_time?: string | null
          event_id?: string
          id?: string
          notes?: string | null
          role?: string
          staff_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_assignments_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_assignments_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          created_by: string
          description: string | null
          due_date: string | null
          event_id: string | null
          id: string
          priority: string | null
          server_id: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          due_date?: string | null
          event_id?: string | null
          id?: string
          priority?: string | null
          server_id: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          due_date?: string | null
          event_id?: string | null
          id?: string
          priority?: string | null
          server_id?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address: string | null
          category: string
          contact_person: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          rating: number | null
          server_id: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          category: string
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          rating?: number | null
          server_id: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          category?: string
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          rating?: number | null
          server_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendors_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      venues: {
        Row: {
          address: string
          capacity: number | null
          city: string | null
          contact_person: string | null
          contact_phone: string | null
          country: string | null
          created_at: string | null
          id: string
          name: string
          notes: string | null
          server_id: string
          updated_at: string | null
        }
        Insert: {
          address: string
          capacity?: number | null
          city?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          name: string
          notes?: string | null
          server_id: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          capacity?: number | null
          city?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          name?: string
          notes?: string | null
          server_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "venues_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_messages: {
        Row: {
          communication_id: string
          content: string
          direction: string | null
          id: string
          is_from_me: boolean | null
          metadata: Json | null
          reactions: Json | null
          reply_to_id: string | null
          sender_name: string
          status: string | null
          timestamp: string | null
        }
        Insert: {
          communication_id: string
          content: string
          direction?: string | null
          id?: string
          is_from_me?: boolean | null
          metadata?: Json | null
          reactions?: Json | null
          reply_to_id?: string | null
          sender_name: string
          status?: string | null
          timestamp?: string | null
        }
        Update: {
          communication_id?: string
          content?: string
          direction?: string | null
          id?: string
          is_from_me?: boolean | null
          metadata?: Json | null
          reactions?: Json | null
          reply_to_id?: string | null
          sender_name?: string
          status?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_communication_id_fkey"
            columns: ["communication_id"]
            isOneToOne: false
            referencedRelation: "communications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_messages"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_server_ownership: {
        Args: { p_id: string; s_id: string }
        Returns: boolean
      }
      exec_sql: { Args: { sql_query: string }; Returns: Json }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
