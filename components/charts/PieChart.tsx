import React, { useState } from 'react'
import Pie, { ProvidedProps, PieArcDatum } from '@visx/shape/lib/shapes/Pie'
import { scaleOrdinal } from '@visx/scale'
import { Group } from '@visx/group'
import { GradientPinkBlue } from '@visx/gradient'
import { animated, useTransition, interpolate } from '@react-spring/web'

export interface PieChartDatum {
  key: string
  value: number
}

const getValue = (d: PieChartDatum) => d.value

const defaultMargin = { top: 20, right: 20, bottom: 20, left: 20 }

export type PieProps = {
  width: number
  data: PieChartDatum[]
  height: number
  margin?: typeof defaultMargin
  animate?: boolean
}

export default function PieChart({
  width,
  height,
  data,
  margin = defaultMargin,
  animate = true,
}: PieProps) {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)

  if (width < 10) return null

  const assetLabels = Object.keys(data)

  // color scales
  const getAssetColor = scaleOrdinal({
    domain: assetLabels,
    range: [
      // 'rgba(255,255,255,0.7)',
      // 'rgba(255,255,255,0.6)',
      'rgba(255,255,255,0.5)',
      'rgba(255,255,255,0.4)',
      'rgba(255,255,255,0.3)',
      'rgba(255,255,255,0.2)',
      'rgba(255,255,255,0.1)',
    ],
  })

  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom
  const radius = Math.min(innerWidth, innerHeight) / 2
  const centerY = innerHeight / 2
  const centerX = innerWidth / 2
  const donutThickness = 80

  return (
    <svg width={width} height={height}>
      <GradientPinkBlue id="pie-bg-gradient" />
      {/* <rect
        rx={14}
        width={width}
        height={height}
        fill="url('#pie-bg-gradient')"
      /> */}
      <Group top={centerY + margin.top} left={centerX + margin.left}>
        <Pie<PieChartDatum>
          data={data}
          pieValue={getValue}
          outerRadius={radius}
          innerRadius={radius - donutThickness}
          cornerRadius={3}
          padAngle={0.005}
        >
          {(pie) => (
            <AnimatedPie<PieChartDatum>
              {...pie}
              animate={animate}
              getKey={(arc) => arc.data.key}
              onClickDatum={({ data: { key: label } }) =>
                animate &&
                setSelectedAsset(
                  selectedAsset && selectedAsset === label ? null : label,
                )
              }
              getColor={(arc) => getAssetColor(arc.data.key)}
            />
          )}
        </Pie>
      </Group>
    </svg>
  )
}

type AnimatedStyles = { startAngle: number; endAngle: number; opacity: number }

const fromLeaveTransition = ({ endAngle }: PieArcDatum<any>) => ({
  // enter from 360° if end angle is > 180°
  startAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  endAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  opacity: 0,
})
const enterUpdateTransition = ({ startAngle, endAngle }: PieArcDatum<any>) => ({
  startAngle,
  endAngle,
  opacity: 1,
})

type AnimatedPieProps<Datum> = ProvidedProps<Datum> & {
  animate?: boolean
  getKey: (d: PieArcDatum<Datum>) => string
  getColor: (d: PieArcDatum<Datum>) => string
  onClickDatum: (d: PieArcDatum<Datum>) => void
  delay?: number
}

function AnimatedPie<Datum>({
  animate,
  arcs,
  path,
  getKey,
  getColor,
  onClickDatum,
}: AnimatedPieProps<Datum>) {
  const transitions = useTransition<PieArcDatum<Datum>, AnimatedStyles>(arcs, {
    from: animate ? fromLeaveTransition : enterUpdateTransition,
    enter: enterUpdateTransition,
    update: enterUpdateTransition,
    leave: animate ? fromLeaveTransition : enterUpdateTransition,
    keys: getKey,
  })
  return transitions((props, arc, { key }) => {
    const [centroidX, centroidY] = path.centroid(arc)
    const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1

    return (
      <g key={key}>
        <animated.path
          // compute interpolated path d attribute from intermediate angle values
          d={interpolate(
            [props.startAngle, props.endAngle],
            (startAngle, endAngle) =>
              path({
                ...arc,
                startAngle,
                endAngle,
              }),
          )}
          fill={getColor(arc)}
          onClick={() => onClickDatum(arc)}
          onTouchStart={() => onClickDatum(arc)}
        />
        {hasSpaceForLabel && (
          <animated.g style={{ opacity: props.opacity }}>
            <text
              fontFamily="Jokker"
              fill="white"
              x={centroidX}
              y={centroidY}
              dy=".33em"
              fontSize={14}
              textAnchor="middle"
              pointerEvents="none"
            >
              {getKey(arc)}
            </text>
          </animated.g>
        )}
      </g>
    )
  })
}
