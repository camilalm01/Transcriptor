import React from 'react';

export default function AuthCard({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <section aria-labelledby="auth-title" className="auth-card">
      <div className="auth-card__inner">
        {/* Logo temporal */}
        <div className="auth-card__logo" aria-hidden="true">EDU</div>
        <h1 id="auth-title" className="auth-card__title">{title}</h1>
        {children}
      </div>
    </section>
  );
}