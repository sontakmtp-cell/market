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
      applications: {
        Row: {
          address: string | null
          applicationDate: string | null
          certificates: Json[] | null
          certifications: string[] | null
          coverLetter: string | null
          created_at: string
          customAnswers: Json | null
          cv: Json | null
          email: string | null
          experienceLevel: string | null
          fullName: string | null
          github: string | null
          id: number
          jobId: number | null
          linkedin: string | null
          phone: string | null
          portfolio: string | null
          portfolioFile: Json | null
          status: string | null
          summary: string | null
          technicalSkills: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          applicationDate?: string | null
          certificates?: Json[] | null
          certifications?: string[] | null
          coverLetter?: string | null
          created_at?: string
          customAnswers?: Json | null
          cv?: Json | null
          email?: string | null
          experienceLevel?: string | null
          fullName?: string | null
          github?: string | null
          id?: never
          jobId?: number | null
          linkedin?: string | null
          phone?: string | null
          portfolio?: string | null
          portfolioFile?: Json | null
          status?: string | null
          summary?: string | null
          technicalSkills?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          applicationDate?: string | null
          certificates?: Json[] | null
          certifications?: string[] | null
          coverLetter?: string | null
          created_at?: string
          customAnswers?: Json | null
          cv?: Json | null
          email?: string | null
          experienceLevel?: string | null
          fullName?: string | null
          github?: string | null
          id?: never
          jobId?: number | null
          linkedin?: string | null
          phone?: string | null
          portfolio?: string | null
          portfolioFile?: Json | null
          status?: string | null
          summary?: string | null
          technicalSkills?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_jobId_fkey"
            columns: ["jobId"]
            isOneToOne: false
            referencedRelation: "recruitment_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          id: string
          project_id: number
          proposal_id: string
          client_id: string
          freelancer_id: string
          status: string
          start_date: string
          deadline: string | null
          budget_amount: number
          currency: string
          progress: number
          milestones: Json
          deliverables: Json
          payment_terms: Json
          contract_terms: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: number
          proposal_id: string
          client_id: string
          freelancer_id: string
          status?: string
          start_date?: string
          deadline?: string | null
          budget_amount: number
          currency?: string
          progress?: number
          milestones?: Json
          deliverables?: Json
          payment_terms?: Json
          contract_terms?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: number
          proposal_id?: string
          client_id?: string
          freelancer_id?: string
          status?: string
          start_date?: string
          deadline?: string | null
          budget_amount?: number
          currency?: string
          progress?: number
          milestones?: Json
          deliverables?: Json
          payment_terms?: Json
          contract_terms?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_contracts_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "marketplace_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_contracts_proposal"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          company: string | null
          created_at: string | null
          description: string | null
          id: string
          title: string
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          title: string
        }
        Update: {
          company?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      marketplace_projects: {
        Row: {
          attachments: Json[] | null
          budgetMax: number | null
          budgetMin: number | null
          category: string | null
          client: Json | null
          client_user_id: string | null
          created_at: string
          currency: string | null
          deadline: string | null
          deliverables: Json[] | null
          duration: string | null
          fullDescription: string | null
          id: number
          isUrgent: boolean | null
          location: string | null
          objectives: Json[] | null
          proposalCount: number | null
          shortDescription: string | null
          skills: string[] | null
          status: string | null
          technicalRequirements: Json[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          attachments?: Json[] | null
          budgetMax?: number | null
          budgetMin?: number | null
          category?: string | null
          client?: Json | null
          client_user_id?: string | null
          created_at?: string
          currency?: string | null
          deadline?: string | null
          deliverables?: Json[] | null
          duration?: string | null
          fullDescription?: string | null
          id?: never
          isUrgent?: boolean | null
          location?: string | null
          objectives?: Json[] | null
          proposalCount?: number | null
          shortDescription?: string | null
          skills?: string[] | null
          status?: string | null
          technicalRequirements?: Json[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          attachments?: Json[] | null
          budgetMax?: number | null
          budgetMin?: number | null
          category?: string | null
          client?: Json | null
          client_user_id?: string | null
          created_at?: string
          currency?: string | null
          deadline?: string | null
          deliverables?: Json[] | null
          duration?: string | null
          fullDescription?: string | null
          id?: never
          isUrgent?: boolean | null
          location?: string | null
          objectives?: Json[] | null
          proposalCount?: number | null
          shortDescription?: string | null
          skills?: string[] | null
          status?: string | null
          technicalRequirements?: Json[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          cover_image_url: string | null
          display_name: string | null
          id: string
          languages: string[] | null
          location: string | null
          phone: string | null
          role_profiles: Json | null
          social_links: Json | null
          updated_at: string | null
          username: string | null
          visibility: Json | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          cover_image_url?: string | null
          display_name?: string | null
          id: string
          languages?: string[] | null
          location?: string | null
          phone?: string | null
          role_profiles?: Json | null
          social_links?: Json | null
          updated_at?: string | null
          username?: string | null
          visibility?: Json | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          cover_image_url?: string | null
          display_name?: string | null
          id?: string
          languages?: string[] | null
          location?: string | null
          phone?: string | null
          role_profiles?: Json | null
          social_links?: Json | null
          updated_at?: string | null
          username?: string | null
          visibility?: Json | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          client_id: string | null
          created_at: string
          id: string
          title: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          id: string
          title: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      proposals: {
        Row: {
          bid_amount: number
          cover_letter: string | null
          created_at: string
          freelancer_id: string | null
          id: string
          project_id: string
          status: string
          timeline: string | null
        }
        Insert: {
          bid_amount: number
          cover_letter?: string | null
          created_at?: string
          freelancer_id?: string | null
          id?: string
          project_id: string
          status?: string
          timeline?: string | null
        }
        Update: {
          bid_amount?: number
          cover_letter?: string | null
          created_at?: string
          freelancer_id?: string | null
          id?: string
          project_id?: string
          status?: string
          timeline?: string | null
        }
        Relationships: []
      }
      recruitment_jobs: {
        Row: {
          applicationDeadline: string | null
          attachments: Json[] | null
          autoResponse: boolean | null
          benefits: string[] | null
          certifications: string[] | null
          companyMaterials: Json[] | null
          contractTerms: string | null
          created_at: string
          currency: string | null
          department: string | null
          description: string | null
          employmentType: string | null
          experienceLevel: string | null
          id: number
          location: string | null
          locationType: string | null
          requirements: string | null
          responseTemplate: string | null
          responsibilities: string | null
          salaryMax: number | null
          salaryMin: number | null
          screeningQuestions: Json | null
          showSalary: boolean | null
          skills: string[] | null
          status: string | null
          templateType: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          applicationDeadline?: string | null
          attachments?: Json[] | null
          autoResponse?: boolean | null
          benefits?: string[] | null
          certifications?: string[] | null
          companyMaterials?: Json[] | null
          contractTerms?: string | null
          created_at?: string
          currency?: string | null
          department?: string | null
          description?: string | null
          employmentType?: string | null
          experienceLevel?: string | null
          id?: never
          location?: string | null
          locationType?: string | null
          requirements?: string | null
          responseTemplate?: string | null
          responsibilities?: string | null
          salaryMax?: number | null
          salaryMin?: number | null
          screeningQuestions?: Json | null
          showSalary?: boolean | null
          skills?: string[] | null
          status?: string | null
          templateType?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          applicationDeadline?: string | null
          attachments?: Json[] | null
          autoResponse?: boolean | null
          benefits?: string[] | null
          certifications?: string[] | null
          companyMaterials?: Json[] | null
          contractTerms?: string | null
          created_at?: string
          currency?: string | null
          department?: string | null
          description?: string | null
          employmentType?: string | null
          experienceLevel?: string | null
          id?: never
          location?: string | null
          locationType?: string | null
          requirements?: string | null
          responseTemplate?: string | null
          responsibilities?: string | null
          salaryMax?: number | null
          salaryMin?: number | null
          screeningQuestions?: Json | null
          showSalary?: boolean | null
          skills?: string[] | null
          status?: string | null
          templateType?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      saved_jobs: {
        Row: {
          created_at: string | null
          id: string
          job_id: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          job_id: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          job_id?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_jobs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "marketplace_projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_saved_job_ids: {
        Args: { user_uuid: string }
        Returns: string[]
      }
      is_job_saved: {
        Args: { job_type_param?: string; job_uuid: string; user_uuid: string }
        Returns: boolean
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
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
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
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
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never
