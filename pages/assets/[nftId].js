import Header from '../../components/Header'
import React, { useEffect, useState, useMemo } from 'react';
import { useNFTCollection } from "@thirdweb-dev/react";
import { useMarketplace } from '@thirdweb-dev/react'
import { useRouter } from 'next/router'
import GeneralDetails from '../../components/nft/GeneralDetails'
import NFTImages from '../../components/nft/NFTImages'
import ItemActivity from '../../components/nft/ItemActivity'
import Purchase from '../../components/nft/Purchase'

const style = {
    wrapper: `flex flex-col items-center container-lg text-[#e5e8eb]`,
    container: `container p-6`,
    topContent: `flex`,
    nftImgContainer: `flex-1 mr-4`,
    detailsContainer: `flex-[2] ml-4`,
}

const Nfts = () => {
    const [selectedNft, setSelectedNft] = useState()
    const [listings, setListings] = useState([])
    const router = useRouter()
    // get an instance of your own collection contract
    // const nftCollection = useNFTCollection("0xa2835f77e09784dDEA91a5797670e9901152A6DB");
    const nftCollection = useNFTCollection("0xa725ef5784f6CBC5542308E26ACE54b61C3d7d7A");

    useEffect(() => {
        if (nftCollection) {
            // call functions on your contract
            nftCollection
                .getAll()
                .then((nfts) => {
                    // Set selected nft
                    const selectedNftItem = nfts.find((nft) => nft.metadata.id.toString() == router.query.nftId)
                    setSelectedNft(selectedNftItem)
                })
                .catch((error) => {
                    console.error("failed to fetch nfts", error);
                });
        }
    }, [nftCollection]);

    // Initialize marketplace contract by passing in the contract address
    // const marketplaceAddress = "0xA39c3edc3D1867CC3A9b5FEAB7Afd12f41BF0db3";omni
    const marketplaceAddress = "0x9363940402E1e6d2EB0bc45872E0F78A2601657B";
    const marketPlaceModule = useMarketplace(marketplaceAddress);

    // Get all listings in the collection
    useEffect(() => {
        if (!marketPlaceModule) return
            ; (async () => {
                const listings = await marketPlaceModule.getAll()
                setListings(listings)
            })()
    }, [marketPlaceModule])

    return (
        <div>
            <Header />
            <div className={style.wrapper}>
                <div className={style.container}>
                    <div className={style.topContent}>
                        <div className={style.nftImgContainer}>
                            <NFTImages selectedNft={selectedNft} />
                        </div>
                        <div className={style.detailsContainer}>
                            <GeneralDetails selectedNft={selectedNft} />
                            <Purchase
                                isListed={router.query.isListed}
                                selectedNft={selectedNft}
                                listings={listings}
                                marketPlaceModule={marketPlaceModule}
                            />
                        </div>
                    </div>
                    <ItemActivity />
                </div>
            </div>
        </div>
    )
}

export default Nfts