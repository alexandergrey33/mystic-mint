# Vercel Deployment Guide for Mystic Mint

This guide provides step-by-step instructions for deploying the Mystic Mint application to Vercel.

## Prerequisites

- GitHub account with access to the repository
- Vercel account
- Environment variables ready

## Step-by-Step Deployment

### 1. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"

### 2. Import Repository

1. In the "Import Git Repository" section, find `alexandergrey33/mystic-mint`
2. Click "Import" next to the repository
3. Vercel will automatically detect it's a Vite project

### 3. Configure Project Settings

1. **Project Name**: `mystic-mint` (or your preferred name)
2. **Framework Preset**: Vite (should be auto-detected)
3. **Root Directory**: `./` (default)
4. **Build Command**: `npm run build` (default)
5. **Output Directory**: `dist` (default)
6. **Install Command**: `npm install` (default)

### 4. Set Environment Variables

In the "Environment Variables" section, add the following:

```
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
VITE_WALLET_CONNECT_PROJECT_ID=YOUR_WALLETCONNECT_PROJECT_ID
VITE_INFURA_API_KEY=YOUR_INFURA_API_KEY
```

**Important**: Make sure to add these for all environments (Production, Preview, Development).

### 5. Deploy

1. Click "Deploy" button
2. Wait for the build process to complete (usually 2-3 minutes)
3. Once deployed, you'll get a live URL

### 6. Custom Domain (Optional)

1. Go to your project dashboard
2. Click "Settings" tab
3. Go to "Domains" section
4. Add your custom domain
5. Follow DNS configuration instructions

## Post-Deployment Configuration

### 1. Verify Deployment

1. Visit your deployed URL
2. Test wallet connection
3. Verify all features work correctly

### 2. Monitor Performance

1. Check Vercel Analytics (if enabled)
2. Monitor build logs for any issues
3. Set up error tracking if needed

## Environment Variables Reference

| Variable | Description | Value |
|----------|-------------|-------|
| `VITE_CHAIN_ID` | Ethereum chain ID for Sepolia testnet | `11155111` |
| `VITE_RPC_URL` | RPC endpoint for blockchain connection | `https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID` |
| `VITE_WALLET_CONNECT_PROJECT_ID` | WalletConnect project ID | `YOUR_WALLETCONNECT_PROJECT_ID` |
| `VITE_INFURA_API_KEY` | Infura API key for RPC access | `YOUR_INFURA_API_KEY` |

## Troubleshooting

### Common Issues

1. **Build Fails**: Check that all dependencies are properly installed
2. **Environment Variables Not Working**: Ensure variables are prefixed with `VITE_`
3. **Wallet Connection Issues**: Verify WalletConnect project ID is correct
4. **RPC Connection Issues**: Check Infura API key and RPC URL

### Build Optimization

1. Enable Vercel's automatic optimizations
2. Use Vercel's Edge Functions if needed
3. Configure caching headers for static assets

## Security Considerations

1. Never commit sensitive API keys to the repository
2. Use environment variables for all configuration
3. Regularly rotate API keys
4. Monitor for any security vulnerabilities

## Support

For deployment issues:
1. Check Vercel documentation
2. Review build logs in Vercel dashboard
3. Contact support if needed

## Next Steps

After successful deployment:
1. Test all functionality
2. Set up monitoring and analytics
3. Configure custom domain
4. Set up CI/CD for automatic deployments
