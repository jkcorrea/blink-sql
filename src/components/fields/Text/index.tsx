// import BasicContextMenuActions from '~/components/Table/ContextMenu/BasicCellContextMenuActions'
import { lazy } from 'preact/compat'

import { withRenderTableCell } from '~/components/Table/TableCell/withRenderTableCell'
import Icon from '~icons/tabler/letter-case'

import type { IFieldConfig } from '../types'
import { FieldType } from '../types'
import DisplayCell from './DisplayCell'
import EditorCell from './EditorCell'
// import { filterOperators } from './Filter'

const SideDrawerField = lazy(() => import('./SideDrawerField'))

// const Settings = lazy(() => import('./Settings' /* webpackChunkName: "Settings-ShortText" */))

export const config: IFieldConfig = {
  type: FieldType.TEXT,
  name: 'Text',
  group: 'Text',
  dataType: 'string',
  initialValue: '',
  initializable: true,
  icon: <Icon />,
  description: 'Text displayed on a single line.',
  // contextMenuActions: BasicContextMenuActions,
  TableCell: withRenderTableCell(DisplayCell, EditorCell),
  SideDrawerField,
  // settings: Settings,
  // filter: {
  //   operators: filterOperators,
  // },
}
export default config
