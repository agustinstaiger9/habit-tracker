import { useState, useEffect } from "react"
import type { Habit } from "../types/habit"
import HabitChart from "./HabitChart"
import "../styles/habitTracker.css"

const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday"
] as const

export default function HabitTracker(){

  const [habits,setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem("habits")
    return saved ? JSON.parse(saved) : []
  })
  const [newHabit,setNewHabit] = useState("")

  useEffect(()=>{
    localStorage.setItem("habits",JSON.stringify(habits))
  },[habits])

  const addHabit = () => {

    if(!newHabit.trim()) return

    const habit:Habit = {
      id:crypto.randomUUID(),
      name:newHabit,
      days:{
        monday:false,
        tuesday:false,
        wednesday:false,
        thursday:false,
        friday:false,
        saturday:false,
        sunday:false
      }
    }

    setHabits([...habits,habit])
    setNewHabit("")
  }

  const deleteHabit = (id:string)=>{
    setHabits(habits.filter(h=>h.id !== id))
  }

  const toggleDay = (habitId:string,day:keyof Habit["days"])=>{

    setHabits(prev =>
      prev.map(h =>
        h.id === habitId
          ? {
              ...h,
              days:{
                ...h.days,
                [day]:!h.days[day]
              }
            }
          : h
      )
    )

  }

  const chartData = [
    {day:"Mon",completed:habits.filter(h=>h.days.monday).length},
    {day:"Tue",completed:habits.filter(h=>h.days.tuesday).length},
    {day:"Wed",completed:habits.filter(h=>h.days.wednesday).length},
    {day:"Thu",completed:habits.filter(h=>h.days.thursday).length},
    {day:"Fri",completed:habits.filter(h=>h.days.friday).length},
    {day:"Sat",completed:habits.filter(h=>h.days.saturday).length},
    {day:"Sun",completed:habits.filter(h=>h.days.sunday).length}
  ]

  /* NUEVAS ESTADISTICAS */

  const totalHabits = habits.length

  const totalCompleted = habits.reduce((acc,habit)=>{
    return acc + Object.values(habit.days).filter(Boolean).length
  },0)

  const totalPossible = totalHabits * 7

  const completionRate = totalPossible === 0
    ? 0
    : Math.round((totalCompleted / totalPossible) * 100)

  return(

    <div className="container">

      <h1>HABIT TRACKER</h1>

      <div className="addHabit">

        <input
          value={newHabit}
          onChange={(e)=>setNewHabit(e.target.value)}
          onKeyDown={(e)=>{
            if(e.key === "Enter"){
              addHabit()
            }
          }}
          placeholder="New habit"
        />

        <button onClick={addHabit}>
          Add
        </button>

      </div>

      <div className="table">

        <div className="header">

          <span>Habit</span>

          {days.map(day=>(
            <span key={day}>
              {day.slice(0,3)}
            </span>
          ))}

          <span>Delete</span>

        </div>

        {habits.map(habit=>(

          <div className="row" key={habit.id}>

            <span className="habitName">
              {habit.name}
            </span>

            {days.map(day=>(

              <input
                key={day}
                type="checkbox"
                checked={habit.days[day]}
                onChange={()=>toggleDay(habit.id,day)}
              />

            ))}

            <button
              className="delete"
              onClick={()=>deleteHabit(habit.id)}
            >
              X
            </button>

          </div>

        ))}

      </div>

      {/* NUEVO BLOQUE DE STATS */}

      <div className="stats">

        <div>
          <span>Total habits</span>
          <strong>{totalHabits}</strong>
        </div>

        <div>
          <span>Completed</span>
          <strong>{totalCompleted}</strong>
        </div>

        <div>
          <span>Completion rate</span>
          <strong>{completionRate}%</strong>
        </div>

      </div>

      <h2 className="chartTitle">
        WEEKLY PROGRESS
      </h2>

      <HabitChart data={chartData}/>

    </div>

  )
}