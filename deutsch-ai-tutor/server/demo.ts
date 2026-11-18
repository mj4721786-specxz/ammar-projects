export interface TutorReply {
  german: string;
  arabic: string;
  correction: string | null;
  pronunciationTip: string | null;
  advance: boolean;
  joke?: { german: string; arabic: string } | null;
}

// Scripted replies used when no API key is set. They do NOT evaluate what the student said.
const SCRIPT: TutorReply[] = [
  { german: "Hallo! Ich bin Klara. Wie heißt du?", arabic: "مرحبًا! أنا كلارا. ما اسمك؟", correction: null, pronunciationTip: "حرف ß في heiße يُنطق مثل س مشددة.", advance: false },
  { german: "Schön, dich kennenzulernen! Woher kommst du?", arabic: "تشرفت بمعرفتك! من أين أنت؟", correction: null, pronunciationTip: "في Schön: حرف ö بين الواو والياء، شفتاك مستديرتان.", advance: true },
  { german: "Super! Und wo wohnst du?", arabic: "رائع! وأين تسكن؟", correction: null, pronunciationTip: null, advance: false, joke: { german: "Ich wohne in der Cloud. Das ist sehr ruhig!", arabic: "أسكن في السحابة. هادئة جدًا!" } },
  { german: "Gut. Zähle bitte bis drei: eins, zwei, drei.", arabic: "جيد. عدّ من فضلك حتى ثلاثة: eins, zwei, drei.", correction: null, pronunciationTip: "كلمة zwei تبدأ بحرف z ينطق مثل ts.", advance: true },
  { german: "Sehr gut! Wie alt bist du?", arabic: "ممتاز! كم عمرك؟", correction: null, pronunciationTip: null, advance: false },
  { german: "Was möchtest du trinken? Tee oder Wasser?", arabic: "ماذا تريد أن تشرب؟ شايًا أم ماءً؟", correction: null, pronunciationTip: "في möchtest: ö مثل الأولى، وch مثل خ خفيفة.", advance: true },
  { german: "Das ist perfekt. Bis bald!", arabic: "هذا رائع. إلى اللقاء قريبًا!", correction: null, pronunciationTip: null, advance: false },
];

export function demoReply(userTurns: number): TutorReply {
  return SCRIPT[Math.min(userTurns, SCRIPT.length - 1)];
}
