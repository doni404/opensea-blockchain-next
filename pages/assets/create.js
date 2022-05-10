import Header from '../../components/Header';
import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useNFTCollection } from "@thirdweb-dev/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

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
    img: `ml-6 mt-4 w-1/4`
}

const Create = () => {

    const router = useRouter()
    const [image, setImage] = useState(null);
    const [createObjectURL, setCreateObjectURL] = useState(null);

    const uploadToClient = (event) => {
        if (event.target.files && event.target.files[0]) {
            const i = event.target.files[0];

            setImage(i);
            setCreateObjectURL(URL.createObjectURL(i));
        }
    };
    // get an instance of your own collection contract

    // Address of the wallet you want to mint the NFT to
    const walletAddress = "0x0C2756b6C81ba7A05E5282BD8be2F3d585Fd8406";

    // access your deployed contracts
    const nftCollection = useNFTCollection("0x422E976aCC779AaCecB65eA1921989E074EC0094")
    const mintItem = async e => {
        console.log(itemName.value);
        // Execute transactions on your contracts from the connected wallet
        await nftCollection.mintTo(walletAddress, {
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
            <button
                className="btn btn-primary bg-white px-5"
                type="submit"
                onClick={mintItem}>
                Send to server
            </button>
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
                <textarea  id="itemDescription" className={style.inputText}
                    placeholder="Description" />
            </div>
        </div>
    )
}

export default Create