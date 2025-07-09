declare module '*.webp' {
  const value: string
  export = value
}
declare module '*.gif' {
  const value: string
  export = value
}
declare module '*.json' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value: any
  export default value
}
declare module 'jszip'
declare module 'react-dom/client'
declare module 'apca-w3'
