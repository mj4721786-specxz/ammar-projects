export type Mood = "ready" | "listening" | "thinking" | "speaking";

export interface Turn {
  role: "user" | "assistant";
  content: string;
}

export interface Tutor {
  german: string;
  arabic: string;
  correction: string | null;
  pronunciationTip: string | null;
}

export interface ChatReply extends Tutor {
  advance: boolean;
  demo: boolean;
}

export type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface LessonInfo {
  title: string;
  level: Level;
}

export interface Status {
  live: boolean;
  lessons: LessonInfo[];
}

export interface Session {
  history: Turn[];
  step: number;
  /** Number of student answers in the current lesson (used to fill the progress bar smoothly). */
  inLesson: number;
  last: Tutor | null;
  /** True once the last lesson has been completed. */
  done: boolean;
}
