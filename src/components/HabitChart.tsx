import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

type Props = {
  data:{
    day:string
    completed:number
  }[]
}

export default function HabitChart({data}:Props){

  return(

  <div className="chartContainer">

    <ResponsiveContainer width="100%" height={300}>

      <BarChart data={data}>

    

        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          allowDecimals={false}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip />

        <Bar
          dataKey="completed"
          fill="hsl(133, 89%, 63%)"
          radius={[6,6,0,0]}
        />

      </BarChart>

    </ResponsiveContainer>

  </div>

)
}