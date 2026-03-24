import React from 'react';

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string;
  id: string;
};

export function PasswordField({ label, id, ...rest }: Props) {
  const describedBy = rest['aria-describedby'];

  return (
    <div className="field">
      <label htmlFor={id} className="field__label">{label}</label>
      <div className="field__password">
        <input
          id={id}
          type="password"
          className="field__input"
          aria-describedby={describedBy}
          {...rest}
        />
      </div>
    </div>
  );
}