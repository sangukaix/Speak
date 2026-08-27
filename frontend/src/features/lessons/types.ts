export type LessonCategory = '업무' | '일상' | '여행';

export type PracticeOption = {
  coachNote: string;
  id: string;
  text: string;
};

export type DialogueTurn = {
  context: string;
  id: string;
  options: PracticeOption[];
  tutorPrompt: string;
};

export type KeyPhrase = {
  english: string;
  korean: string;
};

export type Lesson = {
  category: LessonCategory;
  description: string;
  dialogue: DialogueTurn[];
  durationMinutes: number;
  id: string;
  keyPhrases: KeyPhrase[];
  level: string;
  objectives: string[];
  title: string;
};

export type ReviewKind = '표현' | '문법' | '발음';

export type ReviewItem = {
  confidenceLabel: string;
  id: string;
  improved: string;
  kind: ReviewKind;
  lessonTitle: string;
  original: string;
  reason: string;
};
