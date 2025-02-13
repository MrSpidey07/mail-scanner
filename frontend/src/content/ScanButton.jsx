import { useState } from "react";
import { Scan } from "lucide-react";
import "@/content/ScanButton.css";
import { extractEmailContent } from "@/background";

const ScanButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="scan-button-container">
      <button
        className="scan-button"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => extractEmailContent()}
      >
        <Scan className={`scan-icon ${isHovered ? "hover" : ""}`} size={16} />
        <span>Scan</span>
      </button>
    </div>
  );
};

export default ScanButton;
