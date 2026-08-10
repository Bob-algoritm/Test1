import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Shield, ArrowLeft, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";
import { setAdminPwd, clearAdminPwd, getAdminPwd } from "@/lib/adminClient";
import HomePageEditor from "@/components/admin/HomePageEditor";
import MatrixManager from "@/components/admin/MatrixManager";
import ProjectsManager from "@/components/admin/ProjectsManager";

export default function Admin() {
  const [unlocked, setUnlocked] = useState(() => !!getAdminPwd());
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      const res = await base44.functions.invoke("adminMutate", {
        password: pwd,
        operation: "verify",
      });
      if (res?.data?.ok) {
        setAdminPwd(pwd);
        setUnlocked(true);
      } else {
        setErr(res?.data?.error || "Неверный пароль");
      }
    } catch (error) {
      setErr("Неверный пароль");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    clearAdminPwd();
    setUnlocked(false);
    setPwd("");
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border border-border bg-card shadow-sm p-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-5">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-semibold text-center">Вход в панель управления</h1>
            <p className="text-sm text-muted-foreground text-center mt-1.5">
              Введите пароль администратора
            </p>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <Input
                type="password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                placeholder="Пароль"
                autoFocus
                className="h-11"
              />
              {err && <p className="text-sm text-destructive text-center">{err}</p>}
              <Button type="submit" className="w-full h-11 gap-2" disabled={loading || !pwd}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                Войти
              </Button>
            </form>
          </div>
          <div className="text-center mt-4">
            <Button asChild variant="ghost" size="sm" className="gap-1.5">
              <Link to="/"><ArrowLeft className="w-4 h-4" /> На сайт</Link>
            </Button>
          </div>
        </div>
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
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={logout}>
              <Lock className="w-4 h-4" /> Выйти
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link to="/"><ArrowLeft className="w-4 h-4" /> На сайт</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        <Tabs defaultValue="home" className="w-full">
          <TabsList className="flex flex-wrap h-auto bg-sidebar/40 p-1 mb-6 gap-1">
            <TabsTrigger value="home">Главная страница</TabsTrigger>
            <TabsTrigger value="matrix">Шахматка</TabsTrigger>
            <TabsTrigger value="projects">Проекты</TabsTrigger>
          </TabsList>

          <TabsContent value="home"><HomePageEditor /></TabsContent>
          <TabsContent value="matrix"><MatrixManager /></TabsContent>
          <TabsContent value="projects"><ProjectsManager /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}