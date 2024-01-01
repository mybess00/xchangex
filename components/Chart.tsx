'use client'

import '../styles/Chart.css'
import SelectCurrency from "./ui/SelectCurrency"
import { useRef, useEffect, useState, RefObject } from 'react'
import { createChart, UTCTimestamp } from 'lightweight-charts'
import { ApiResponse } from '@/app/api/chart/route'
import { CHART_CURRENCIES } from './ui/SelectCurrency'

type DataGraph = {
  time: UTCTimestamp ,
  value: number,
}

const GRAPH_OPTIONS = {
  UPDATE: 'update',
  CREATE: 'create'
}

export default function Chart () {
  const coinRef = useRef(null)
  const containerChartRef : RefObject<HTMLDivElement> = useRef(null)
  const [coin, setCoin] = useState('')
  const handleChange = () => {
    if (coinRef.current) {
      const coinSelect: HTMLSelectElement = coinRef.current
      console.log(coinSelect.value)
      setCoin(coinSelect.value)
    }
  }

  const fetchDataGraph = async () => {
    const response = await fetch('api/chart', {
      method: 'POST',
      headers: { 'Content-Type' : 'application/json' },
      body: JSON.stringify({
        'coin': coin
      })
    })
    if (!response.ok) {
      console.log(response)
      throw new Error('Error 008: POST on components/Chart.tsx')
    }
    const res : ApiResponse = await response.json()
    return res
  }

  useEffect(() => {
    if (containerChartRef.current && coin !== 'placeholder' && coin !== '') {
      containerChartRef.current.innerHTML = ''
      const chart = createChart(containerChartRef.current)
      const areaSeries = chart.addAreaSeries({
        topColor: 'rgba(33, 150, 243, 0.56)',
        bottomColor: 'rgba(33, 150, 243, 0.04)',
        lineColor: 'rgba(33, 150, 243, 1)',
        lineWidth: 2,
      });
      const dataGraph : DataGraph[] = [] 
      const createGraph = async () => {
        const data = await fetchDataGraph()
        const dataLimit = 20
        if (data.graph.length > dataLimit) {
          const dataLenght =  data.graph.length
          for(let i = 1; i<=dataLimit; i++){
            let newIndex = Math.floor(dataLenght/dataLimit*i)
            if (i == dataLimit) {
              newIndex--
            }
            const value = data.graph[newIndex].price
            const time = new Date(data.graph[newIndex].date).getTime()/1000 as UTCTimestamp
            dataGraph.push({time, value})
          }
        } else {
          data.graph.forEach(({price, date}) => {
            const value = price
            const time = new Date(date).getTime()/1000 as UTCTimestamp
            dataGraph.push({time, value})
          })
        }
      }
      createGraph().then(() => {
        areaSeries.setData(dataGraph)
        chart.timeScale().fitContent();
      })
    }  
  }, [coin])

  return (
    <section className="ct-chart">
      <div className='ct-chart-title'>
        <h2>Coin Price Over Time</h2>
        <p>All data from the selected currency is aginst USD. In case of USD is against EUR. For MLC is against CUP.</p>
        <SelectCurrency aRef={coinRef} eventChange={handleChange} currencyPack={CHART_CURRENCIES}/>
      </div>
      <div ref={containerChartRef} className='container-chart'>
        
      </div>
    </section>
  )
}