'use client'

import '../styles/Calculator.css'
import { useRef } from 'react'
import { usePrice } from '../hooks/usePrice'
import SelectCurrency from "./ui/SelectCurrency"

export default function Calculator () {
  const amountRef = useRef(null)
  const spanResultRef = useRef(null)
  const fromCurrencyRef = useRef(null)
  const toCurrencyRef = useRef(null)
  const spanRateRef = useRef(null)
  const dataPrice = usePrice()

  const calculate = async () => {
    if (!amountRef.current || !fromCurrencyRef.current || !toCurrencyRef.current || !spanResultRef.current || !spanRateRef.current) {
      return
    }
    const amountInput: HTMLInputElement = amountRef.current
    const fromCurrency: HTMLSelectElement = fromCurrencyRef.current
    const toCurrency: HTMLSelectElement = toCurrencyRef.current
    const amountValue = amountInput.value
    const fromValue = fromCurrency.value
    const toValue = toCurrency.value
    //Validar los valores amountValue, fromValue, toValue
    const amountRegex = /^[0-9.]+$/
    if (amountValue == '' || !amountRegex.test(amountValue) || fromValue == '' || fromValue == 'placeholder' || toValue == '' || toValue == 'placeholder') {
      alert('Debe introducir un monto y seleccionar dos monedas')
      return
    }
    const ctSpan : HTMLDivElement = spanResultRef.current
    const ctSpanRate : HTMLSpanElement = spanRateRef.current
    const span = ctSpan.querySelector('span')
    const spanRate = ctSpanRate.querySelector('span')
    if (!span || !spanRate) {
      return
    }
    try {
      let isWorking = true;
      const animate = () => {
        setTimeout(() => {
          if (isWorking) {
            if(span.innerHTML.length < 5) {
              span.innerHTML = `${span.innerHTML}.`
            } else {
              span.innerHTML = '.'
            }
            animate()
          }
        }, 300)
      }
      animate()
      
      const result = await dataPrice.convert(amountValue, fromValue, toValue)
      isWorking = false
      ctSpan.style.boxShadow = '0 0 0 4px #5f169b'
      if (span && spanRate) {
        span.innerHTML = `${result.result} ${toValue}`
        spanRate.innerHTML = `Rate: 1 ${result.request.from} = ${result.rate} ${result.request.to}`
      }
      setTimeout(() => {
        ctSpan.style.boxShadow = ''
      }, 400)
    } catch (error) {
      
    } 
  }

  const change = () => {
    if (fromCurrencyRef.current && toCurrencyRef.current) {
      // Change currencies between fromSelect and toSelect
      const fromCurrency: HTMLSelectElement = fromCurrencyRef.current
      const toCurrency: HTMLSelectElement = toCurrencyRef.current
      const fromValue = toCurrency.value
      const toValue = fromCurrency.value
      fromCurrency.value = fromValue
      toCurrency.value = toValue
      
      // Animation function
      fromCurrency.style.boxShadow = '0 0 0 3px #5f169b'
      toCurrency.style.boxShadow = '0 0 0 3px #5f169b'
      setTimeout(() => {
        fromCurrency.style.boxShadow = ''
        toCurrency.style.boxShadow = ''
        calculate()
      }, 300)
    }
  }
  return (
    <section className='ct-main'>
      <div className="ct-title">
        <h2>Currency Converter</h2>
        <p>Calculate the exchange rate betwenn two currencies.</p>
      </div>

      <div className="ct-amount">
        <p>Amount</p>
        <input type="number" placeholder='Enter the amount' ref={amountRef}/>
      </div>

      <div className="ct-currencies">
        <SelectCurrency title="From" aRef={fromCurrencyRef}/>
        <SelectCurrency title="To" aRef={toCurrencyRef}/>
      </div>

      <div className="ct-result">
        <p>Equivalent Amount</p>
        <div className='ct-result-span' ref={spanResultRef}>
          <span></span>
        </div>
        <div ref={spanRateRef} className='ct-rate'>
          <span></span>
        </div>
      </div>

      <div className='ct-btn-calculate'>
        <button className='btn-change' onClick={change}>{'<>'}</button>
        <button className="btn-calculate" onClick={calculate}>Calculate</button>
      </div>
    </section>
  )
}