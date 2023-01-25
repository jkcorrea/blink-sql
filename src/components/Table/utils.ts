export const splitCellId = (id: string): { rowId: string; colId: string } => {
  const [rowId, ...colStrs] = id.split('_')
  return { rowId, colId: colStrs.join('_') }
}
