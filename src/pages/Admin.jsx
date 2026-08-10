import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import HomePageEditor from "@/components/admin/HomePageEditor";
import MatrixManager from "@/components/admin/MatrixManager";
import ProjectsManager from "@/components/admin/ProjectsManager";
import UsersManager from "@/components/admin/UsersManager";

export default function Admin() {
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return (
      <div className="p-8 md:p-12 max-w-md mx-auto text-center">
        <div className="w-12 h-12 rounded-xl bg-destructive/15 flex items-center justify-center mx-auto mb-4">
          <Shield className="w-6 h-6 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold">Нужны права администратора</h2>
        <p className="text-muted-foreground text-sm mt-2">
          Войдите как администратор, чтобы открыть панель управления.
        </p>
        <Button asChild variant="outline" className="mt-4 gap-2">
          <Link to="/login"><ArrowLeft className="w-4 h-4" /> Войти</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="leading-none">
              <div className="font-semibold tracking-tight">Панель управления</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Yangi Hayot</div>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link to="/"><ArrowLeft className="w-4 h-4" /> На сайт</Link>
          </Button>
        </div>
      </header>

      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        <Tabs defaultValue="home" className="w-full">
          <TabsList className="flex flex-wrap h-auto bg-sidebar/40 p-1 mb-6 gap-1">
            <TabsTrigger value="home">Главная страница</TabsTrigger>
            <TabsTrigger value="matrix">Шахматка</TabsTrigger>
            <TabsTrigger value="projects">Проекты</TabsTrigger>
            <TabsTrigger value="users">Пользователи</TabsTrigger>
          </TabsList>

          <TabsContent value="home"><HomePageEditor /></TabsContent>
          <TabsContent value="matrix"><MatrixManager /></TabsContent>
          <TabsContent value="projects"><ProjectsManager /></TabsContent>
          <TabsContent value="users"><UsersManager /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}