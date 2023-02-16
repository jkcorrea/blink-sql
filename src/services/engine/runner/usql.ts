import { Command } from '@tauri-apps/api/shell'

import type { RunnerFn } from '.'

const SIDECAR_PATH = 'binaries/usql/usql'
const SIDECAR_BASE_FLAGS = [
  // Output results as JSON
  '-J',
  // Quiet (only output raw results)
  '-q',
  // IMPORTANT: this goes last, tells usql to execute the SQL that comes next
  '-c',
]

export const runner: RunnerFn = async (sql, databaseUrl) => {
  const url = new URL(databaseUrl)
  url.searchParams.set('sslmode', 'disable')

  try {
    const cmd = Command.sidecar(SIDECAR_PATH, [...SIDECAR_BASE_FLAGS, sql, url.toString()])
    const res = await cmd.execute()

    if (res.code !== 0) {
      throw new Error(res.stderr)
    }

    return JSON.parse(res.stdout)
  } catch (error) {
    console.error(error)
    throw error
  }
}
