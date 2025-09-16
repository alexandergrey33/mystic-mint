# 🔮 Mystic Mint
### *Where Art Meets Cryptography*

> **The world's first FHE-powered NFT platform that keeps your creative secrets truly secret**

---

## 🎭 The Problem We Solve

Traditional NFT platforms expose everything: rarity, parameters, metadata. This leads to:
- **Pre-sniping** of rare artworks
- **Manipulation** of minting strategies  
- **Loss of creative control** for artists
- **Transparency that kills mystery**

## ✨ Our Solution

Mystic Mint uses **Fully Homomorphic Encryption (FHE)** to create a new paradigm:

```
🎨 Your Art Parameters → 🔐 FHE Encryption → ⛓️ Blockchain Storage
```

**Result**: Your art's rarity and generation secrets remain encrypted until YOU choose to reveal them.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- A Web3 wallet (MetaMask, Rainbow, etc.)
- Some Sepolia ETH for testing

### Installation
```bash
git clone https://github.com/alexandergrey33/mystic-mint.git
cd mystic-mint
npm install
npm run dev
```

### Environment Setup
Create `.env.local`:
```env
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
VITE_WALLET_CONNECT_PROJECT_ID=YOUR_WALLETCONNECT_PROJECT_ID
VITE_INFURA_API_KEY=YOUR_INFURA_API_KEY
```

> **Note**: Replace the placeholder values with your actual API keys and project IDs.

---

## 🎯 How It Works

### 1. **Configure Your Art** 🎨
- Set complexity levels (encrypted)
- Choose color variations (encrypted)  
- Select pattern types (encrypted)
- Add your unique title

### 2. **FHE Encryption** 🔐
- All parameters encrypted using FHE
- Rarity calculated in encrypted space
- No one can see your art's true nature

### 3. **Blockchain Minting** ⛓️
- Encrypted data stored on-chain
- Smart contract handles FHE operations
- Your secrets remain protected

### 4. **Reveal When Ready** 👁️
- You control when to reveal
- Decrypt parameters on your terms
- Maintain creative mystery

---

## 🛠️ Tech Stack

### Frontend Magic
- **React 18** + **TypeScript** - Type-safe development
- **Vite** - Lightning-fast builds
- **Tailwind CSS** - Beautiful, responsive design
- **shadcn/ui** - Accessible component library

### Web3 Integration
- **RainbowKit** - Seamless wallet connection
- **Wagmi** - React hooks for Ethereum
- **Viem** - Lightweight Ethereum library

### Cryptographic Layer
- **FHE (Fully Homomorphic Encryption)** - Privacy-preserving computation
- **Ethereum Sepolia** - Testnet deployment
- **Solidity Smart Contracts** - FHE-enabled on-chain logic

---

## 🔒 Smart Contract Features

Our `MysticMint.sol` contract provides:

```solidity
// Encrypted art parameters
struct Artwork {
    euint32 complexity;      // Encrypted complexity
    euint32 colorVariation;  // Encrypted color variation  
    euint8 patternType;      // Encrypted pattern type
    ebool isRare;           // Encrypted rarity flag
    ebool isRevealed;       // Reveal status
    // ... other fields
}
```

**Key Functions:**
- `mintArtwork()` - Mint with encrypted parameters
- `revealArtwork()` - Decrypt and reveal when ready
- `updateRarity()` - Verifier can update rarity scores

---

## 🎨 User Experience

### For Artists
- **Complete Privacy**: Your creative process stays private
- **Rarity Protection**: No one can front-run your rare pieces
- **Creative Control**: Reveal on your timeline
- **Professional Tools**: Enterprise-grade encryption

### For Collectors  
- **True Mystery**: Genuine surprise when art is revealed
- **Fair Distribution**: No insider advantage
- **Verified Authenticity**: Blockchain-backed provenance
- **Unique Experience**: First-of-its-kind platform

---

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repo to Vercel
2. Set environment variables
3. Deploy automatically

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Manual Build
```bash
npm run build
npm run preview
```

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Make** your changes
4. **Commit** with style: `git commit -m 'Add amazing feature'`
5. **Push** to your branch: `git push origin feature/amazing-feature`
6. **Open** a Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🆘 Support & Community

- **🐛 Bug Reports**: [GitHub Issues](https://github.com/alexandergrey33/mystic-mint/issues)
- **💡 Feature Requests**: [GitHub Discussions](https://github.com/alexandergrey33/mystic-mint/discussions)
- **📚 Documentation**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **💬 Community**: Join our Discord (coming soon)

---

## 🌟 Why Mystic Mint?

| Traditional NFTs | Mystic Mint |
|------------------|-------------|
| ❌ Exposed parameters | ✅ Encrypted parameters |
| ❌ Predictable rarity | ✅ Hidden rarity |
| ❌ Pre-sniping possible | ✅ Fair distribution |
| ❌ No mystery | ✅ True surprise |
| ❌ Centralized control | ✅ Decentralized privacy |

---

## 🔮 The Future of Art

Mystic Mint isn't just another NFT platform—it's a **paradigm shift**:

- **Privacy-First**: Your creative process deserves protection
- **Fair Distribution**: No insider advantages
- **True Mystery**: Real surprise and delight
- **Artist Empowerment**: You control the narrative

---

*Built with ❤️ by the Mystic Mint team for artists who value privacy and collectors who crave mystery.*

**Ready to mint your first confidential masterpiece?** 🎨✨