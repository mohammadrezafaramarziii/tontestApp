import { SimpleIconsTon } from "./Icons";

export default function Header() {
    return (
        <header className="w-full flex items-center justify-between bg-blue-600 p-4">
            <div className="text-xl md:text-3xl text-blue-50 font-bold">
                My TON Testnet wallet
            </div>
            <div>
                <SimpleIconsTon className="w-10 h-10 md:w-12 md:h-12 text-blue-100" />
            </div>
        </header>
    )
}
