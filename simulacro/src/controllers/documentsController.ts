import type { NextFunction, Request, Response } from 'express';

import { AppError } from '../errors/AppError.js';
import * as documentsService from '../services/documentsService.js';
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError.js';

// GET /api/v1/admin/documents?page=1&limit=20
export function list(req: Request, res: Response, next: NextFunction): void {
    try {
        // req.query always arrives as text: the controller converts it.
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 20);
        res.json(documentsService.list(page, limit));
    } catch (err) {
        next(err);
    }
}

// GET /api/v1/admin/documents/:documentId
export function getById(req: Request, res: Response, next: NextFunction): void {
  try {
    const document = documentsService.getById(String(req.params.documentId));
    // if (!document) {
    //   throw new AppError(404, `Article with id '${req.params.documentId}' not found`, 'NOT_FOUND');
    // }
    if (!document){
      throw new ResourceNotFoundError(404, `Document with id '${String(req.params.documentId)}' not found`, "404", String(req.params.documentId) )
    }
    res.json({ data: document });
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/admin/documents
export function create(req: Request, res: Response, next: NextFunction): void {
  try {
    const { title, description } = req.body;
    if (!title || typeof title !== 'string') {
      throw new AppError(400, 'Missing required field: title', 'BAD_REQUEST');
    }
    const document = documentsService.create(
      title.trim(),
      typeof description === 'string' ? description.trim() : '',
    );
    res.status(201).json({ data: document });
  } catch (err) {
    next(err);
  }
}

// PATCH
export function update(req: Request, res: Response, next: NextFunction): void {
  try {
    const { title, description } = req.body;
    const document = documentsService.update(String(req.params.documentId), { title, description });
    if (!document) {
      throw new AppError(404, `Document with id '${req.params.documentId}' not found`, 'NOT_FOUND');
    }

    if(typeof title !== 'string'){
      throw new AppError(400, `El titulo contiene un valor que no es una cadena `, 'BAD_REQUEST')
    }

    if(title.trim().length == 0){
      throw new AppError(400, `Carcater de espacio detectado`, 'BAD_REQUEST')
    }

    res.json({ data: document });
  } catch (err) {
    next(err);
  }
}