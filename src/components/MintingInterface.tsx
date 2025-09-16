import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Lock, Sparkles, Eye, EyeOff, Wallet, CheckCircle, Loader2, Shield, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useContract } from '@/hooks/useContract';
import heroArt from "@/assets/hero-art.jpg";

export const MintingInterface = () => {
  const [isEncrypted, setIsEncrypted] = useState(true);
  const [complexity, setComplexity] = useState([50]);
  const [colorVariation, setColorVariation] = useState([75]);
  const [pattern, setPattern] = useState("geometric");
  const [title, setTitle] = useState("");
  const { toast } = useToast();
  
  // Use the contract hook for all contract interactions
  const {
    mintingState,
    isLoading,
    isConnected,
    address,
    artworkCount,
    mintPrice,
    mintArtwork,
    resetMintingState,
    transactionHash,
    artworkId
  } = useContract();

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

    // Use the contract hook to mint artwork
    await mintArtwork({
      title,
      complexity: complexity[0],
      colorVariation: colorVariation[0],
      pattern,
      mintPrice: 0.1
    });
  };

  // Auto-reset form after successful mint
  useEffect(() => {
    if (mintingState.status === 'success') {
      const timer = setTimeout(() => {
        resetMintingState();
        setTitle("");
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [mintingState.status, resetMintingState]);

  const toggleEncryption = () => {
    setIsEncrypted(!isEncrypted);
  };

  const getCurrentStep = () => {
    return mintingSteps.find(step => step.key === mintingState.status);
  };

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
              {mintingState.status === "encrypting" && (
                <div className="space-y-3 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-purple-500 animate-pulse" />
                    <span className="text-sm font-medium text-purple-600">
                      FHE Encryption in Progress
                    </span>
                  </div>
                  <Progress value={mintingState.progress} className="w-full" />
                  <p className="text-xs text-muted-foreground">
                    Encrypting your art parameters using Fully Homomorphic Encryption
                  </p>
                </div>
              )}

              {/* Minting Progress */}
              {isLoading && mintingState.status !== "encrypting" && (
                <div className="space-y-3 p-4 bg-muted/20 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm font-medium">
                      {getCurrentStep()?.label || "Processing..."}
                    </span>
                  </div>
                  <Progress value={mintingState.progress} className="w-full" />
                  <p className="text-xs text-muted-foreground">
                    Please don't close this window during the minting process
                  </p>
                </div>
              )}

              {mintingState.status === "success" && (
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
                    {transactionHash && (
                      <div className="flex items-center gap-1 text-xs text-blue-600">
                        <ExternalLink className="h-3 w-3" />
                        <span>Tx: {transactionHash.slice(0, 10)}...</span>
                      </div>
                    )}
                    {artworkId && (
                      <div className="flex items-center gap-1 text-xs text-purple-600">
                        <span>Artwork ID: #{artworkId}</span>
                      </div>
                    )}
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
                <span className="font-semibold">{mintPrice.toFixed(3)} ETH</span>
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
                <span className="text-muted-foreground">Total Artworks:</span>
                <span className="text-sm font-medium">{artworkCount}</span>
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
                      disabled={mintingState.status !== "idle" || isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          {getCurrentStep()?.label || "Processing..."}
                        </>
                      ) : mintingState.status === "success" ? (
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