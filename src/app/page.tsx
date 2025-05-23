"use client";

import { useState } from "react";
import NFTCard from "./components/NFTCard";

interface ImageData {
  originalUrl?: string;
  cachedUrl?: string;
}

interface ContractData {
  address: string;
}

interface NFTData {
  image?: ImageData;
  tokenUri?: string | { raw?: string };
  contract: ContractData;
  tokenId: string;
  name?: string;
}

interface ApiResponse {
  data: {
    ownedNfts: NFTData[];
  };
}

export default function Home() {
  const [address, setAddress] = useState<string>("");
  const [data, setData] = useState<NFTData[]>([]);

  const getNfts = async (): Promise<void> => {
    try {
      const response = await fetch(`./api/getnfts?wallet=${address}`);
      if (!response.ok) {
        return alert("Something went wrong!");
      }
      const responseData: ApiResponse = await response.json();
      console.log(responseData);
      setData(responseData.data.ownedNfts);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      alert("Error fetching NFTs. Please try again.");
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setAddress(e.target.value);
  };

  return (
    <div className="h-full mt-20 p-5">
      <div className="flex flex-col gap-10">
        <div className="flex items-center justify-center">
          <h1>NFT EXPLORER</h1>
        </div>

        <div className="flex space-x-5 items-center justify-center">
          <input
            type="text"
            placeholder="Enter your wallet address"
            className="px-5 py-2 border rounded-md"
            value={address}
            onChange={handleAddressChange}
          />

          <button
            className="px-5 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all cursor-pointer"
            onClick={getNfts}
          >
            Get NFTs
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-10">
          {data.map((nft: NFTData) => (
            <NFTCard
              key={`${nft.contract.address}-${nft.tokenId}`}
              data={nft}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
