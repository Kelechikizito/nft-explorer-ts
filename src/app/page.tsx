"use client";

import { useState } from "react";
import NFTCard from "./components/NFTCard";
import Modal from "./components/Modal";

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

interface ApiError {
  error: string;
}

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  type: "error" | "success" | "warning" | "info";
}

export default function Home() {
  const [address, setAddress] = useState<string>("");
  const [data, setData] = useState<NFTData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    title: "",
    message: "",
    type: "error"
  });

  const showModal = (title: string, message: string, type: ModalState["type"] = "error") => {
    setModal({
      isOpen: true,
      title,
      message,
      type
    });
  };

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  const getNfts = async (): Promise<void> => {
    if (!address.trim()) {
      showModal(
        "Invalid Input",
        "Please enter a wallet address before searching.",
        "warning"
      );
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(`./api/getnfts?wallet=${address}`);

      if (!response.ok) {
        try {
          const errorData: ApiError = await response.json();
          const errorMessage = errorData.error || `HTTP error! status: ${response.status}`;

          switch (response.status) {
            case 400:
              showModal(
                "Invalid Request",
                errorMessage || "The wallet address format is invalid. Please check and try again."
              );
              break;
            case 401:
              showModal(
                "Authentication Error",
                errorMessage || "API authentication failed. Please contact support."
              );
              break;
            case 408:
              showModal(
                "Request Timeout",
                errorMessage || "The request took too long to complete. Please try again."
              );
              break;
            case 429:
              showModal(
                "Rate Limit Exceeded",
                errorMessage || "Too many requests. Please wait a moment and try again."
              );
              break;
            case 500:
              showModal(
                "Server Error",
                errorMessage || "Internal server error. Please try again later."
              );
              break;
            default:
              showModal(
                "Request Failed",
                errorMessage || `Unexpected error occurred (${response.status}). Please try again.`
              );
          }
        } catch {
          showModal(
            "Network Error",
            `Failed to fetch NFTs. Server responded with status ${response.status}.`
          );
        }
        setData([]);
        return;
      }

      const responseData: ApiResponse = await response.json();
      console.log(responseData);
      setData(responseData.data.ownedNfts);
    } catch (error) {
      console.error("Error fetching NFTs:", error);

      if (error instanceof TypeError && error.message.includes("fetch")) {
        showModal(
          "Connection Error",
          "Unable to connect to the server. Please check your internet connection and try again."
        );
      } else {
        showModal(
          "Unexpected Error",
          "An unexpected error occurred while fetching NFTs. Please try again."
        );
      }
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setAddress(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      getNfts();
    }
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 px-5">
      <div className="text-6xl mb-6">🖼️</div>
      <h2 className="text-2xl font-semibold text-gray-600 mb-3">
        No NFTs Found
      </h2>
      <p className="text-gray-500 text-center max-w-md mb-6">
        We couldn&apos;t find any NFTs for this wallet address. This could mean:
      </p>
      <ul className="text-gray-500 text-sm space-y-2 mb-8">
        <li>• The wallet doesn&apos;t own any NFTs</li>
        <li>• The address might be incorrect</li>
        <li>• The NFTs might not be indexed yet</li>
      </ul>
      <button
        onClick={() => {
          setAddress("");
          setHasSearched(false);
          setData([]);
        }}
        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
      >
        Try Another Address
      </button>
    </div>
  );

  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
      <p className="text-gray-600">Loading NFTs...</p>
    </div>
  );

  return (
    <div className="h-full mt-20 p-5">
      <div className="flex flex-col gap-10">
        <div className="flex items-center justify-center">
          <h1 className="text-3xl font-bold text-gray-800">NFT EXPLORER</h1>
        </div>

        <div className="flex space-x-5 items-center justify-center">
          <input
            type="text"
            placeholder="Enter your wallet address"
            className="px-5 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={address}
            onChange={handleAddressChange}
            onKeyDown={handleKeyPress}
            disabled={loading}
          />

          <button
            className="px-5 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={getNfts}
            disabled={loading}
          >
            {loading ? "Loading..." : "Get NFTs"}
          </button>
        </div>

        {/* Content Area */}
        {loading ? (
          <LoadingState />
        ) : hasSearched && data.length === 0 ? (
          <EmptyState />
        ) : data.length > 0 ? (
          <>
            <div className="text-center text-gray-600">
              Found {data.length} NFT{data.length !== 1 ? 's' : ''}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {data.map((nft: NFTData) => (
                <NFTCard
                  key={`${nft.contract.address}-${nft.tokenId}`}
                  data={nft}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 py-20">
            Enter a wallet address above to explore NFTs
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        type={modal.type}
      >
        <p className="text-sm">{modal.message}</p>
      </Modal>
    </div>
  );
}
