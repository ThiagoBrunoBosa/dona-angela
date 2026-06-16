"use client";

import { useState, useCallback } from "react";
import { Flame } from "lucide-react";
import { Button } from "@/components/ui/form";

export function KitchenMode() {
  const [active, setActive] = useState(false);
  const [supported, setSupported] = useState(true);

  const toggle = useCallback(async () => {
    if (!("wakeLock" in navigator)) {
      setSupported(false);
      return;
    }

    try {
      if (active) {
        setActive(false);
      } else {
        await navigator.wakeLock.request("screen");
        setActive(true);
      }
    } catch {
      setSupported(false);
      setActive(false);
    }
  }, [active]);

  if (!supported && !active) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 z-40 lg:bottom-6">
      <Button
        type="button"
        onClick={toggle}
        aria-label={active ? "Desativar modo cozinha" : "Ativar modo cozinha"}
        className="shadow-lg"
      >
        {active ? (
          <Flame className="mr-2 h-4 w-4 fill-primary" />
        ) : (
          <Flame className="mr-2 h-4 w-4" />
        )}
        Modo Cozinha
      </Button>
    </div>
  );
}
