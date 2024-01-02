import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { curveCardinal } from 'd3-shape'
import { Line } from '@visx/shape'
import { GlyphCircle } from '@visx/glyph'
import { AxisBottom } from '@visx/axis'
import { EventType } from '@visx/event/lib/types'
import { localPoint } from '@visx/event'

import { Currency } from '../../model/currency'
import {
  ChartModel,
  PricePoint,
  TimePeriod,
  TimestampFormatterType,
} from '../../model/chart'
import {
  CHART_RESOLUTION_TABLE,
  getNearestPricePoint,
  getTicks,
} from '../../utils/chart'
import { getTimestampFormatter } from '../../utils/date'

import AnimatedInLineChart from './AnimatedInLineChart'

export const ChartWrapper = ({
  chart,
  periodList,
  timePeriod,
  setTimePeriod,
  currency,
}: {
  chart: ChartModel
  periodList: TimePeriod[]
  timePeriod: TimePeriod
  setTimePeriod: (timePeriod: TimePeriod) => void
  currency: Currency
}) => {
  const { prices, timeScale, priceScale, dimensions, lastValidPrice } = chart
  const { ticks, tickTimestampFormatter, crosshairTimestampFormatter } =
    useMemo(() => {
      // Limits the number of ticks based on graph width
      const maxTicks = Math.floor(dimensions.width / 100)

      const userLocale =
        navigator.languages && navigator.languages.length
          ? navigator.languages[0]
          : navigator.language
      const ticks = getTicks(
        chart.startingPrice.timestamp,
        chart.endingPrice.timestamp,
        timePeriod,
        maxTicks,
      )
      const tickTimestampFormatter = getTimestampFormatter(
        timePeriod,
        userLocale,
        TimestampFormatterType.TICK,
      )
      const crosshairTimestampFormatter = getTimestampFormatter(
        timePeriod,
        userLocale,
        TimestampFormatterType.CROSSHAIR,
      )

      return { ticks, tickTimestampFormatter, crosshairTimestampFormatter }
    }, [
      dimensions.width,
      chart.startingPrice.timestamp,
      chart.endingPrice.timestamp,
      timePeriod,
    ])

  const [crosshair, setCrosshair] = useState<{
    x: number
    y: number
    price: PricePoint
  }>()
  const resetCrosshair = useCallback(
    () => setCrosshair(undefined),
    [setCrosshair],
  )

  const setCrosshairOnHover = useCallback(
    (event: Element | EventType) => {
      const { x } = localPoint(event) || { x: 0 }
      const price = getNearestPricePoint(x, prices, timeScale)

      if (price) {
        const x = timeScale(price.timestamp)
        const y = priceScale(price.value)
        setCrosshair({ x, y, price })
      }
    },
    [priceScale, timeScale, prices],
  )

  // Resets the crosshair when the time period is changed, to avoid stale UI
  useEffect(() => resetCrosshair(), [resetCrosshair, timePeriod])

  const crosshairEdgeMax = dimensions.width * 0.85
  const crosshairAtEdge = !!crosshair && crosshair.x > crosshairEdgeMax

  // Default curve doesn't look good for the HOUR chart.
  // Higher values make the curve more rigid, lower values smooth the curve but make it less "sticky" to real data points,
  // making it unacceptable for shorter durations / smaller variances.
  const curveTension = timePeriod === TimePeriod.HOUR ? 1 : 0.9

  const getX = useCallback(
    (p: PricePoint) => timeScale(p.timestamp),
    [timeScale],
  )
  const getY = useCallback((p: PricePoint) => priceScale(p.value), [priceScale])
  const curve = useMemo(
    () => curveCardinal.tension(curveTension),
    [curveTension],
  )

  return (
    <div className="flex flex-col rounded-2xl flex-shrink-0 bg-white dark:bg-gray-900 w-full p-4 sm:p-6">
      <div className="flex items-start flex-grow shrink-0 basis-0">
        <div className="flex-1 flex flex-col items-start gap-1 flex-grow shrink-0 basis-0">
          <div className="text-xs sm:text-sm text-gray-500">
            Current Price ({currency.symbol})
          </div>
          <div className="flex items-end gap-1">
            <div className="font-semibold sm:text-lg">
              $
              {(crosshair
                ? crosshair.price.value
                : lastValidPrice.value
              ).toFixed(2)}
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-start ">
          <div className="flex ml-auto gap-1 sm:gap-2">
            {periodList.map((_timePeriod) => (
              <button
                key={_timePeriod}
                onClick={() => setTimePeriod(_timePeriod)}
                className={`text-xs sm:text-sm flex px-2 py-1 flex-col justify-center items-center gap-2.5 min-w-[40px] rounded-2xl ${
                  timePeriod === _timePeriod
                    ? 'bg-gray-100 dark:bg-gray-700'
                    : ''
                }`}
              >
                {CHART_RESOLUTION_TABLE[_timePeriod].label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <svg
          data-cy="price-chart"
          width={dimensions.width}
          height={dimensions.height}
          style={{ minWidth: '100%' }}
        >
          <AnimatedInLineChart
            data={prices}
            getX={getX}
            getY={getY}
            marginTop={dimensions.marginTop}
            curve={curve}
            strokeWidth={2}
          />
          {crosshair !== undefined ? (
            <g>
              <AxisBottom
                top={dimensions.height + 5}
                scale={timeScale}
                stroke="#FFFFFF12"
                hideTicks={true}
                tickValues={ticks}
                tickFormat={tickTimestampFormatter}
                tickLabelProps={() => ({
                  fill: '#9B9B9B',
                  fontSize: 12,
                  textAnchor: 'middle',
                  transform: 'translate(0 -29)',
                })}
              />
              <text
                x={crosshair.x + (crosshairAtEdge ? -4 : 4)}
                y={10}
                textAnchor={crosshairAtEdge ? 'end' : 'start'}
                fontSize={12}
                fill="#9B9B9B"
              >
                {crosshairTimestampFormatter(crosshair.price.timestamp)}
              </text>
              <Line
                from={{ x: crosshair.x, y: 0 }}
                to={{ x: crosshair.x, y: dimensions.height }}
                stroke="#FFFFFF12"
                strokeWidth={1}
                pointerEvents="none"
                strokeDasharray="4,4"
              />
              <GlyphCircle
                left={crosshair.x}
                top={crosshair.y + dimensions.marginTop}
                size={50}
                fill="#22C55E"
                stroke="#FFFFFF12"
                strokeWidth={0.5}
              />
            </g>
          ) : (
            <AxisBottom
              hideAxisLine={true}
              scale={timeScale}
              stroke="#FFFFFF12"
              top={dimensions.height - 1}
              hideTicks
            />
          )}
          <rect
            x={0}
            y={0}
            width={dimensions.width}
            height={dimensions.height}
            fill="transparent"
            onTouchStart={setCrosshairOnHover}
            onTouchMove={setCrosshairOnHover}
            onMouseMove={setCrosshairOnHover}
            onMouseLeave={resetCrosshair}
          />
        </svg>
      </div>
    </div>
  )
}
