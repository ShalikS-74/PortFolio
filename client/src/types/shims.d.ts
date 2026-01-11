// Local shims to satisfy TS while keeping build simple
// If you prefer full typings, install: npm i -D @types/react-day-picker

declare module 'react-day-picker' {
  import * as React from 'react'
  export const DayPicker: React.ComponentType<any>
}

declare module 'react-hook-form'
