import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import NFTTile from "./NFTTile";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { GetIpfsUrlFromPinata } from "../utils";

export default function Marketplace() {

    const sampleData = [
        {
            name: "NFT#1",
            description: "Alchemy's First NFT",
            website:"http://axieinfinity.io",
            image:"https://gateway.pinata.cloud/ipfs/QmTsRJX7r5gyubjkdmzFrKQhHv74p5wT9LdeF1m3RTqrE5",
            price:"0.03ETH",
        }
    ];

    const [data, updateData] = useState(sampleData);
    const [dataFetched, updateFetched] = useState(false);

    useEffect(() => {
        const getAllNFTs = async () => {
            if (!window.ethereum) {
                alert("Please install MetaMask!");
                return;
            }

            try {
                const ethers = require("ethers");
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();

                if (!MarketplaceJSON.address) {
                    alert("Contract address missing!");
                    return;
                }

                const contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);
                const transaction = await contract.getAllNFTs();

                const items = await Promise.all(transaction.map(async i => {
                    let tokenURI = await contract.tokenURI(i.tokenId);
                    tokenURI = GetIpfsUrlFromPinata(tokenURI);
                    let meta = await axios.get(tokenURI);
                    meta = meta.data;

                    let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
                    return {
                        price,
                        tokenId: i.tokenId.toNumber(),
                        seller: i.seller,
                        owner: i.owner,
                        image: meta.image,
                        name: meta.name,
                        description: meta.description,
                    };
                }));

                updateData(items);
                updateFetched(true);

            } catch (error) {
                console.error("Error fetching NFTs:", error);
            }
        }

        if(!dataFetched) getAllNFTs();

    }, [dataFetched]);

    return (
        <div>
            <Navbar />
            <div className="flex flex-col place-items-center mt-20">
                <div className="md:text-xl font-bold text-white">
                    Top NFTs
                </div>
                <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
                    {data.map((value, index) => (
                        <NFTTile data={value} key={index} />
                    ))}
                </div>
            </div>            
        </div>
    );
}
