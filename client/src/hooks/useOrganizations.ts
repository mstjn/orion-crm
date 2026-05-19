import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { organizationService } from '../services/organizationService';
import type { CreateOrganizationInput, UpdateOrganizationInput } from '../types/organization';
import logger from '../logger';

export const useOrganizations = () => {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: organizationService.getAll,
  });
};

export const useOrganization = (id: string) => {
  return useQuery({
    queryKey: ['organizations', id],
    queryFn: () => organizationService.getById(id),
    enabled: !!id,
  });
};

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateOrganizationInput) => organizationService.create(input),
    onSuccess: (organization) => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      logger.info('Organization created', { id: organization.id });
    },
    onError: (error: Error) => {
      logger.error('Failed to create organization', { error: error.message });
    },
  });
};

export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateOrganizationInput }) =>
      organizationService.update(id, input),
    onSuccess: (organization) => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      logger.info('Organization updated', { id: organization.id });
    },
    onError: (error: Error) => {
      logger.error('Failed to update organization', { error: error.message });
    },
  });
};

export const useDeleteOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => organizationService.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      logger.info('Organization deleted', { id });
    },
    onError: (error: Error) => {
      logger.error('Failed to delete organization', { error: error.message });
    },
  });
};

export const useOrganizationStats = () => {
  return useQuery({
    queryKey: ['organizations', 'stats'],
    queryFn: organizationService.getStats,
  });
};
