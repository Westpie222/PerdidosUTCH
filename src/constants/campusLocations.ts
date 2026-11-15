import { CampusPoint, LostItem } from '../types';

export const CAMPUS_BOUNDS = {
  south: 28.64106698154629,
  west: -106.15002886351107,
  north: 28.64310391705791,
  east: -106.14436096029425,
};

export const CAMPUS_CENTER = { latitude: 28.642034433656725, longitude: -106.14727189720733 };

// Margen (en grados) alrededor del campus para que los pines de los bordes no queden cortados.
export const CAMPUS_MARGIN = 0.0003;

export const isInsideCampus = (latitude: number, longitude: number) =>
    latitude >= CAMPUS_BOUNDS.south - CAMPUS_MARGIN &&
    latitude <= CAMPUS_BOUNDS.north + CAMPUS_MARGIN &&
    longitude >= CAMPUS_BOUNDS.west - CAMPUS_MARGIN &&
    longitude <= CAMPUS_BOUNDS.east + CAMPUS_MARGIN;

// Las publicaciones antiguas solo tienen x/y (% del mapa ficticio): se proyectan sobre el campus real.
export const getItemPosition = (item: LostItem) => {
  if (item.position) return item.position;
  const { x, y } = item.coords ?? { x: 50, y: 50 };
  return {
    latitude: CAMPUS_BOUNDS.north - (y / 100) * (CAMPUS_BOUNDS.north - CAMPUS_BOUNDS.south),
    longitude: CAMPUS_BOUNDS.west + (x / 100) * (CAMPUS_BOUNDS.east - CAMPUS_BOUNDS.west),
  };
};

export const UTCH_CAMPUS_POINTS: CampusPoint[] = [
  {
    id: 'ti',
    name: 'Edificio Tecnologías de la Información',
    shortLabel: 'Edificio TI',
    latitude: 28.641154294067583,
    longitude: -106.14816591271736,
    type: 'building',
  },
  {
    id: 'industrial',
    name: 'Edificio Ing Industrial',
    shortLabel: 'Ing. Industrial',
    latitude: 28.64097449057571,
    longitude: -106.14860104009789,
    type: 'building',
  },
  {
    id: 'negocios',
    name: 'Edificio Desarrollo de Negocios',
    shortLabel: 'Des. Negocios',
    latitude: 28.641690335318597,
    longitude: -106.14832042664638,
    type: 'building',
  },
  {
    id: 'rectoria',
    name: 'Edificio Rectoria',
    shortLabel: 'Rectoría',
    latitude: 28.641959596749903,
    longitude: -106.14775171675247,
    type: 'building',
  },
  {
    id: 'cafeteria',
    name: 'Cafeteria',
    shortLabel: 'Cafetería',
    latitude: 28.642343785649675,
    longitude: -106.14763572985294,
    type: 'building',
  },
  {
    id: 'posgrados',
    name: 'Edificio Posgrados',
    shortLabel: 'Posgrados',
    latitude: 28.641463761140205,
    longitude: -106.14726906163811,
    type: 'building',
  },
  {
    id: 'mantenimiento',
    name: 'Edificio Mantenimiento',
    shortLabel: 'Mantenimiento',
    latitude: 28.64275363679231,
    longitude: -106.14607974852021,
    type: 'building',
  },
  {
    id: 'laboratorios_a',
    name: 'Edificio Laboratorios "A"',
    shortLabel: 'Lab. A',
    latitude: 28.643074341386175,
    longitude: -106.14755862793918,
    type: 'building',
  },
  {
    id: 'mecatronica',
    name: 'Edificio Mecatronica',
    shortLabel: 'Mecatrónica',
    latitude: 28.642843931129768,
    longitude: -106.14512806362102,
    type: 'building',
  },
  {
    id: 'biblioteca',
    name: 'Biblioteca',
    shortLabel: 'Biblioteca',
    latitude: 28.642518226189885,
    longitude: -106.14560574330014,
    type: 'building',
  },
  {
    id: 'gps',
    name: 'Ubicación exacta (gps)',
    shortLabel: 'GPS',
    latitude: 28.642034433656725,
    longitude: -106.14727189720733,
    type: 'landmark',
  },
];

