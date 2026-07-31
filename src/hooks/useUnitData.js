import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export const useProjects = () =>
  useQuery({ queryKey: ["projects"], queryFn: () => base44.entities.Project.list("-created_date") });

export const useBuildings = () =>
  useQuery({ queryKey: ["buildings"], queryFn: () => base44.entities.Building.list("-created_date") });

export const useFloors = () =>
  useQuery({ queryKey: ["floors"], queryFn: () => base44.entities.Floor.list("-created_date") });

export const useUnits = () =>
  useQuery({ queryKey: ["units"], queryFn: () => base44.entities.Unit.list("-created_date") });

export const useUsers = () =>
  useQuery({ queryKey: ["users"], queryFn: () => base44.entities.User.list() });

export function useCrud(entityName, queryKey) {
  const qc = useQueryClient();
  const create = useMutation({
    mutationFn: (data) => base44.entities[entityName].create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });
  const update = useMutation({
    mutationFn: ({ id, data }) => base44.entities[entityName].update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });
  const remove = useMutation({
    mutationFn: (id) => base44.entities[entityName].delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });
  return { create, update, remove };
}