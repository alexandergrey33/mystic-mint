# 🔧 Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Chain Configuration
VITE_CHAIN_ID=11155111

# RPC Configuration
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
VITE_INFURA_API_KEY=YOUR_INFURA_API_KEY

# WalletConnect Configuration
VITE_WALLET_CONNECT_PROJECT_ID=YOUR_WALLETCONNECT_PROJECT_ID
```

## How to Get Your API Keys

### 1. Infura API Key
1. Go to [Infura.io](https://infura.io/)
2. Create an account or sign in
3. Create a new project
4. Select "Ethereum" network
5. Copy your Project ID and use it as `YOUR_INFURA_PROJECT_ID`
6. Use the same Project ID as `YOUR_INFURA_API_KEY`

### 2. WalletConnect Project ID
1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create an account or sign in
3. Create a new project
4. Copy your Project ID and use it as `YOUR_WALLETCONNECT_PROJECT_ID`

## Security Notes

- ⚠️ **Never commit your `.env.local` file to version control**
- 🔒 Keep your API keys secure and don't share them publicly
- 🔄 Rotate your keys regularly for security
- 📝 Use different keys for development and production environments

## Example Configuration

```env
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://sepolia.infura.io/v3/abc123def456ghi789
VITE_WALLET_CONNECT_PROJECT_ID=xyz789uvw456rst123
VITE_INFURA_API_KEY=abc123def456ghi789
```

## Troubleshooting

### Common Issues

1. **Wallet Connection Fails**
   - Verify your WalletConnect Project ID is correct
   - Ensure the project is properly configured in WalletConnect Cloud

2. **RPC Connection Issues**
   - Check your Infura API key is valid
   - Verify the RPC URL format is correct
   - Ensure you have sufficient quota on your Infura plan

3. **Build Errors**
   - Make sure all environment variables are prefixed with `VITE_`
   - Verify the `.env.local` file is in the root directory
   - Check for typos in variable names
