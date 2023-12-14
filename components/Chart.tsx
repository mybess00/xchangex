'use client'

import '../styles/Chart.css'
import SelectCurrency from "./ui/SelectCurrency"
import { useRef, useEffect, useState } from 'react'

export default function Chart () {
  const coinRef = useRef(null)
  const [coin, setCoin] = useState('')
  const handleChange = () => {
    if (coinRef.current) {
      setCoin(coinRef.current.value)
    }
  }

  useEffect(() => {
    // Cambiar grafico
    console.log(coin)
  }, [coin])

  return (
    <section className="ct-chart">
      <div className='ct-chart-title'>
        <h2>Coin Price Over Time</h2>
        <SelectCurrency aRef={coinRef} eventChange={handleChange}/>
      </div>
      {/*Grafico buscar api que grafique*/}
    </section>
  )
}