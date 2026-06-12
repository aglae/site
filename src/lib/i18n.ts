export type Lang = 'en' | 'es';

export const langs: Lang[] = ['en', 'es'];

export const ui = {
  en: {
    'nav.design': 'Design',
    'nav.writing': 'Empty Forest',
    'nav.about': 'About',
    'home.enterForest': 'Enter the Empty Forest',
    'home.seeWork': 'See the work',
    'writing.title': 'Empty Forest',
    'writing.tagline':
      'A quiet place where thoughts are left behind, whether or not anyone finds them.',
    'writing.themes': 'Paths through the forest',
    'writing.allPieces': 'Everything left here',
    'writing.recentlyDisturbed': 'Recently disturbed',
    'echoes.title': 'Nearby Echoes',
    'echoes.subtitle': 'Other things the forest surfaced',
    'meta.firstLeft': 'First left here',
    'meta.lastDisturbed': 'Last disturbed',
    'meta.spoilers': 'Spoilers',
    'design.title': 'Body of work',
    'footer.resume': 'Resume',
    'lang.switch': 'Español',
    'lang.label': 'ES',
  },
  es: {
    'nav.design': 'Diseño',
    'nav.writing': 'Bosque Vacío',
    'nav.about': 'Sobre mí',
    'home.enterForest': 'Entrar al Bosque Vacío',
    'home.seeWork': 'Ver el trabajo',
    'writing.title': 'Bosque Vacío',
    'writing.tagline':
      'Un lugar tranquilo donde los pensamientos se quedan atrás, los encuentre alguien o no.',
    'writing.themes': 'Senderos del bosque',
    'writing.allPieces': 'Todo lo que quedó aquí',
    'writing.recentlyDisturbed': 'Perturbado recientemente',
    'echoes.title': 'Ecos cercanos',
    'echoes.subtitle': 'Otras cosas que el bosque hizo aparecer',
    'meta.firstLeft': 'Dejado aquí por primera vez',
    'meta.lastDisturbed': 'Perturbado por última vez',
    'meta.spoilers': 'Spoilers',
    'design.title': 'Cuerpo de trabajo',
    'footer.resume': 'Currículum',
    'lang.switch': 'English',
    'lang.label': 'EN',
  },
} as const;

export type UIKey = keyof (typeof ui)['en'];

export function t(lang: Lang, key: UIKey): string {
  return ui[lang][key];
}

/** Prefix a root-relative path for the given language. */
export function localePath(lang: Lang, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return lang === 'en' ? clean : `/es${clean}`;
}

/** The same page in the other language. */
export function altPath(lang: Lang, path: string): string {
  return lang === 'en' ? `/es${path}` : path.replace(/^\/es/, '') || '/';
}

export const treeStateLabels: Record<Lang, Record<string, string>> = {
  en: { hanging: 'Hanging', crooked: 'Crooked', fallen: 'Fallen' },
  es: { hanging: 'Colgante', crooked: 'Torcido', fallen: 'Caído' },
};

export const typeLabels: Record<Lang, Record<string, string>> = {
  en: {
    thought: 'Thought',
    note: 'Note',
    reflection: 'Reflection',
    essay: 'Essay',
  },
  es: {
    thought: 'Pensamiento',
    note: 'Nota',
    reflection: 'Reflexión',
    essay: 'Ensayo',
  },
};

/** Gender of each piece type in Spanish, for adjective agreement. */
const esTypeGender: Record<string, 'm' | 'f'> = {
  thought: 'm', // pensamiento
  note: 'f', // nota
  reflection: 'f', // reflexión
  essay: 'm', // ensayo
};

const esStateAdjective: Record<string, { m: string; f: string }> = {
  hanging: { m: 'colgante', f: 'colgante' },
  crooked: { m: 'torcido', f: 'torcida' },
  fallen: { m: 'caído', f: 'caída' },
};

/** "Crooked Reflection" (EN) / "Reflexión torcida" (ES) */
export function pieceLabel(lang: Lang, treeState: string, type: string): string {
  if (lang === 'en') {
    return `${treeStateLabels.en[treeState]} ${typeLabels.en[type]}`;
  }
  const gender = esTypeGender[type] ?? 'm';
  return `${typeLabels.es[type]} ${esStateAdjective[treeState]?.[gender] ?? ''}`.trim();
}

export function formatDate(lang: Lang, date: Date): string {
  return date.toLocaleDateString(lang === 'en' ? 'en-US' : 'es-ES', {
    month: 'long',
    year: 'numeric',
  });
}

/** "Originally written in English. Spanish translation AI-translated, not yet revised." */
export function translationNotice(
  lang: Lang,
  originalLanguage: Lang,
  translation?: { method: 'ai' | 'human'; reviewed: boolean },
): string {
  const langNames: Record<Lang, Record<Lang, string>> = {
    en: { en: 'English', es: 'Spanish' },
    es: { en: 'inglés', es: 'español' },
  };
  const orig = langNames[lang][originalLanguage];

  if (lang === originalLanguage) {
    return lang === 'en'
      ? `Originally written in ${orig}.`
      : `Escrito originalmente en ${orig}.`;
  }

  let status: string;
  if (!translation || translation.method === 'human') {
    status = lang === 'en' ? 'Rewritten version.' : 'Versión reescrita.';
  } else if (translation.reviewed) {
    status =
      lang === 'en'
        ? 'This version AI-translated, revised.'
        : 'Esta versión traducida con IA, revisada.';
  } else {
    status =
      lang === 'en'
        ? 'This version AI-translated, not yet revised.'
        : 'Esta versión traducida con IA, aún sin revisar.';
  }

  return lang === 'en'
    ? `Originally written in ${orig}. ${status}`
    : `Escrito originalmente en ${orig}. ${status}`;
}
