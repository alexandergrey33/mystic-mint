// Contract interaction utilities for Mystic Mint
import { parseEther, encodeAbiParameters, parseAbiParameters } from 'viem';
import { MYSTIC_MINT_ABI, MYSTIC_MINT_ADDRESS } from '@/contracts/MysticMintABI';
import { encryptParams, validateEncryptedParams, getPatternTypeNumber } from './fhe';

export interface MintingParams {
  title: string;
  complexity: number;
  colorVariation: number;
  pattern: string;
}

export interface ContractMintingParams {
  complexity: string; // Encrypted complexity
  colorVariation: string; // Encrypted color variation
  patternType: string; // Encrypted pattern type
  inputProof: string; // FHE proof
}

export interface MintResult {
  success: boolean;
  transactionHash?: string;
  artworkId?: number;
  error?: string;
}

/**
 * Prepare encrypted parameters for contract interaction
 */
export function prepareEncryptedParams(params: MintingParams): ContractMintingParams {
  const fheParams = {
    complexity: params.complexity,
    colorVariation: params.colorVariation,
    patternType: getPatternTypeNumber(params.pattern)
  };

  const encrypted = encryptParams(fheParams);
  
  if (!validateEncryptedParams(encrypted)) {
    throw new Error('Failed to validate encrypted parameters');
  }

  return {
    complexity: encrypted.complexity,
    colorVariation: encrypted.colorVariation,
    patternType: encrypted.patternType,
    inputProof: encrypted.proof
  };
}

/**
 * Encode parameters for contract call
 */
export function encodeContractParams(
  title: string,
  encryptedParams: ContractMintingParams
) {
  try {
    // Encode the minting parameters struct
    const structParams = [
      { name: 'complexity', type: 'string', value: encryptedParams.complexity },
      { name: 'colorVariation', type: 'string', value: encryptedParams.colorVariation },
      { name: 'patternType', type: 'string', value: encryptedParams.patternType },
      { name: 'inputProof', type: 'string', value: encryptedParams.inputProof }
    ];

    // For demonstration, we'll use a simplified encoding
    // In a real FHE implementation, this would use proper FHE encoding
    const encodedParams = {
      complexity: encryptedParams.complexity,
      colorVariation: encryptedParams.colorVariation,
      patternType: encryptedParams.patternType,
      inputProof: encryptedParams.inputProof
    };

    return [title, encodedParams];
  } catch (error) {
    throw new Error(`Failed to encode contract parameters: ${error}`);
  }
}

/**
 * Calculate mint price in wei
 */
export function calculateMintPrice(ethAmount: number = 0.1): bigint {
  return parseEther(ethAmount.toString());
}

/**
 * Validate contract address
 */
export function validateContractAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Get contract configuration
 */
export function getContractConfig() {
  return {
    address: MYSTIC_MINT_ADDRESS,
    abi: MYSTIC_MINT_ABI,
    functionName: 'mintArtwork' as const,
  };
}

/**
 * Prepare contract call data
 */
export function prepareContractCall(
  title: string,
  params: MintingParams,
  mintPrice: number = 0.1
) {
  // Validate inputs
  if (!title.trim()) {
    throw new Error('Artwork title is required');
  }

  if (params.complexity < 0 || params.complexity > 100) {
    throw new Error('Complexity must be between 0 and 100');
  }

  if (params.colorVariation < 0 || params.colorVariation > 100) {
    throw new Error('Color variation must be between 0 and 100');
  }

  // Prepare encrypted parameters
  const encryptedParams = prepareEncryptedParams(params);
  
  // Encode parameters for contract
  const encodedParams = encodeContractParams(title, encryptedParams);
  
  // Calculate mint price
  const value = calculateMintPrice(mintPrice);
  
  // Get contract configuration
  const contractConfig = getContractConfig();
  
  return {
    ...contractConfig,
    args: encodedParams,
    value,
  };
}

/**
 * Parse contract event data
 */
export function parseMintEvent(eventData: any) {
  try {
    return {
      artworkId: Number(eventData.artworkId),
      creator: eventData.creator,
      title: eventData.title,
      mintTime: Number(eventData.mintTime),
      transactionHash: eventData.transactionHash
    };
  } catch (error) {
    throw new Error(`Failed to parse mint event: ${error}`);
  }
}

/**
 * Generate metadata hash for artwork
 */
export function generateMetadataHash(params: MintingParams): string {
  const metadata = {
    title: params.title,
    complexity: params.complexity,
    colorVariation: params.colorVariation,
    pattern: params.pattern,
    timestamp: Date.now(),
    version: '1.0.0'
  };
  
  // Simple hash generation (in production, use proper hashing)
  return btoa(JSON.stringify(metadata)).slice(0, 32);
}

/**
 * Validate mint transaction result
 */
export function validateMintResult(result: any): MintResult {
  if (!result) {
    return { success: false, error: 'No transaction result' };
  }

  if (result.error) {
    return { success: false, error: result.error.message || 'Transaction failed' };
  }

  if (result.hash) {
    return { 
      success: true, 
      transactionHash: result.hash,
      artworkId: result.artworkId // This would come from the contract event
    };
  }

  return { success: false, error: 'Unknown transaction state' };
}
