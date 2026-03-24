import type { PropsWithChildren, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import AuthCard from './AuthCard';
import BackButton from '../ui/BackButton';

type AuthFormLayoutProps = PropsWithChildren<{
  title: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  submitText: string;
  submitAriaLabel: string;
  submitLoadingText?: string;
  loading: boolean;
  globalError?: string;
  footerText: string;
  footerLinkText: string;
  footerLinkTo: string;
  showBackButton?: boolean;
  extraTopContent?: ReactNode;
}>;

export default function AuthFormLayout({
  title,
  onSubmit,
  submitText,
  submitAriaLabel,
  submitLoadingText,
  loading,
  globalError,
  footerText,
  footerLinkText,
  footerLinkTo,
  showBackButton,
  extraTopContent,
  children
}: AuthFormLayoutProps) {
  return (
    <AuthCard title={title}>
      {showBackButton && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.5rem' }}>
          <BackButton />
          <span className="sr-only">Volver a la pagina anterior</span>
        </div>
      )}

      {extraTopContent}

      <form onSubmit={onSubmit} className="grid" style={{ gap: '1rem' }} noValidate>
        {globalError && <div role="alert" className="field__error">{globalError}</div>}

        {children}

        <button type="submit" className="btn-primary" aria-label={submitAriaLabel} disabled={loading}>
          {loading ? (submitLoadingText || submitText) : submitText}
        </button>

        <p style={{ textAlign: 'center' }}>
          {footerText}{' '}
          <Link to={footerLinkTo} className="link">{footerLinkText}</Link>
        </p>
      </form>
    </AuthCard>
  );
}
