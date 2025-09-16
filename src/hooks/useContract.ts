// React hook for contract interactions
import { useState, useCallback } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { MYSTIC_MINT_ABI, MYSTIC_MINT_ADDRESS } from '@/contracts/MysticMintABI';
import { prepareContractCall, validateMintResult, generateMetadataHash } from '@/lib/contract';
import { useToast } from '@/hooks/use-toast';

export interface MintingState {
  status: 'idle' | 'preparing' | 'encrypting' | 'minting' | 'confirming' | 'success' | 'error';
  progress: number;
  error?: string;
  transactionHash?: string;
  artworkId?: number;
}

export interface MintingParams {
  title: string;
  complexity: number;
  colorVariation: number;
  pattern: string;
  mintPrice?: number;
}

export function useContract() {
  const [mintingState, setMintingState] = useState<MintingState>({
    status: 'idle',
    progress: 0
  });

  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Read contract data
  const { data: artworkCount } = useReadContract({
    address: MYSTIC_MINT_ADDRESS,
    abi: MYSTIC_MINT_ABI,
    functionName: 'getArtworkCount',
  });

  const { data: mintPrice } = useReadContract({
    address: MYSTIC_MINT_ADDRESS,
    abi: MYSTIC_MINT_ABI,
    functionName: 'mintPrice',
  });

  const mintArtwork = useCallback(async (params: MintingParams) => {
    if (!isConnected) {
      const error = 'Wallet not connected';
      setMintingState({ status: 'error', progress: 0, error });
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      // Step 1: Preparing
      setMintingState({ status: 'preparing', progress: 10 });
      
      // Step 2: Encrypting parameters
      setMintingState({ status: 'encrypting', progress: 30 });
      
      // Prepare contract call with encrypted parameters
      const contractCall = prepareContractCall(
        params.title,
        {
          complexity: params.complexity,
          colorVariation: params.colorVariation,
          pattern: params.pattern
        },
        params.mintPrice || 0.1
      );

      // Step 3: Minting
      setMintingState({ status: 'minting', progress: 60 });
      
      // Execute contract call
      writeContract(contractCall);

      toast({
        title: "Parameters Encrypted",
        description: "Your art parameters have been encrypted using FHE",
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setMintingState({ 
        status: 'error', 
        progress: 0, 
        error: errorMessage 
      });
      
      toast({
        title: "Minting Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [isConnected, writeContract, toast]);

  // Handle transaction confirmation
  if (isConfirming && mintingState.status === 'minting') {
    setMintingState({ 
      status: 'confirming', 
      progress: 80,
      transactionHash: hash 
    });
  }

  // Handle successful transaction
  if (isSuccess && mintingState.status === 'confirming') {
    const metadataHash = generateMetadataHash({
      title: '', // This would come from the minting params
      complexity: 0,
      colorVariation: 0,
      pattern: ''
    });

    setMintingState({ 
      status: 'success', 
      progress: 100,
      transactionHash: hash,
      artworkId: Number(artworkCount) // Use current count as artwork ID
    });

    toast({
      title: "Artwork Successfully Minted!",
      description: `Your FHE-protected artwork has been minted with transaction ${hash?.slice(0, 10)}...`,
    });
  }

  // Handle transaction error
  if (error && mintingState.status !== 'error') {
    setMintingState({ 
      status: 'error', 
      progress: 0, 
      error: error.message 
    });
  }

  const resetMintingState = useCallback(() => {
    setMintingState({ status: 'idle', progress: 0 });
  }, []);

  const isLoading = mintingState.status === 'preparing' || 
                   mintingState.status === 'encrypting' || 
                   mintingState.status === 'minting' || 
                   mintingState.status === 'confirming' ||
                   isPending || 
                   isConfirming;

  return {
    // State
    mintingState,
    isLoading,
    isConnected,
    address,
    
    // Contract data
    artworkCount: artworkCount ? Number(artworkCount) : 0,
    mintPrice: mintPrice ? Number(mintPrice) / 1e18 : 0.1,
    
    // Actions
    mintArtwork,
    resetMintingState,
    
    // Transaction data
    transactionHash: mintingState.transactionHash,
    artworkId: mintingState.artworkId,
  };
}

// Hook for reading artwork information
export function useArtwork(artworkId: number) {
  const { data: artworkInfo } = useReadContract({
    address: MYSTIC_MINT_ADDRESS,
    abi: MYSTIC_MINT_ABI,
    functionName: 'getArtworkInfo',
    args: [BigInt(artworkId)],
  });

  return {
    artworkInfo: artworkInfo ? {
      title: artworkInfo[0],
      metadataHash: artworkInfo[1],
      creator: artworkInfo[2],
      mintTime: Number(artworkInfo[3]),
      revealTime: Number(artworkInfo[4]),
      isRevealed: artworkInfo[5],
    } : null,
    isLoading: !artworkInfo,
  };
}

// Hook for user's artworks
export function useUserArtworks(userAddress?: string) {
  const { data: userArtworks } = useReadContract({
    address: MYSTIC_MINT_ADDRESS,
    abi: MYSTIC_MINT_ABI,
    functionName: 'getUserArtworks',
    args: userAddress ? [userAddress as `0x${string}`] : undefined,
  });

  return {
    userArtworks: userArtworks ? userArtworks.map(id => Number(id)) : [],
    isLoading: !userArtworks,
  };
}
