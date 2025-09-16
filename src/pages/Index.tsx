import { Header } from "@/components/Header";
import { MintingInterface } from "@/components/MintingInterface";
import { StatusIndicator } from "@/components/StatusIndicator";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <MintingInterface />
      </main>
      <StatusIndicator />
    </div>
  );
};

export default Index;
