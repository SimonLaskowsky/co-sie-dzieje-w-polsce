export interface Act {
  id: string | number;
  title: string;
  act_number?: string;
  simple_title?: string;
  content?: string;
  refs?: Record<string, { id: string; date?: string; art?: string }[]>;
  texts?: { type: string; fileName: string }[];
  item_type: string;
  announcement_date: string;
  change_date?: string;
  promulgation?: string;
  item_status?: string;
  comments?: string | null;
  keywords?: string[];
  file: string;
  votes?: Votes | null;
  category?: string | null;
}

export interface Votes {
  parties?: Record<
    string,
    {
      votes: { no: number; yes: number; absent: number; abstain: number };
      percentages: {
        no: number;
        yes: number;
        absent: number;
        abstain: number;
      };
      totalMembers: number;
    }
  >;
  summary?: {
    no: number;
    yes: number;
    total: number;
    absent: number;
    abstain: number;
    percentages: { no: number; yes: number; absent: number; abstain: number };
  };
  government?: {
    parties?: string[];
    votesPercentage?: {
      no?: number;
      yes?: number;
      absent?: number;
      abstain?: number;
    };
  };
}

export interface Keyword {
  keyword: string;
}

export interface ActsAndKeywordsResponse {
  acts: Act[];
  keywords: Keyword[];
}
