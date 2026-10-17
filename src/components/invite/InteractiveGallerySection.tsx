'use client';

import { useState } from 'react';
import Image from 'next/image';
import { m, AnimatePresence } from 'motion/react';
import { hindiBody, hindiDisplay } from './hindiFonts';
import { NIGHT_GLASS, nightGlassVars, type NightGlassColors } from './nightGlass';

export interface InteractiveGalleryItem {
  id: string;
  src: string;
  alt: string;
  caption: string;
  subtitle?: string;
}

export const DEFAULT_GALLERY_ITEMS: InteractiveGalleryItem[] = [
  {
    id: 'mandap',
    src: '/art/gallery/mandap-ceremony.jpg',
    alt: 'Traditional Pheras around the sacred fire in floral mandap',
    caption: 'The Perfect Match',
    subtitle: 'पवित्र सात फेरे एवं मांगलिक अग्नि',
  },
  {
    id: 'desert',
    src: '/art/gallery/desert-sunset.jpg',
    alt: 'Romantic desert sunset couple portrait',
    caption: 'Desert Romance',
    subtitle: 'स्वर्णिम रेत और प्रेम की छाँव',
  },
  {
    id: 'palace-courtyard',
    src: '/art/gallery/palace-courtyard.jpg',
    alt: 'Regal couple in emerald attire at palace courtyard',
    caption: 'Heritage Royalty',
    subtitle: 'शाही झरोखे एवं राजसी ठाठ',
  },
  {
    id: 'ballroom',
    src: '/art/gallery/palace-hall.jpg',
    alt: 'Couple in royal purple attire in grand chandelier hall',
    caption: 'Grand Celebration',
    subtitle: 'दीपमालाओं और झूमरों के बीच',
  },
  {
    id: 'balcony',
    src: '/art/gallery/balcony-sunset.jpg',
    alt: 'Couple portrait at palace balcony at sunset',
    caption: 'Sunset Promise',
    subtitle: 'संध्या की स्वर्णिम बेला',
  },
];

export interface InteractiveGalleryWords {
  /** The badge on the featured picture while its caption is hidden… */
  hintIdle: string;
  /** …and while it shows. */
  hintActive: string;
  /** Accessible name of a picture, before its caption. */
  view: string;
  expand: string;
  close: string;
  prev: string;
  next: string;
}

const HINDI_WORDS: InteractiveGalleryWords = {
  hintIdle: 'क्लिक करें',
  hintActive: 'टैप करें',
  view: 'View photo',
  expand: 'Full Screen View',
  close: 'Close',
  prev: '← पिछला',
  next: 'अगला →',
};

export interface InteractiveGallerySectionProps {
  /** Exactly five are shown; fewer and the sample set is shown instead. */
  items?: InteractiveGalleryItem[];
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  words?: Partial<InteractiveGalleryWords>;
  displayClassName?: string;
  bodyClassName?: string;
  /** The captions' font-family. */
  captionFont?: string;
  colors?: Partial<NightGlassColors>;
  className?: string;
}

/** Round icon buttons over a picture (full screen, close). */
const ICON_BUTTON =
  'rounded-pill bg-black/60 backdrop-blur-md border border-[color-mix(in_srgb,var(--ng-gold)_50%,transparent)] text-[color:var(--ng-bright)] hover:bg-[var(--ng-gold)] hover:text-[color:var(--ng-card)]';
const NAV_BUTTON =
  'px-4 py-1.5 rounded-pill border border-[color-mix(in_srgb,var(--ng-gold)_40%,transparent)] text-[color:var(--ng-bright)] text-[13px] hover:bg-[color-mix(in_srgb,var(--ng-gold)_10%,transparent)]';

