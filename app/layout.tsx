import { inter } from '../app/ui/fonts';
import Header from './components/header';
import Footer from './components/footer';
import './globals.css';

export const metadata = {
  title: "Home | Handcrafted Haven",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}