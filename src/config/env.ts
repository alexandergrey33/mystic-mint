export const config = {
  chainId: import.meta.env.VITE_CHAIN_ID ? parseInt(import.meta.env.VITE_CHAIN_ID) : 11155111,
  rpcUrl: import.meta.env.VITE_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID',
  walletConnectProjectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'YOUR_WALLETCONNECT_PROJECT_ID',
  infuraApiKey: import.meta.env.VITE_INFURA_API_KEY || 'YOUR_INFURA_API_KEY',
};
