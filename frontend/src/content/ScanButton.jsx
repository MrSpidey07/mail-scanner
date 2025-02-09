import { Button } from "@/components/ui/button";
import { Scan } from "lucide-react";
import { useState } from "react";

const ScanButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="dark"
      style={{
        position: "absolute",
        bottom: "8px",
        right: "16px",
        zIndex: 9999,
      }}
    >
      <div className="flex items-center gap-2">
        <Button
          variant="default"
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => console.log("Scan button clicked")}
        >
          <Scan
            className={`mr-2 transition-transform duration-300 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
            size={20}
          />
          <span className="font-semibold">Scan Now</span>
        </Button>
      </div>
    </div>
  );
};

export default ScanButton;
