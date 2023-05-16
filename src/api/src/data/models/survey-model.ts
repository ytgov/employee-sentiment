export interface Survey {}

export interface Question {
  ID: number;
  TITLE: string;
  DISPLAY_TEXT: string;
  CREATE_DATE: Date;
  OWNER: string;
  STATE: number;
  MAX_ANWERS: number;
  RATINGS_PER_TRANCHE: number;
  CURRENT_RATING_TRANCHE: number;
}

export interface QuestionResponse {
  RLID: number;
  TOKEN: string;
  QID: number;
  VALUE: string;
}
