import React, { useCallback, useEffect, useRef } from 'react'

const Line = ({ position }: { position: number }) => {
  const fillColor = '#45D87F'
  const emptyColor = '#D1D5DB'
  return (
    <div
      style={{
        height: '0.25rem',
        flex: 1,
        background: `linear-gradient(
      to right,
      ${fillColor} ${position}%, ${fillColor} ${position}%, ${fillColor} ${position}%, ${emptyColor} ${position}%, ${emptyColor} 100%)`,
      }}
    />
  )
}

const Slider = ({
  length,
  minPosition = 0,
  value,
  onValueChange,
  disabled,
  children,
}: {
  length: number
  minPosition?: number
  value: number
  onValueChange: (value: number) => void
  disabled?: boolean
} & React.HTMLAttributes<HTMLDivElement> &
  React.PropsWithChildren) => {
  minPosition = Math.min(100, minPosition)
  const sliderRef = useRef<HTMLDivElement | null>(null)
  const thumbRef = useRef<HTMLDivElement | null>(null)
  const diff = useRef<number>(0)
  const unit = (100 - minPosition) / (length - 1)

  const [position, _setPosition] = React.useState<number>(0)
  const setPosition = useCallback(
    (position: number) => {
      _setPosition(position)
      onValueChange(Math.min(Math.floor(position / unit) + 1, length))
    },
    [length, onValueChange, unit],
  )

  const handleMove = useCallback(
    (clientX: number) => {
      if (disabled || !sliderRef?.current || !thumbRef?.current) {
        return
      }
      let newX =
        clientX - diff.current - sliderRef.current.getBoundingClientRect().left
      const end = sliderRef.current.offsetWidth - thumbRef.current.offsetWidth
      const start = 0
      if (newX < start) {
        newX = 0
      }
      if (newX > end) {
        newX = end
      }
      const newPosition = Math.ceil((newX / end) * (100 - minPosition))
      setPosition(Math.round(newPosition / unit) * unit + minPosition)
    },
    [disabled, minPosition, setPosition, unit],
  )

  useEffect(() => {
    if (thumbRef.current) {
      thumbRef.current.style.left = `${position}%`
    }
  }, [position, thumbRef])

  useEffect(() => {
    const newPosition = unit * (value - 1)
    setPosition(Math.round(newPosition / unit) * unit + minPosition)
  }, [minPosition, setPosition, unit, value])

  useEffect(() => {
    if (disabled) {
      setPosition(0)
    }
  }, [disabled, onValueChange, setPosition])

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      handleMove(event.clientX)
    },
    [handleMove],
  )
  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mouseup', handleMouseUp)
    document.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (thumbRef.current) {
        diff.current =
          event.clientX - thumbRef.current.getBoundingClientRect().left
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
      }
    },
    [thumbRef, handleMouseMove, handleMouseUp],
  )

  const handleSliderClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      handleMove(event.clientX)
    },
    [handleMove],
  )

  return (
    <div
      className="flex relative items-center justify-center min-h-[2.75rem]"
      ref={sliderRef}
      onClick={handleSliderClick}
    >
      <Line position={position * 4} />
      <Line position={(position - 25) * 4} />
      <Line position={(position - 50) * 4} />
      <Line position={(position - 75) * 4} />
      <div
        className={`flex flex-col items-center absolute left-[${position}%]`}
        ref={thumbRef}
        onMouseDown={handleMouseDown}
      >
        <div
          className={`top-1/2 absolute rounded-2xl select-none cursor-grab -translate-x-[${
            50 - position
          }%] -translate-y-1/2`}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default Slider
