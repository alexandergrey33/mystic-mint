import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Unlock } from "lucide-react";

interface EncryptedDisplayProps {
  value: string | number;
  label: string;
  encrypted?: boolean;
}

export const EncryptedDisplay = ({ value, label, encrypted = true }: EncryptedDisplayProps) => {
  const [displayValue, setDisplayValue] = useState<string>("");

  useEffect(() => {
    if (encrypted) {
      // Generate random encrypted-looking text
      const chars = "ABCDEF0123456789";
      const randomValue = Array.from({ length: 8 }, () => 
        chars.charAt(Math.floor(Math.random() * chars.length))
      ).join("");
      setDisplayValue(`0x${randomValue}...`);
    } else {
      setDisplayValue(String(value));
    }
  }, [encrypted, value]);

  return (
    <Card className="mystery-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">{label}</span>
          <Badge variant="secondary" className={encrypted ? "bg-mystery-purple" : "bg-neon-green/20"}>
            {encrypted ? <Lock className="h-3 w-3 mr-1" /> : <Unlock className="h-3 w-3 mr-1" />}
            {encrypted ? "Encrypted" : "Revealed"}
          </Badge>
        </div>
        <div className={`font-mono text-lg ${encrypted ? "encrypted-text" : "text-foreground"}`}>
          {displayValue}
        </div>
      </CardContent>
    </Card>
  );
};