import type { Beast } from './types';

// ============================================================================
// Bestiaire mineur — à semer partout.
// ============================================================================

export const BESTIARY: Beast[] = [
  {
    id: 'sauteurs',
    name: 'Les Sauteurs',
    threat: 'Meute nocturne',
    description:
      'Cadavres rigides qui bondissent et aspirent le souffle d’un baiser. Mortels en nombre, la nuit.',
    discovered: true,
  },
  {
    id: 'effaces',
    name: 'Les Effacés',
    threat: 'Vol d’identité',
    description:
      'Choses sans visage qui volent les identités — prennent ton nom, ta place ; personne ne se souvient de toi.',
    discovered: false,
  },
  {
    id: 'affames',
    name: 'Les Affamés',
    threat: 'Nuée',
    description:
      'Esprits au ventre sans fond, attirés par la faim et l’avidité ; ravageurs en nuée.',
    discovered: true,
  },
  {
    id: 'retenus',
    name: 'Revenants (les Retenus)',
    threat: 'Variable',
    description:
      'Morts non franchis, du spectre pleurnichard au seigneur-revenant retenu par un serment ou un crime.',
    discovered: true,
  },
  {
    id: 'betes-souffle',
    name: 'Bêtes-de-Souffle',
    threat: 'Prédateur / monture',
    description:
      'Loups de givre, tigres de braise, chevaux-de-vent. Montures rêvées ou prédateurs ; dévoyées quand elles ont trop dévoré.',
    discovered: true,
  },
];

export const BEAST_BY_ID: Record<string, Beast> = Object.fromEntries(
  BESTIARY.map((b) => [b.id, b]),
);
