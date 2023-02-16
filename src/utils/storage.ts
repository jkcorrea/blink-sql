import localforage from 'localforage'

export const storage = localforage.createInstance({
  name: 'Blink',
  storeName: 'blink_store',
})
