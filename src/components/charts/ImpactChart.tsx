import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface ImpactData {
  date: string;
  hours: number;
  events: number;
}

interface ImpactChartProps {
  data: ImpactData[];
}

function ImpactChart({ data }: ImpactChartProps) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d946ef" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => format(new Date(date), 'MMM d')}
            className="text-gray-600"
          />
          <YAxis className="text-gray-600" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
            labelFormatter={(date) => format(new Date(date), 'MMMM d, yyyy')}
          />
          <Area
            type="monotone"
            dataKey="hours"
            stroke="#0ea5e9"
            fillOpacity={1}
            fill="url(#colorHours)"
            strokeWidth={2}
            name="Volunteer Hours"
          />
          <Area
            type="monotone"
            dataKey="events"
            stroke="#d946ef"
            fillOpacity={1}
            fill="url(#colorEvents)"
            strokeWidth={2}
            name="Events Attended"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ImpactChart;