import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from './i18n';

export type Piece = CollectionEntry<'writing'>;

/** Entry ids look like "en/haunted-houses". */
export function pieceLang(piece: Piece): Lang {
  return piece.id.split('/')[0] as Lang;
}

export function pieceSlug(piece: Piece): string {
  return piece.id.split('/').slice(1).join('/');
}

export async function getPieces(lang: Lang): Promise<Piece[]> {
  const all = await getCollection('writing');
  return all
    .filter((p) => pieceLang(p) === lang)
    .sort(
      (a, b) => b.data.lastDisturbed.valueOf() - a.data.lastDisturbed.valueOf(),
    );
}

export interface EchoCandidate {
  slug: string;
  title: string;
  treeState: string;
  type: string;
  weight: number;
}

/**
 * Build the weighted pool of echo candidates for a piece.
 * Shared themes raise the weight; manual echoes are weighted highest.
 * The final pick of 3 happens client-side so the forest can surprise.
 */
export function echoPool(piece: Piece, pieces: Piece[]): EchoCandidate[] {
  const slug = pieceSlug(piece);
  const pool: EchoCandidate[] = [];

  for (const other of pieces) {
    const otherSlug = pieceSlug(other);
    if (otherSlug === slug) continue;

    const shared = other.data.themes.filter((t) =>
      piece.data.themes.includes(t),
    ).length;
    const manual = piece.data.manualEchoes.includes(otherSlug);

    if (shared === 0 && !manual) continue;

    pool.push({
      slug: otherSlug,
      title: other.data.title,
      treeState: other.data.treeState,
      type: other.data.type,
      weight: shared + (manual ? 4 : 0),
    });
  }

  return pool.sort((a, b) => b.weight - a.weight);
}
