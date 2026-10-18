import { useEffect, useRef, useState } from 'react'

/** Fires once whenever `value` changes, for a one-shot CSS highlight. */
export function useBumpKey(value: number): number {
  const [key, setKey] = useState(0)
  const prev = useRef(value)
  useEffect(() => {
    if (prev.current !== value) {
      prev.current = value
      setKey((k) => k + 1)
    }
  }, [value])
  return key
}
