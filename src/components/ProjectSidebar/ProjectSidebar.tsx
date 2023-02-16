import { Disclosure } from '@headlessui/react'
import { useMemo } from 'preact/hooks'
import { Link, useLocation } from 'react-router-dom'

import { SqlDriverType } from '~/constants'
import type { Project, Table } from '~/types/project'
import { tw } from '~/utils/tw'
import ChevronIcon from '~icons/tabler/chevron-right'

interface Props {
  project: Project
  tables: Table[]
}

const DEFAULT_SCHEMA = 'public'
const wrapperClassName = 'px-2 flex hover:bg-primary/10 cursor-default'
const listItemClassName = 'py-0.5 overflow-x-clip text-ellipsis text-sm'
const activeClassName = 'bg-primary/10'

export const ProjectSidebar = ({ project, tables }: Props) => {
  const groupedTables: [string, Table[]][] = useMemo(() => {
    if (!tables || tables.length === 0) return []

    // For Postgres, group tables by their schema
    if (project?.driverType === SqlDriverType.POSTGRES) {
      const grouped = tables.reduce((acc, table) => {
        const schema = table.schema ?? DEFAULT_SCHEMA
        if (!acc[schema]) acc[schema] = []
        acc[schema].push(table)
        return acc
      }, {} as Record<string, Table[]>)

      return Object.entries(grouped).sort(([a], [b]) => {
        if (a === DEFAULT_SCHEMA) return -1
        if (b === DEFAULT_SCHEMA) return 1
        return a.localeCompare(b)
      })
    }

    // For other drivers, just put all tables in the public schema
    return [[DEFAULT_SCHEMA, tables]]
  }, [tables, project?.driverType])

  return (
    <div className="bg-base-100 text-base-content relative h-full overflow-y-auto overflow-x-hidden text-ellipsis">
      <ul className="flex flex-col">
        {groupedTables[0][1].map((table) => (
          <TableListItem key={table.id} table={table} />
        ))}
        {groupedTables.slice(1).map(([schema, tables]) => (
          <NestedList key={schema} schema={schema} tables={tables} />
        ))}
      </ul>
    </div>
  )
}

interface NestedListProps {
  schema: string
  tables: Table[]
}

const NestedList = ({ schema, tables }: NestedListProps) => {
  const isGroupActive = useLocation().pathname.includes(schema)

  return (
    // @ts-expect-error className is valid
    <Disclosure as="li">
      {({ open }: { open: boolean }) => (
        <>
          <Disclosure.Button
            className={tw(wrapperClassName, 'flex w-full items-center', isGroupActive && !open && activeClassName)}
          >
            <ChevronIcon className={tw('text-base-content mr-1 shrink-0 opacity-50', open && 'rotate-90')} />
            <span className={listItemClassName}>{schema}</span>
          </Disclosure.Button>
          {/* @ts-expect-error idk*/}
          <Disclosure.Panel as="ul">
            {tables.map((table) => (
              <TableListItem key={table.id} table={table} isNested />
            ))}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

const TableListItem = ({ table, isNested }: { table: Table; isNested?: boolean }) => {
  const isActive = useLocation().pathname.includes(table.id)

  return (
    <Link to={`t/${table.id}`} className={tw(wrapperClassName, isActive && activeClassName)}>
      <li className={tw(listItemClassName, isNested && 'pl-3')}>{table.name}</li>
    </Link>
  )
}
