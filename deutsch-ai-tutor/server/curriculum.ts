export type Level = "A1" | "A2";

export interface Lesson {
  level: Level;
  titleAr: string;
  /** Goal written for the AI tutor (English is clearer for the model). */
  goal: string;
}

const a1 = (titleAr: string, goal: string): Lesson => ({ level: "A1", titleAr, goal });
const a2 = (titleAr: string, goal: string): Lesson => ({ level: "A2", titleAr, goal });

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
];

export const LAST_STEP = LESSONS.length - 1;
