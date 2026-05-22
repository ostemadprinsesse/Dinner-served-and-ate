import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Awesome Recipe Cookbook',
  description: 'Dinner-served-and-ate (Next.js + React)',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="page">
          <header className="header">
            <div className="headerInner">
              <h1 className="title">🍳 Dinner served at ate 🍳</h1>
            </div>
            <nav className="nav">
              <Link className="navLink" href="/">🏠 HOME</Link>
            </nav>
          </header>

          <main className="content">{children}</main>

          <footer className="footer">
            <div className="marquee">✨ Welcome to the best recipe site on the World Wide Web! ✨</div>
          </footer>
        </div>
      </body>
    </html>
  );
}
