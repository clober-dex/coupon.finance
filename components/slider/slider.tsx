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
  leftPaddingPercentage = 0,
  value,
  onValueChange,
  disabled,
  children,
}: {
  length: number
  leftPaddingPercentage?: number
  value: number
  onValueChange: (value: number) => void
  disabled?: boolean
} & React.HTMLAttributes<HTMLDivElement> &
  React.PropsWithChildren) => {
  leftPaddingPercentage = Math.min(100, leftPaddingPercentage)
  const sliderRef = useRef<HTMLDivElement | null>(null)
  const thumbRef = useRef<HTMLDivElement | null>(null)
  const diff = useRef<number>(0)
  const unit = 100 / (length - 1)

  const [position, _setPosition] = React.useState<number>(
    Math.max(Math.min(100, (value - 1) * unit), leftPaddingPercentage),
  )
  const setPosition = useCallback(
    (position: number) => {
      _setPosition(position)
      onValueChange(Math.floor(position / unit) + 1)
    },
    [onValueChange, unit],
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
      const newPosition = Math.floor((100 * newX) / end)
      setPosition(
        Math.max(Math.round(newPosition / unit) * unit, leftPaddingPercentage),
      )
    },
    [disabled, leftPaddingPercentage, setPosition, unit],
  )

  useEffect(() => {
    if (thumbRef.current) {
      thumbRef.current.style.left = `${position}%`
    }
  }, [position, thumbRef])

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
