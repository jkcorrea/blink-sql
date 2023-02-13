import { Disclosure } from '@headlessui/react'
import { useMemo } from 'preact/hooks'
import { Link, useMatch } from 'react-router-dom'

import { SqlDriverType } from '~/constants'
import type { Project, Table } from '~/types/project'
import { tw } from '~/utils/tw'

interface Props {
  project: Project
  tables: Table[]
}

const DEFAULT_SCHEMA = 'public'
const wrapperClassName = 'hover:bg-primary/5 cursor-default'
const listItemClassName = 'py-0.5 overflow-x-hidden text-ellipsis text-sm'

export const ProjectSidebar = ({ project, tables }: Props) => {
  const groupedTables: [string, Table[]][] = useMemo(() => {
    if (!tables || tables.length === 0) return []

    // For Postgres, group tables by their schema
    if (project?.driver.type === SqlDriverType.POSTGRES) {
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
  }, [tables, project?.driver])

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
  const isActive = useMatch(`t/${schema}.*`)

  console.log(schema, isActive)
  return (
    // @ts-expect-error className is valid
    <Disclosure as="li" className="space-y-1">
      {({ open }: { open: boolean }) => (
        <>
          <Disclosure.Button
            className={tw(wrapperClassName, 'group flex w-full items-center', isActive && 'bg-gray-100 text-gray-900')}
          >
            <svg
              className={tw(
                open ? 'rotate-90 text-gray-400' : 'text-gray-300',
                'mr-2 h-5 w-5 shrink-0 transition-colors duration-150 ease-in-out group-hover:text-gray-400',
              )}
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
            </svg>
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
  return (
    <Link to={`t/${table.id}`} className={wrapperClassName}>
      <li className={tw(listItemClassName, isNested ? 'px-7' : 'px-5')}>{table.name}</li>
    </Link>
  )
}
