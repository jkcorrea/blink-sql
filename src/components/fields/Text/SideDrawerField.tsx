import { ISideDrawerFieldProps } from '../types'

export default function ShortText(props: ISideDrawerFieldProps) {
  return (
    <input
      {...{ maxLength: props.column.config?.maxLength }}
      type="text"
      class="m-0 w-full"
      disabled={props.disabled}
      value={props.value}
      onChange={(e) => props.onChange(e.currentTarget.value)}
      onBlur={() => props.onSubmit()}
    />
  )
}
