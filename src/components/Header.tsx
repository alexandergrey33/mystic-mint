import { ConnectButton } from '@rainbow-me/rainbowkit';

export const Header = () => {
  return (
    <header className="border-b border-border/50 backdrop-blur-sm bg-background/80">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-1">
            <h1 className="text-3xl font-bold encrypted-text">
              Create Art, Keep Rarity Private
            </h1>
            <p className="text-muted-foreground">
              Confidential generative art minting platform
            </p>
          </div>
          
          <ConnectButton 
            chainStatus="icon"
            accountStatus="avatar"
            showBalance={{
              smallScreen: false,
              largeScreen: true,
            }}
          />
        </div>
      </div>
    </header>
  );
};