import { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "./components/common/AuthProvider";
import Header from "./components/common/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "University Graduation Management System - IYTE",
  description: "A platform to manage the graduation approval process for universities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[rgb(var(--background-rgb))]`}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              <div className="container mx-auto px-4 py-8">
                {children}
              </div>
            </main>
            <footer className="bg-[rgb(var(--iyte-red))] text-white py-6">
              <div className="container mx-auto px-4 text-center">
                <p className="text-sm">Izmir Institute of Technology &copy; {new Date().getFullYear()}</p>
                <p className="text-xs mt-1">Graduation Management System</p>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
} 