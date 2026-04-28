import './globals.css';

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
              <a className="navLink" href="/">🏠 HOME</a>
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
