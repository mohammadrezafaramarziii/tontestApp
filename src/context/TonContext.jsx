import { createContext, useContext, useEffect, useMemo, useState } from "react";
import TonWeb from "tonweb";


const TonContext = createContext();

const APY_KEY = "690c76acda28afd43f5bf094ef05f63a3e42cd7b68cf0f44d25db6bd25f44620";

export default function TonProvider({ children }) {
    const [balance, setBalance] = useState(null);
    const [walletAddress, setWalletAddress] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(null);
    const [status, setStatus] = useState("");
    const [txHash, setTxHash] = useState(null);

    const testSeed = new Uint8Array([
        14, 151, 191, 233, 19, 234, 141, 134, 48, 136, 210, 161, 177, 8, 211, 191,
        239, 32, 19, 72, 111, 152, 178, 142, 116, 18, 199, 190, 244, 151, 98, 143,
    ]);

    const keyPair = useMemo(() =>
        TonWeb.utils.nacl.sign.keyPair.fromSeed(testSeed),
        []);

    const tonweb = new TonWeb(new TonWeb.HttpProvider(`https://testnet.toncenter.com/api/v2/jsonRPC?api_key=${APY_KEY}`));
    const wallet = useMemo(() =>
        tonweb.wallet.create({ publicKey: keyPair.publicKey }),
        [keyPair]);

    const fetchUserData = async () => {
        try {
            const address = await wallet.getAddress();
            setWalletAddress(address.toString(true, true, true));

            const balance = await tonweb.provider.getBalance(address.toString(true, true, true));
            setBalance(TonWeb.utils.fromNano(balance));
        } catch (error) {
            console.error(error);
            setBalance(null);
        }
    };

    const waitForSeqnoChange = async (oldSeqno) => {
        for (let i = 0; i < 20; i++) {
            await new Promise(r => setTimeout(r, 100));
            const newSeqnoRaw = await wallet.methods.seqno().call();
            const newSeqno = Number(newSeqnoRaw);
            if (newSeqno > oldSeqno) {
                return true;
            }
        }
        return false;
    };

    const sendTransaction = async (recipient, amount) => {
        if (!recipient || !amount) {
            setError("Please enter the recipient's address and amount");
            return;
        }

        setLoading(true);
        setStatus("");
        setError("");
        setTxHash(null);

        try {
            const nanoTON = TonWeb.utils.toNano(amount);
            const balance = await tonweb.provider.getBalance(walletAddress);

            if (BigInt(balance) < BigInt(nanoTON)) {
                setError("Insufficient inventory");
                setLoading(false);
                return;
            }

            const seqnoRaw = await wallet.methods.seqno().call();
            const seqno = Number(seqnoRaw);

            if (isNaN(seqno) || seqno < 0) {
                throw new Error("Invalid seqno received from wallet");
            }

            const transfer = wallet.methods.transfer({
                secretKey: keyPair.secretKey,
                toAddress: recipient,
                amount: nanoTON,
                seqno: seqno,
                sendMode: 1,
            });

            await transfer.send();
            const confirmed = await waitForSeqnoChange(seqno);


            if (confirmed) {
                const transactions = await tonweb.provider.getTransactions(walletAddress.toString(true, true, true), 1);
                const tx = transactions[0]?.transaction_id;
                const { hash } = tx;

                fetchUserData();

                setTxHash(hash);
                setStatus("The transaction was confirmed and recorded");
            } else {
                setError("Transaction sent but not confirmed yet");
            }


        } catch (error) {
            console.error(error);
            setError("Error during transaction");
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setLoading(false);
        setStatus("");
        setError("");
        setTxHash(null);
    }

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <TonContext.Provider
            value={{
                balance,
                walletAddress,
                sendTransaction,
                loading,
                status,
                error,
                txHash,
                reset,
            }}
        >
            {children}
        </TonContext.Provider>
    )
}

export function useTon() {
    const context = useContext(TonContext);

    if (context === undefined) throw new Error("Ton context was used outside of TonContext");

    return context
}