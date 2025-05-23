import { NextRequest, NextResponse } from "next/server";
import { Alchemy, Network } from "alchemy-sdk";

const config = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
  maxRetries: 3,
  requestTimeout: 30000, // 30 seconds
};

const alchemy = new Alchemy(config);

// Helper function to validate wallet address
function isValidWalletAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Helper function for retry logic
async function retryWithDelay<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    
    console.log(`Retrying in ${delay}ms... (${retries} retries left)`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryWithDelay(fn, retries - 1, delay * 2);
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get("wallet");

  if (!wallet) {
    return NextResponse.json(
      { error: "Wallet address is required" },
      { status: 400 }
    );
  }

  if (!isValidWalletAddress(wallet)) {
    return NextResponse.json(
      { error: "Invalid wallet address format" },
      { status: 400 }
    );
  }

  if (!process.env.ALCHEMY_API_KEY) {
    console.error("ALCHEMY_API_KEY is not configured");
    return NextResponse.json(
      { error: "API configuration error" },
      { status: 500 }
    );
  }

  try {
    console.log(`Fetching NFTs for wallet: ${wallet}`);
    
    const results = await retryWithDelay(
      () => alchemy.nft.getNftsForOwner(wallet, {
        excludeFilters: [], // Optional: exclude spam/airdrops
        includeFilters: [],
        pageSize: 25,
      }),
      3, 
      1000
    );

    console.log(`Successfully fetched ${results.ownedNfts.length} NFTs`);
    
    return NextResponse.json({ 
      message: "success", 
      data: results,
      count: results.ownedNfts.length 
    });

  } catch (error: any) {
    console.error("Alchemy error:", error);

    if (error.message?.includes("401") || error.message?.includes("authenticated")) {
      return NextResponse.json(
        { error: "API authentication failed. Please check your API key." },
        { status: 401 }
      );
    }

    if (error.code === 'ETIMEDOUT' || error.message?.includes("timeout")) {
      return NextResponse.json(
        { error: "Request timeout. The server took too long to respond." },
        { status: 408 }
      );
    }

    if (error.message?.includes("rate limit")) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch NFTs. Please try again later." },
      { status: 500 }
    );
  }
}
