/**
 * The design box of `AbhishekShrine`, in px: the scene is drawn 375 wide and SCENE_H tall and scales with the page's
 * width. It lives here, not in the component's file, so a server component (the page that lays the river out, whose
 * pool must be exactly this tall) can read the number: a value imported from a `'use client'` file is not a number there.
 */
export const SCENE_W = 375;
export const SCENE_H = 390;
