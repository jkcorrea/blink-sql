import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main class="mx-auto p-4 text-center text-gray-700">
      <h1 class="max-6-xs my-16 text-6xl font-thin uppercase text-sky-700">Not Found</h1>
      <p class="mt-8">
        Visit{' '}
        <a href="https://solidjs.com" target="_blank" class="text-sky-600 hover:underline">
          solidjs.com
        </a>{' '}
        to learn how to build Solid apps.
      </p>
      <p class="my-4">
        <Link href="/" class="text-sky-600 hover:underline">
          Home
        </Link>
        {' - '}
        <Link href="/about" class="text-sky-600 hover:underline">
          About Page
        </Link>
      </p>
    </main>
  )
}
