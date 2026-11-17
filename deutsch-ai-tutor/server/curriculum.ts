export type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface Lesson {
  level: Level;
  titleAr: string;
  /** Goal written for the AI tutor (English is clearer for the model). */
  goal: string;
}

const a1 = (titleAr: string, goal: string): Lesson => ({ level: "A1", titleAr, goal });
const a2 = (titleAr: string, goal: string): Lesson => ({ level: "A2", titleAr, goal });
const b1 = (titleAr: string, goal: string): Lesson => ({ level: "B1", titleAr, goal });
const b2 = (titleAr: string, goal: string): Lesson => ({ level: "B2", titleAr, goal });
const c1 = (titleAr: string, goal: string): Lesson => ({ level: "C1", titleAr, goal });
const c2 = (titleAr: string, goal: string): Lesson => ({ level: "C2", titleAr, goal });

// The student moves one step forward each time the tutor decides the lesson goal is met.
// IMPORTANT: only append new lessons at the end. Saved progress in browsers is a lesson index.
export const LESSONS: Lesson[] = [
  /* ---------------- A1 ---------------- */
  a1("التحية والوداع", "Greetings and goodbyes: Hallo, Guten Morgen, Guten Tag, Guten Abend, Tschüss, Auf Wiedersehen."),
  a1("كيف حالك؟", "Asking and answering how someone is: Wie geht's? Gut, danke. Und dir? Es geht. Nicht so gut."),
  a1("التعريف بالنفس", "Saying and asking names: Ich heiße ... Wie heißt du? Ich bin ... Freut mich."),
  a1("من أين أنت؟", "Origin: Woher kommst du? Ich komme aus dem Irak / aus Bagdad. Countries with and without article."),
  a1("أين تسكن؟", "Residence: Wo wohnst du? Ich wohne in ... Simple verb conjugation ich/du for wohnen and kommen."),
  a1("الأرقام من 1 إلى 10", "Numbers 0 to 10: null, eins, zwei, drei ... zehn. Counting and saying a phone digit."),
  a1("الأرقام من 11 إلى 20 والعمر", "Numbers 11 to 20 and age: Wie alt bist du? Ich bin ... Jahre alt."),
  a1("العائلة", "Family words: Mutter, Vater, Bruder, Schwester, Kinder. Mein/meine. Ich habe einen Bruder."),
  a1("المهن والعمل", "Jobs: Was bist du von Beruf? Ich bin Verkäufer / Techniker. Ich arbeite in ... "),
  a1("الأكل والشرب", "Food and drink with Ich möchte / Ich trinke gern: Tee, Wasser, Brot, Reis. Articles der/die/das."),
  a1("في المطعم", "Restaurant: Die Speisekarte, bitte. Ich nehme ... Zahlen, bitte. Ja/Nein questions."),
  a1("الوقت والساعة", "Telling time: Wie spät ist es? Es ist drei Uhr. Um wie viel Uhr?"),
  a1("أيام الأسبوع", "Weekdays and simple plans: Montag ... Sonntag. Am Montag arbeite ich."),
  a1("التسوق والأسعار", "Shopping: Wie viel kostet das? Das kostet ... Euro. Ich brauche ... Ich nehme das."),
  a1("الاتجاهات في المدينة", "Directions: Wo ist der Bahnhof? links, rechts, geradeaus. Entschuldigung."),
  a1("مراجعة المحادثة اليومية", "Review: a short free conversation mixing greetings, name, origin, job, food. At the end congratulate the learner: A1 is complete and the next lessons are A2."),

  /* ---------------- A2 ---------------- */
  a2("روتين اليوم", "Daily routine with separable verbs: Ich stehe um sieben Uhr auf. Ich frühstücke. Ich fange um acht an. Time of day: morgens, mittags, abends."),
  a2("الهوايات ووقت الفراغ", "Hobbies: Was machst du in deiner Freizeit? Ich spiele gern Fußball / fahre gern Fahrrad. gern, lieber, am liebsten."),
  a2("الطقس", "Weather and seasons: Wie ist das Wetter? Es ist warm / kalt. Es regnet. Es schneit. Im Sommer ist es heiß."),
  a2("شراء الملابس", "Clothes shopping: Jacke, Hose, Schuhe, Hemd. Colors. Ich suche eine Jacke. Die passt mir. Zu groß / zu klein. Anprobieren."),
  a2("المقادير في السوبرماركت", "Quantities: ein Kilo Äpfel, eine Flasche Wasser, eine Packung Reis. Ich brauche / Ich hätte gern ... Accusative with einen/eine/ein."),
  a2("الأفعال المساعدة: يمكن ويجب ويريد", "Modal verbs können, müssen, wollen, dürfen: Ich kann gut kochen. Ich muss arbeiten. Ich will Deutsch lernen. Verb at the end of the sentence."),
  a2("المواعيد والدعوات", "Appointments and invitations: Hast du am Samstag Zeit? Ja, gern. / Leider nein, ich muss arbeiten. Um wie viel Uhr treffen wir uns? Wo treffen wir uns?"),
  a2("عند الطبيب", "At the doctor: Körperteile (Kopf, Bauch, Hals, Rücken). Ich habe Kopfschmerzen. Mir tut der Rücken weh. Ich brauche einen Termin. Gute Besserung!"),
  a2("الماضي (1): ما فعلته أمس", "Perfekt with haben: Gestern habe ich gearbeitet / gekocht / gelernt. Was hast du gestern gemacht? Partizip II of regular verbs (ge...t)."),
  a2("الماضي (2): السفر والعطلة", "Perfekt with sein: Ich bin nach Bagdad gefahren. Ich bin zu Hause geblieben. Wohin bist du gefahren? Am Wochenende, letzte Woche."),
  a2("البيت والأثاث", "Home and furniture: Wohnung, Zimmer, Küche, Bad, Sofa, Bett, Tisch. Wo steht der Tisch? Er steht im Wohnzimmer. Es gibt ... Hier ist ..."),
  a2("المواصلات العامة", "Public transport: Ich möchte eine Fahrkarte nach ... Wann fährt der Zug / Bus? Wann kommt er an? Von welchem Gleis? Einfach oder hin und zurück?"),
  a2("الهاتف والرسائل", "Phone and messages: Hallo, hier ist ... Kann ich bitte mit ... sprechen? Ich rufe später an. Kannst du den Termin verschieben? Können Sie das wiederholen?"),
  a2("العمل والتقديم على وظيفة", "Work and a simple job interview: Ich suche eine Arbeit. Ich habe als Verkäufer / Techniker gearbeitet. Ich kann gut mit Kunden sprechen. Wann kann ich anfangen?"),
  a2("الخطط والأسباب", "Plans and reasons: Nächste Woche möchte ich ... Ich werde ... weil + verb at the end. Warum lernst du Deutsch? Weil ich in Deutschland arbeiten möchte."),
  a2("مراجعة A2", "Review: a free conversation mixing routine, hobbies, the past (Perfekt), appointments and plans. At the end congratulate the learner warmly: A2 is complete."),

  /* ---------------- B1 ---------------- */
  b1("الآراء وتقديم الأسباب", "Express an opinion, support it with reasons and examples, and respond politely to another view using meiner Meinung nach, weil, deshalb, and trotzdem."),
  b1("التمنّي والطلبات المهذبة", "Use Konjunktiv II for wishes, hypothetical situations, and polite requests with hätte, wäre, würde, könnte, and sollte."),
  b1("المبني للمجهول", "Describe processes and events with present and simple past passive (werden + Partizip II), and compare them with active sentences."),
  b1("الجمل الموصولة", "Describe people, places, and things with Relativsätze in nominative and accusative, and introduce dative relative pronouns."),
  b1("الجمل الفرعية والروابط", "Connect ideas with obwohl, damit, and falls; place the conjugated verb correctly and explain contrast, purpose, and condition."),
  b1("حكاية الماضي بـ Präteritum", "Tell a coherent story using common Präteritum forms (war, hatte, konnte, musste) alongside Perfekt, with clear time sequence."),
  b1("حياة الدراسة والعمل", "Explain study or work responsibilities, schedules, skills, and goals; describe a challenge and ask for clarification in a meeting."),
  b1("الأخبار والإعلام", "Summarize a short news report, distinguish facts from opinions, and give a reasoned personal reaction using indirect connectors."),
  b1("الشكاوى وحل المشكلات", "Describe a service or product problem, make a specific complaint, suggest a solution, and explain the outcome clearly."),
  b1("الصحة والعادات اليومية", "Discuss health routines, symptoms, and lifestyle choices; give and understand practical advice with sollte, müsste, and comparative forms."),
  b1("السفر والتجارب الثقافية", "Narrate a travel or cultural experience with temporal connectors, describe what went well or badly, and explain what you learned."),
  b1("مراجعة B1", "Review B1 in a sustained conversation combining opinions, subordinate clauses, past narration, and work or study. Congratulate the learner on completing B1."),

  /* ---------------- B2 ---------------- */
  b2("الحجج والمناظرة", "Build a structured argument with a clear claim, supporting evidence, counterargument, and measured conclusion; respond to objections."),
  b2("الرسائل الرسمية", "Write and discuss a formal email making a request or complaint, using appropriate greetings, register, and concise supporting details."),
  b2("نقل الكلام بـ Konjunktiv I", "Report another person's statements accurately with Konjunktiv I, and use Ersatzformen when the reported form matches the indicative."),
  b2("تحويل الأفعال إلى أسماء", "Use Nominalisierung and expanded noun phrases to make explanations more concise and formal; convert them back into clear clauses."),
  b2("البيئة وتغيّر المناخ", "Discuss environmental causes, policies, and trade-offs; compare proposed solutions and qualify claims with relevant evidence."),
  b2("المجتمع والتكنولوجيا", "Evaluate how technology affects work, privacy, and society; weigh benefits and risks and defend a nuanced position."),
  b2("التعابير الاصطلاحية والتلازم اللفظي", "Use common idioms and natural collocations in context, explain their register, and avoid literal translations from Arabic."),
  b2("العروض المهنية", "Give a coherent short presentation with signposting, examples, emphasis, and a concise conclusion; answer follow-up questions."),
  b2("التنازل والسبب والنتيجة", "Express complex relationships with dennoch, wohingegen, insofern, and während; distinguish concession, contrast, cause, and consequence."),
  b2("التفاوض وإدارة الخلاف", "Negotiate a practical agreement, clarify priorities, disagree diplomatically, and reformulate proposals until both sides understand."),
  b2("تقييم المصادر الإعلامية", "Compare two reports on the same issue, assess evidence and bias, and state what remains uncertain without overstating conclusions."),
  b2("مراجعة B2", "Review B2 through a structured discussion using formal language, reported speech, argument, idioms, and source evaluation. Congratulate the learner on completing B2."),

  /* ---------------- C1 ---------------- */
  c1("اللغة الأكاديمية والمهنية", "Shift confidently into academic or professional German, using precise terminology, formal conventions, and appropriately cautious claims."),
  c1("الرأي الدقيق والتحفّظ", "Express nuanced positions with concessions, qualifications, and degrees of certainty; distinguish what is known, inferred, and disputed."),
  c1("تلخيص النصوص المعقدة", "Summarize a dense article or lecture by identifying its thesis, evidence, assumptions, and implications without copying its wording."),
  c1("البلاغة والإقناع", "Analyze and use rhetorical strategies such as contrast, repetition, framing, and analogy while keeping arguments accurate and ethical."),
  c1("الأدب والثقافة", "Interpret themes, voice, imagery, and cultural context in a literary passage; support an interpretation with details from the text."),
  c1("اللهجات والفروق الإقليمية", "Recognize common regional and colloquial features in pronunciation and vocabulary, identify where they are used, and respond in standard German."),
  c1("البحث والعرض بالأدلة", "Present a research question, synthesize several findings, attribute evidence clearly, and answer critical questions with well-supported reasoning."),
  c1("مناقشة القضايا المجردة", "Explore abstract questions about ethics, identity, or responsibility, define key terms, and develop a coherent line of reasoning."),
  c1("التراكيب المتقدمة", "Use and interpret complex subordinate, participial, and infinitive clauses; recast dense syntax into precise, readable German."),
  c1("تغيير الأسلوب والسجل", "Rewrite the same message for a formal report, a professional conversation, and an informal exchange while preserving intent."),
  c1("النقاش مع وجهات نظر متعددة", "Compare competing explanations, identify hidden assumptions, and synthesize a balanced conclusion while acknowledging unresolved questions."),
  c1("مراجعة C1", "Review C1 through a complex text summary, a nuanced discussion, and a brief formal presentation. Congratulate the learner on completing C1."),

  /* ---------------- C2 ---------------- */
  c2("الدقة والفروق الدقيقة", "Choose among near-synonyms with precise control of connotation, collocation, register, and implied meaning; explain why alternatives differ."),
  c2("الفكاهة والتلاعب بالكلمات", "Understand and create suitable German wordplay, irony, and humor; explain cultural references when they do not translate directly."),
  c2("الموضوعات التخصصية", "Discuss an unfamiliar specialist topic, clarify technical terms, distinguish established facts from assumptions, and ask precise follow-up questions."),
  c2("تنويع الأسلوب", "Adapt voice, rhythm, vocabulary, and sentence structure for persuasive, analytical, narrative, and conversational purposes."),
  c2("دقة الترجمة", "Compare German and Arabic expressions, preserve intent and tone rather than word order, and explain when a cultural equivalent is preferable."),
  c2("الإيحاء والغموض والسخرية", "Interpret ambiguity, understatement, implication, and irony from context; explain multiple plausible readings without flattening the nuance."),
  c2("الخطاب المقنع المتقدم", "Deliver a persuasive argument with controlled emphasis, subtle concessions, precise evidence, and language suited to a discerning audience."),
  c2("دمج المصادر المعقدة", "Synthesize contrasting long-form sources, trace their assumptions and evidence, and produce a coherent independent conclusion."),
  c2("التنوع اللغوي والاجتماعي", "Distinguish standard, regional, social, and historical language choices, and explain their effects without stereotyping speakers."),
  c2("المحادثة العفوية وإصلاح التعثر", "Handle fast, unpredictable conversation, clarify ambiguous references, repair misunderstandings smoothly, and keep a natural register."),
  c2("الكتابة الإبداعية والتحليل الأدبي", "Create or analyze a sophisticated short text, controlling imagery, rhythm, voice, and intertextual references with deliberate precision."),
  c2("مراجعة الإتقان C2", "Demonstrate near-native precision in a spontaneous discussion, nuanced summary, and stylistic rewrite. Congratulate the learner on completing the full A1–C2 course."),
];

export const LAST_STEP = LESSONS.length - 1;
