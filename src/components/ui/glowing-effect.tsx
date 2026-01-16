"use client";

import { memo, useCallback, useEffect, useRef } from "react";
import { animate } from "motion";
import { cn } from "../../lib/utils";

interface GlowingEffectProps {
    blur?: number;
    inactiveZone?: number;
    proximity?: number;
    spread?: number;
    variant?: "default" | "white";
    glow?: boolean;
    className?: string;
    disabled?: boolean;
    movementDuration?: number;
    borderWidth?: number;
}

const GlowingEffect = memo(function GlowingEffect({
    blur = 0,
    inactiveZone = 0.7,
    proximity = 0,
    spread = 20,
    variant = "default",
    glow = false,
    className,
    movementDuration = 2,
    borderWidth = 1,
    disabled = true,
}: GlowingEffectProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const lastPosition = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef<number>(0);

    const handleMove = useCallback(
        (e?: MouseEvent | { x: number; y: number }) => {
            if (!containerRef.current) return;

            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }

            animationFrameRef.current = requestAnimationFrame(() => {
                const element = containerRef.current;
                if (!element) return;

                const { left, top, width, height } = element.getBoundingClientRect();
                const mouseX = e?.x ?? lastPosition.current.x;
                const mouseY = e?.y ?? lastPosition.current.y;

                if (e) {
                    lastPosition.current = { x: mouseX, y: mouseY };
                }

                const center = [left + width * 0.5, top + height * 0.5];
                const distanceFromCenter = Math.hypot(
                    mouseX - center[0],
                    mouseY - center[1]
                );
                const inactiveRadius = 0.5 * Math.min(width, height) * inactiveZone;
                const isInInactiveZone = distanceFromCenter < inactiveRadius;
                const isInProximity =
                    mouseX > left - proximity &&
                    mouseX < left + width + proximity &&
                    mouseY > top - proximity &&
                    mouseY < top + height + proximity;

                if (!isInProximity || isInInactiveZone) {
                    element.style.setProperty("--active", "0");
                    return;
                }

                const relativeX = mouseX - left;
                const relativeY = mouseY - top;

                element.style.setProperty("--active", "1");
                element.style.setProperty("--x", `${relativeX}px`);
                element.style.setProperty("--y", `${relativeY}px`);
            });
        },
        [inactiveZone, proximity]
    );

    useEffect(() => {
        if (disabled) return;

        const handleScroll = () => handleMove();
        const handlePointerMove = (e: PointerEvent) => handleMove(e);

        window.addEventListener("scroll", handleScroll, { passive: true });
        document.body.addEventListener("pointermove", handlePointerMove, {
            passive: true,
        });

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            window.removeEventListener("scroll", handleScroll);
            document.body.removeEventListener("pointermove", handlePointerMove);
        };
    }, [handleMove, disabled]);

    useEffect(() => {
        if (!glow || disabled) return;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) {
            containerRef.current?.style.setProperty("--glow", "0");
            return;
        }

        const updateGlow = () => {
            const element = containerRef.current;
            if (!element) return;

            const active = getComputedStyle(element).getPropertyValue("--active");

            if (active === "1") {
                animate(
                    element,
                    { "--glow": [0, 1] },
                    { duration: movementDuration, ease: "linear" }
                );
            } else {
                animate(
                    element,
                    { "--glow": 0 },
                    { duration: movementDuration / 2, ease: "linear" }
                );
            }
        };

        const interval = setInterval(updateGlow, 100);
        return () => clearInterval(interval);
    }, [glow, disabled, movementDuration]);

    return (
        <div
            className={cn(
                "pointer-events-none absolute inset-0 rounded-[inherit]",
                className
            )}
        >
            <div
                ref={containerRef}
                style={
                    {
                        "--blur": `${blur}px`,
                        "--spread": spread,
                        "--start": "0",
                        "--active": "0",
                        "--glow": "0",
                        "--repeating-conic-gradient-times": 5,
                        "--gradient":
                            variant === "white"
                                ? `repeating-conic-gradient(
                    from 236.84deg at 50% 50%,
                    #ffffff 0%,
                    #f0f0f0 calc(25% / 5),
                    #e0e0e0 calc(50% / 5),
                    #ffffff calc(100% / 5)
                  )`
                                : `radial-gradient(circle, #d79f1e 10%, #d79f1e00 20%),
                   radial-gradient(circle at 40% 40%, #fbbf24 5%, #fbbf2400 15%),
                   radial-gradient(circle at 60% 60%, #b45309 10%, #b4530900 20%), 
                   repeating-conic-gradient(
                     from 236.84deg at 50% 50%,
                     #d79f1e 0%,
                     #fbbf24 calc(25% / var(--repeating-conic-gradient-times)),
                     #b45309 calc(50% / var(--repeating-conic-gradient-times)), 
                     #d79f1e calc(100% / var(--repeating-conic-gradient-times))
                   )`,
                        "--border-width": `${borderWidth}px`,
                    } as React.CSSProperties
                }
                className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[var(--active)] transition-opacity duration-300"
            >
                <div
                    className="absolute inset-0 rounded-[inherit]"
                    style={{
                        background: `var(--gradient)`,
                        backgroundAttachment: "fixed",
                        backgroundPosition: "var(--x) var(--y)",
                        backgroundSize: `calc(100% + (var(--spread) * 2px)) calc(100% + (var(--spread) * 2px))`,
                        filter: "blur(var(--blur))",
                        maskImage: `
              linear-gradient(black, black) content-box,
              linear-gradient(black, black)
            `,
                        maskComposite: "exclude",
                        WebkitMaskComposite: "xor",
                        padding: "var(--border-width)",
                        transform: `scale(calc(1 + (var(--glow) * 0.05)))`,
                    }}
                />
                <div
                    className="absolute inset-0 rounded-[inherit]"
                    style={{
                        background: `var(--gradient)`,
                        backgroundAttachment: "fixed",
                        backgroundPosition: "var(--x) var(--y)",
                        backgroundSize: `calc(100% + (var(--spread) * 2px)) calc(100% + (var(--spread) * 2px))`,
                        filter: `blur(calc(var(--blur) + 10px + (var(--glow) * 20px)))`,
                        opacity: `calc(0.4 + (var(--glow) * 0.6))`,
                        maskImage: `
              linear-gradient(black, black) content-box,
              linear-gradient(black, black)
            `,
                        maskComposite: "exclude",
                        WebkitMaskComposite: "xor",
                        padding: "var(--border-width)",
                    }}
                />
            </div>
        </div>
    );
});

export { GlowingEffect };
