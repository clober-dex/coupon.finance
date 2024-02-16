import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'

const TickMark = ({
  label,
  width,
  disabled,
  position,
}: {
  label: string | undefined
  width: number
  disabled: boolean
  position: number
}) => {
  const right = Math.floor(width / 2)
  return (
    <React.Fragment key={`${position}-${right}`}>
      <div
        className={`absolute h-6 ${
          disabled ? '' : 'group-hover:h-9'
        } w-[2px] bg-gray-400 rounded-sm z-[1] -top-2.5`}
        style={{
          left: `${position}%`,
        }}
      >
        {label ? (
          <div
            className={`absolute -top-8 w-[${width}px] -right-[${right}px] flex h-6 px-2 py-1 justify-center items-center gap-1 rounded-2xl bg-green-500 bg-opacity-10 text-xs text-green-500 font-bold`}
          >
            {label}
          </div>
        ) : (
          <></>
        )}
      </div>
      <div
        className="relative z-0 flex-1 h-full"
        style={{
          background: '#D1D5DB',
        }}
      />
    </React.Fragment>
  )
}

const Slider = ({
  value,
  onValueChange,
  segments,
  segmentsVisible = false,
  renderControl,
  minPosition = 0,
  tickMarks,
  disabled,
}: {
  value: number
  onValueChange: (value: number) => void
  segments?: number
  segmentsVisible?: boolean
  renderControl?: () => JSX.Element
  minPosition?: number
  disabled?: boolean
  tickMarks?: { value: number; width: number; label: string | undefined }[]
} & React.HTMLAttributes<HTMLDivElement> &
  React.PropsWithChildren) => {
  value = Math.max(value, 0)
  if (segments) {
    segments -= 1
  }

  const initialValue = {
    height: 4,
    borderRadius: 4,
  }
  const ref = useRef<HTMLDivElement>(null)
  const startValue = useRef(value)

  const [hovered, setHovered] = useState(false)
  const [dragged, setDragged] = useState(false)

  let renderedValue = value
  if (segments) {
    const seg = 100 / segments
    renderedValue = Math.round(value * seg)
  }
  if (minPosition > 0) {
    renderedValue = minPosition + ((100 - minPosition) / 100) * renderedValue
  }

  const lastTickMark = tickMarks?.find(({ value }) => value === segments)

  return (
    <motion.div
      ref={ref}
      className="group relative flex items-center h-[2.75rem]"
    >
      <motion.div
        drag="x"
        dragConstraints={ref}
        dragMomentum={false}
        dragElastic={0}
        dragPropagation={true}
        onDrag={(e, info) => {
          if (!ref.current) {
            return
          }
          const containerWidth = ref.current.getBoundingClientRect().width
          let value =
            startValue.current + (info.offset.x / containerWidth) * 100
          value = Math.min(value, 100)
          value = Math.max(value, 0)

          if (segments) {
            const seg = 100 / segments
            const segementIndex = Math.round(value / seg)
            value = segementIndex * seg
            onValueChange(segementIndex)
          } else {
            value = Math.round(value)
            onValueChange(value)
          }
        }}
        onDragStart={() => {
          if (segments) {
            const seg = 100 / segments
            startValue.current = Math.round(value * seg)
          } else {
            startValue.current = Math.round(value)
          }
          setDragged(true)
        }}
        onDragEnd={() => setDragged(false)}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        className="relative flex items-center flex-1 h-full"
      >
        <motion.div
          className="relative flex-1"
          initial={initialValue}
          animate={
            disabled
              ? initialValue
              : {
                  height: dragged || hovered ? 14 : initialValue.height,
                  borderRadius:
                    dragged || hovered ? 14 : initialValue.borderRadius,
                }
          }
        >
          <div
            className="relative flex flex-1 h-full gap-[1px]"
            style={{
              background:
                segments && segmentsVisible ? 'transparent' : '#D1D5DB',
            }}
          >
            {minPosition > 0 && <div style={{ width: `${minPosition}%` }} />}
            {Array.from({
              length: segments && tickMarks ? segments : 0,
            }).map((_, i) => {
              const tickMark = tickMarks?.find(({ value }) => value === i)
              return segments && tickMark ? (
                <TickMark
                  label={tickMark.label}
                  width={tickMark.width}
                  disabled={disabled ?? false}
                  position={Math.floor((i * 100) / segments)}
                  key={i}
                />
              ) : null
            })}
            {segments && lastTickMark ? (
              <TickMark
                label={lastTickMark.label}
                width={lastTickMark.width}
                disabled={disabled ?? false}
                position={100}
                key={100}
              />
            ) : (
              <></>
            )}
          </div>

          <motion.div
            className="absolute inset-0"
            animate={{
              width: `${renderedValue}%`,
            }}
            transition={{ type: 'tween' }}
            style={{
              background: '#22C55E',
            }}
          />
        </motion.div>

        <motion.div
          className="absolute inset-0"
          animate={{
            width: `${renderedValue}%`,
          }}
          transition={{ type: 'tween' }}
        >
          <div
            className="absolute right-0"
            style={{
              top: '50%',
              transform: 'translate(50%, -50%)',
            }}
          >
            {renderControl ? renderControl() : <></>}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default Slider
