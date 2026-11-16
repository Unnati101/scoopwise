import { z } from 'zod';
import { createLocalStore } from '@/lib/localStore';

export type Theme = 'light' | 'dark';

/** The shopper's explicit choice. Null means "follow the device setting". */
export const themeStore = createLocalStore<Theme | null>('frosty.theme', z.enum(['light', 'dark']).nullable(), null);

export const DARK_QUERY = '(prefers-color-scheme: dark)';

// Runs before first paint so the page never flashes the wrong theme.
export const THEME_INIT_SCRIPT = `(function(){try{var t=JSON.parse(localStorage.getItem('frosty.theme'));if(t!=='light'&&t!=='dark'){t=matchMedia('${DARK_QUERY}').matches?'dark':'light'}document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}})()`;