/**
 * InteractiveGallerySection — Luxury Wedding Photo Gallery
 *
 * Feature highlights:
 * - 1 large top featured card + 2x2 grid below (5 photos layout)
 * - Click interaction: image zooms in, dark gradient shadow fades in at bottom,
 *   and caption ("The Perfect Match") animates in at the bottom-left in gold serif font.
 * - Clicking any grid photo also showcases it with full zoom and caption.
 */
export function InteractiveGallerySection({
  items = DEFAULT_GALLERY_ITEMS,
  title = 'पावन स्मृतियाँ',
  subtitle = 'फोटो पर क्लिक करके खूबसूरत पलों को देखें',
  eyebrow = 'Captured Moments',
  words,
  displayClassName = hindiDisplay.className,
  bodyClassName = hindiBody.className,
  captionFont = 'Georgia, Cambria, "Times New Roman", serif',
  colors,
  className = '',
}: InteractiveGallerySectionProps) {
  const galleryItems = items && items.length >= 5 ? items : DEFAULT_GALLERY_ITEMS;
  const w = { ...HINDI_WORDS, ...words };
  const c = { ...NIGHT_GLASS, ...colors };

  // Selected photo for the main top card
  const [featuredIndex, setFeaturedIndex] = useState(0);

  // Cards whose zoom + bottom shadow + caption is showing; the top card starts shown.
  const [activeCards, setActiveCards] = useState<Record<string, boolean>>({
    [galleryItems[0].id]: true,
  });

  // Lightbox modal state for full-screen view
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const toggleCardActive = (id: string, index?: number) => {
    setActiveCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

    if (index !== undefined) {
      setFeaturedIndex(index);
    }
  };

  const featuredItem = galleryItems[featuredIndex] || galleryItems[0];
  const isFeaturedActive = !!activeCards[featuredItem.id];
  const gridItems = galleryItems.slice(1, 5);

  return (
    <section style={nightGlassVars(c)} className={`relative z-10 w-full mb-16 px-4 ${className}`}>
      {/* Section Header */}
      <div className="text-center mb-6">
        {eyebrow && (
          <div className="inline-flex items-center gap-2 rounded-pill px-3.5 py-1 border border-[color-mix(in_srgb,var(--ng-gold)_30%,transparent)] bg-[color-mix(in_srgb,var(--ng-card)_80%,transparent)] text-[11px] sm:text-[12px] font-semibold text-[color:var(--ng-bright)] tracking-widest uppercase mb-2 shadow-sm">
            <span>✦</span>
            <span>{eyebrow}</span>
            <span>✦</span>
          </div>
        )}
        <h3
          className={`${displayClassName} text-[24px] sm:text-[28px] font-bold text-[color:var(--ng-ink)] drop-shadow-[0_2px_12px_color-mix(in_srgb,var(--ng-gold)_35%,transparent)]`}
        >
          {title}
        </h3>
        <p className={`${bodyClassName} text-[13px] sm:text-[14px] text-[color:color-mix(in_srgb,var(--ng-muted)_80%,transparent)] mt-1`}>
          {subtitle}
        </p>
      </div>

      {/* Gallery Container - Max width 480px matching mobile invite view */}
      <div className="max-w-[480px] mx-auto w-full">
        {/* 1. Large Featured Card (Top) */}
        <div
          role="button"
          tabIndex={0}
          aria-label={`${w.view}: ${featuredItem.caption}`}
          onClick={() => toggleCardActive(featuredItem.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleCardActive(featuredItem.id);
            }
          }}
          className={`group relative w-full aspect-[4/4.5] sm:aspect-[4/3.8] rounded-[16px] sm:rounded-[24px] overflow-hidden cursor-pointer select-none transition-all duration-500 shadow-[0_12px_36px_rgba(0,0,0,0.7)] ${
            isFeaturedActive
              ? 'border-2 border-[color-mix(in_srgb,var(--ng-gold)_80%,transparent)] shadow-[0_0_24px_color-mix(in_srgb,var(--ng-gold)_35%,transparent)]'
              : 'border border-[color-mix(in_srgb,var(--ng-gold)_35%,transparent)] hover:border-[color-mix(in_srgb,var(--ng-gold)_60%,transparent)]'
          }`}
        >
          {/* Inner Image with Smooth Zoom */}
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src={featuredItem.src}
              alt={featuredItem.alt}
              fill
              sizes="(max-width: 640px) 100vw, 480px"
              priority
              className={`object-cover object-center transition-transform duration-700 ease-out ${
                isFeaturedActive ? 'scale-110' : 'scale-100 group-hover:scale-105'
              }`}
            />
          </div>

          {/* Interactive Tap Hint Badge (Top Right) */}
          <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-pill bg-black/55 backdrop-blur-md border border-[color-mix(in_srgb,var(--ng-gold)_40%,transparent)] text-[color:var(--ng-bright)] text-[11px] font-medium tracking-wide shadow-md transition-opacity duration-300">
            <span className="text-[12px] animate-pulse">✦</span>
            <span>{isFeaturedActive ? w.hintActive : w.hintIdle}</span>
          </div>

          {/* Bottom Dark Gradient Shadow */}
          <div
            className={`pointer-events-none absolute inset-x-0 bottom-0 h-44 sm:h-52 bg-gradient-to-t from-black/95 via-black/60 to-transparent transition-opacity duration-500 ease-out z-10 ${
              isFeaturedActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
            }`}
          />

          {/* Caption at Bottom-Left */}
          <div
            className={`absolute bottom-4 left-4 sm:bottom-6 sm:left-6 right-4 z-20 transition-all duration-500 ease-out ${
              isFeaturedActive
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
          >
            <h4
              style={{ fontFamily: captionFont }}
              className="text-[color:var(--ng-bright)] text-[20px] sm:text-[23px] font-semibold tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]"
            >
              {featuredItem.caption}
            </h4>
            {featuredItem.subtitle && (
              <p
                className={`${bodyClassName} text-[13px] sm:text-[14px] text-[color:color-mix(in_srgb,var(--ng-body)_90%,transparent)] mt-0.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]`}
              >
                {featuredItem.subtitle}
              </p>
            )}
          </div>

          {/* Lightbox Trigger Icon (Bottom Right) */}
          {isFeaturedActive && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(featuredIndex);
              }}
              title={w.expand}
              aria-label={w.expand}
              className={`absolute bottom-4 right-4 z-30 p-2 transition-all duration-300 shadow-md ${ICON_BUTTON}`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
            </button>
          )}
        </div>

        {/* 2. 2-Column Grid (4 Images Below) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
          {gridItems.map((item, idx) => {
            const actualIndex = idx + 1;
            const isSelectedAsFeatured = featuredIndex === actualIndex;
            const isCardActive = !!activeCards[item.id];

            return (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                aria-label={`${w.view}: ${item.caption}`}
                onClick={() => {
                  toggleCardActive(item.id, actualIndex);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleCardActive(item.id, actualIndex);
                  }
                }}
                className={`group relative aspect-[4/4.5] sm:aspect-square rounded-[16px] overflow-hidden cursor-pointer select-none transition-all duration-500 shadow-lg ${
                  isSelectedAsFeatured
                    ? 'border-2 border-[color:var(--ng-gold)] shadow-[0_0_18px_color-mix(in_srgb,var(--ng-gold)_40%,transparent)]'
                    : isCardActive
                    ? 'border border-[color-mix(in_srgb,var(--ng-gold)_80%,transparent)] shadow-[0_0_12px_color-mix(in_srgb,var(--ng-gold)_25%,transparent)]'
                    : 'border border-[color-mix(in_srgb,var(--ng-gold)_30%,transparent)] hover:border-[color-mix(in_srgb,var(--ng-gold)_60%,transparent)]'
                }`}
              >
                {/* Grid Image */}
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, 240px"
                    className={`object-cover object-center transition-transform duration-700 ease-out ${
                      isCardActive || isSelectedAsFeatured
                        ? 'scale-110'
                        : 'scale-100 group-hover:scale-105'
                    }`}
                  />
                </div>

                {/* Bottom Shadow for Grid Card */}
                <div
                  className={`pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/95 via-black/55 to-transparent transition-opacity duration-500 ease-out z-10 ${
                    isCardActive || isSelectedAsFeatured
                      ? 'opacity-100'
                      : 'opacity-0 group-hover:opacity-40'
                  }`}
                />

                {/* Grid Card Caption at Bottom Left */}
                <div
                  className={`absolute bottom-2.5 left-2.5 right-2 z-20 transition-all duration-500 ease-out ${
                    isCardActive || isSelectedAsFeatured
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-2 pointer-events-none'
                  }`}
                >
                  <p
                    style={{ fontFamily: captionFont }}
                    className="text-[color:var(--ng-bright)] text-[14px] sm:text-[15px] font-semibold tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] leading-snug line-clamp-1"
                  >
                    {item.caption}
                  </p>
                  {item.subtitle && (
                    <p
                      className={`${bodyClassName} text-[11px] text-[color:color-mix(in_srgb,var(--ng-body)_90%,transparent)] mt-0.5 line-clamp-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]`}
                    >
                      {item.subtitle}
                    </p>
                  )}
                </div>

                {/* Subtle active indicator dot */}
                {isSelectedAsFeatured && (
                  <div className="absolute top-2.5 left-2.5 z-20 w-2 h-2 rounded-pill bg-[var(--ng-bright)] shadow-[0_0_8px_var(--ng-bright)]" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal (For Full-Screen Zoom View) */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-xl w-full max-h-[85vh] rounded-[24px] overflow-hidden border border-[color-mix(in_srgb,var(--ng-gold)_50%,transparent)] bg-[var(--ng-card)] shadow-2xl flex flex-col"
            >
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                aria-label={w.close}
                className={`absolute top-4 right-4 z-30 w-10 h-10 flex items-center justify-center transition-colors ${ICON_BUTTON}`}
              >
                ✕
              </button>

              {/* Lightbox Image */}
              <div className="relative w-full aspect-[4/4.5] sm:aspect-[4/3.5] overflow-hidden">
                <Image
                  src={galleryItems[lightboxIndex].src}
                  alt={galleryItems[lightboxIndex].alt}
                  fill
                  priority
                  className="object-cover object-center"
                />
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/95 via-black/50 to-transparent z-10" />

                <div className="absolute bottom-5 left-5 right-16 z-20">
                  <h3
                    style={{ fontFamily: captionFont }}
                    className="text-[color:var(--ng-bright)] text-[24px] sm:text-[28px] font-bold tracking-wide drop-shadow-lg"
                  >
                    {galleryItems[lightboxIndex].caption}
                  </h3>
                  {galleryItems[lightboxIndex].subtitle && (
                    <p className={`${bodyClassName} text-[15px] text-[color:var(--ng-body)] mt-1`}>
                      {galleryItems[lightboxIndex].subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Lightbox Navigation Footer */}
              <div className="p-4 bg-[var(--ng-deep)] border-t border-[color-mix(in_srgb,var(--ng-gold)_20%,transparent)] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex((prev) =>
                      prev !== null
                        ? (prev - 1 + galleryItems.length) % galleryItems.length
                        : 0
                    )
                  }
                  className={NAV_BUTTON}
                >
                  {w.prev}
                </button>
                <span className="text-[12px] text-[color:color-mix(in_srgb,var(--ng-bright)_70%,transparent)] font-mono">
                  {lightboxIndex + 1} / {galleryItems.length}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex((prev) =>
                      prev !== null ? (prev + 1) % galleryItems.length : 0
                    )
                  }
                  className={NAV_BUTTON}
                >
                  {w.next}
                </button>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </section>
  );
}
