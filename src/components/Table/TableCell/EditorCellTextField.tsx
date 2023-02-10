import type { IEditorCellProps } from '~/components/fields/types'
import { tw } from '~/utils/tw'

export interface IEditorCellTextFieldProps extends IEditorCellProps<string> {}

export default function EditorCellTextField(props: IEditorCellTextFieldProps) {
  return (
    <input
      value={props.value}
      class={tw('mt-px h-[calc(100%-1px)] w-full p-0 pb-px outline-offset-[inherit] outline-inherit')}
      style={{
        // TODO
        'background-color': 'var(--cell-background-color)',
        font: 'inherit', // Prevent text jumping
        'letter-spacing': 'inherit', // Prevent text jumping
      }}
      onBlur={() => props.onReset()}
      onChange={(e) => props.onChange(e.currentTarget.value)}
      autofocus
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          e.stopPropagation()
        }
        // Escape prevents saving the new value
        if (e.key === 'Escape') {
          // Setting isDirty to false prevents saving
          props.onReset()
          // Stop propagation to prevent the table from closing the editor
          e.stopPropagation()
          // Close the editor after isDirty is set to false again
          setTimeout(() => props.setIsFocused(false))
        }
        if (e.key === 'Enter' && !e.shiftKey) {
          // Removes focus from inside cell, triggering save on unmount
          props.setIsFocused(false)
        }
      }}
      onClick={(e) => e.stopPropagation()}
      onDblClick={(e) => e.stopPropagation()}
    />
  )
}
