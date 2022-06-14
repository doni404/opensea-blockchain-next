import Header from '../../components/Header';
import React, { useEffect, useState, Fragment } from 'react';
import { useRouter } from 'next/router';
import { useSigner, useAddress, useMetamask } from "@thirdweb-dev/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'

const style = {
    title: `text-4xl font-bold mb-4 text-white mt-6 ml-6`,
    desc: `text-sm mb-4 text-white mt-6 ml-6`,
    desc_component: `text-sm mb-4 text-white ml-6`,
    requiredMark: `text-red-600 text-lg`,
    fieldName: `text-base font-bold text-white mt-3 ml-6`,
    filedesc: `text-sm mb-1 text-white mt-1 ml-6`,
    fileInput: `mt-4 ml-6 mb-4 text-white`,
    divForm: `mt-4 ml-6`,
    divFormRecipient: `mt-4 ml-6 flex`,
    inputTextRecipient: `bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`,
    inputTextPercentage: `ml-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-28  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`,
    inputText: `bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`,
    inputTextArea: `bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 h-40 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`,
    img: `ml-6 mt-4 w-1/4`,
    button: `mt-6 ml-6`,
}

// const contracts = [
//     { address: "0x422E976aCC779AaCecB65eA1921989E074EC0094", contractType: "nft-collection" },
//     { address: "0xa725ef5784f6CBC5542308E26ACE54b61C3d7d7A", contractType: "nft-collection" },
// ]

const Create = () => {

    const router = useRouter()
    const contracts = useState([])
    const [contractList, setContractList] = useState([])
    const [image, setImage] = useState(null);
    const [selectedContract, setSelectedContract] = useState(contracts[0])
    const [createObjectURL, setCreateObjectURL] = useState(null);
    // Read the connected wallet's address (undefined if no connected wallet)
    const address = useAddress();
    // Function to connect the user's MetaMask wallet.
    const connectWallet = useMetamask();

    const walletAddress = "0x0C2756b6C81ba7A05E5282BD8be2F3d585Fd8406";

    const signer = useSigner();

    const sdk = ThirdwebSDK.fromSigner(signer);

    // const sdk = new ThirdwebSDK("rinkeby");

    // Connect to your smart contract using the React SDK's hooks
    const uploadToClient = (event) => {
        if (event.target.files && event.target.files[0]) {
            const i = event.target.files[0];

            setImage(i);
            setCreateObjectURL(URL.createObjectURL(i));
        }
    };


    // Address of the wallet you want to mint the NFT to
    // const address = useAddress(walletAddress);

    // console.log('signer ', signer);

    useEffect(() => {
        // getContracts();
    }, [])

    // async function getContracts() {
    //     if (!address) {
    //         connectWallet();
    //     }
    //     // console.log('address ', address)
    //     // const contracts = await thirdweb.getContractList(walletAddress);
    //     contracts = await thirdweb.getContractList(walletAddress);
    //     console.log('getContracts', contracts);
    //     setContractList(contracts)
    //     setSelectedContract(contracts[0]);
    // }

    const createContract = async e => {
        if (!address) {
            connectWallet();
        }
        console.log(image);
        // Execute transactions on your contracts from the connected wallet
        await sdk.deployer.deployNFTCollection({
            name: itemName.value,
            primary_sale_recipient: address,
            description: itemDescription.value,
            image: image,
            fee_recipient : itemRecipent.value,
            seller_fee_basis_points : parseFloat(itemPercentage.value) * 100
        });

    };

    return (
        <div className="overflow-hidden">
            <Header />
            <div className={style.title}>Create a Collection </div>
            <div className={style.desc}>
                <span className={style.requiredMark}>*</span>
                Required fields </div>
            <div className={style.fieldName}>
                Image
                <span className={style.requiredMark}> *</span>
            </div>
            <div className={style.desc_component}>
                This image will also be used for navigation. 350 x 350 recommended.
            </div>
            <img className={style.img} src={createObjectURL} />
            <input className={style.fileInput} type="file" name="myImage" onChange={uploadToClient} />

            <div className={style.fieldName}>
                Name
                <span className={style.requiredMark}> *</span>
            </div>
            <div className={style.divForm}>
                <input type="text" id="itemName" className={style.inputText} placeholder="Item name" required />
            </div>
            <div className={style.fieldName}>
                Description
            </div>
            <div className={style.divForm}>
                <textarea id="itemDescription" className={style.inputText}
                    placeholder="Description" />
            </div>
            <div className={style.fieldName}>
                Royalties
            </div>
            <div className={style.divFormRecipient}>
                <input id="itemRecipent" className={style.inputTextRecipient}
                    placeholder="Recipient Address" />
                <input id="itemPercentage" className={style.inputTextPercentage}
                    placeholder="Percentage" />
            </div>
            <div className={style.button}>
                <button
                    className="btn btn-primary bg-white px-5"
                    type="submit"
                    onClick={createContract}>
                    Create
                </button>
            </div>
        </div>
    )
}

export default Create
