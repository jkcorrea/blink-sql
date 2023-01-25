import { IDisplayCellProps } from '../types'

export default function DisplayCellValue(props: IDisplayCellProps) {
  return <>{typeof props.value === 'string' ? props.value : null}</>
}
