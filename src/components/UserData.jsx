import { useTon } from '../context/TonContext'

export default function UserData() {
    const { balance, walletAddress } = useTon();

    return (
        <div className='flex flex-col items-center justify-center gap-4'>
            <div className='text-4xl text-blue-600 font-bold'>
                {balance || 0} TON
            </div>
            <div className='text-sm text-slate-800 text-center'>
                Your address: {walletAddress}
            </div>
        </div>
    )
}
