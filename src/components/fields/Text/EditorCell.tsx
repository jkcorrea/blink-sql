import EditorCellTextField from '~/components/Table/TableCell/EditorCellTextField'

import type { IEditorCellProps } from '../types'

export default function ShortText(props: IEditorCellProps<string>) {
  return <EditorCellTextField {...props} />
}
