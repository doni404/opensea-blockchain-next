import Header from '../../components/Header';
import React, { useEffect, useState, Fragment } from 'react';
import { useRouter } from 'next/router';
import { useNFTCollection, useAddress, useMetamask} from "@thirdweb-dev/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'

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
    // const address = useAddress();
    // Function to connect the user's MetaMask wallet.
    const connectWallet = useMetamask();

    // Connect to your smart contract using the React SDK's hooks
    const uploadToClient = (event) => {
        if (event.target.files && event.target.files[0]) {
            const i = event.target.files[0];

            setImage(i);
            setCreateObjectURL(URL.createObjectURL(i));
        }
    };


    const sdk = new ThirdwebSDK("ethereum");
    const contract = sdk.getNFTCollection("0xd4702C073353Bf24714516fEbb3AC388fA87d6DA");

    const address = "0xA770a11B87A06845E875904Ad40039052666AFEd";

    const nftCollection = useNFTCollection("0xd4702C073353Bf24714516fEbb3AC388fA87d6DA")

    const mintItem = async e => {
     
        await nftCollection.mintTo(address, {
            name: itemName.value,
            description: itemDescription.value,
            image: image // This can be an image url or file
        });

    };

    return (
        <div className="overflow-hidden">
            <Header />
            <div className={style.title}>Create New Item </div>
            <div className={style.desc}>
                <span className={style.requiredMark}>*</span>
                Required fields </div>
            <div className={style.fieldName}>
                Image, Video, Audio, or 3D Model
                <span className={style.requiredMark}> *</span>
            </div>
            <div className={style.filedesc}>
                File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF. Max size: 100 MB</div>
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
            {/* <div className={style.fieldName}>
                Collection
            </div>
            <div className="mt-3 mb-10 ml-6 w-1/4">
                <Listbox value={selectedContract} onChange={setSelectedContract}>
                    <div className="relative mt-1">
                        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                            <span className="block truncate">{selectedContract.address}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <SelectorIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                            </span>
                        </Listbox.Button>
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {contractList.map((contract, contractIdx) => (
                                    <Listbox.Option
                                        key={contractIdx}
                                        className={({ active }) =>
                                            `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                            }`
                                        }
                                        value={contract}
                                    >
                                        {({ selectedContract }) => (
                                            <>
                                                <span
                                                    className={`block truncate ${selectedContract ? 'font-medium' : 'font-normal'
                                                        }`}
                                                >
                                                    {contract.address}
                                                </span>
                                                {selectedContract ? (
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </Listbox>
            </div> */}
            <div className={style.button}>
                <button
                    className="btn btn-primary bg-white px-5"
                    type="submit"
                    onClick={mintItem}>
                    Create
                </button>
            </div>
        </div>
    )
}

export default Create