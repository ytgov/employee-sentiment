export interface Survey {}

export interface Question {
  QID: number;
  SID: number;
  ASK: string;
  TYPE: string;
  RANGE: number;
  SELECTION_JSON: string;
  OPTIONAL: number;
  ORDER: number;
}

export interface QuestionResponse {
  RLID: number;
  TOKEN: string;
  QID: number;
  VALUE: string;
}
