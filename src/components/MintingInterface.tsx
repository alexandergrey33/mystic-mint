import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Lock, Sparkles, Eye, EyeOff, Wallet, CheckCircle, Loader2, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { MYSTIC_MINT_ABI, MYSTIC_MINT_ADDRESS } from '@/contracts/MysticMintABI';
import { encryptParams, validateEncryptedParams, getPatternTypeNumber } from '@/lib/fhe';
import heroArt from "@/assets/hero-art.jpg";

export const MintingInterface = () => {
  const [isEncrypted, setIsEncrypted] = useState(true);
  const [complexity, setComplexity] = useState([50]);
  const [colorVariation, setColorVariation] = useState([75]);
  const [pattern, setPattern] = useState("geometric");
  const [title, setTitle] = useState("");
  const [mintingState, setMintingState] = useState<"idle" | "connecting" | "encrypting" | "minting" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const mintingSteps = [
    { key: "connecting", label: "Connecting Wallet", progress: 20 },
    { key: "encrypting", label: "Encrypting Parameters", progress: 50 },
    { key: "minting", label: "Minting NFT", progress: 80 },
    { key: "success", label: "Mint Complete", progress: 100 }
  ];

  const handleMint = async () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter an artwork title before minting",
        variant: "destructive",
      });
      return;
    }

    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      setMintingState("encrypting");
      setProgress(50);
      
      // Step 1: Encrypt parameters using FHE
      const params = {
        complexity: complexity[0],
        colorVariation: colorVariation[0],
        patternType: getPatternTypeNumber(pattern)
      };
      
      const encryptedParams = encryptParams(params);
      
      // Validate encrypted parameters
      if (!validateEncryptedParams(encryptedParams)) {
        throw new Error("Failed to encrypt parameters");
      }
      
      toast({
        title: "Parameters Encrypted",
        description: "Your art parameters have been encrypted using FHE",
      });
      
      setTimeout(() => {
        setMintingState("minting");
        setProgress(80);
        
        // Step 2: Call smart contract with encrypted data
        writeContract({
          address: MYSTIC_MINT_ADDRESS,
          abi: MYSTIC_MINT_ABI,
          functionName: 'mintArtwork',
          args: [
            title,
            {
              complexity: encryptedParams.complexity as any, // Simulated externalEuint32
              colorVariation: encryptedParams.colorVariation as any, // Simulated externalEuint32
              patternType: encryptedParams.patternType as any, // Simulated externalEuint8
              inputProof: encryptedParams.proof
            }
          ],
          value: BigInt(0.1 * 10**18), // 0.1 ETH in wei
        });
      }, 2000);
    } catch (error) {
      setMintingState("error");
      toast({
        title: "Minting Failed",
        description: error instanceof Error ? error.message : "An error occurred during minting",
        variant: "destructive",
      });
    }
  };

  // Handle transaction success
  if (isSuccess && mintingState === "minting") {
    setMintingState("success");
    setProgress(100);
    toast({
      title: "Minting Successful!",
      description: `"${title}" has been minted with encrypted parameters`,
    });
    
    setTimeout(() => {
      setMintingState("idle");
      setProgress(0);
      setTitle("");
    }, 3000);
  }

  const toggleEncryption = () => {
    setIsEncrypted(!isEncrypted);
  };

  const getCurrentStep = () => {
    return mintingSteps.find(step => step.key === mintingState);
  };

  const isLoading = mintingState === "connecting" || mintingState === "encrypting" || mintingState === "minting";

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Preview Section */}
        <div className="space-y-6">
          <Card className="mystery-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Art Preview
                </CardTitle>
                <Badge variant="secondary" className="bg-mystery-purple">
                  {isEncrypted ? "Encrypted" : "Visible"}
                </Badge>
              </div>
              <CardDescription>
                Your generative art will be revealed after minting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <img 
                  src={heroArt} 
                  alt="Generative art preview" 
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    isEncrypted ? 'blur-lg opacity-50' : ''
                  }`}
                />
                {isEncrypted && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="text-center">
                      <Lock className="h-12 w-12 text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Parameters Encrypted
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={toggleEncryption}
            variant="outline" 
            className="w-full art-border"
          >
            {isEncrypted ? <Eye className="mr-2 h-4 w-4" /> : <EyeOff className="mr-2 h-4 w-4" />}
            {isEncrypted ? "Reveal Preview" : "Hide Preview"}
          </Button>
        </div>

        {/* Controls Section */}
        <div className="space-y-6">
          <Card className="mystery-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-accent" />
                Encrypted Parameters
              </CardTitle>
              <CardDescription>
                Configure your art generation settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Artwork Title</Label>
                <Input 
                  id="title" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter artwork title"
                  className="bg-muted/30"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label>Complexity Level</Label>
                <Slider
                  value={complexity}
                  onValueChange={setComplexity}
                  max={100}
                  step={1}
                  className="w-full"
                  disabled={isLoading}
                />
                <p className="text-sm text-muted-foreground">
                  Current: {complexity[0]}%
                </p>
              </div>

              <div className="space-y-2">
                <Label>Color Variation</Label>
                <Slider
                  value={colorVariation}
                  onValueChange={setColorVariation}
                  max={100}
                  step={1}
                  className="w-full"
                  disabled={isLoading}
                />
                <p className="text-sm text-muted-foreground">
                  Current: {colorVariation[0]}%
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pattern">Pattern Type</Label>
                <select 
                  id="pattern"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  className="w-full px-3 py-2 bg-muted/30 border border-border rounded-md"
                  disabled={isLoading}
                >
                  <option value="geometric">Geometric</option>
                  <option value="organic">Organic</option>
                  <option value="abstract">Abstract</option>
                  <option value="fractal">Fractal</option>
                </select>
              </div>

              {/* FHE Encryption Status */}
              {mintingState === "encrypting" && (
                <div className="space-y-3 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-purple-500 animate-pulse" />
                    <span className="text-sm font-medium text-purple-600">
                      FHE Encryption in Progress
                    </span>
                  </div>
                  <Progress value={progress} className="w-full" />
                  <p className="text-xs text-muted-foreground">
                    Encrypting your art parameters using Fully Homomorphic Encryption
                  </p>
                </div>
              )}

              {/* Minting Progress */}
              {isLoading && mintingState !== "encrypting" && (
                <div className="space-y-3 p-4 bg-muted/20 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm font-medium">
                      {getCurrentStep()?.label || "Processing..."}
                    </span>
                  </div>
                  <Progress value={progress} className="w-full" />
                  <p className="text-xs text-muted-foreground">
                    Please don't close this window during the minting process
                  </p>
                </div>
              )}

              {mintingState === "success" && (
                <div className="space-y-3 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/30">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600">
                      Artwork Successfully Minted!
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Your art parameters have been encrypted and stored on-chain
                    </p>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <Shield className="h-3 w-3" />
                      <span>FHE Protected</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mystery-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-purple-500" />
                Minting Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mint Price:</span>
                <span className="font-semibold">0.1 ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">FHE Encryption:</span>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-600">
                  <Shield className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Privacy Level:</span>
                <Badge variant="secondary" className="bg-pink-500/20 text-pink-600">
                  Maximum
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Gas:</span>
                <span className="text-sm">~$15</span>
              </div>
            </CardContent>
          </Card>

          {!isConnected ? (
            <div className="w-full">
              <ConnectButton 
                chainStatus="icon"
                accountStatus="avatar"
                showBalance={{
                  smallScreen: false,
                  largeScreen: true,
                }}
              />
            </div>
          ) : (
            <Button 
              onClick={handleMint}
              size="lg"
              className="w-full neon-glow bg-primary hover:bg-primary/90"
              disabled={mintingState !== "idle" || isPending || isConfirming}
            >
              {mintingState === "encrypting" || mintingState === "minting" || isPending || isConfirming ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {getCurrentStep()?.label || "Processing..."}
                </>
              ) : mintingState === "success" ? (
                <>
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Minted Successfully
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-5 w-5" />
                  Mint FHE-Protected Art
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};