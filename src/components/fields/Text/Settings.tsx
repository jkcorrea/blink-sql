import { TextInput } from '~/components/inputs'

import { ISettingsProps } from '../types'

export default function Settings(props: ISettingsProps) {
  return (
    <>
      <TextInput
        id="character-limit"
        type="number"
        label="Character limit"
        value={props.config.maxLength}
        onChange={(e) => {
          if (e.currentTarget.value === '0') props.onChange('maxLength')(null)
          else props.onChange('maxLength')(e.currentTarget.value)
        }}
      />
      <TextInput
        id="validation-regex"
        type="text"
        label="Validation regex"
        value={props.config.validationRegex}
        fullWidth
        onChange={(e) => {
          if (e.currentTarget.value === '') props.onChange('validationRegex')(null)
          else props.onChange('validationRegex')(e.currentTarget.value)
        }}
      />
    </>
  )
}
