import { inter } from "../app/ui/fonts";
import AuthWrapper from "./components/AuthWrapper";
import "./globals.css";

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
        <AuthWrapper>{children}</AuthWrapper>
      </body>
    </html>
  );
}
