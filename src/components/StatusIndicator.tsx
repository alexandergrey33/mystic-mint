import { Badge } from "@/components/ui/badge";
import { Shield, Zap, CheckCircle } from "lucide-react";

export const StatusIndicator = () => {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2">
      <Badge 
        variant="secondary" 
        className="bg-mystery-purple/80 backdrop-blur-sm border border-primary/20 animate-glow"
      >
        <Shield className="h-3 w-3 mr-1" />
        Rarity Protected
      </Badge>
      
      <Badge 
        variant="secondary" 
        className="bg-neon-green/20 backdrop-blur-sm border border-neon-green/30"
      >
        <Zap className="h-3 w-3 mr-1" />
        Network: Mainnet
      </Badge>
      
      <Badge 
        variant="secondary" 
        className="bg-accent/20 backdrop-blur-sm border border-accent/30"
      >
        <CheckCircle className="h-3 w-3 mr-1" />
        Encryption Active
      </Badge>
    </div>
  );
};