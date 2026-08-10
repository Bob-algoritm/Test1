import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { getAdminPwd, adminMutate } from "@/lib/adminClient";

export const useSiteContent = () =>
  useQuery({
    queryKey: ["siteContent"],
    queryFn: async () => {
      const list = await base44.entities.SiteContent.list("-updated_date", 1);
      return list[0] || null;
    },
  });

export const useSaveSiteContent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const list = await base44.entities.SiteContent.list("-updated_date", 1);
      if (list[0]) {
        return adminMutate({
          password: getAdminPwd(),
          entity: "SiteContent",
          operation: "update",
          id: list[0].id,
          data,
        });
      }
      return adminMutate({
        password: getAdminPwd(),
        entity: "SiteContent",
        operation: "create",
        data,
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["siteContent"] }),
  });
};