import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, BookOpen, PlusCircle, Zap } from 'lucide-react';

export const StudioNavbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header
      style={{
        position: 'relative',
        zIndex: 40,
        width: '100%',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        background: 'rgba(7, 8, 11, 0.7)',
        backdropFilter: 'blur(24px) saturate(1.2)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.2)',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 1.5rem',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left: Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--theme-accent) 0%, #a855f7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px var(--theme-glow)',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08) rotate(-3deg)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1) rotate(0deg)')}
            >
              <Sparkles size={16} color="#fff" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              <span style={{
                fontSize: '0.9rem',
                fontWeight: 800,
                letterSpacing: '-0.01em',
                color: '#fff',
                lineHeight: 1.2,
              }}>
                PlotWeaver
              </span>
              <span style={{
                fontSize: '0.6rem',
                fontWeight: 500,
                letterSpacing: '0.1em',
                color: 'var(--theme-muted)',
                textTransform: 'uppercase',
              }}>
                AI Story Studio
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <NavLink to="/" active={isActive('/')} icon={<PlusCircle size={14} />} label="New Story" />
            <NavLink to="/library" active={isActive('/library')} icon={<BookOpen size={14} />} label="Vault" />
          </nav>
        </div>

        {/* Right: Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.3rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              fontSize: '0.7rem',
              fontWeight: 600,
              color: '#34d399',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#34d399',
                animation: 'breathe 2s ease-in-out infinite',
              }}
            />
            <Zap size={11} />
            <span>Gemini AI Live</span>
          </div>
        </div>
      </div>
    </header>
  );
};

/* ─── Inline NavLink component ─── */
function NavLink({ to, active, icon, label }: {
  to: string;
  active: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      to={to}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.4rem 0.85rem',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.78rem',
        fontWeight: 600,
        textDecoration: 'none',
        color: active ? '#fff' : 'var(--theme-muted)',
        background: active ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.color = '#fff';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.color = 'var(--theme-muted)';
          e.currentTarget.style.background = 'transparent';
        }
      }}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
