import React, { useState } from 'react'
import TextField from './TextField'
import { useTon } from '../context/TonContext'
import Loading from './Loading';
import { SolarCheckCircleBold } from './Icons';

export default function SenderForm() {
    const [data, setData] = useState({ address: "", amount: 0 })
    const { status, loading, error, sendTransaction, txHash, reset } = useTon();

    const onSubmit = (e) => {
        e.preventDefault();
        sendTransaction(data.address, data.amount)
    }

    const onReset = () => {
        reset();
        setData({ address: "", amount: 0 });
    }

    if (status) return (
        <div className='w-full flex flex-col items-center gap-4 mx-auto mt-12'>
            <SolarCheckCircleBold className="w-14 h-14 text-green-500" />
            <div className='text-slate-800 font-medium text-center'>
                {status}
            </div>
            <div className='text-sm text-slate-700 text-center'>
                Transaction ID = {txHash}
            </div>
            <button onClick={onReset} className='max-w-auto px-6 flex items-center justify-center bg-blue-600 text-sm font-medium text-blue-50 h-14 rounded-lg cursor-pointer hover:bg-blue-700 duration-300'>
                OK
            </button>
        </div>
    )

    return (
        <form onSubmit={onSubmit} className='w-full flex flex-col gap-4 max-w-sm mx-auto mt-12'>
            <TextField
                placeholder="Recipient address..."
                value={data.address}
                onChange={({ target }) => setData({ ...data, address: target.value })}
            />
            <TextField
                type="number"
                placeholder={"Amount..."}
                value={data.amount}
                onChange={({ target }) => setData({ ...data, amount: target.value })}
            />
            {
                error &&
                <p className='text-red-600 font-medium'>
                    {error}
                </p>
            }
            <button type='submit' disabled={loading} className='w-full flex items-center justify-center bg-blue-600 text-sm font-medium text-blue-50 h-14 rounded-lg cursor-pointer hover:bg-blue-700 duration-300'>
                {loading ? <Loading /> : "Continue"}
            </button>
        </form>
    )
}
