import type {Metadata} from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CULTURX™ | Internal. External. Optimized.',
  description: 'CULTURX™ is a premium human optimization ecosystem combining precision-fermented kombucha, targeted supplements, clinical bodywork and concierge recovery for elite human performance.',
  keywords: [
    'CULTURX',
    'kombucha',
    'gut health',
    'clinical bodywork',
    'wellness concierge',
    'elite human performance',
    'precision fermentation',
    'biohacking',
    'microbiome optimization',
    'supplements',
    'recovery'
  ],
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} scroll-smooth`}>
      <body className="bg-brand-black text-white font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
