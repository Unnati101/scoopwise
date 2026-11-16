import type { Metadata, Viewport } from 'next';
import { Fredoka, Nunito, Noto_Sans_Devanagari, Pacifico } from 'next/font/google';
import { Toaster } from 'sonner';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { CartDrawer } from '@/features/cart/CartDrawer';
import { CartProvider } from '@/features/cart/CartProvider';
import { getI18n } from '@/i18n/server';
import { I18nProvider } from '@/i18n/provider';
import { localizeFlavor, localizeMenuItem } from '@/i18n/localize';
import { buildSearchIndex } from '@/lib/searchIndex';
import { SITE_NAME } from '@/lib/constants';
import { THEME_INIT_SCRIPT } from '@/lib/theme';
import { flavorService } from '@/services/flavorService';
import { menuService } from '@/services/menuService';
import './globals.css';

const display = Fredoka({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const body = Nunito({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const hindi = Noto_Sans_Devanagari({ subsets: ['devanagari'], variable: '--font-hindi', display: 'swap', preload: false });
const script = Pacifico({ subsets: ['latin'], weight: '400', variable: '--font-script', display: 'swap' });

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: { default: t('meta.defaultTitle'), template: `%s | ${SITE_NAME}` }, description: t('meta.description') };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fff6f1' },
    { media: '(prefers-color-scheme: dark)', color: '#171114' },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const i18n = await getI18n();
  const [flavors, menuItems] = await Promise.all([flavorService.list(), menuService.listAll()]);
  const searchItems = buildSearchIndex(
    flavors.map((flavor) => localizeFlavor(flavor, i18n.m)),
    menuItems.map((item) => localizeMenuItem(item, i18n.m)),
    i18n,
  );

  return (
    <html lang={i18n.locale} className={`${display.variable} ${body.variable} ${hindi.variable} ${script.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <I18nProvider locale={i18n.locale} messages={i18n.m}>
          <CartProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
            >
              {i18n.t('common.skipToContent')}
            </a>
            <Header searchItems={searchItems} />
            <main id="main">{children}</main>
            <Footer />
            <CartDrawer />
            <Toaster position="top-center" richColors closeButton />
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
