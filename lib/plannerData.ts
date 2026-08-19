export type Subject =
  | "English"
  | "Math"
  | "Science"
  | "History / Social Science"
  | "World Language"
  | "PE"
  | "VPA"
  | "Elective"
  | "CTE / ROP"
  | "Dual Enrollment / College";

export type Course = {
  id: string;
  name: string;
  code: string;
  subject: Subject;
  provider: "Ayala" | "Chaffey";
  duration: "Semester" | "Year-long";
  gradeLevels: number[];
  level: "CP" | "Honors" | "AP" | "College" | "Standard";
  ag?: "A" | "B" | "C" | "D" | "E" | "F" | "G";
  prerequisite?: string;
  notes?: string;
  source: string;
  sourceUrl: string;
  verification: "Official 2026–27" | "Current official listing" | "Confirm with Ayala Counseling";
  units?: number;
};

const ayalaSource = "Ayala 2026–27 registration sheets";
const ayalaUrl = "https://ayala.chino.k12.ca.us/courseofferings";

export const ayalaCourses: Course[] = [
  { id: "eng9cp", name: "English 9 CP", code: "5013", subject: "English", provider: "Ayala", duration: "Year-long", gradeLevels: [9], level: "CP", ag: "B", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Official 2026–27" },
  { id: "eng9h", name: "English 9 Honors", code: "5012", subject: "English", provider: "Ayala", duration: "Year-long", gradeLevels: [9], level: "Honors", ag: "B", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Official 2026–27" },
  { id: "eng10cp", name: "English 10 CP", code: "5023", subject: "English", provider: "Ayala", duration: "Year-long", gradeLevels: [10], level: "CP", ag: "B", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Official 2026–27" },
  { id: "eng10h", name: "English 10 Honors", code: "5022", subject: "English", provider: "Ayala", duration: "Year-long", gradeLevels: [10], level: "Honors", ag: "B", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Official 2026–27" },
  { id: "eng11cp", name: "English 11 CP", code: "5032", subject: "English", provider: "Ayala", duration: "Year-long", gradeLevels: [11], level: "CP", ag: "B", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Official 2026–27" },
  { id: "eng11ap", name: "AP English Language", code: "5033", subject: "English", provider: "Ayala", duration: "Year-long", gradeLevels: [11], level: "AP", ag: "B", prerequisite: "See Ayala’s suggested AP preparation guidance.", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Confirm with Ayala Counseling" },
  { id: "eng12cp", name: "English 12 CP", code: "5042", subject: "English", provider: "Ayala", duration: "Year-long", gradeLevels: [12], level: "CP", ag: "B", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Official 2026–27" },
  { id: "eng12ap", name: "AP English Literature", code: "5044", subject: "English", provider: "Ayala", duration: "Year-long", gradeLevels: [12], level: "AP", ag: "B", prerequisite: "See Ayala’s suggested AP preparation guidance.", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Confirm with Ayala Counseling" },
  { id: "im1", name: "Integrated Math 1", code: "5113", subject: "Math", provider: "Ayala", duration: "Year-long", gradeLevels: [9,10,11,12], level: "CP", ag: "C", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Official 2026–27" },
  { id: "im2", name: "Integrated Math 2", code: "5115", subject: "Math", provider: "Ayala", duration: "Year-long", gradeLevels: [9,10,11,12], level: "CP", ag: "C", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Official 2026–27" },
  { id: "im2h", name: "Integrated Math 2 Honors", code: "5120", subject: "Math", provider: "Ayala", duration: "Year-long", gradeLevels: [9,10], level: "Honors", ag: "C", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Official 2026–27" },
  { id: "im3", name: "Integrated Math 3", code: "5118", subject: "Math", provider: "Ayala", duration: "Year-long", gradeLevels: [10,11,12], level: "CP", ag: "C", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Official 2026–27" },
  { id: "im3h", name: "Integrated Math 3 H / Pre-Calculus", code: "5129", subject: "Math", provider: "Ayala", duration: "Year-long", gradeLevels: [10,11,12], level: "Honors", ag: "C", prerequisite: "Integrated Math 2 Honors", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Official 2026–27" },
  { id: "apstats", name: "AP Statistics", code: "5119", subject: "Math", provider: "Ayala", duration: "Year-long", gradeLevels: [10,11,12], level: "AP", ag: "C", prerequisite: "Confirm placement guidance with Ayala Counseling.", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Confirm with Ayala Counseling" },
  { id: "calcab", name: "AP Calculus AB", code: "5124", subject: "Math", provider: "Ayala", duration: "Year-long", gradeLevels: [11,12], level: "AP", ag: "C", prerequisite: "Integrated Math 3 Honors or Trigonometry", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Official 2026–27" },
  { id: "calcbc", name: "AP Calculus BC", code: "5125", subject: "Math", provider: "Ayala", duration: "Year-long", gradeLevels: [11,12], level: "AP", ag: "C", prerequisite: "AP Calculus AB", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Official 2026–27" },
  { id: "bio", name: "Biology: The Living Earth CP", code: "5S01", subject: "Science", provider: "Ayala", duration: "Year-long", gradeLevels: [9,10], level: "CP", ag: "D", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Official 2026–27" },
  { id: "bioh", name: "Biology: The Living Earth Honors", code: "5S02", subject: "Science", provider: "Ayala", duration: "Year-long", gradeLevels: [9,10], level: "Honors", ag: "D", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Official 2026–27" },
  { id: "chem", name: "Chemistry in the Earth System CP", code: "5S03", subject: "Science", provider: "Ayala", duration: "Year-long", gradeLevels: [10,11,12], level: "CP", ag: "D", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Official 2026–27" },
  { id: "chemh", name: "Chemistry in the Earth System Honors", code: "5S04", subject: "Science", provider: "Ayala", duration: "Year-long", gradeLevels: [10,11,12], level: "Honors", ag: "D", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Official 2026–27" },
  { id: "apbio", name: "AP Biology", code: "5406", subject: "Science", provider: "Ayala", duration: "Year-long", gradeLevels: [10,11,12], level: "AP", ag: "D", prerequisite: "See Ayala’s suggested AP preparation guidance.", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Confirm with Ayala Counseling" },
  { id: "apphys1", name: "AP Physics 1", code: "5427", subject: "Science", provider: "Ayala", duration: "Year-long", gradeLevels: [10,11,12], level: "AP", ag: "D", prerequisite: "See Ayala’s suggested AP preparation guidance.", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Confirm with Ayala Counseling" },
  { id: "apes", name: "AP Environmental Science", code: "5425", subject: "Science", provider: "Ayala", duration: "Year-long", gradeLevels: [10,11,12], level: "AP", ag: "D", prerequisite: "See Ayala’s suggested AP preparation guidance.", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Confirm with Ayala Counseling" },
  { id: "worldcp", name: "World History CP", code: "5201", subject: "History / Social Science", provider: "Ayala", duration: "Year-long", gradeLevels: [9,10], level: "CP", ag: "A", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Official 2026–27" },
  { id: "aphug", name: "AP Human Geography", code: "5927", subject: "History / Social Science", provider: "Ayala", duration: "Year-long", gradeLevels: [9,10], level: "AP", ag: "A", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Official 2026–27" },
  { id: "ush", name: "U.S. History CP", code: "5211", subject: "History / Social Science", provider: "Ayala", duration: "Year-long", gradeLevels: [11], level: "CP", ag: "A", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Official 2026–27" },
  { id: "apush", name: "AP U.S. History", code: "5212", subject: "History / Social Science", provider: "Ayala", duration: "Year-long", gradeLevels: [11], level: "AP", ag: "A", prerequisite: "See Ayala’s suggested AP preparation guidance.", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Confirm with Ayala Counseling" },
  { id: "gov", name: "U.S. Government CP", code: "5221", subject: "History / Social Science", provider: "Ayala", duration: "Semester", gradeLevels: [12], level: "CP", ag: "A", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Official 2026–27" },
  { id: "econ", name: "Economics CP", code: "5301", subject: "History / Social Science", provider: "Ayala", duration: "Semester", gradeLevels: [12], level: "CP", ag: "G", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Official 2026–27" },
  { id: "span1", name: "Spanish 1", code: "5724", subject: "World Language", provider: "Ayala", duration: "Year-long", gradeLevels: [9,10,11,12], level: "CP", ag: "E", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Official 2026–27" },
  { id: "span2", name: "Spanish 2", code: "5725", subject: "World Language", provider: "Ayala", duration: "Year-long", gradeLevels: [10,11,12], level: "CP", ag: "E", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Official 2026–27" },
  { id: "span3", name: "Spanish 3 Honors", code: "5726", subject: "World Language", provider: "Ayala", duration: "Year-long", gradeLevels: [10,11,12], level: "Honors", ag: "E", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Official 2026–27" },
  { id: "asl1", name: "American Sign Language 1", code: "5716", subject: "World Language", provider: "Ayala", duration: "Year-long", gradeLevels: [9,10,11,12], level: "CP", ag: "E", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Official 2026–27" },
  { id: "mand1", name: "Mandarin 1", code: "5735", subject: "World Language", provider: "Ayala", duration: "Year-long", gradeLevels: [9,10,11,12], level: "CP", ag: "E", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Official 2026–27" },
  { id: "pe9", name: "PE 9", code: "5601", subject: "PE", provider: "Ayala", duration: "Year-long", gradeLevels: [9], level: "Standard", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Official 2026–27" },
  { id: "pe1012", name: "PE 10–12", code: "5602", subject: "PE", provider: "Ayala", duration: "Year-long", gradeLevels: [10,11,12], level: "Standard", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Official 2026–27" },
  { id: "art", name: "Art Fundamentals", code: "5746", subject: "VPA", provider: "Ayala", duration: "Year-long", gradeLevels: [9,10,11,12], level: "CP", ag: "F", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Official 2026–27" },
  { id: "theatre", name: "Introduction to Theatre", code: "5701", subject: "VPA", provider: "Ayala", duration: "Year-long", gradeLevels: [9,10,11,12], level: "CP", ag: "F", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Official 2026–27" },
  { id: "health", name: "Health", code: "5502", subject: "Elective", provider: "Ayala", duration: "Semester", gradeLevels: [9,10,11,12], level: "Standard", notes: "Listed as required on Ayala’s 2026–27 registration sheet.", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Official 2026–27" },
  { id: "psych", name: "AP Psychology", code: "5922", subject: "Elective", provider: "Ayala", duration: "Year-long", gradeLevels: [11,12], level: "AP", ag: "G", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Official 2026–27" },
  { id: "ied", name: "Introduction to Engineering Design", code: "5935", subject: "CTE / ROP", provider: "Ayala", duration: "Year-long", gradeLevels: [9,10,11,12], level: "CP", ag: "G", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Official 2026–27" },
  { id: "poe", name: "Principles of Engineering", code: "5937", subject: "CTE / ROP", provider: "Ayala", duration: "Year-long", gradeLevels: [10,11,12], level: "CP", ag: "G", prerequisite: "Confirm pathway sequence with Ayala Counseling.", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Confirm with Ayala Counseling" },
  { id: "cse", name: "Computer Science Essentials", code: "5E46", subject: "CTE / ROP", provider: "Ayala", duration: "Year-long", gradeLevels: [9,10,11,12], level: "CP", ag: "G", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Official 2026–27" },
  { id: "apcsp", name: "AP Computer Science Principles", code: "5E21C", subject: "CTE / ROP", provider: "Ayala", duration: "Year-long", gradeLevels: [10,11,12], level: "AP", ag: "G", prerequisite: "Confirm pathway placement with Ayala Counseling.", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Confirm with Ayala Counseling" },
  { id: "apcsa", name: "AP Computer Science Applications", code: "5E40C", subject: "CTE / ROP", provider: "Ayala", duration: "Year-long", gradeLevels: [10,11,12], level: "AP", ag: "G", prerequisite: "Confirm pathway placement with Ayala Counseling.", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Confirm with Ayala Counseling" },
  { id: "sportsmed", name: "ROP Sports Medicine 1", code: "5R06", subject: "CTE / ROP", provider: "Ayala", duration: "Year-long", gradeLevels: [9,10,11,12], level: "Standard", ag: "G", source: ayalaSource, sourceUrl: ayalaUrl, verification: "Official 2026–27" },
];

const chaffeySource = "Chaffey HSP Summer 2026 course options";
const chaffeyUrl = "https://www.chaffey.edu/dual-enrollment/de-hs-partnership.php";

export const chaffeyCourses: Course[] = [
  { id: "ch-en1a", name: "Academic Reading and Writing", code: "ENGL-1A", subject: "Dual Enrollment / College", provider: "Chaffey", duration: "Semester", gradeLevels: [9,10,11,12], level: "College", prerequisite: "Course eligibility/placement may apply.", source: chaffeySource, sourceUrl: chaffeyUrl, verification: "Current official listing", units: 3 },
  { id: "ch-en1b", name: "Critical Thinking and Writing", code: "ENGL-1B", subject: "Dual Enrollment / College", provider: "Chaffey", duration: "Semester", gradeLevels: [9,10,11,12], level: "College", prerequisite: "ENGL-1A must be completed first.", source: chaffeySource, sourceUrl: chaffeyUrl, verification: "Current official listing", units: 3 },
  { id: "ch-m25", name: "College Algebra", code: "MATH-25", subject: "Dual Enrollment / College", provider: "Chaffey", duration: "Semester", gradeLevels: [9,10,11,12], level: "College", prerequisite: "Course eligibility/placement may apply.", source: chaffeySource, sourceUrl: chaffeyUrl, verification: "Current official listing", units: 4 },
  { id: "ch-m61", name: "Pre-Calculus", code: "MATH-61", subject: "Dual Enrollment / College", provider: "Chaffey", duration: "Semester", gradeLevels: [9,10,11,12], level: "College", prerequisite: "MATH-25 and MATH-31, or placement eligibility, must be completed first.", source: chaffeySource, sourceUrl: chaffeyUrl, verification: "Current official listing", units: 4 },
  { id: "ch-stat", name: "Introduction to Statistics", code: "STAT-10", subject: "Dual Enrollment / College", provider: "Chaffey", duration: "Semester", gradeLevels: [9,10,11,12], level: "College", prerequisite: "Course eligibility/placement may apply.", source: chaffeySource, sourceUrl: chaffeyUrl, verification: "Current official listing", units: 4 },
  { id: "ch-it10", name: "Intro to Computer Information Systems", code: "ITIS-10", subject: "Dual Enrollment / College", provider: "Chaffey", duration: "Semester", gradeLevels: [9,10,11,12], level: "College", source: chaffeySource, sourceUrl: chaffeyUrl, verification: "Current official listing", units: 3 },
  { id: "ch-it30", name: "Intro to Computer Programming", code: "ITIS-30", subject: "Dual Enrollment / College", provider: "Chaffey", duration: "Semester", gradeLevels: [9,10,11,12], level: "College", prerequisite: "Confirm eligibility in the live Chaffey listing.", source: chaffeySource, sourceUrl: chaffeyUrl, verification: "Current official listing", units: 3 },
  { id: "ch-bus10", name: "Introduction to Business", code: "BUS-10", subject: "Dual Enrollment / College", provider: "Chaffey", duration: "Semester", gradeLevels: [9,10,11,12], level: "College", source: chaffeySource, sourceUrl: chaffeyUrl, verification: "Current official listing", units: 3 },
  { id: "ch-psych1", name: "Introduction to Psychology", code: "PSYCH-1", subject: "Dual Enrollment / College", provider: "Chaffey", duration: "Semester", gradeLevels: [9,10,11,12], level: "College", source: chaffeySource, sourceUrl: chaffeyUrl, verification: "Current official listing", units: 3 },
  { id: "ch-hist17", name: "U.S. History Through 1877", code: "HIST-17", subject: "Dual Enrollment / College", provider: "Chaffey", duration: "Semester", gradeLevels: [9,10,11,12], level: "College", source: chaffeySource, sourceUrl: chaffeyUrl, verification: "Current official listing", units: 3 },
  { id: "ch-bi1", name: "General Biology", code: "BIOL-1", subject: "Dual Enrollment / College", provider: "Chaffey", duration: "Semester", gradeLevels: [9,10,11,12], level: "College", prerequisite: "Confirm eligibility in the live Chaffey listing.", source: chaffeySource, sourceUrl: chaffeyUrl, verification: "Current official listing", units: 4 },
  { id: "ch-asl1", name: "Elementary American Sign Language I", code: "ASL-1", subject: "Dual Enrollment / College", provider: "Chaffey", duration: "Semester", gradeLevels: [9,10,11,12], level: "College", source: chaffeySource, sourceUrl: chaffeyUrl, verification: "Current official listing", units: 4 },
  { id: "ch-ph10", name: "Personal Health and Wellness", code: "PH-10", subject: "Dual Enrollment / College", provider: "Chaffey", duration: "Semester", gradeLevels: [9,10,11,12], level: "College", source: chaffeySource, sourceUrl: chaffeyUrl, verification: "Current official listing", units: 3 },
  { id: "ch-eg10", name: "Intro to Engineering Design", code: "EGTECH-10", subject: "Dual Enrollment / College", provider: "Chaffey", duration: "Semester", gradeLevels: [9,10,11,12], level: "College", source: chaffeySource, sourceUrl: chaffeyUrl, verification: "Current official listing", units: 3 },
];

export const allCourses = [...ayalaCourses, ...chaffeyCourses];

export const subjectColors: Record<Subject, string> = {
  English: "#516e9e",
  Math: "#8662a8",
  Science: "#3e8272",
  "History / Social Science": "#b36b4e",
  "World Language": "#b38a37",
  PE: "#5f7f89",
  VPA: "#a4567a",
  Elective: "#6d7483",
  "CTE / ROP": "#2f7189",
  "Dual Enrollment / College": "#2d5c93",
};
