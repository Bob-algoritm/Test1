import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { getAdminPwd, adminMutate } from "@/lib/adminClient";

export const useProjects = () =>
  useQuery({ queryKey: ["projects"], queryFn: () => base44.entities.Project.list("-created_date") });

export const useBuildings = () =>
  useQuery({ queryKey: ["buildings"], queryFn: () => base44.entities.Building.list("-created_date") });

export const useEntrances = () =>
  useQuery({ queryKey: ["entrances"], queryFn: () => base44.entities.Entrance.list("-created_date") });

export const useFloors = () =>
  useQuery({ queryKey: ["floors"], queryFn: () => base44.entities.Floor.list("-created_date") });

export const useUnits = () =>
  useQuery({ queryKey: ["units"], queryFn: () => base44.entities.Unit.list("-created_date") });

export const useUsers = () =>
  useQuery({ queryKey: ["users"], queryFn: () => base44.entities.User.list() });

// Create/update/delete are routed through the password-protected backend
// function (adminMutate), which runs with the service role so entity RLS
// (admin-only writes) stays enforced for everyone else.
export function useCrud(entityName, queryKey) {
  const qc = useQueryClient();
  const pwd = () => getAdminPwd();

  const create = useMutation({
    mutationFn: (data) =>
      adminMutate({ password: pwd(), entity: entityName, operation: "create", data }),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });
  const update = useMutation({
    mutationFn: ({ id, data }) =>
      adminMutate({ password: pwd(), entity: entityName, operation: "update", id, data }),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });
  const remove = useMutation({
    mutationFn: (id) =>
      adminMutate({ password: pwd(), entity: entityName, operation: "delete", id }),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });
  return { create, update, remove };
}