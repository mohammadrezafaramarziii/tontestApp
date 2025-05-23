import Header from './components/Header'
import TonProvider from './context/TonContext'
import UserData from './components/UserData'
import SenderForm from './components/SenderForm'
import { Link } from 'react-router-dom'

export default function App() {

    return (
        <TonProvider>
            <div className='w-full h-screen flex flex-col justify-between'>
                <Header />
                <div className='w-full p-8 pt-12 flex-1'>
                    <UserData />
                    <SenderForm />
                </div>
                <footer className='w-full bg-blue-100 p-4 text-blue-500 text-center text-sm'>
                    <Link to={'https://mrfaramarzi.ir'} target='_blank'>
                        Mohammad Reza Faramarzi
                    </Link>
                </footer>
            </div>
        </TonProvider>
    )
}
