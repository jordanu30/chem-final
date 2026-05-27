'use client'

import {
  ComposedChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

const sucroseData = [
  { m: 0, tf: 0 },
  { m: 0.1, tf: 1.00 },
  { m: 0.2, tf: 1.55 },
  { m: 0.4, tf: 1.95 },
  { m: 0.6, tf: 2.40 },
]

const naclData = [
  { m: 0, tf: 0 },
  { m: 0.1, tf: 0.95 },
  { m: 0.2, tf: 0.90 },
  { m: 0.4, tf: 5.60 },
  { m: 0.6, tf: 4.20 },
]

const cacl2Data = [
  { m: 0, tf: 0 },
  { m: 0.1, tf: 1.45 },
  { m: 0.2, tf: 2.05 },
  { m: 0.4, tf: 3.45 },
  { m: 0.6, tf: 5.50 },
]

const sucroseTrend = [
  { m: 0, trend_s: 0 },
  { m: 0.6, trend_s: 3.6 * 0.6 },
]

const naclTrend = [
  { m: 0, trend_n: 0 },
  { m: 0.6, trend_n: 8.65 * 0.6 },
]

const cacl2Trend = [
  { m: 0, trend_c: 0 },
  { m: 0.6, trend_c: 8.61 * 0.6 },
]

interface TooltipPayload {
  name: string
  value: number
  color: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null
  const entry = payload[0]
  return (
    <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm shadow-lg">
      <p style={{ color: entry.color }} className="font-bold mb-1">{entry.name}</p>
      <p className="text-gray-600">Molality: <span className="text-gray-900 font-mono font-semibold">{entry.value} m</span></p>
      <p className="text-gray-600">|ΔTf|: <span className="text-gray-900 font-mono font-semibold">{payload[1]?.value?.toFixed(2)} °C</span></p>
    </div>
  )
}

export default function FreezeGraph() {
  return (
    <div className="w-full h-[420px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart margin={{ top: 20, right: 30, bottom: 30, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.07)" />
          <XAxis
            dataKey="m"
            type="number"
            domain={[0, 0.65]}
            tickCount={7}
            label={{ value: 'Molality (m)', position: 'insideBottom', offset: -14, fill: '#6b7280', fontSize: 13 }}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            stroke="rgba(0,0,0,0.15)"
          />
          <YAxis
            dataKey="tf"
            type="number"
            domain={[0, 7]}
            label={{ value: '|ΔTf| (°C)', angle: -90, position: 'insideLeft', offset: 10, fill: '#6b7280', fontSize: 13 }}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            stroke="rgba(0,0,0,0.15)"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '16px' }}
            formatter={(value) => <span style={{ color: '#374151', fontSize: 13 }}>{value}</span>}
          />
          <ReferenceLine y={0} stroke="rgba(0,0,0,0.08)" />

          {/* Trendlines */}
          <Line
            data={sucroseTrend}
            dataKey="trend_s"
            dot={false}
            stroke="#4ecdc4"
            strokeWidth={2}
            strokeDasharray="6 3"
            name="Sucrose trend"
            legendType="none"
          />
          <Line
            data={naclTrend}
            dataKey="trend_n"
            dot={false}
            stroke="#45b7d1"
            strokeWidth={2}
            strokeDasharray="6 3"
            name="NaCl trend"
            legendType="none"
          />
          <Line
            data={cacl2Trend}
            dataKey="trend_c"
            dot={false}
            stroke="#ff6b6b"
            strokeWidth={2}
            strokeDasharray="6 3"
            name="CaCl₂ trend"
            legendType="none"
          />

          {/* Data points */}
          <Scatter
            name="Sucrose (i=1, slope=3.6, R²=0.875)"
            data={sucroseData}
            fill="#4ecdc4"
            r={7}
          />
          <Scatter
            name="NaCl (i=2, slope=8.65, R²=0.736)"
            data={naclData}
            fill="#45b7d1"
            r={7}
          />
          <Scatter
            name="CaCl₂·2H₂O (i=3, slope=8.61, R²=0.986)"
            data={cacl2Data}
            fill="#ff6b6b"
            r={7}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
