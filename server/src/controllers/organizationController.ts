import { Request, Response } from 'express';
import { organizationService } from '../services/organizationService';
import { CreateOrganizationSchema, UpdateOrganizationSchema } from '../models/organizationModel';
import logger from '../logger';

export const organizationController = {
  async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const organizations = await organizationService.getAllOrganizations();
      res.json(organizations);
    } catch (error) {
      logger.error('Failed to fetch organizations', { error: (error as Error).message });
      res.status(500).json({ error: 'Failed to fetch organizations' });
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const organization = await organizationService.getOrganizationById(id);
      res.json(organization);
    } catch (error) {
      if (error instanceof Error && error.message === 'Organization not found') {
        logger.warn('Organization not found', { id: req.params.id });
        res.status(404).json({ error: 'Organization not found' });
      } else {
        logger.error('Failed to fetch organization', { id: req.params.id, error: (error as Error).message });
        res.status(500).json({ error: 'Failed to fetch organization' });
      }
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = CreateOrganizationSchema.parse(req.body);
      const organization = await organizationService.createOrganization(validatedData);
      logger.info('Organization created', { id: organization.id });
      res.status(201).json(organization);
    } catch (error) {
      if ((error as Error).name === 'ZodError') {
        logger.warn('Invalid organization data', { error: (error as Error).message });
        res.status(400).json({ error: 'Invalid input data' });
      } else {
        logger.error('Failed to create organization', { error: (error as Error).message });
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = UpdateOrganizationSchema.parse(req.body);
      const organization = await organizationService.updateOrganization(id, validatedData);
      logger.info('Organization updated', { id });
      res.json(organization);
    } catch (error) {
      if (error instanceof Error && error.message === 'Organization not found') {
        logger.warn('Organization not found', { id: req.params.id });
        res.status(404).json({ error: 'Organization not found' });
      } else {
        logger.warn('Invalid organization data', { id: req.params.id, error: (error as Error).message });
        res.status(400).json({ error: 'Invalid input data' });
      }
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await organizationService.deleteOrganization(id);
      logger.info('Organization deleted', { id });
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === 'Organization not found') {
        logger.warn('Organization not found', { id: req.params.id });
        res.status(404).json({ error: 'Organization not found' });
      } else {
        logger.error('Failed to delete organization', { id: req.params.id, error: (error as Error).message });
        res.status(500).json({ error: 'Failed to delete organization' });
      }
    }
  },

  async getStats(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await organizationService.getOrganizationStats();
      res.json(stats);
    } catch (error) {
      logger.error('Failed to fetch organization stats', { error: (error as Error).message });
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  },
};