export const INITIAL_LOST_ITEMS: LostItem[] = [
  {
    id: 'item-1',
    title: 'Mochila negra Puma con libreta',
    type: 'found',
    category: 'Mochila',
    locationName: 'UTCH "Inclusión" y Laboratorios',
    coords: { x: 38, y: 33 },
    description: 'Encontrada en el pasillo central del edificio de Inclusión en la banca de madera. Contiene una libreta de cálculo y unos audífonos con cable.',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80',
    author: {
      name: 'Valeria Gómez',
      studentId: '22041289',
      career: 'Mecatrónica',
      phone: '614 250 1198',
    },
    date: 'Hace 15 min',
    commentsCount: 3,
    comments: [
      { id: 'c1', author: 'Roberto S.', text: 'Creo que es de un chavo del grupo MTR41M!', time: 'Hace 10 min' },
      { id: 'c2', author: 'Valeria Gómez', text: 'La dejé encargada con el encargado de laboratorio.', time: 'Hace 5 min' },
    ],
  },
  {
    id: 'item-2',
    title: 'Credencial escolar UTCH y credencial de elector',
    type: 'found',
    category: 'Credencial',
    locationName: 'UTCH Edificios Centrales',
    coords: { x: 68, y: 32 },
    description: 'Credencial de estudiante a nombre de Alan Ramírez de la carrera de Mantenimiento Industrial. Se cayó cerca de las escaleras del edificio B.',
    imageUrl: 'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=700&q=80',
    author: {
      name: 'Mariana Chávez',
      studentId: '21034410',
      career: 'Desarrollo de Software',
      phone: '614 312 9044',
    },
    date: 'Hace 45 min',
    commentsCount: 5,
    comments: [
      { id: 'c3', author: 'Luis P.', text: 'Ya le avisé por WhatsApp a Alan, va para allá.', time: 'Hace 20 min' },
    ],
  },
  {
    id: 'item-3',
    title: 'Calculadora científica Casio fx-991LAX',
    type: 'lost',
    category: 'Electrónica',
    locationName: 'Tecnologías de la Información',
    coords: { x: 23, y: 52 },
    description: 'Olvidé mi calculadora negra con tapa gris en el laboratorio de redes (Aula TI-203). Tiene una calcomanía de Batman en la parte trasera.',
    imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=700&q=80',
    author: {
      name: 'Carlos Méndez',
      studentId: '21040852',
      career: 'Tecnologías de la Información',
      phone: '614 188 4567',
    },
    date: 'Hace 2 horas',
    commentsCount: 1,
    comments: [
      { id: 'c4', author: 'Profe Mario', text: 'Pasa a prefectura a preguntar, entregaron una al mediodía.', time: 'Hace 1 hora' },
    ],
  },
  {
    id: 'item-4',
    title: 'Termo metálico Stanley verde oliva',
    type: 'found',
    category: 'Accesorios',
    locationName: 'Glorieta "El Cazador"',
    coords: { x: 40, y: 49 },
    description: 'Termo verde tipo Stanley encontrado en las bancas de la glorieta El Cazador después de la hora de comida. Está en perfecto estado.',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=80',
    author: {
      name: 'Esteban Morales',
      studentId: '23091002',
      career: 'Procesos Industriales',
      phone: '614 445 7789',
    },
    date: 'Hace 3 horas',
    commentsCount: 2,
    comments: [
      { id: 'c5', author: 'Daniela R.', text: 'Es de Caro!! Te paso su contacto.', time: 'Hace 2 horas' },
    ],
  },
  {
    id: 'item-5',
    title: 'Juego de llaves con llavero de peluche',
    type: 'lost',
    category: 'Otros',
    locationName: 'Rectoría UTCH',
    coords: { x: 22, y: 63 },
    description: 'Se extravió un juego de 4 llaves con un llavero de aguacate tejido cerca de la entrada de ventanillas de Rectoría.',
    imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=700&q=80',
    author: {
      name: 'Fernanda Ortiz',
      studentId: '20011880',
      career: 'Administración',
      phone: '614 556 1234',
    },
    date: 'Ayer',
    commentsCount: 0,
    comments: [],
  },
];
