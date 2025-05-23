# 🧭 NFT Explorer

This is a simple NFT Explorer app built with **Next.js** and powered by **Alchemy’s SDK**.  
It connects to the **Ethereum Mainnet** and allows users to explore NFTs by entering a **wallet address** or a **collection contract address**.

## 🔍 Features

- 🔗 Connects to the Ethereum Mainnet via Alchemy
- 🧠 Fetches NFTs owned by a given wallet or from a collection
- 🖼️ Displays NFT images with:
  - Name
  - Token ID
  - Contract address (click to copy)
- 🧰 Built with:
  - Next.js App Router
  - Tailwind CSS for styling
  - Alchemy SDK for fetching NFT data

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/nft-explorer.git
cd nft-explorer
````

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your environment

Create a `.env` file in the root and add your Alchemy API key:

```env
ALCHEMY_API_KEY=your_alchemy_api_key_here
```

You can get your API key from [Alchemy](https://dashboard.alchemy.com/).

### 4. Run the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 How It Works

1. User enters a wallet or contract address in the search bar.
2. The app sends a request to the backend API at `/api/getnfts`.
3. The backend uses Alchemy SDK to fetch NFT data.
4. Results are displayed in neat cards with images and metadata.

## 📦 Deployment

You can deploy this app on platforms like **Vercel** (recommended for Next.js).

## 🔐 Image Domains

To properly load images from various NFT hosting sources (e.g., IPFS, Alchemy CDN, Cloudinary), the `next.config.mjs` file is configured to allow remote images from:

- `ipfs.io`
- `nft-cdn.alchemy.com`
- `res.cloudinary.com`
- `i.seadn.io`
- `www.troublemaker.fun`
- `y.at`
- All other hosts (`**` wildcard – optional)

## 📸 Screenshots

[Screenshot](image.png)

## 🙌 Credits

- [Alchemy SDK](https://docs.alchemy.com/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
