import { ChangeEvent, MouseEventHandler, useState } from 'react';
import './App.css';
import { useTransctionContext } from './context/TransactionsContext';
import { ethers } from 'ethers';


export interface IFormData {
  addressTo: string,
  amount: string,
  message: string
}

function App() {

  const { isConnected, connectWallet, sendTransaction, allTransactions, currentAccountAddress } = useTransctionContext()


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const values = {
      addressTo: (document.getElementById("addressTo") as HTMLInputElement).value,
      amount: (document.getElementById("amount") as HTMLInputElement).value,
      message: (document.getElementById("message") as HTMLInputElement).value
    }

    if (!values.addressTo || !values.amount || !values.message) return
    else {
      const formData: IFormData = {
        addressTo: values.addressTo!.toString(),
        amount: values.amount!.toString(),
        message: values.message!.toString()
      }
      sendTransaction(formData)

    }

  }

  return (
    <div className="App">
      <nav>
        <div className='logo my-auto'><span className='logo-span'>Meta Transfer</span></div>

        <div className='address'>
          <span ><span style={{ color: "rgb(255, 101, 0)", fontSize: "20px" }}>Connected Account: </span>{currentAccountAddress}</span>
        </div>

        {!isConnected ? (
          <button className='connect-btn btn' onClick={connectWallet}>Connect</button>

        ) : (
          <button className='connect-btn btn disabled' >Connected</button>
        )}


      </nav>
      <div className='swap-container'>
        <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "17px", marginTop: "20px", marginLeft: "20px", color: "#fff" }}>Transfer</h3>
        <div className='inener-container'>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className='input-div'>
              <input className='input form-control' placeholder='Address to' name='addressTo' type='text' id='addressTo' />
            </div>
            <div className='input-div mt-3'>
              <input className='input form-control' placeholder='Amount (ETH)' name='amount' type='text' id='amount' />
            </div>
            <div className='input-div mt-3'>
              <input className='input form-control' placeholder='Enter Message' name='message' type='text' id='message' />

            </div>
            <button className='btn swap-btn' type='submit' >Send</button>
          </form>

        </div>
      </div>
      <div className='transactions-container'>

        {allTransactions ? allTransactions.map((txs) => {
          return (
            <div className='tx'>
              <div style={{ paddingTop: "20px", display: "flex", alignItems: "start" }}>
                <span >To: <span className='ms-1' style={{ fontSize: "16px", color: "#fff" }}>{txs[1]}</span></span>
              </div>
              <div>
                <span>Amount: <span className='ms-1' style={{ fontSize: "16px", color: "#fff" }}>{ethers.formatEther(txs[2])}</span></span>
              </div>
              <div>
                <span>Message: <span className='ms-1' style={{ fontSize: "16px", color: "#fff" }}>{txs[3]}</span></span>
              </div>
            </div>
          )
        }) : (
          <div style={{ color: "#eee", textAlign: "center" }}>
            There is no wallet connected or no transactions...
          </div>
        )}




      </div>
    </div>
  );
}

export default App;
