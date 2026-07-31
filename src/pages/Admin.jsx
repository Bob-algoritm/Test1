import React from "react";
import { useAuth } from "@/lib/AuthContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Shield } from "lucide-react";
import ProjectsManager from "@/components/admin/ProjectsManager";
import BuildingsManager from "@/components/admin/BuildingsManager";
import FloorsManager from "@/components/admin/FloorsManager";
import UnitsManager from "@/components/admin/UnitsManager";
import UsersManager from "@/components/admin/UsersManager";

export default function Admin() {
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return (
      <div className="p-8 md:p-12 max-w-md mx-auto text-center">
        <div className="w-12 h-12 rounded-xl bg-destructive/15 flex items-center justify-center mx-auto mb-4">
          <Shield className="w-6 h-6 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold">Admin access required</h2>
        <p className="text-muted-foreground text-sm mt-2">
          You need an administrator account to access the admin panel.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Admin Panel</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage your portfolio and control who has access.
        </p>
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="flex flex-wrap h-auto bg-sidebar/40 p-1 mb-6 gap-1">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="buildings">Buildings</TabsTrigger>
          <TabsTrigger value="floors">Floors</TabsTrigger>
          <TabsTrigger value="units">Units</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="projects"><ProjectsManager /></TabsContent>
        <TabsContent value="buildings"><BuildingsManager /></TabsContent>
        <TabsContent value="floors"><FloorsManager /></TabsContent>
        <TabsContent value="units"><UnitsManager /></TabsContent>
        <TabsContent value="users"><UsersManager /></TabsContent>
      </Tabs>
    </div>
  );
}