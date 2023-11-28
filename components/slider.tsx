import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'

const Slider = ({
  value,
  onValueChange,
  segments,
  segmentsVisible = false,
  renderControl,
  minPosition = 0,
}: {
  value: number
  onValueChange: (value: number) => void
  segments?: number
  segmentsVisible?: boolean
  renderControl?: () => JSX.Element
  minPosition?: number
} & React.HTMLAttributes<HTMLDivElement> &
  React.PropsWithChildren) => {
  value = Math.max(value, 0)
  if (segments) {
    segments -= 1
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

  return (
    <motion.div ref={ref} className="relative flex items-center h-[2.75rem]">
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
          className="relative flex-1 overflow-hidden"
          initial={{
            height: 4,
            borderRadius: 2,
          }}
          animate={{
            height: dragged || hovered ? 14 : 4,
            borderRadius: dragged || hovered ? 14 : 4,
          }}
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
              length: segments && segmentsVisible ? segments : 0,
            }).map((_, i) => (
              <div
                key={`${i}`}
                className="relative z-0 flex-1 h-full"
                style={{
                  background: '#D1D5DB',
                }}
              ></div>
            ))}
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
