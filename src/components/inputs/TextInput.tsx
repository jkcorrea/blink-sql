import { JSX, splitProps } from 'solid-js'

import { tw } from '~/lib/utils'

export interface TextInputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  fullWidth?: boolean
  wrapperclass?: string
}

export const TextInput = (props: TextInputProps) => {
  const [{ error, label, fullWidth, wrapperclass }, inputProps] = splitProps(props, [
    'error',
    'label',
    'fullWidth',
    'wrapperclass',
  ])

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
        class={tw('input-bordered input', fullWidth && 'w-full', error && 'input-error', ...(inputProps?.class ?? []))}
      />
      {error && (
        <label class="label py-1">
          <span class="label-text-alt text-error text-xs">{error}</span>
        </label>
      )}
    </div>
  )
}
