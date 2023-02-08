import type { ISideDrawerFieldProps } from '../types'

export default function ShortText(props: ISideDrawerFieldProps) {
  return (
    <input
      type="text"
      class="m-0 w-full"
      disabled={props.disabled}
      value={props.value}
      onChange={(e) => props.onChange(e.currentTarget.value)}
      onBlur={() => props.onSubmit()}
    />
  )
}
