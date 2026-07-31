import React from "react";
import { useUsers } from "@/hooks/useUnitData";
import { useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { Loader2, ShieldCheck, UserCog } from "lucide-react";

export default function UsersManager() {
  const { data: users = [], isLoading } = useUsers();
  const qc = useQueryClient();

  const toggleEdit = async (u, value) => {
    await base44.entities.User.update(u.id, { can_edit_units: value });
    qc.invalidateQueries({ queryKey: ["users"] });
  };

  const changeRole = async (u, role) => {
    await base44.entities.User.update(u.id, { role });
    qc.invalidateQueries({ queryKey: ["users"] });
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Users &amp; Permissions</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Grant editors permission to change unit status (Available / Reserved / Occupied). Admins have full access.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 mb-4 flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
          <UserCog className="w-4 h-4 text-primary" />
        </div>
        <div className="text-sm text-muted-foreground">
          <div className="font-medium text-foreground">Roles</div>
          Admin — full CMS access. Editor — can change unit status only. Viewer — read-only browsing.
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      ) : users.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
          No registered users yet. Invite users from the platform to grant access.
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-sidebar/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-4 py-3">User</th>
                <th className="text-left font-medium px-4 py-3">Email</th>
                <th className="text-left font-medium px-4 py-3">Role</th>
                <th className="text-left font-medium px-4 py-3">Edit unit status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => {
                const isAdmin = u.role === "admin";
                return (
                  <tr key={u.id} className="hover:bg-sidebar/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                          {(u.full_name || u.email || "U").charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{u.full_name || "—"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                    <td className="px-4 py-3">
                      {isAdmin ? (
                        <Badge className="gap-1.5"><ShieldCheck className="w-3 h-3" /> Admin</Badge>
                      ) : (
                        <Select value={u.role || "user"} onValueChange={(v) => changeRole(u, v)}>
                          <SelectTrigger className="w-[110px] h-8"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isAdmin ? (
                        <span className="text-xs text-muted-foreground italic">Full access</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Switch checked={!!u.can_edit_units} onCheckedChange={(v) => toggleEdit(u, v)} />
                          <span className={u.can_edit_units ? "text-xs text-emerald-400 font-medium" : "text-xs text-muted-foreground"}>
                            {u.can_edit_units ? "Editor" : "Viewer"}
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}