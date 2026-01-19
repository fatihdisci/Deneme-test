import React, { useState, useRef, useEffect } from "react";
import { Share2, Link2, Twitter, Facebook, Linkedin, X, Check, Instagram } from "lucide-react";

interface ShareButtonProps {
    title: string;
    url: string;
}

export default function ShareButton({ title, url }: ShareButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [copyMessage, setCopyMessage] = useState("Bağlantıyı Kopyala");
    const menuRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleShare = (platform: string) => {
        let shareUrl = "";
        const encodedUrl = encodeURIComponent(url);
        const encodedTitle = encodeURIComponent(title);

        switch (platform) {
            case "whatsapp":
                shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
                break;
            case "twitter":
                shareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
                break;
            case "linkedin":
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
                break;
            case "facebook":
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                break;
            case "instagram":
                // Instagram doesn't have a direct web share API like others.
                // We copy the link and notify the user to open Instagram.
                navigator.clipboard.writeText(url).then(() => {
                    setCopied(true);
                    setCopyMessage("Link Kopyalandı!");
                    // Keep menu open but show Instagram-specifc state
                    setTimeout(() => {
                        // We could direct them to instagram.com but it's better to let them know
                        window.open("https://instagram.com", "_blank");
                        setIsOpen(false);
                        setCopied(false);
                        setCopyMessage("Bağlantıyı Kopyala");
                    }, 1000);
                });
                return;
            default:
                break;
        }

        if (platform === "copy") {
            navigator.clipboard.writeText(url).then(() => {
                setCopied(true);
                setCopyMessage("Kopyalandı!");
                setTimeout(() => {
                    setCopied(false);
                    setCopyMessage("Bağlantıyı Kopyala");
                }, 2000);
            });
        } else if (shareUrl) {
            window.open(shareUrl, "_blank", "width=600,height=400");
            setIsOpen(false);
        }
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 group ${isOpen ? "bg-gold-500 text-white" : "text-slate-400 hover:text-gold-500 hover:bg-slate-900"
                    }`}
                title="Paylaş"
            >
                <Share2 className="w-5 h-5" />
                <span className="font-medium">Paylaş</span>
            </button>

            {/* Popup Menu */}
            {isOpen && (
                <div className="absolute bottom-full right-0 mb-3 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 share-popup-animation origin-bottom-right">
                    <div className="p-1">
                        <button
                            onClick={() => handleShare("whatsapp")}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-left text-sm"
                        >
                            <div className="w-8 h-8 rounded-full bg-[#25D366]/20 flex items-center justify-center text-[#25D366] shrink-0">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                            </div>
                            WhatsApp
                        </button>

                        <button
                            onClick={() => handleShare("instagram")}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-left text-sm"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center text-white shrink-0">
                                <Instagram className="w-4 h-4" />
                            </div>
                            Instagram
                        </button>


                        <button
                            onClick={() => handleShare("twitter")}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-left text-sm"
                        >
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white border border-slate-700 shrink-0">
                                <X className="w-4 h-4" />
                            </div>
                            X (Twitter)
                        </button>

                        <button
                            onClick={() => handleShare("linkedin")}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-left text-sm"
                        >
                            <div className="w-8 h-8 rounded-full bg-[#0077b5]/20 flex items-center justify-center text-[#0077b5] shrink-0">
                                <Linkedin className="w-4 h-4" />
                            </div>
                            LinkedIn
                        </button>

                        <button
                            onClick={() => handleShare("facebook")}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-left text-sm"
                        >
                            <div className="w-8 h-8 rounded-full bg-[#1877F2]/20 flex items-center justify-center text-[#1877F2] shrink-0">
                                <Facebook className="w-4 h-4" />
                            </div>
                            Facebook
                        </button>

                        <div className="h-px bg-slate-800 my-1 mx-2"></div>

                        <button
                            onClick={() => handleShare("copy")}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-left text-sm"
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 ${copied ? 'bg-green-500/20 text-green-500' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                                {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                            </div>
                            {copyMessage}
                        </button>
                    </div>
                    <style>{`
            @keyframes sharePopupEntry {
              0% { opacity: 0; transform: scale(0.95) translateY(10px); }
              100% { opacity: 1; transform: scale(1) translateY(0); }
            }
            .share-popup-animation {
              animation: sharePopupEntry 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `}</style>
                </div>
            )}
        </div>
    );
}
