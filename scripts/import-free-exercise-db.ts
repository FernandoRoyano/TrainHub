/**
 * Import exercises from Free Exercise DB into Supabase with offline Spanish translations.
 *
 * Unlike import-exercises.ts (which calls the Wger API for translations),
 * this script uses a comprehensive hardcoded dictionary to translate exercise
 * names and instructions to Spanish -- no external API calls needed.
 *
 * Usage:
 *   npx tsx scripts/import-free-exercise-db.ts
 *
 * Required env vars (reads from .env.local automatically):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import {
  MUSCLE_MAP,
  EQUIPMENT_MAP,
  CATEGORY_MAP,
  DIFFICULTY_MAP,
  MECHANICS_MAP,
  FORCE_MAP,
  uniqueMuscles,
} from "./mappings";

// ---------- env ----------
// eslint-disable-next-line @typescript-eslint/no-require-imports
require("dotenv").config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  console.error("ERROR: Missing NEXT_PUBLIC_SUPABASE_URL in .env.local");
  process.exit(1);
}
if (!SERVICE_KEY) {
  console.error("ERROR: Missing SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// ---------- types ----------
interface FreeExercise {
  id: string;
  name: string;
  force: string | null;
  level: string;
  mechanic: string | null;
  equipment: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category: string;
  images: string[];
}

// ---------- constants ----------
const EXERCISES_JSON_URL =
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json";

const IMAGE_BASE =
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises";

// ---------- Spanish translation dictionary ----------

/**
 * Comprehensive English-to-Spanish word/phrase mapping for exercise names.
 * Ordered longest-first so multi-word phrases are matched before their parts.
 */
