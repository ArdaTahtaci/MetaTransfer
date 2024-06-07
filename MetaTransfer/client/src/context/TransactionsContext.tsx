import React, { createContext, useContext, useEffect, useState } from 'react'
import { ethers } from "ethers"
import { contractABI, contractAddress } from '../utils/constants'
import { IFormData } from '../App';

interface IProps {
    children: React.ReactNode
}

interface ProviderMessage {
    type: string;
    data: unknown;
}

export type TxContext = {
    connectWallet: () => void
    sendTransaction: (payload: IFormData) => void
    isConnected: boolean
    allTransactions: any[]
    currentAccountAddress: string
}

export const TransactionContext = createContext<TxContext>({ connectWallet: () => { }, isConnected: false, sendTransaction: () => { }, allTransactions: [], currentAccountAddress: "" })




const TransactionProvider = (props: IProps) => {

    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [allTransactions, setAllTransactions] = useState([])
    const [currentAccount, setCurrentAccount] = useState("")


    const [isLoading, setIsLoading] = useState(false)
    const [transactionCount, setTransactionCount] = useState()


    const ethereum = (window as any).ethereum

    useEffect(() => {
        const setAllTx = async () => {
            getAllTransactions().then((txs: any) => {
                setAllTransactions(txs)

                getEthereumContract().then((contract) => {
                    contract.signer.then((sgnr) => {
                        setCurrentAccount(sgnr.address)

                    })
                })
            }).catch(() => setAllTransactions([]))
        }
        // const setTxCount = async () => {
        //     await getTransactionCount().then(() => console.log(transactionCount))
        // }
        setAllTx()
        // setTxCount()
    }, [])

    useEffect(() => {
        setIsConnected(ethereum.isConnected())
    }, [ethereum.isConnected()])



    const getEthereumContract = async () => {

        const provider = new ethers.BrowserProvider(ethereum)
        const signer = provider.getSigner()
        const writeContract = new ethers.Contract(contractAddress, contractABI, await signer)
        const readContract = new ethers.Contract(contractAddress, contractABI, provider)

        // console.log(provider, signer, transactionContract)

        return {
            writeContract: writeContract,
            readContract: readContract,
            signer: signer
        }
    }



    const connectWallet = async () => {
        try {
            if (!ethereum) return alert("please install metamask")

            const accounts = ethereum.request({ method: 'eth_requestAccounts' })


            setCurrentAccount(accounts[0])
        } catch (error) {
            console.log(error)

            throw new Error("No ethereum object")
        }
    }



    const sendTransaction = async (payload: IFormData) => {

        try {
            if (!ethereum) return alert("Please install metamask")

            let writeContract, readContract, signer

            const contract = await getEthereumContract()
            if (contract) {

            }
            writeContract = contract.writeContract
            readContract = contract.readContract
            signer = contract.signer
            // getEthereumContract().signer


            if (signer && writeContract) {
                const parsedAmount = ethers.parseEther(payload.amount)

                const txHash = (await signer).sendTransaction({
                    to: payload.addressTo,
                    value: parsedAmount
                })
                console.log((await txHash).hash)

                const response = await writeContract.addToBlockchain(payload.addressTo, parsedAmount, payload.message, "test")
                console.log(response)



            }
            else {
                console.log(signer)
                console.log(writeContract)
            }
            const transactionCount = await readContract.getTransactionCount()
            setTransactionCount(transactionCount)

        } catch (error) {
            console.log("burda")
            console.log((error as Error).message)
            console.log(error)
        }
    }

    const getAllTransactions = async () => {


        try {
            if (!ethereum) return alert("Please install metamask")

            const contract = (await getEthereumContract()).readContract

            if (contract) {
                const transactions = await contract.getAllTransactions()
                return transactions
            }
            return []

        } catch (error) {
            console.log((error as Error).message)
        }
    }

    const getTransactionCount = async () => {

        const contract = (await getEthereumContract()).readContract

        const count = await contract.getTransactionCount()

        setTransactionCount(count)
    }


    return (
        <TransactionContext.Provider value={{ connectWallet: connectWallet, isConnected: isConnected, sendTransaction: sendTransaction, allTransactions, currentAccountAddress: currentAccount }}>
            {props.children}
        </TransactionContext.Provider>
    )
}

const useTransctionContext = () => useContext(TransactionContext)

export { useTransctionContext, TransactionProvider }