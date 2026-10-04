import React from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
  id: string;
};

export function FormField({ label, hint, error, id, ...rest }: Props) {
  const describedBy = [
    hint ? `${id}-hint` : '',
    error ? `${id}-error` : ''
  ].filter(Boolean).join(' ') || undefined;

  return (
    <div className="field">
      <label htmlFor={id} className="field__label">{label}</label>
      <input id={id} aria-describedby={describedBy} className="field__input" {...rest} />
      {hint && <div id={`${id}-hint`} className="field__hint">{hint}</div>}
      {error && <div id={`${id}-error`} className="field__error" role="alert">{error}</div>}
    </div>
  );
}