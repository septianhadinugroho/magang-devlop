"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function GrabMartItem() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between gap-2  border-b pb-4">
          <h1 className="text-3xl font-bold text-center md:text-left">
            GrabMart Items
          </h1>
        </div>
      </CardHeader>
      <CardContent>
        <p>This is a dummy page for GrabMart Items.</p>
      </CardContent>
    </Card>
  );
}