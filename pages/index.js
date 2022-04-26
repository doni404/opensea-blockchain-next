import { useEffect } from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import { client } from '../lib/sanityClient'
import toast, { Toaster } from 'react-hot-toast'
import {
  useMetamask,
  useWalletConnect,
  useCoinbaseWallet,
  useNetwork,
  useAddress,
  useDisconnect,
} from '@thirdweb-dev/react';

const style = {
  wrapper: ``,
  walletConnectWrapper: `flex flex-col justify-center items-center h-screen w-screen bg-[#3b3d42] `,
  button: `border border-[#282b2f] bg-[#2081e2] p-[0.8rem] text-xl font-semibold rounded-lg cursor-pointer text-black`,
  details: `text-lg text-center text=[#282b2f] font-semibold mt-4`,
}

export default function Home() {
  const connectWithCoinbaseWallet = useCoinbaseWallet();
  const connectWithMetamask = useMetamask();
  const connectWithWalletConnect = useWalletConnect();
  const disconnectWallet = useDisconnect();
  const address = useAddress();
  const network = useNetwork();

  const welcomeUser = (userName, toastHandler = toast) => {
    toastHandler.success(
      `Welcome back${userName != 'Unnamed' ? ` ${userName}` : ''}`,
      {
        style: {
          background: '#04111d',
          color: '#fff',
        }
      }
    )
  }

  useEffect(() => {
    if (!address) return
      ; (async () => {
        const userDoc = {
          _type: 'users',
          _id: address,
          userName: 'Unamed',
          walletAddress: address,
        }

        // Insert data to database sanity, or get if it exists
        const result = await client.createIfNotExists(userDoc)
        console.log(result)

        // Call toast
        welcomeUser(result.userName)
      })()
  }, [address])

  return (
    <div className={style.wrapper}>
      <Toaster position="top-center" reverseOrder={false} />
      { address ? (
        <>
          <Header />
          <Hero />
        </>
      ) : (
          <div className={style.walletConnectWrapper}>
            <button
              className={style.button}
              onClick={() => connectWithMetamask()}
            >
              Connect Wallet
          </button>
            <div className={style.details}>
              You need Chrome to be
            <br /> able to run this app.
          </div>
          </div>
        )}
    </div>
  )
}
