import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { HiTag } from 'react-icons/hi'
import { IoMdWallet, IoIosPricetags } from 'react-icons/io'
import toast, { Toaster } from 'react-hot-toast'
import { NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";
import { ThirdwebSDK, ListingType } from "@thirdweb-dev/sdk";
import { useMarketplace, useCreateDirectListing, useBuyNow } from "@thirdweb-dev/react";
import { BigNumber } from 'ethers'

const style = {
    button: `mr-8 flex items-center py-2 px-12 rounded-lg cursor-pointer`,
    buttonIcon: `text-xl`,
    buttonText: `ml-2 text-lg font-semibold`,
    test: `bg-white`,
    modalWrapper: `justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none`,
    modalOutline: `relative w-auto my-6 mx-auto max-w-2xl`,
    modalContent: `border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none`,
    modalHeader: `flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t`,
    modalBody: `relative p-6 flex-auto`,
    modalFooter: `flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b`,
}

const MakeOffer = ({ isListed, selectedNft, listings, marketPlaceModule }) => {
    const [selectedMarketNft, setSelectedMarketNft] = useState();
    const [enableButton, setEnableButton] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();
    //old
    // useEffect(() => {
    //     if (!listings || isListed === 'false') return
    //         ; (async () => {

    //             setSelectedMarketNft(
    //                 listings.find((marketNft) => marketNft.asset?.id.toString() == selectedNft.metadata.id.toString())
    //             )
    //         })()
    // }, [selectedNft, listings, isListed])
    //new
    useEffect(() => {
        if (!listings || isListed === 'false' || selectedNft === undefined) return
            ; (async () => {
                const meta = selectedNft.metadata
                var result = listings.find(market => market.asset.id.toString() === meta.id.toString());
                if (result !== undefined) {
                    setSelectedMarketNft(result)
                }

            })()
    }, [selectedNft, listings, isListed])

    useEffect(() => {
        if (!selectedMarketNft || !selectedNft) return

        setEnableButton(true)
    }, [selectedMarketNft, selectedNft])

    // `Purchase successful!`
    // `Purchase failed!`
    const confirmPurchase = (toastHandler = toast) =>
        toastHandler.success(`Purchase successful!`, {
            style: {
                background: '#04111d',
                color: '#fff',
            },
        })

    const failedPurchase = (toastHandler = toast) =>
        toastHandler.error(`Purchase failed!`, {
            style: {
                background: '#04111d',
                color: '#fff',
            },
        })
    //old
    // const buyItem = async (
    //     listingId = selectedMarketNft.id,
    //     quantityDesired = 1
    // ) => {
    //     console.log("selectedMarketNft", selectedMarketNft)
    //     console.log(listingId, quantityDesired, marketPlaceModule, 'test doni')

    //     // can use marketPlaceModule.direct.buyoutListing or below
    //     await marketPlaceModule.buyoutListing(parseInt(listingId.toString()), quantityDesired)
    //         .then(() => confirmPurchase())
    //         .catch((error) => {
    //             console.error(error);
    //             failedPurchase();
    //         });
    // }
    //new
    const marketplace = useMarketplace("0x684E826A0B25B6B29D88Dc21D589d1bB8680DE92")
    const directListing = useCreateDirectListing(marketplace)
    const buyOut = useBuyNow(marketplace)

    const buyItem = async () => {
        // The listing ID of the asset you want to buy
        const listingId = selectedMarketNft.id
        console.log(listingId)
        // Quantity of the asset you want to buy
        const quantityDesired = 1

        const listing = {
            id: listingId,
            type: ListingType.Direct,
            buyAmount: quantityDesired
        }


        await buyOut.mutateAsync(listing).then(() => {
            // Back to collection list after complete listing and wait 3 secs
            confirmPurchase()
        })
            .catch((error) => {
                console.error(error);
                failedPurchase();
            });
    }

    //new
    const sellItem = async e => {
        e.preventDefault();
        console.log("param price", price.value)
        setShowModal(false)

        console.log("selectedNft : ", selectedNft)

        // Data of the listing you want to create
        const listing = {
            // address of the contract the asset you want to list is on
            assetContractAddress: "0xd4702C073353Bf24714516fEbb3AC388fA87d6DA",
            // token ID of the asset you want to list
            tokenId: selectedNft.metadata.id.toString(),
            // in how many seconds will the listing open up
            startTimestamp: new Date(),
            // how long the listing will be open for 86400s = 1 day
            listingDurationInSeconds: 86400,
            // how many of the asset you want to list
            quantity: 1,
            // address of the currency contract that will be used to pay for the listing
            currencyContractAddress: NATIVE_TOKEN_ADDRESS,
            // how much the asset will be sold for
            buyoutPricePerToken: price.value,
        }

        console.log("listing item : ", listing)

        await directListing.mutateAsync(listing).then(() => {
            // Back to collection list after complete listing and wait 3 secs
            confirmPurchase()
            setTimeout(() => {
                router.push('/collections/0xa725ef5784f6CBC5542308E26ACE54b61C3d7d7A')
            }, 3000)
        })
            .catch((error) => {
                console.error(error);
                failedPurchase();
            });
        //old
        // can use marketPlaceModule.direct.buyoutListing or below
        // const tx = await contract.direct.createListing(listing)
        //     .then(() => {
        //         // Back to collection list after complete listing and wait 3 secs
        // confirmPurchase()
        // setTimeout(() => {
        //     router.push('/collections/0xa725ef5784f6CBC5542308E26ACE54b61C3d7d7A')
        // }, 3000)
        //     })
        //     .catch((error) => {
        //         console.error(error);
        //         failedPurchase();
        //     });

        // const receipt = tx.receipt; // the transaction receipt
        // const id = tx.id; // the id of the newly created listing
    };

    return (
        <div className="flex h-20 w-full items-center rounded-lg border border-[#151c22] bg-[#303339] px-12">
            <Toaster position="top-center" reverseOrder={false} />
            {isListed === 'true' ? (
                <>
                    <div
                        onClick={buyItem}
                        className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`}
                    >
                        <IoMdWallet className={style.buttonIcon} />
                        <div className={style.buttonText}>Buy Now</div>
                    </div>
                    <div
                        className={`${style.button} border border-[#151c22]  bg-[#363840] hover:bg-[#4c505c]`}
                    >
                        <HiTag className={style.buttonIcon} />
                        <div className={style.buttonText}>Make Offer</div>
                    </div>
                </>
            ) : (
                <div>
                    <div className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`}>
                        <IoIosPricetags className={style.buttonIcon} />
                        <div className={style.buttonText} onClick={() => setShowModal(true)}>Sell</div>
                    </div>

                    {showModal ? (
                        <>
                            <div className={style.modalWrapper}>
                                <div className={style.modalOutline}>
                                    {/*content*/}
                                    <form onSubmit={sellItem}>
                                        <div className={style.modalContent}>
                                            {/*header*/}
                                            <div className={style.modalHeader}>
                                                <h3 className="text-3xl font-semibold text-gray-700">
                                                    List item for sale
                                                </h3>
                                                <button
                                                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                                    onClick={() => setShowModal(false)}>
                                                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
                                                </button>
                                            </div>
                                            {/*body*/}
                                            <div className={style.modalBody}>
                                                <p className="my-2 text-slate-400 text-sm leading-relaxed">
                                                    Service Fee 2.5%
                                                </p>
                                                <div className="mb-6">
                                                    <label htmlFor="price" className="block mb-4 text-sm font-medium text-gray-900 dark:text-gray-300">Price</label>
                                                    <input type="text" id="price" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="0.05" required />
                                                </div>
                                            </div>
                                            {/*footer*/}
                                            <div className={style.modalFooter}>
                                                <button
                                                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                    type="button"
                                                    onClick={() => setShowModal(false)}>
                                                    Close
                                                </button>
                                                <button
                                                    className="bg-sky-500 text-white active:bg-sky-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                    type="submit">
                                                    Complete listing
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                        </>
                    ) : null}
                </div>
            )}
        </div>
    )
}

export default MakeOffer