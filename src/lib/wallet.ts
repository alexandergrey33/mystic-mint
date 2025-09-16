import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';
import { config as envConfig } from '../config/env';

export const config = getDefaultConfig({
  appName: 'Mystic Mint',
  projectId: envConfig.walletConnectProjectId,
  chains: [sepolia],
  ssr: false,
});

export const chainId = envConfig.chainId;
export const rpcUrl = envConfig.rpcUrl;
