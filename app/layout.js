import { Inter } from "next/font/google";
import "./globals.css";
import { library } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { faChevronDown,faChevronUp, faChevronLeft,faChevronRight, faPlus,faPlusCircle, faUser} from '@fortawesome/free-solid-svg-icons';


library.add(faChevronDown,faChevronUp, faChevronLeft,faChevronRight, faPlus,faPlusCircle, faUser);
import "./fonts.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pickleball World Cup",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
