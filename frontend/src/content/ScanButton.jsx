import { useState } from "react";
import { Scan } from "lucide-react";
import "@/content/ScanButton.css";

const ScanButton = ({ onClick, isLoading }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="scan-button-container">
      <button
        className={`scan-button ${isLoading ? "loading" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        disabled={isLoading}
      >
        <Scan className={`scan-icon ${isHovered ? "hover" : ""}`} size={16} />
        <span>{isLoading ? "Scanning..." : "Scan"}</span>
      </button>
    </div>
  );
};

export default ScanButton;
