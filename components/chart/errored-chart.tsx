import React from 'react'

import { CHART_RESOLUTION_TABLE } from '../../utils/chart'
import { ErroredChartModel, TimePeriod } from '../../model/chart'

export const ErroredChart = ({
  chart,
  periodList,
}: {
  chart: ErroredChartModel
  periodList: TimePeriod[]
}) => {
  return (
    <div className="flex flex-col rounded-2xl flex-shrink-0 bg-white dark:bg-gray-900 w-full p-4 sm:p-6">
      <div className="flex items-start flex-grow shrink-0 basis-0">
        <div className="flex-1 flex flex-col items-start gap-1 flex-grow shrink-0 basis-0">
          <div className="text-xs sm:text-sm text-gray-500">Mark Price</div>
          <div className="flex items-end gap-1">
            <div className="font-semibold sm:text-lg">-</div>
          </div>
        </div>
        <div className="flex-1 flex items-start ">
          <div className="flex ml-auto gap-1 sm:gap-2">
            {periodList.map((_timePeriod) => (
              <button
                key={_timePeriod}
                className="text-xs sm:text-sm flex px-2 py-1 flex-col justify-center items-center gap-2.5 min-w-[40px] rounded-2xl"
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
          width={chart.dimensions.width}
          height={chart.dimensions.height}
          style={{ minWidth: '100%' }}
        />
      </div>
    </div>
  )
}
