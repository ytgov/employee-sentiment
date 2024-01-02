export interface Survey {}

export interface Question {
  ID: number;
  TITLE: string;
  DISPLAY_TEXT: string;
  CREATE_DATE: Date;
  OWNER: string;
  STATE: number;
  MAX_ANSWERS: number;
  RATINGS_PER_TRANCHE: number;
  CURRENT_RATING_TRANCHE: number;
  MODERATABLE: number;
  QUESTION_NOUNCE: string;
  ZERO_RATING_FLAG: number;

  moderators?: string[];
}

export enum QuestionState {
  Draft = 0,
  Opinionate = 1,
  Inspire = 2,
  Rate = 3,
  Closed = 4,
  Publish = 5,
}

export interface QuestionResponse {
  RLID: number;
  TOKEN: string;
  QID: number;
  VALUE: string;
}

export interface Participant {
  ID: number;
  EMPLID: number;
  EMAIL: string;
  RANDOM_NOUNCE: string;
  ANSWERS_SUBMITTED: number; // boolean
  EXTRA_ANSWER_SUBMITTED: number; // boolean
  DATE_ANSWERED: Date;
  IS_RESPONDER: number; //boolean
  IS_RATER: number; //boolean
  HAS_RATED_ANSWERS: number; //boolean
  ANSWERS_RATED: number;
  LAST_RATING_TRANCHE: number;
  RATED_DATE: Date;
  QUESTION_ID: number;
}

export interface ParticipantRating {
  ID: number;
  PARTICPANT_ID: number;
  ANSWER_ID: number;
  TRANCHE_NUMBER: number;
  ANSWERED: number; // boolean
}

export interface Answer {
  ID: number;
  HEADING: string;
  ANSWER_TEXT: string;
  IS_EXTRA: number; // boolean
  OWNER_HASH: string;
  QUESTION_ID: number;
  MODERATED_HEADER: string;
  MODERATED_TEXT: string;
  DONE_MODERATING: number; // boolean
  CATEGORY: string;
  MODERATOR_NOTES: string;
  DELETED_FLAG: number; // boolean
  SUMMARY_VISIBLE: number; // boolean
  STAR0: number;
  STAR1: number;
  STAR2: number;
  STAR3: number;
  STAR4: number;
  STAR5: number;
}
