import type { NextFunction, Request, Response } from 'express';

import { AppError } from '../errors/AppError.js';
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError.js';
import * as noticesService from '../services/noticesService.js';

// GET /api/v1/notices?page=1&limit=2&search=examen
export function list(req: Request, res: Response, next: NextFunction): void {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 2);
    // page y limit: enteros mayores que cero
    if (!Number.isInteger(page) || page < 1) {
      throw new AppError(400, 'Invalid query param: page', 'BAD_REQUEST');
    }
    if (!Number.isInteger(limit) || limit < 1) {
      throw new AppError(400, 'Invalid query param: limit', 'BAD_REQUEST');
    }
    // search vacío o ausente: sin filtro
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    res.json(noticesService.list(page, limit, search));
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/notices/:noticeId
export function getById(req: Request, res: Response, next: NextFunction): void {
  try {
    const noticeId = String(req.params.noticeId);
    const notice = noticesService.getById(noticeId);
    if (!notice) {
      throw new ResourceNotFoundError(404, `Notice with id '${noticeId}' not found`, 'NOT_FOUND', noticeId);
    }
    res.json({ data: notice });
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/notices
export function create(req: Request, res: Response, next: NextFunction): void {
  try {
    const { title, description } = req.body ?? {};
    if (typeof title !== 'string' || title.trim().length === 0) {
      throw new AppError(400, 'Missing required field: title', 'BAD_REQUEST');
    }
    if (description !== undefined && typeof description !== 'string') {
      throw new AppError(400, 'Invalid field: description', 'BAD_REQUEST');
    }
    // id y createdAt los genera el servicio
    const notice = noticesService.create(
      title.trim(),
      typeof description === 'string' ? description.trim() : '',
    );
    res.status(201).json({ data: notice });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/v1/notices/:noticeId
export function update(req: Request, res: Response, next: NextFunction): void {
  try {
    const noticeId = String(req.params.noticeId);
    const { title, description } = req.body ?? {};
    // se valida todo antes de modificar nada
    if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
      throw new AppError(400, 'Invalid field: title', 'BAD_REQUEST');
    }
    if (description !== undefined && typeof description !== 'string') {
      throw new AppError(400, 'Invalid field: description', 'BAD_REQUEST');
    }
    // solo title y description; los omitidos se conservan
    const notice = noticesService.update(noticeId, {
      title: typeof title === 'string' ? title.trim() : undefined,
      description: typeof description === 'string' ? description.trim() : undefined,
    });
    if (!notice) {
      throw new ResourceNotFoundError(404, `Notice with id '${noticeId}' not found`, 'NOT_FOUND', noticeId);
    }
    res.json({ data: notice });
  } catch (err) {
    next(err);
  }
}
