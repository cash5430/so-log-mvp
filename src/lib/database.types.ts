export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          birthday: string | null;
          zodiac_sign: string | null;
          blood_type: string | null;
          mbti_type: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string;
          birthday?: string | null;
          zodiac_sign?: string | null;
          blood_type?: string | null;
          mbti_type?: string | null;
        };
        Update: {
          name?: string;
          birthday?: string | null;
          zodiac_sign?: string | null;
          blood_type?: string | null;
          mbti_type?: string | null;
        };
      };
      dream_entries: {
        Row: {
          id: string;
          user_id: string;
          dream_content: string;
          stress_level: number | null;
          energy_level: number | null;
          stimulants: string[];
          hexagram: string | null;
          tarot_card: string | null;
          analysis: string | null;
          entry_date: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          dream_content: string;
          stress_level?: number | null;
          energy_level?: number | null;
          stimulants?: string[];
          hexagram?: string | null;
          tarot_card?: string | null;
          analysis?: string | null;
          entry_date?: string;
        };
        Update: {
          dream_content?: string;
          stress_level?: number | null;
          energy_level?: number | null;
          stimulants?: string[];
          hexagram?: string | null;
          tarot_card?: string | null;
          analysis?: string | null;
        };
      };
    };
  };
}
