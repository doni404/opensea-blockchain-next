import Header from '../../components/Header';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSigner, useAddress, useMetamask } from "@thirdweb-dev/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import Link from 'next/link'

const style = {
    title: `text-4xl font-bold mb-4 text-white mt-6 ml-6`,
    desc: `text-sm mb-4 text-white mt-6 ml-6`,
    requiredMark: `text-red-600 text-lg`,
    fieldName: `text-base font-bold text-white mt-3 ml-6`,
    filedesc: `text-sm mb-1 text-white mt-1 ml-6`,
    fileInput: `mt-4 ml-6 mb-4 text-white`,
    divForm: `mt-4 ml-6`,
    inputText: `bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`,
    inputTextArea: `bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 h-40 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`,
    img: `ml-6 mt-4 w-1/4`,
    button: `mt-6 ml-6`,
}

const MyCollection = () => {

    const contracts = useState([])
    const [contractList, setContractList] = useState([]);

    const address = useAddress();
    // Function to connect the user's MetaMask wallet.
    const connectWallet = useMetamask();
    // Address of the wallet you want to mint the NFT to
    const walletAddress = "0xA770a11B87A06845E875904Ad40039052666AFEd";
    // const address = useAddress();
    const sdk = new ThirdwebSDK("mainnet");
    // const signer = useSigner();

    // const sdk = ThirdwebSDK.fromSigner(signer);

    useEffect(() => {

        getContracts();

    }, [])


    async function getContracts() {
        if (!address) {
            connectWallet();
        }
        contracts = await sdk.getContractList(walletAddress);
        console.log('getContracts', contracts);
        setContractList(contracts)
    }


    async function createContract() {
        if (!address) {
            connectWallet();
        }

        console.log(address);
        await sdk.deployer.deployNFTCollection({
            name: "My Collection",
            primary_sale_recipient: address,
        })
    };




    return (
        <div className="overflow-hidden">
            <Header />
            <div className={style.title}>My Collection </div>
            <div className={style.desc}>
                Create, curate, and manage collections of unique NFTs to share and sell.</div>
            <Link href="/collections/create">
                <div className={style.button}>
                    <button
                        className="btn btn-primary bg-white px-5"
                        type="submit"
                        >
                        Create Collection
                    </button>
                </div>
            </Link>
            <table class="shadow-lg bg-white border-collapse mt-6 ml-6">
                <tr>
                    <th class="bg-blue-100 border text-left px-8 py-4">Address</th>
                    <th class="bg-blue-100 border text-left px-8 py-4">Contract Type</th>
                    <th class="bg-blue-100 border text-left px-8 py-4">Network</th>
                </tr>
                {contractList && contractList.length > 0 && contractList.map(list => (
                    <tr>
                        <td class="border px-8 py-4">{list.address}</td>
                        <td class="border px-8 py-4">{list.contractType}</td>
                        <td class="border px-8 py-4">Rinkeby</td>
                    </tr>
                ))}
            </table>
        </div>
    )
}

export default MyCollection