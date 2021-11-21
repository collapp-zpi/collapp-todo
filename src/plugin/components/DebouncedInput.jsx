import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";

export const DebouncedInput = ({handleUpdate, value, isDone}) => {
  const [innerValue, setInnerValue] = useState(value)
  const timeoutRef = useRef(null)

  useEffect(() => {
    setInnerValue(value)
  }, [value])

  useEffect(() => {
    if (innerValue === value) return

    if (timeoutRef?.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      handleUpdate({value: innerValue})
    }, 1000)

    return () => {
      if (timeoutRef?.current) clearTimeout(timeoutRef.current)
    }
  }, [innerValue, value])

  const handleChange = (e) => setInnerValue(e?.target?.value)

  return (
    <input
      className={classNames("py-3 px-2 flex-grow bg-transparent outline-none transition-opacity", isDone && 'line-through opacity-75')}
      value={innerValue}
      onChange={handleChange}
    />
  )
}
