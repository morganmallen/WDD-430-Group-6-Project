import { inter } from '../app/ui/fonts';
import Header from './components/header';
import Footer from './components/footer';
import { AuthProvider } from './context/AuthContext';
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
        <AuthProvider>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}