const EXERCISE_NAME_TRANSLATIONS: [RegExp, string][] = [
  // ---- Multi-word phrases (must come FIRST) ----
  // Equipment phrases
  [/\bsmith machine\b/gi, "multipower"],
  [/\be-z curl bar\b/gi, "barra Z"],
  [/\bez curl bar\b/gi, "barra Z"],
  [/\bez[- ]?bar\b/gi, "barra Z"],
  [/\btrap bar\b/gi, "barra hexagonal"],
  [/\bswiss ball\b/gi, "pelota suiza"],
  [/\bexercise ball\b/gi, "pelota de ejercicio"],
  [/\bmedicine ball\b/gi, "balón medicinal"],
  [/\bstability ball\b/gi, "pelota de estabilidad"],
  [/\bfoam roll(?:er)?\b/gi, "rodillo de espuma"],
  [/\bpull[- ]?up bar\b/gi, "barra de dominadas"],
  [/\bpreacher curl\b/gi, "curl en banco Scott"],
  [/\bpreacher bench\b/gi, "banco Scott"],
  [/\bflat bench\b/gi, "banco plano"],
  [/\bincline bench\b/gi, "banco inclinado"],
  [/\bdecline bench\b/gi, "banco declinado"],
  [/\badjustable bench\b/gi, "banco ajustable"],
  [/\butility bench\b/gi, "banco multiusos"],
  [/\bbosu ball\b/gi, "bosu"],
  [/\bab wheel\b/gi, "rueda abdominal"],
  [/\bab roller\b/gi, "rueda abdominal"],
  [/\bjump rope\b/gi, "cuerda de saltar"],
  [/\bresistance band\b/gi, "banda de resistencia"],
  [/\bpower rack\b/gi, "jaula de potencia"],
  [/\bcable machine\b/gi, "máquina de poleas"],
  [/\bleg press\b/gi, "prensa de piernas"],
  [/\bhack squat\b/gi, "sentadilla hack"],
  [/\bpec deck\b/gi, "máquina de aperturas"],

  // Grip/stance phrases
  [/\bclose[- ]?grip\b/gi, "agarre cerrado"],
  [/\bwide[- ]?grip\b/gi, "agarre ancho"],
  [/\bnarrow[- ]?grip\b/gi, "agarre estrecho"],
  [/\bneutral[- ]?grip\b/gi, "agarre neutro"],
  [/\breverse[- ]?grip\b/gi, "agarre inverso"],
  [/\boverhand[- ]?grip\b/gi, "agarre prono"],
  [/\bunderhand[- ]?grip\b/gi, "agarre supino"],
  [/\bmixed[- ]?grip\b/gi, "agarre mixto"],
  [/\bsumo stance\b/gi, "postura sumo"],
  [/\bsplit stance\b/gi, "postura dividida"],

  // Body position phrases
  [/\bsingle[- ]?leg\b/gi, "a una pierna"],
  [/\bone[- ]?leg\b/gi, "a una pierna"],
  [/\bsingle[- ]?arm\b/gi, "a un brazo"],
  [/\bone[- ]?arm\b/gi, "a un brazo"],
  [/\bstraight[- ]?arm\b/gi, "brazo recto"],
  [/\bstiff[- ]?leg(?:ged)?\b/gi, "piernas rígidas"],
  [/\bbent[- ]?over\b/gi, "inclinado"],
  [/\bbent[- ]?arm\b/gi, "brazo flexionado"],
  [/\bface[- ]?down\b/gi, "boca abajo"],
  [/\bface[- ]?up\b/gi, "boca arriba"],

  // Exercise compound names
  [/\bpush[- ]?up(?:s)?\b/gi, "flexiones"],
  [/\bpull[- ]?up(?:s)?\b/gi, "dominadas"],
  [/\bchin[- ]?up(?:s)?\b/gi, "dominadas supinas"],
  [/\bmuscle[- ]?up(?:s)?\b/gi, "muscle-up"],
  [/\bdead ?lift(?:s)?\b/gi, "peso muerto"],
  [/\bclean and jerk\b/gi, "cargada y envión"],
  [/\bclean and press\b/gi, "cargada y press"],
  [/\bpower clean\b/gi, "cargada de potencia"],
  [/\bhang clean\b/gi, "cargada colgante"],
  [/\bfront squat\b/gi, "sentadilla frontal"],
  [/\bback squat\b/gi, "sentadilla trasera"],
  [/\bgoblet squat\b/gi, "sentadilla copa"],
  [/\boverhead squat\b/gi, "sentadilla sobre cabeza"],
  [/\bsumo squat\b/gi, "sentadilla sumo"],
  [/\bpistol squat\b/gi, "sentadilla pistola"],
  [/\bbulgarian split squat\b/gi, "sentadilla búlgara"],
  [/\bsplit squat\b/gi, "sentadilla dividida"],
  [/\bbox squat\b/gi, "sentadilla en caja"],
  [/\bzercher squat\b/gi, "sentadilla Zercher"],
  [/\boverhead press\b/gi, "press sobre cabeza"],
  [/\bshoulder press\b/gi, "press de hombros"],
  [/\bmilitary press\b/gi, "press militar"],
  [/\bbench press\b/gi, "press de banca"],
  [/\bfloor press\b/gi, "press en suelo"],
  [/\bpush press\b/gi, "push press"],
  [/\barnold press\b/gi, "press Arnold"],
  [/\blandmine press\b/gi, "press con landmine"],
  [/\bclose grip bench press\b/gi, "press de banca agarre cerrado"],
  [/\bincline press\b/gi, "press inclinado"],
  [/\bdecline press\b/gi, "press declinado"],
  [/\bhammer curl\b/gi, "curl martillo"],
  [/\bconcentration curl\b/gi, "curl concentrado"],
  [/\bspider curl\b/gi, "curl araña"],
  [/\bzottman curl\b/gi, "curl Zottman"],
  [/\bcable curl\b/gi, "curl en polea"],
  [/\bincline curl\b/gi, "curl inclinado"],
  [/\breverse curl\b/gi, "curl inverso"],
  [/\bwrist curl\b/gi, "curl de muñeca"],
  [/\bbicep curl\b/gi, "curl de bíceps"],
  [/\bbiceps curl\b/gi, "curl de bíceps"],
  [/\bbarbell curl\b/gi, "curl con barra"],
  [/\bdumbbell curl\b/gi, "curl con mancuerna"],
  [/\btricep(?:s)? extension\b/gi, "extensión de tríceps"],
  [/\btricep(?:s)? pushdown\b/gi, "jalón de tríceps"],
  [/\btricep(?:s)? kickback\b/gi, "patada de tríceps"],
  [/\btricep(?:s)? dip\b/gi, "fondo de tríceps"],
  [/\bskull ?crusher(?:s)?\b/gi, "rompecráneos"],
  [/\bfrench press\b/gi, "press francés"],
  [/\bbent[- ]?over row\b/gi, "remo inclinado"],
  [/\bbarbell row\b/gi, "remo con barra"],
  [/\bdumbbell row\b/gi, "remo con mancuerna"],
  [/\bcable row\b/gi, "remo en polea"],
  [/\bseated row\b/gi, "remo sentado"],
  [/\bupright row\b/gi, "remo al mentón"],
  [/\bpendlay row\b/gi, "remo Pendlay"],
  [/\bt[- ]?bar row\b/gi, "remo en T"],
  [/\binverted row\b/gi, "remo invertido"],
  [/\blat pulldown\b/gi, "jalón al pecho"],
  [/\bstraight[- ]?arm pulldown\b/gi, "jalón con brazo recto"],
  [/\blateral raise\b/gi, "elevación lateral"],
  [/\bfront raise\b/gi, "elevación frontal"],
  [/\brear delt(?:oid)? (?:raise|fly)\b/gi, "elevación posterior"],
  [/\bface pull\b/gi, "tirón a la cara"],
  [/\bleg curl\b/gi, "curl de pierna"],
  [/\bleg extension\b/gi, "extensión de pierna"],
  [/\bleg raise\b/gi, "elevación de piernas"],
  [/\bcalf raise\b/gi, "elevación de gemelos"],
  [/\bhip thrust\b/gi, "empuje de cadera"],
  [/\bglute bridge\b/gi, "puente de glúteos"],
  [/\bglute[- ]?ham raise\b/gi, "elevación glúteo-isquiotibial"],
  [/\bgood morning\b/gi, "buenos días"],
  [/\bback extension\b/gi, "extensión de espalda"],
  [/\bhyper ?extension\b/gi, "hiperextensión"],
  [/\breverse hyper(?:extension)?\b/gi, "hiperextensión inversa"],
  [/\bwalking lunge\b/gi, "zancada caminando"],
  [/\breverse lunge\b/gi, "zancada inversa"],
  [/\bside lunge\b/gi, "zancada lateral"],
  [/\bcurtsy lunge\b/gi, "zancada cruzada"],
  [/\bstep[- ]?up(?:s)?\b/gi, "subida al cajón"],
  [/\bbox jump\b/gi, "salto al cajón"],
  [/\bbroad jump\b/gi, "salto de longitud"],
  [/\btuck jump\b/gi, "salto agrupado"],
  [/\bjump squat\b/gi, "sentadilla con salto"],
  [/\bjumping jack\b/gi, "saltos de tijera"],
  [/\bmountain climber(?:s)?\b/gi, "escaladores"],
  [/\bburpee(?:s)?\b/gi, "burpees"],
  [/\bbicycle crunch\b/gi, "crunch bicicleta"],
  [/\breverse crunch\b/gi, "crunch inverso"],
  [/\bcable crunch\b/gi, "crunch en polea"],
  [/\bdecline crunch\b/gi, "crunch declinado"],
  [/\bside plank\b/gi, "plancha lateral"],
  [/\bfront plank\b/gi, "plancha frontal"],
  [/\bRussian twist\b/gi, "giro ruso"],
  [/\brushian twist\b/gi, "giro ruso"],
  [/\bwood ?chop(?:s)?\b/gi, "leñador"],
  [/\bpallov press\b/gi, "press Pallof"],
  [/\bpallof press\b/gi, "press Pallof"],
  [/\bdead ?bug\b/gi, "bicho muerto"],
  [/\bbird[- ]?dog\b/gi, "pájaro-perro"],
  [/\bbear crawl\b/gi, "gateo del oso"],
  [/\bfarmer(?:'?s)? walk\b/gi, "paseo del granjero"],
  [/\bfarmer(?:'?s)? carry\b/gi, "cargada del granjero"],
  [/\bsuitcase carry\b/gi, "cargada tipo maleta"],
  [/\brackwalk\b/gi, "caminata en rack"],
  [/\bbattle rope\b/gi, "cuerda de batalla"],
  [/\bsled push\b/gi, "empuje de trineo"],
  [/\bsled pull\b/gi, "tirón de trineo"],
  [/\btire flip\b/gi, "volteo de neumático"],
  [/\bkettlebell swing\b/gi, "swing con kettlebell"],
  [/\bkettlebell snatch\b/gi, "arrancada con kettlebell"],
  [/\bkettlebell clean\b/gi, "cargada con kettlebell"],
  [/\bturkish get[- ]?up\b/gi, "levantada turca"],
  [/\bwindmill\b/gi, "molino"],
  [/\bhalo\b/gi, "halo"],
  [/\bchest fly\b/gi, "apertura de pecho"],
  [/\bchest press\b/gi, "press de pecho"],
  [/\bcable fly\b/gi, "apertura en polea"],
  [/\bcable crossover\b/gi, "cruce de poleas"],
  [/\bdumbbell fly\b/gi, "apertura con mancuerna"],
  [/\bpec fly\b/gi, "apertura de pecho"],
  [/\bshrug(?:s)?\b/gi, "encogimiento de hombros"],
  [/\bface ?pull\b/gi, "tirón a la cara"],
  [/\bhand stand\b/gi, "parada de manos"],
  [/\bhandstand\b/gi, "parada de manos"],
  [/\bwall sit\b/gi, "sentadilla en pared"],
  [/\bglute kickback\b/gi, "patada de glúteo"],
  [/\bdonkey kick\b/gi, "patada de burro"],
  [/\bfire hydrant\b/gi, "hidrante"],
  [/\bclamshell\b/gi, "concha"],
  [/\bhip abduction\b/gi, "abducción de cadera"],
  [/\bhip adduction\b/gi, "aducción de cadera"],
  [/\binner thigh\b/gi, "aductor"],
  [/\bouter thigh\b/gi, "abductor"],
  [/\bround the world\b/gi, "vuelta al mundo"],
  [/\baround the world\b/gi, "vuelta al mundo"],
  [/\bhigh pull\b/gi, "tirón alto"],
  [/\bclean pull\b/gi, "tirón de cargada"],
  [/\bsnatch pull\b/gi, "tirón de arrancada"],
  [/\bpower snatch\b/gi, "arrancada de potencia"],
  [/\bhang snatch\b/gi, "arrancada colgante"],
  [/\bfront raise\b/gi, "elevación frontal"],
  [/\brack pull\b/gi, "peso muerto en rack"],
  [/\bdeficit deadlift\b/gi, "peso muerto con déficit"],
  [/\bsumo deadlift\b/gi, "peso muerto sumo"],
  [/\bromanian deadlift\b/gi, "peso muerto rumano"],
  [/\bconventional deadlift\b/gi, "peso muerto convencional"],

  // ---- Single-word translations (alphabetical) ----
  // Body parts
  [/\babdominals?\b/gi, "abdominales"],
  [/\babs\b/gi, "abdominales"],
  [/\bcore\b/gi, "core"],
  [/\bchest\b/gi, "pecho"],
  [/\bback\b/gi, "espalda"],
  [/\bshoulder(?:s)?\b/gi, "hombros"],
  [/\bbicep(?:s)?\b/gi, "bíceps"],
  [/\btricep(?:s)?\b/gi, "tríceps"],
  [/\bquadricep(?:s)?\b/gi, "cuádriceps"],
  [/\bquad(?:s)?\b/gi, "cuádriceps"],
  [/\bhamstring(?:s)?\b/gi, "isquiotibiales"],
  [/\bglute(?:s)?\b/gi, "glúteos"],
  [/\bcalf\b/gi, "gemelo"],
  [/\bcalves\b/gi, "gemelos"],
  [/\bforearm(?:s)?\b/gi, "antebrazos"],
  [/\btrap(?:s)?\b/gi, "trapecios"],
  [/\btrapezius\b/gi, "trapecio"],
  [/\blat(?:s)?\b/gi, "dorsales"],
  [/\blatissimus\b/gi, "dorsal"],
  [/\bneck\b/gi, "cuello"],
  [/\bdelt(?:oid)?(?:s)?\b/gi, "deltoides"],
  [/\bpectoral(?:s)?\b/gi, "pectorales"],
  [/\bpec(?:s)?\b/gi, "pectorales"],
  [/\brhomboid(?:s)?\b/gi, "romboides"],
  [/\bserratus\b/gi, "serrato"],
  [/\boblique(?:s)?\b/gi, "oblicuos"],
  [/\bhip(?:s)?\b/gi, "cadera"],
  [/\bgroin\b/gi, "ingle"],
  [/\bshin(?:s)?\b/gi, "espinilla"],
  [/\bwrist(?:s)?\b/gi, "muñeca"],
  [/\belbow(?:s)?\b/gi, "codo"],
  [/\bknee(?:s)?\b/gi, "rodilla"],
  [/\bankle(?:s)?\b/gi, "tobillo"],
  [/\bfoot\b/gi, "pie"],
  [/\bfeet\b/gi, "pies"],
  [/\btorso\b/gi, "torso"],
  [/\bspine\b/gi, "columna"],
  [/\blower body\b/gi, "tren inferior"],
  [/\bupper body\b/gi, "tren superior"],

  // Equipment
  [/\bbarbell\b/gi, "barra"],
  [/\bdumbbell(?:s)?\b/gi, "mancuerna"],
  [/\bcable\b/gi, "polea"],
  [/\bmachine\b/gi, "máquina"],
  [/\bbench\b/gi, "banco"],
  [/\bband(?:s)?\b/gi, "banda"],
  [/\bkettlebell\b/gi, "kettlebell"],
  [/\bplate\b/gi, "disco"],
  [/\bball\b/gi, "pelota"],
  [/\brope\b/gi, "cuerda"],
  [/\bring(?:s)?\b/gi, "anillas"],
  [/\bbar\b/gi, "barra"],
  [/\bmat\b/gi, "colchoneta"],
  [/\bbox\b/gi, "cajón"],
  [/\broller\b/gi, "rodillo"],
  [/\bchain(?:s)?\b/gi, "cadena"],
  [/\btowel\b/gi, "toalla"],
  [/\bstick\b/gi, "palo"],
  [/\bwheel\b/gi, "rueda"],

  // Movements
  [/\bpress\b/gi, "press"],
  [/\bcurl\b/gi, "curl"],
  [/\brow(?:s)?\b/gi, "remo"],
  [/\bsquat(?:s)?\b/gi, "sentadilla"],
  [/\blunge(?:s)?\b/gi, "zancada"],
  [/\bfly\b/gi, "apertura"],
  [/\bflies\b/gi, "aperturas"],
  [/\bflye(?:s)?\b/gi, "apertura"],
  [/\braise(?:s)?\b/gi, "elevación"],
  [/\bextension(?:s)?\b/gi, "extensión"],
  [/\bpulldown\b/gi, "jalón"],
  [/\bpullover\b/gi, "pullover"],
  [/\bcrunch(?:es)?\b/gi, "crunch"],
  [/\bplank\b/gi, "plancha"],
  [/\bdip(?:s)?\b/gi, "fondos"],
  [/\bsnatch\b/gi, "arrancada"],
  [/\bclean\b/gi, "cargada"],
  [/\bjerk\b/gi, "envión"],
  [/\bthrust(?:s)?\b/gi, "empuje"],
  [/\bkick(?:s)?\b/gi, "patada"],
  [/\btwist(?:s)?\b/gi, "giro"],
  [/\brotation(?:s)?\b/gi, "rotación"],
  [/\bflexion\b/gi, "flexión"],
  [/\babduction\b/gi, "abducción"],
  [/\badduction\b/gi, "aducción"],
  [/\bswing(?:s)?\b/gi, "swing"],
  [/\bpull\b/gi, "tirón"],
  [/\bpush\b/gi, "empuje"],
  [/\blift(?:s)?\b/gi, "levantamiento"],
  [/\bjump(?:s)?\b/gi, "salto"],
  [/\bwalk\b/gi, "caminata"],
  [/\bhold\b/gi, "mantenimiento"],
  [/\bsit[- ]?up(?:s)?\b/gi, "abdominales"],
  [/\bstretch(?:es|ing)?\b/gi, "estiramiento"],
  [/\brollout\b/gi, "despliegue"],
  [/\bcrunch\b/gi, "crunch"],
  [/\broll\b/gi, "rodamiento"],
  [/\bbridge\b/gi, "puente"],
  [/\bcarry\b/gi, "cargada"],
  [/\btoss\b/gi, "lanzamiento"],
  [/\bthrow\b/gi, "lanzamiento"],
  [/\bslam\b/gi, "golpeo"],
  [/\bchop\b/gi, "corte"],
  [/\bsprint(?:s)?\b/gi, "sprint"],
  [/\brun\b/gi, "carrera"],
  [/\bjog\b/gi, "trote"],
  [/\bcrawl\b/gi, "gateo"],
  [/\bclimb\b/gi, "escalada"],
  [/\bhang\b/gi, "colgada"],
  [/\bflip\b/gi, "volteo"],

  // Descriptors
  [/\bincline\b/gi, "inclinado"],
  [/\bdecline\b/gi, "declinado"],
  [/\bseated\b/gi, "sentado"],
  [/\bsitting\b/gi, "sentado"],
  [/\bstanding\b/gi, "de pie"],
  [/\blying\b/gi, "tumbado"],
  [/\bprone\b/gi, "prono"],
  [/\bsupine\b/gi, "supino"],
  [/\breverse\b/gi, "inverso"],
  [/\balternating\b/gi, "alterno"],
  [/\balternate\b/gi, "alterno"],
  [/\bunilateral\b/gi, "unilateral"],
  [/\bbilateral\b/gi, "bilateral"],
  [/\bisometric\b/gi, "isométrico"],
  [/\beccentric\b/gi, "excéntrico"],
  [/\bconcentric\b/gi, "concéntrico"],
  [/\bexplosive\b/gi, "explosivo"],
  [/\bweighted\b/gi, "con peso"],
  [/\bassisted\b/gi, "asistido"],
  [/\bbodyweight\b/gi, "con peso corporal"],
  [/\boverhead\b/gi, "sobre cabeza"],
  [/\bbehind\b/gi, "tras"],
  [/\bfront\b/gi, "frontal"],
  [/\blateral\b/gi, "lateral"],
  [/\bmedial\b/gi, "medial"],
  [/\bposterior\b/gi, "posterior"],
  [/\banterior\b/gi, "anterior"],
  [/\bupper\b/gi, "superior"],
  [/\blower\b/gi, "inferior"],
  [/\bmiddle\b/gi, "medio"],
  [/\binner\b/gi, "interior"],
  [/\bouter\b/gi, "exterior"],
  [/\bnarrow\b/gi, "estrecho"],
  [/\bwide\b/gi, "ancho"],
  [/\bhigh\b/gi, "alto"],
  [/\blow\b/gi, "bajo"],
  [/\bfull\b/gi, "completo"],
  [/\bhalf\b/gi, "medio"],
  [/\bpartial\b/gi, "parcial"],
  [/\bslow\b/gi, "lento"],
  [/\bdouble\b/gi, "doble"],
  [/\bsingle\b/gi, "simple"],
  [/\bheavy\b/gi, "pesado"],
  [/\blight\b/gi, "ligero"],
  [/\bdeep\b/gi, "profundo"],
  [/\bpaused\b/gi, "con pausa"],
  [/\btempo\b/gi, "tempo"],

  // Positional
  [/\bon\b/gi, "en"],
  [/\bwith\b/gi, "con"],
  [/\bto\b/gi, "a"],
  [/\band\b/gi, "y"],
  [/\bthe\b/gi, "el"],
  [/\bof\b/gi, "de"],
  [/\bfor\b/gi, "para"],
  [/\bat\b/gi, "en"],
  [/\bfrom\b/gi, "desde"],
  [/\bbetween\b/gi, "entre"],
  [/\bacross\b/gi, "a través"],
  [/\bover\b/gi, "sobre"],
  [/\bunder\b/gi, "debajo"],
  [/\bbehind\b/gi, "detrás"],
  [/\bin\b/gi, "en"],
];

/**
 * Known full exercise name translations. These override the word-by-word approach
 * for exercises whose name doesn't translate well word by word.
 */
const FULL_NAME_TRANSLATIONS: Record<string, string> = {
  "rickshaw carry": "cargada en rickshaw",
  "landmine 180's": "landmine 180",
  "clean and jerk": "cargada y envión",
  "power clean and jerk": "cargada de potencia y envión",
  "snatch-grip deadlift": "peso muerto agarre de arrancada",
  "sumo deadlift high pull": "peso muerto sumo tirón alto",
  "dumbbell bench press": "press de banca con mancuernas",
  "barbell bench press - medium grip": "press de banca con barra agarre medio",
  "pushups": "flexiones",
  "push-ups": "flexiones",
  "pull-ups": "dominadas",
  "chin-ups": "dominadas supinas",
  "sit-ups": "abdominales",
  "sit-up": "abdominal",
  "handstand push-up": "flexiones en parada de manos",
  "pike push-up": "flexiones pike",
  "diamond push-up": "flexiones diamante",
  "close-grip barbell bench press": "press de banca con barra agarre cerrado",
  "wide-grip lat pulldown": "jalón al pecho agarre ancho",
  "close-grip lat pulldown": "jalón al pecho agarre cerrado",
  "behind the neck barbell press": "press tras nuca con barra",
  "lying triceps press": "press francés tumbado",
  "standing calf raises": "elevaciones de gemelos de pie",
  "seated calf raise": "elevación de gemelos sentado",
  "donkey calf raises": "elevaciones de gemelos tipo burro",
  "jogging-treadmill": "trote en cinta",
  "running, treadmill": "carrera en cinta",
  "stationary bike": "bicicleta estática",
  "rowing, stationary": "remo estático",
  "elliptical trainer": "elíptica",
  "stairmaster": "escaladora",
  "trail running/walking": "carrera/caminata por sendero",
  "thigh abductor": "abductor de muslo",
  "thigh adductor": "aductor de muslo",
  "butterfly": "mariposa",
  "superman": "superman",
  "plank": "plancha",
  "side plank": "plancha lateral",
  "v-up": "V-up",
  "v-sit": "V-sit",
  "l-sit": "L-sit",
  "dragon flag": "bandera del dragón",
  "ab crunch machine": "máquina de crunch abdominal",
  "exercise bike": "bicicleta estática",
  "recumbent bike": "bicicleta reclinada",
};

/**
 * Instruction translation: common English phrases/sentences to Spanish.
 */
const INSTRUCTION_WORD_MAP: [RegExp, string][] = [
  // Common instruction phrases
  [/\bStarting Position\b/gi, "Posición inicial"],
  [/\bstarting position\b/gi, "posición inicial"],
  [/\bRepeat for\b/gi, "Repetir durante"],
  [/\brepeat for\b/gi, "repetir durante"],
  [/\bRepeat on the other side\b/gi, "Repetir en el otro lado"],
  [/\breturn to the starting position\b/gi, "volver a la posición inicial"],
  [/\bReturn to the starting position\b/gi, "Volver a la posición inicial"],
  [/\bSlowly lower\b/gi, "Bajar lentamente"],
  [/\bslowly lower\b/gi, "bajar lentamente"],
  [/\bSlowly return\b/gi, "Volver lentamente"],
  [/\bslowly return\b/gi, "volver lentamente"],
  [/\bthe desired number of repetitions\b/gi, "el número deseado de repeticiones"],
  [/\bthe recommended number of repetitions\b/gi, "el número recomendado de repeticiones"],
  [/\bsets and reps\b/gi, "series y repeticiones"],
  [/\breps\b/gi, "repeticiones"],
  [/\bsets\b/gi, "series"],
  [/\brepetitions\b/gi, "repeticiones"],
  [/\bHold (?:the |this )?position\b/gi, "Mantener la posición"],
  [/\bhold (?:the |this )?position\b/gi, "mantener la posición"],
  [/\bfor (\d+) seconds\b/gi, "durante $1 segundos"],
  [/\bKeep your back straight\b/gi, "Mantener la espalda recta"],
  [/\bkeep your back straight\b/gi, "mantener la espalda recta"],
  [/\bKeep your core tight\b/gi, "Mantener el core contraído"],
  [/\bkeep your core tight\b/gi, "mantener el core contraído"],
  [/\bBreathe out\b/gi, "Exhalar"],
  [/\bbreathe out\b/gi, "exhalar"],
  [/\bBreathe in\b/gi, "Inhalar"],
  [/\bbreathe in\b/gi, "inhalar"],
  [/\bExhale\b/gi, "Exhalar"],
  [/\bexhale\b/gi, "exhalar"],
  [/\bInhale\b/gi, "Inhalar"],
  [/\binhale\b/gi, "inhalar"],
  [/\bTip\b/g, "Consejo"],
  [/\bVariation\b/gi, "Variación"],
  [/\bCaution\b/gi, "Precaución"],
];

// ---------- translation helpers ----------

function translateExerciseName(name: string): string {
  const lowerName = name.toLowerCase().trim();

  // Check full-name dictionary first
  if (FULL_NAME_TRANSLATIONS[lowerName]) {
    return capitalizeFirst(FULL_NAME_TRANSLATIONS[lowerName]);
  }

  // Word-by-word replacement
  let translated = name;
  for (const [pattern, replacement] of EXERCISE_NAME_TRANSLATIONS) {
    translated = translated.replace(pattern, replacement);
  }

  // Clean up spacing/capitalization
  translated = translated.replace(/\s{2,}/g, " ").trim();
  return capitalizeFirst(translated);
}

function translateInstructions(instructions: string): string {
  let translated = instructions;
  for (const [pattern, replacement] of INSTRUCTION_WORD_MAP) {
    translated = translated.replace(pattern, replacement);
  }
  // Also apply exercise name translations for body parts, movements, etc.
  for (const [pattern, replacement] of EXERCISE_NAME_TRANSLATIONS) {
    translated = translated.replace(pattern, replacement);
  }
  return translated;
}

function capitalizeFirst(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ---------- mapping helpers ----------

function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function mapMuscles(muscles: string[]): string[] {
  return uniqueMuscles(muscles.map(titleCase));
}

function mapEquipment(equipment: string | null): string[] {
  if (!equipment) return ["bodyweight"];
  const titleEquip = equipment
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  const mapped = EQUIPMENT_MAP[titleEquip];
  return mapped ? [mapped] : ["bodyweight"];
}

function mapCategory(category: string): { category: string; exercise_type: string } {
  const titleCat = titleCase(category);
  return CATEGORY_MAP[titleCat] ?? { category: "strength", exercise_type: "compound" };
}

function mapDifficulty(level: string): string {
  return DIFFICULTY_MAP[titleCase(level)] ?? "intermediate";
}

function mapMechanics(mechanic: string | null): string | null {
  if (!mechanic) return null;
  return MECHANICS_MAP[titleCase(mechanic)] ?? null;
}

function mapForce(force: string | null): string | null {
  if (!force) return null;
  return FORCE_MAP[titleCase(force)] ?? null;
}

// ---------- main ----------
async function main() {
  console.log("=== Free Exercise DB Import (with offline Spanish translations) ===\n");

  // 1. Fetch exercises from GitHub
  console.log("Fetching exercises.json from GitHub...");
  const res = await fetch(EXERCISES_JSON_URL);
  if (!res.ok) {
    console.error(`Failed to fetch exercises.json: HTTP ${res.status}`);
    process.exit(1);
  }
  const exercises: FreeExercise[] = await res.json();
  console.log(`Fetched ${exercises.length} exercises.\n`);

  // 2. Load existing exercise names (case-insensitive duplicate check)
  console.log("Checking for existing exercises in database...");
  const { data: existingRows, error: fetchErr } = await supabase
    .from("exercises")
    .select("name, source_id");

  if (fetchErr) {
    console.error(`Failed to fetch existing exercises: ${fetchErr.message}`);
    process.exit(1);
  }

  const existingNames = new Set(
    (existingRows ?? []).map((e: { name: string }) => e.name.toLowerCase())
  );
  const existingSourceIds = new Set(
    (existingRows ?? []).filter((e: { source_id: string | null }) => e.source_id).map((e: { source_id: string }) => e.source_id)
  );
  console.log(`Found ${existingNames.size} existing exercises in database.\n`);

  // 3. Process and insert exercises in batches
  let inserted = 0;
  let skipped = 0;
  let errors = 0;

  const BATCH_SIZE = 50;
  const batch: Record<string, unknown>[] = [];

  for (let i = 0; i < exercises.length; i++) {
    const ex = exercises[i];

    // Duplicate check (by name or source_id)
    if (existingNames.has(ex.name.toLowerCase()) || existingSourceIds.has(ex.id)) {
      skipped++;
      continue;
    }

    // Map fields
    const primaryMapped = mapMuscles(ex.primaryMuscles);
    const secondaryMapped = mapMuscles(ex.secondaryMuscles);
    const allMuscles = Array.from(new Set([...primaryMapped, ...secondaryMapped]));
    const equipmentMapped = mapEquipment(ex.equipment);
    const catMap = mapCategory(ex.category);
    const instructionsEn = ex.instructions.join("\n\n");

    // Build image URLs from the exercise folder name
    const folderName = ex.name.replace(/ /g, "_");
    const imageUrls = ex.images.map(
      (img) => `${IMAGE_BASE}/${img}`
    );
    const thumbnailUrl = imageUrls[0] ?? null;

    // Translate name and instructions
    const nameEs = translateExerciseName(ex.name);
    const instructionsEs = translateInstructions(instructionsEn);

    const row = {
      trainer_id: null,
      name: ex.name,
      name_es: nameEs,
      slug: slugify(ex.name),
      source: "free_exercise_db",
      source_id: ex.id,
      description: null,
      description_es: null,
      instructions: instructionsEn,
      instructions_es: instructionsEs,
      video_url: null,
      thumbnail_url: thumbnailUrl,
      muscle_groups: allMuscles,
      equipment: equipmentMapped,
      difficulty: mapDifficulty(ex.level),
      category: catMap.category,
      primary_muscles: primaryMapped,
      secondary_muscles: secondaryMapped,
      exercise_type: catMap.exercise_type,
      mechanics: mapMechanics(ex.mechanic),
      force: mapForce(ex.force),
      images: imageUrls,
      is_public: true,
    };

    batch.push(row);

    // Mark as added to avoid duplicate within this run
    existingNames.add(ex.name.toLowerCase());
    existingSourceIds.add(ex.id);

    // Flush batch
    if (batch.length >= BATCH_SIZE) {
      const { error } = await supabase.from("exercises").insert(batch);
      if (error) {
        console.error(`  [BATCH ERROR] ${error.message}`);
        errors += batch.length;
      } else {
        inserted += batch.length;
      }
      batch.length = 0;

      // Progress log
      console.log(
        `  Progress: ${i + 1}/${exercises.length} | Inserted: ${inserted} | Skipped: ${skipped} | Errors: ${errors}`
      );
    }
  }

  // Flush remaining
  if (batch.length > 0) {
    const { error } = await supabase.from("exercises").insert(batch);
    if (error) {
      console.error(`  [BATCH ERROR] ${error.message}`);
      errors += batch.length;
    } else {
      inserted += batch.length;
    }
  }

  console.log("\n========= IMPORT COMPLETE =========");
  console.log(`Total in Free Exercise DB: ${exercises.length}`);
  console.log(`Inserted:                  ${inserted}`);
  console.log(`Skipped (duplicates):      ${skipped}`);
  console.log(`Errors:                    ${errors}`);
  console.log("====================================");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
