import { Command } from '@tauri-apps/api/shell'

const SIDECAR_PATH = 'binaries/usql/usql'
const SIDECAR_BASE_FLAGS = [
  // Output results as JSON
  '-J',
  // Quiet (only output raw results)
  '-q',
  // IMPORTANT: this goes last, tells usql to execute the SQL that comes next
  '-c',
]

export async function executeSql<T = unknown>(sql: string, dbUrl: string): Promise<T> {
  try {
    const cmd = Command.sidecar(SIDECAR_PATH, [...SIDECAR_BASE_FLAGS, sql, dbUrl])
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
