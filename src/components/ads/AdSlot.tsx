import { cn } from "@/lib/utils";

type AdSlotProps = {
  slot: 1 | 2 | 3;
  className?: string;
};

export function AdSlot({ slot, className }: AdSlotProps) {
  return (
    <aside
      aria-label={`Espaço publicitário ${slot}`}
      className={cn(
        "flex items-center justify-center rounded border border-dashed border-border bg-border/20 text-center text-xs text-muted",
        slot === 1 && "mx-auto mb-6 h-20 w-full max-w-4xl",
        slot === 2 && "hidden min-h-[250px] w-full lg:block lg:min-h-[600px]",
        slot === 3 &&
          "fixed bottom-0 left-0 right-0 z-30 mx-auto mb-16 h-14 max-w-lg lg:hidden",
        className,
      )}
      data-ad-slot={slot}
    >
      Publicidade
    </aside>
  );
}
