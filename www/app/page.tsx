"use client"
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const [theme, setTheme] = useState<any>({
    "background": "224 71.4% 4.1%",
    "foreground": "210 20% 98%",
    "card": "224 71.4% 4.1%",
    "card-foreground": "210 20% 98%",
    "popover": "224 71.4% 4.1%",
    "popover-foreground": "210 20% 98%",
    "primary": "210 20% 98%",
    "primary-foreground": "220.9 39.3% 11%",
    "secondary": "215 27.9% 16.9%",
    "secondary-foreground": "210 20% 98%",
    "muted": "215 27.9% 16.9%",
    "muted-foreground": "217.9 10.6% 64.9%",
    "accent": "215 27.9% 16.9%",
    "accent-foreground": "210 20% 98%",
    "destructive": "0 62.8% 30.6%",
    "destructive-foreground": "210 20% 98%",
    "border": "215 27.9% 16.9%",
    "input": "215 27.9% 16.9%",
    "ring": "216 12.2% 83.9%"
  });

  useEffect(() => {
    for (const key in theme) {
      document.documentElement.style.setProperty(`--${key}`, theme[key]);
    }
  }, [theme]);

  // Gray/Default Theme:
  const switchDefaultTheme = () => {
    setTheme({
      "background": "224 71.4% 4.1%",
      "foreground": "210 20% 98%",
      "card": "224 71.4% 4.1%",
      "card-foreground": "210 20% 98%",
      "popover": "224 71.4% 4.1%",
      "popover-foreground": "210 20% 98%",
      "primary": "210 20% 98%",
      "primary-foreground": "220.9 39.3% 11%",
      "secondary": "215 27.9% 16.9%",
      "secondary-foreground": "210 20% 98%",
      "muted": "215 27.9% 16.9%",
      "muted-foreground": "217.9 10.6% 64.9%",
      "accent": "215 27.9% 16.9%",
      "accent-foreground": "210 20% 98%",
      "destructive": "0 62.8% 30.6%",
      "destructive-foreground": "210 20% 98%",
      "border": "215 27.9% 16.9%",
      "input": "215 27.9% 16.9%",
      "ring": "216 12.2% 83.9%"
    });
  };

  return (
    <div className="w-full lg:w-[1200px] mx-auto p-5 space-y-5">
      <h1 className="flex-center bg-primary-foreground h-16 w-full border text-foreground rounded-md">Theme!</h1>
      <div className="flex items-center justify-start w-full h-auto py-3 space-x-3">
        <Button onClick={switchDefaultTheme}>Default(Gray)</Button>
        <Button>Slate</Button>
      </div>

      <div className="grid grid-cols-3">
        {theme && Object.entries(theme).map(([key, value]: [any, any]) => (
          <p key={key} className={`flex-center bg-${key} text-[#00ff44] h-32 w-full border`}><strong>{key}</strong></p>
        ))}
      </div>

    </div>
  );
}
