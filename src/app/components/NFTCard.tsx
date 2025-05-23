import { useEffect, useState } from "react";
import Image from "next/image";

const IPFS_URL = "ipfs://";
const IPFS_GATEWAY_URL = "https://ipfs.io/ipfs/";

interface ImageData {
  originalUrl?: string;
  cachedUrl?: string;
}

interface ContractData {
  address?: string;
}

interface Metadata {
  image?: string;
}

interface Data {
  image?: ImageData;
  tokenUri?: string | { raw?: string };
  contract?: ContractData;
  tokenId: string;
  name?: string;
}

interface NFTCardProps {
  data: Data;
}

export default function NFTCard({ data }: NFTCardProps) {
  const [imageUrl, setImageUrl] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const resolveImageUrl = async () => {
      let rawUrl = data?.image?.originalUrl || data?.image?.cachedUrl;

      if (!rawUrl) {
        let tokenUri =
          typeof data?.tokenUri === "string"
            ? data.tokenUri
            : data?.tokenUri?.raw;

        if (tokenUri?.startsWith(IPFS_URL)) {
          tokenUri = tokenUri.replace(IPFS_URL, IPFS_GATEWAY_URL);
        }

        try {
          const res = await fetch(tokenUri);
          const metadata: Metadata = await res.json();
          rawUrl = metadata?.image;
        } catch (err) {
          console.error("Failed to load metadata:", err);
        }
      }

      if (!rawUrl) return;

      const finalUrl = rawUrl.startsWith(IPFS_URL)
        ? rawUrl.replace(IPFS_URL, IPFS_GATEWAY_URL)
        : rawUrl;

      setImageUrl(finalUrl);
    };

    resolveImageUrl();
  }, [data]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.contract?.address || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shortAddress = data.contract?.address
    ? data.contract.address.slice(0, 20) + "..."
    : null;

  const shortTokenId =
    data.tokenId.length > 20 ? data.tokenId.slice(0, 20) + "..." : data.tokenId;

  return (
    <div className="p-5 border rounded-lg flex flex-col">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={data.name || "NFT Image"}
          width={500}
          height={500}
          unoptimized
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
          Loading...
        </div>
      )}

      <div className="mt-2">{data.name || <i>No name provided</i>}</div>

      <div
        className="mt-2 cursor-pointer hover:underline relative"
        title={data.contract?.address}
        onClick={handleCopy}
      >
        {copied ? "Copied!" : shortAddress || <i>No contract address</i>}
      </div>

      <div className="mt-2" title={data.tokenId}>
        Token ID: {shortTokenId}
      </div>
    </div>
  );
}
