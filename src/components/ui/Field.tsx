import type { InputHTMLAttributes, ReactNode } from 'react';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  help?: ReactNode;
  error?: string;
  required?: boolean;
  requiredLabel?: string;
}

/**
 * A visible label, always. Placeholder-as-label disappears the moment someone
 * types, and this form is filled by guests of every age on every device.
 */
export function Field({ id, label, help, error, required, requiredLabel = 'Required', className = '', ...rest }: FieldProps) {
  const helpId = help ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="label uppercase text-ink-strong">
        {label}
        {required && <span className="caption ml-2 font-normal normal-case text-ink-muted">{requiredLabel}</span>}
      </label>
      <input
        id={id}
        required={required}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        className={`body w-full rounded-sm border-[1.5px] bg-surface-raised px-3 py-3 text-ink-strong ${
          error ? 'border-signal-danger' : 'border-line-firm'
        } ${className}`}
        {...rest}
      />
      {help && (
        <span id={helpId} className="caption text-ink-muted">
          {help}
        </span>
      )}
      {error && (
        <span id={errorId} className="caption text-signal-danger">
          {error}
        </span>
      )}
    </div>
  );
}
