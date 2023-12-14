'use client'

import '../styles/CurrencyDetails.css'
import SelectCurrency from './ui/SelectCurrency'
import { useRef } from 'react'

export default function CurrencyDetails () {
  const coinSelectedRef = useRef(null)
  const coinPairRef = useRef(null)

  return (
    <section className="ct-currency">
      <h2>Currency Details</h2>
      <div className='ct-currency-select'>
        <SelectCurrency title='Coin' aRef={coinSelectedRef}/>
        <SelectCurrency title='Pair' aRef={coinPairRef}/>
      </div>
      <div className='rate-detail'>
        <p>Rate: </p>
        <span></span>
      </div>
      <h4>Last Prices</h4>
      <div className='ct-currency-result'>
        <div className='ct-price-detail'>
          <div className='price-detail'>
            <p>Current: </p>
            <span></span>
          </div>
          <div className='price-detail'>
            <p>1 hour: </p>
            <span></span>
          </div>
          <div className='price-detail'>
            <p>8 hour: </p>
            <span></span>
          </div>
        </div>
        <div className='ct-price-detail'>
          <div className='price-detail'>
            <p>24 hour: </p>
            <span></span>
          </div>
          <div className='price-detail'>
            <p>7 day: </p>
            <span></span>
          </div>
          <div className='price-detail'>
            <p>1 month: </p>
            <span></span>
          </div>
        </div>
      </div>
    </section> 
  )
}