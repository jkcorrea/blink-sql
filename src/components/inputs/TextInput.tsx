import type { JSX } from 'preact'

import { tw } from '~/utils/tw'

export interface TextInputProps extends JSX.HTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  fullWidth?: boolean
  wrapperclass?: string
}

export const TextInput = ({ error, label, fullWidth, wrapperclass, ...inputProps }: TextInputProps) => {
  return (
    <div class={tw('form-control', fullWidth && 'w-full', wrapperclass)}>
      {label && (
        <label for={inputProps.id} class="label">
          <span class={tw('label-text text-xs uppercase', error && 'text-error')}>{label}</span>
          {inputProps.required && <span class="label-text-alt">*</span>}
        </label>
      )}
      <input
        type="text"
        {...inputProps}
        class={tw('input-bordered input', fullWidth && 'w-full', error && 'input-error', inputProps.class?.toString())}
      />
      {error && (
        <label class="label py-1">
          <span class="label-text-alt text-error text-xs">{error}</span>
        </label>
      )}
    </div>
  )
}
