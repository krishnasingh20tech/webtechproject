"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";

// --- Types ---
export type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip";

interface FlipCardProps {
    src: string;
    index: number;
    total: number;
    phase: AnimationPhase;
    target: { x: number; y: number; rotation: number; scale: number; opacity: number };
}

// --- FlipCard Component ---
const IMG_WIDTH = 60;
const IMG_HEIGHT = 85;

function FlipCard({
    src,
    index,
    total,
    phase,
    target,
}: FlipCardProps) {
    return (
        <motion.div
            animate={{
                x: target.x,
                y: target.y,
                rotate: target.rotation,
                scale: target.scale,
                opacity: target.opacity,
            }}
            transition={{
                type: "spring",
                stiffness: 40,
                damping: 15,
            }}
            style={{
                position: "absolute",
                width: IMG_WIDTH,
                height: IMG_HEIGHT,
                transformStyle: "preserve-3d",
                perspective: "1000px",
            }}
            className="cursor-pointer group"
        >
            <motion.div
                className="relative h-full w-full"
                style={{ transformStyle: "preserve-3d" }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                whileHover={{ rotateY: 180 }}
            >
                {/* Front Face */}
                <div
                    className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-lg bg-card"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    <img
                        src={src}
                        alt={`hero-${index}`}
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
                </div>

                {/* Back Face */}
                <div
                    className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-lg bg-muted flex flex-col items-center justify-center p-4 border border-border"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                    <div className="text-center">
                        <p className="text-[8px] font-bold text-primary uppercase tracking-widest mb-1">View</p>
                        <p className="text-xs font-medium text-foreground">Details</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

// --- Main Hero Component ---
const TOTAL_IMAGES = 20;

// Unsplash Images
const IMAGES = [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80",
    "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=300&q=80",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&q=80",
    "https://images.unsplash.com/photo-1506744038136-028b60a970df?w=300&q=80",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&q=80",
    "https://images.unsplash.com/photo-1506765515384-028b60a970df?w=300&q=80",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=80",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=300&q=80",
    "https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?w=300&q=80",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&q=80",
    "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=300&q=80",
    "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=300&q=80",
    "https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?w=300&q=80",
    "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=300&q=80",
    "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=300&q=80",
    "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=300&q=80",
    "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=300&q=80",
    "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=300&q=80",
];

// Helper for linear interpolation
const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

export default function ScrollMorphHero() {
    const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
    const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
    const [scrollProgress, setScrollProgress] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // --- Container Size ---
    useEffect(() => {
        if (!containerRef.current) return;

        const updateSize = () => {
            setContainerSize({
                width: containerRef.current?.offsetWidth || 800,
                height: containerRef.current?.offsetHeight || 600,
            });
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    // --- Scroll Logic ---
    const [isSectionVisible, setIsSectionVisible] = useState(false);

    // Check if section is visible in viewport
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const checkVisibility = () => {
            const rect = container.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Section is visible when it's in the viewport (simpler logic)
            const isVisible = rect.top < windowHeight && rect.bottom > 0;
            setIsSectionVisible(isVisible);
            
            // Debug logging (remove in production)
            console.log('Section visibility:', {
                top: rect.top,
                bottom: rect.bottom,
                windowHeight,
                isVisible
            });
        };

        checkVisibility();
        window.addEventListener('scroll', checkVisibility);
        window.addEventListener('resize', checkVisibility);

        return () => {
            window.removeEventListener('scroll', checkVisibility);
            window.removeEventListener('resize', checkVisibility);
        };
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let isScrolling = false;
        let scrollTimeout: NodeJS.Timeout;

        const handleWheel = (e: WheelEvent) => {
            // Only handle scroll if section is visible
            if (!isSectionVisible) return;

            console.log('Scroll event detected, isSectionVisible:', isSectionVisible);

            // Add visual feedback class during scroll
            if (!isScrolling) {
                container.classList.add('scrolling');
                isScrolling = true;
            }

            // Clear existing timeout
            clearTimeout(scrollTimeout);
            
            // Set timeout to remove scrolling class
            scrollTimeout = setTimeout(() => {
                container.classList.remove('scrolling');
                isScrolling = false;
            }, 150);

            // Allow normal scrolling when animation is at boundaries
            if (scrollProgress >= 1 && e.deltaY > 0) {
                console.log('Animation complete, allowing normal scroll down');
                container.classList.add('scroll-complete');
                setTimeout(() => container.classList.remove('scroll-complete'), 300);
                return; // Don't prevent default, let normal scroll happen
            }
            
            if (scrollProgress <= 0 && e.deltaY < 0) {
                console.log('Animation at start, allowing normal scroll up');
                container.classList.add('scroll-start');
                setTimeout(() => container.classList.remove('scroll-start'), 300);
                return; // Don't prevent default, let normal scroll happen
            }

            // Only capture scroll for animation when within bounds and section is visible
            if (scrollProgress >= 0 && scrollProgress <= 1) {
                console.log('Handling animation scroll, current progress:', scrollProgress);
                e.preventDefault();
                
                // Enhanced scroll sensitivity based on velocity
                const scrollVelocity = Math.abs(e.deltaY);
                const sensitivity = scrollVelocity > 50 ? 0.015 : 0.01; // More responsive for fast scrolling
                
                const currentScroll = scrollProgress;
                const newScroll = Math.min(Math.max(currentScroll + e.deltaY * sensitivity, 0), 1);
                setScrollProgress(newScroll);

                // Add momentum effect
                if (newScroll >= 0.99 && scrollProgress < 0.99) {
                    container.classList.add('animation-complete');
                    setTimeout(() => container.classList.remove('animation-complete'), 500);
                } else if (newScroll <= 0.01 && scrollProgress > 0.01) {
                    container.classList.add('animation-reset');
                    setTimeout(() => container.classList.remove('animation-reset'), 500);
                }
            }
        };

        container.addEventListener("wheel", handleWheel, { passive: false });
        return () => {
            container.removeEventListener("wheel", handleWheel);
            clearTimeout(scrollTimeout);
        };
    }, [scrollProgress, isSectionVisible]);

    // --- Mouse Parallax ---
    const [mouseX, setMouseX] = useState(0);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const relativeX = e.clientX - rect.left;
            const normalizedX = (relativeX / rect.width) * 2 - 1;
            setMouseX(normalizedX * 50);
        };
        container.addEventListener("mousemove", handleMouseMove);
        return () => container.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // --- Intro Sequence ---
    useEffect(() => {
        const timer1 = setTimeout(() => setIntroPhase("line"), 500);
        const timer2 = setTimeout(() => setIntroPhase("circle"), 2500);
        return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }, []);

    // --- Random Scatter Positions ---
    const scatterPositions = useMemo(() => {
        return IMAGES.map(() => ({
            x: (Math.random() - 0.5) * 1500,
            y: (Math.random() - 0.5) * 1000,
            rotation: (Math.random() - 0.5) * 180,
            scale: 0.6,
            opacity: 1, // Changed from 0 to 1 to ensure visibility
        }));
    }, []);

    return (
        <div ref={containerRef} className="relative w-full h-full bg-background overflow-hidden">
            <style>{`
                .scrolling {
                    cursor: grabbing !important;
                }
                .scrolling img {
                    transition: transform 0.3s ease !important;
                }
                .scroll-complete {
                    animation: pulseGlow 0.3s ease;
                }
                .scroll-start {
                    animation: pulseGlow 0.3s ease;
                }
                .animation-complete {
                    animation: celebrationPulse 0.5s ease;
                }
                .animation-reset {
                    animation: resetPulse 0.5s ease;
                }
                @keyframes pulseGlow {
                    0% { box-shadow: 0 0 0 0 rgba(255, 158, 122, 0.4); }
                    50% { box-shadow: 0 0 20px 10px rgba(255, 158, 122, 0.2); }
                    100% { box-shadow: 0 0 0 0 rgba(255, 158, 122, 0); }
                }
                @keyframes celebrationPulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                    100% { transform: scale(1); }
                }
                @keyframes resetPulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(0.98); }
                    100% { transform: scale(1); }
                }
            `}</style>
            {/* Container */}
            <div className="flex h-full w-full flex-col items-center justify-center perspective-1000">

                {/* Intro Text (Fades out) */}
                <div className="absolute z-0 flex flex-col items-center justify-center text-center pointer-events-none top-1/2 -translate-y-1/2">
                    <motion.h1
                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                        animate={introPhase === "circle" && scrollProgress < 0.5 ? { opacity: 1 - scrollProgress * 2, y: 0, filter: "blur(0px)" } : { opacity: 0, filter: "blur(10px)" }}
                        transition={{ duration: 1 }}
                        className="text-2xl md:text-4xl font-medium tracking-tight text-foreground"
                    >
                        Perfect Images, Every Time.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={introPhase === "circle" && scrollProgress < 0.5 ? { opacity: 0.5 - scrollProgress } : { opacity: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="mt-4 text-xs font-bold tracking-[0.2em] text-muted-foreground"
                    >
                        SCROLL TO EXPLORE
                    </motion.p>
                </div>

                {/* Arc Active Content (Fades in) */}
                <motion.div
                    animate={{ opacity: scrollProgress > 0.8 ? 1 : 0, y: scrollProgress > 0.8 ? 0 : 20 }}
                    className="absolute top-[10%] z-10 flex flex-col items-center justify-center text-center pointer-events-none px-4"
                >
                    <h2 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                        Our Vision
                    </h2>
                    <div className="max-w-3xl space-y-4">
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light">
                            We envision a world where every photograph achieves perfection through intelligent enhancement.
                        </p>
                        <p className="text-base md:text-lg text-foreground/80 leading-relaxed font-medium">
                            Our mission is to democratize professional photo editing, making exceptional imagery accessible to everyone. By combining cutting-edge AI technology with artistic expertise, we empower photographers, businesses, and creators to transform their visual stories into masterpieces that inspire and captivate.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3 mt-6">
                            <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">AI-Powered</span>
                            <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">Professional Quality</span>
                            <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">Instant Results</span>
                        </div>
                    </div>
                </motion.div>

                {/* Main Container */}
                <div className="relative flex items-center justify-center w-full h-full">
                    {IMAGES.slice(0, TOTAL_IMAGES).map((src, i) => {
                        let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

                        // 1. Intro Phases (Scatter -> Line)
                        if (introPhase === "scatter") {
                            target = scatterPositions[i];
                        } else if (introPhase === "line") {
                            const lineSpacing = 70;
                            const lineTotalWidth = TOTAL_IMAGES * lineSpacing;
                            const lineX = i * lineSpacing - lineTotalWidth / 2;
                            target = { x: lineX, y: 0, rotation: 0, scale: 1, opacity: 1 };
                        } else {
                            // 2. Circle Phase & Morph Logic
                            const isMobile = containerSize.width < 768;
                            const minDimension = Math.min(containerSize.width, containerSize.height);
                            const circleRadius = Math.min(minDimension * 0.35, 350);
                            const circleAngle = (i / TOTAL_IMAGES) * 360;
                            const circleRad = (circleAngle * Math.PI) / 180;
                            const circlePos = {
                                x: Math.cos(circleRad) * circleRadius,
                                y: Math.sin(circleRad) * circleRadius,
                                rotation: circleAngle + 90,
                            };

                            const baseRadius = Math.min(containerSize.width, containerSize.height * 1.5);
                            const arcRadius = baseRadius * (isMobile ? 1.2 : 0.8);
                            const arcApexY = containerSize.height * (isMobile ? 0.4 : 0.3);
                            const arcCenterY = arcApexY + arcRadius;
                            const spreadAngle = isMobile ? 120 : 160;
                            const startAngle = -90 - (spreadAngle / 2);
                            const step = spreadAngle / (TOTAL_IMAGES - 1);

                            const maxRotation = spreadAngle * 0.3;
                            const boundedRotation = -scrollProgress * maxRotation;

                            const currentArcAngle = startAngle + (i * step) + boundedRotation;
                            const arcRad = (currentArcAngle * Math.PI) / 180;

                            const arcPos = {
                                x: Math.cos(arcRad) * arcRadius + 50, // Shift 50px to the right for centering
                                y: Math.sin(arcRad) * arcRadius + arcCenterY,
                                rotation: currentArcAngle + 90,
                                scale: isMobile ? 1.2 : 1.5,
                            };

                            // Interpolate (Morph)
                            target = {
                                x: lerp(circlePos.x, arcPos.x, scrollProgress),
                                y: lerp(circlePos.y, arcPos.y, scrollProgress),
                                rotation: lerp(circlePos.rotation, arcPos.rotation, scrollProgress),
                                scale: lerp(1, arcPos.scale, scrollProgress),
                                opacity: 1,
                            };
                        }

                        return (
                            <FlipCard
                                key={i}
                                src={src}
                                index={i}
                                total={TOTAL_IMAGES}
                                phase={introPhase}
                                target={target}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
