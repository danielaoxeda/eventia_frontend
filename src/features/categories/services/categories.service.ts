import type { AdminCategory, NewAdminCategory } from "../types/category.types";

/** Categorías dummy iniciales. */
export const INITIAL_CATEGORIES: AdminCategory[] = [
  {
    id: "CAT-01",
    name: "Música & Conciertos",
    slug: "musica-conciertos",
    icon: "music_note",
    events: 142,
    liveLabel: "18 en vivo",
    volume: "S/ 4,820,500.00",
    isActive: true,
  },
  {
    id: "CAT-02",
    name: "Festivales",
    slug: "festivales",
    icon: "festival",
    events: 36,
    liveLabel: "4 en venta",
    volume: "S/ 2,190,000.00",
    isActive: true,
  },
  {
    id: "CAT-03",
    name: "Teatro & Cultura",
    slug: "teatro-cultura",
    icon: "theater_comedy",
    events: 88,
    liveLabel: "12 en cartelera",
    volume: "S/ 740,220.00",
    isActive: true,
  },
  {
    id: "CAT-04",
    name: "Gastronomía & Ferias",
    slug: "gastronomia-ferias",
    icon: "restaurant",
    events: 54,
    liveLabel: "6 en curso",
    volume: "S/ 1,350,900.00",
    isActive: true,
  },
  {
    id: "CAT-05",
    name: "Tecnología & Startups",
    slug: "tecnologia-startups",
    icon: "devices",
    events: 22,
    liveLabel: "2 próximos",
    volume: "S/ 410,000.00",
    isActive: true,
  },
  {
    id: "CAT-06",
    name: "Deportes Extremos & Motor",
    slug: "deportes-extremos",
    icon: "sports_motorsports",
    events: 19,
    liveLabel: "0 activos",
    volume: "S/ 315,800.00",
    isActive: false,
  },
];

/** Convierte un nombre en slug URL ("Música & Conciertos" → "musica-conciertos"). */
export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Construye una categoría nueva, activa y sin eventos. */
export function buildCategory(id: string, input: NewAdminCategory): AdminCategory {
  return {
    id,
    name: input.name.trim(),
    slug: slugify(input.name),
    icon: "category",
    events: 0,
    liveLabel: "0 activos",
    volume: "S/ 0.00",
    isActive: true,
  };
}
