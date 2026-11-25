import { randomUUID } from 'node:crypto';

export interface Notice {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface NoticeChanges {
  title?: string;
  description?: string;
}

const notices: Notice[] = [
  {
    id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    title: 'Horario de secretaría',
    description: 'La secretaría atiende de lunes a viernes de 9:00 a 13:00.',
    createdAt: '2026-09-01T08:00:00.000Z',
  },
  {
    id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    title: 'Horario de biblioteca',
    description: 'La biblioteca abre de 8:00 a 20:00.',
    createdAt: '2026-09-02T08:00:00.000Z',
  },
  {
    id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    title: 'Calendario del examen final',
    description: 'Ya está disponible el calendario de exámenes del primer trimestre.',
    createdAt: '2026-09-03T08:00:00.000Z',
  },
  {
    id: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
    title: 'Revisión del examen parcial',
    description: 'Las revisiones se solicitan en secretaría.',
    createdAt: '2026-09-04T08:00:00.000Z',
  },
  {
    id: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
    title: 'Cierre del centro por festivo',
    description: 'El centro permanecerá cerrado el día festivo local.',
    createdAt: '2026-09-05T08:00:00.000Z',
  },
];

// total = avisos filtrados antes de paginar; página fuera de rango devuelve []
export function list(page: number, limit: number, search: string) {
  const filtered = search
    ? notices.filter((notice) => notice.title.toLowerCase().includes(search.toLowerCase()))
    : notices;
  const start = (page - 1) * limit;
  return {
    data: filtered.slice(start, start + limit),
    pagination: { page, limit, total: filtered.length },
  };
}

export function getById(id: string): Notice | undefined {
  return notices.find((notice) => notice.id === id);
}

export function create(title: string, description: string): Notice {
  const notice: Notice = {
    id: randomUUID(),
    title,
    description,
    createdAt: new Date().toISOString(),
  };
  notices.push(notice);
  return notice;
}

export function update(id: string, changes: NoticeChanges): Notice | undefined {
  const notice = getById(id);
  if (!notice) {
    return undefined;
  }
  if (changes.title !== undefined) {
    notice.title = changes.title;
  }
  if (changes.description !== undefined) {
    notice.description = changes.description;
  }
  return notice;
}
