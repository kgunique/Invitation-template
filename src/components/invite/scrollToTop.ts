/** Back to the very top, instantly. The page under an opening screen may be
 * anywhere: the browser restores the old scroll position on a reload, and a
 * guest can scroll behind an overlay. 'instant' so a smooth-scroll stylesheet
 * can't make it a slow glide. */
export const scrollToTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
