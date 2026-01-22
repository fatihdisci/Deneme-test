"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, ExternalLink, X } from 'lucide-react';

// Abstract map SVG paths representing roads/streets
const AbstractMapSVG = () => (
    <svg
        viewBox="0 0 400 300"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
    >
        {/* Background grid */}
        <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="rgba(171, 147, 77, 0.1)"
                    strokeWidth="0.5"
                />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Main roads */}
        <path
            d="M 0 150 Q 100 150 200 100 T 400 120"
            fill="none"
            stroke="rgba(171, 147, 77, 0.4)"
            strokeWidth="3"
            strokeLinecap="round"
        />
        <path
            d="M 50 0 Q 50 75 100 150 T 150 300"
            fill="none"
            stroke="rgba(171, 147, 77, 0.3)"
            strokeWidth="2.5"
            strokeLinecap="round"
        />
        <path
            d="M 250 0 Q 280 100 320 150 T 380 300"
            fill="none"
            stroke="rgba(171, 147, 77, 0.35)"
            strokeWidth="2"
            strokeLinecap="round"
        />

        {/* Secondary streets */}
        <path
            d="M 0 80 L 120 80 Q 140 80 140 100 L 140 200"
            fill="none"
            stroke="rgba(100, 116, 139, 0.3)"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
        <path
            d="M 200 0 L 200 80 Q 200 100 220 100 L 400 100"
            fill="none"
            stroke="rgba(100, 116, 139, 0.25)"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
        <path
            d="M 300 180 L 300 300"
            fill="none"
            stroke="rgba(100, 116, 139, 0.2)"
            strokeWidth="1"
            strokeLinecap="round"
        />
        <path
            d="M 0 220 L 200 220"
            fill="none"
            stroke="rgba(100, 116, 139, 0.2)"
            strokeWidth="1"
            strokeLinecap="round"
        />

        {/* Location marker */}
        <circle cx="200" cy="150" r="8" fill="#ab934d" opacity="0.9" />
        <circle cx="200" cy="150" r="16" fill="none" stroke="#ab934d" strokeWidth="2" opacity="0.5" />
        <circle cx="200" cy="150" r="24" fill="none" stroke="#ab934d" strokeWidth="1" opacity="0.3" />
    </svg>
);

interface InteractiveMapProps {
    address?: string;
    googleMapsUrl?: string;
    embedUrl?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
    address = "Dişçi Hukuk Bürosu - İzmir/Menemen",
    googleMapsUrl = "https://maps.google.com/?q=Menemen,İzmir",
    embedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d49772.98768647168!2d26.988559849999998!3d38.6108835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14bbd84b63f0e52f%3A0xf48d1ed3c3f07f1a!2sMenemen%2C%20%C4%B0zmir!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str"
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleCardClick = () => {
        setIsExpanded(true);
    };

    const handleCloseClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsExpanded(false);
    };

    const handleExternalLinkClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="relative w-full h-full">
            <div
                className={`relative bg-slate-900 overflow-hidden h-full ${!isExpanded ? 'cursor-pointer' : ''}`}
                onClick={!isExpanded ? handleCardClick : undefined}
            >
                {/* Header */}
                <div className="relative z-10 flex items-center justify-between px-4 py-3 bg-slate-900/90 backdrop-blur-sm border-b border-slate-800">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#ab934d]/20 flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-[#ab934d]" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">{address}</p>
                            <p className="text-xs text-slate-400">Konum</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {isExpanded && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                                onClick={handleCloseClick}
                                type="button"
                            >
                                <X className="w-4 h-4 text-slate-400" />
                            </motion.button>
                        )}
                    </div>
                </div>

                {/* Map Container */}
                <motion.div
                    className="relative"
                    animate={{ height: isExpanded ? '350px' : '280px' }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                >
                    {/* Abstract SVG Map */}
                    <AnimatePresence>
                        {!isExpanded && (
                            <motion.div
                                className="absolute inset-0 bg-slate-950"
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <AbstractMapSVG />

                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

                                {/* Click hint */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.div
                                        className="flex items-center gap-2 px-4 py-2 bg-slate-900/80 backdrop-blur-sm rounded-full border border-slate-700"
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <Navigation className="w-4 h-4 text-[#ab934d]" />
                                        <span className="text-sm text-slate-300">Haritayı açmak için tıklayın</span>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Google Maps Iframe */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                className="absolute inset-0"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                            >
                                <iframe
                                    src={embedUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Google Maps - Dişçi Hukuk Bürosu"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Footer */}
                <div className="relative z-10 flex items-center justify-between px-4 py-3 bg-slate-900/90 backdrop-blur-sm border-t border-slate-800">
                    <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 flex-1 py-2.5 bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold rounded-lg transition-all text-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <MapPin className="w-4 h-4" />
                        Yol Tarifi Al
                    </a>
                </div>
            </div>
        </div>
    );
};

export default InteractiveMap;
