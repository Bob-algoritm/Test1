import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BuildingsManager from "@/components/admin/BuildingsManager";
import FloorsManager from "@/components/admin/FloorsManager";
import EntrancesManager from "@/components/admin/EntrancesManager";
import UnitsManager from "@/components/admin/UnitsManager";

export default function MatrixManager() {
  const [tab, setTab] = useState("buildings");
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Шахматка</h2>
        <p className="text-sm text-muted-foreground">Данные матрицы: здания, подъезды, этажи и квартиры.</p>
      </div>
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="flex flex-wrap h-auto bg-sidebar/40 p-1 mb-6 gap-1">
          <TabsTrigger value="buildings">Здания</TabsTrigger>
          <TabsTrigger value="entrances">Подъезды</TabsTrigger>
          <TabsTrigger value="floors">Этажи</TabsTrigger>
          <TabsTrigger value="units">Квартиры</TabsTrigger>
        </TabsList>
        <TabsContent value="buildings"><BuildingsManager /></TabsContent>
        <TabsContent value="entrances"><EntrancesManager /></TabsContent>
        <TabsContent value="floors"><FloorsManager /></TabsContent>
        <TabsContent value="units"><UnitsManager /></TabsContent>
      </Tabs>
    </div>
  );
}