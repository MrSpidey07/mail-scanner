import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ResultPopup = ({ data, onClose }) => {
  const tempSafeScore = data.safeScore;
  const safeScore = Number(tempSafeScore.replace("%", ""));
  const getScoreColor = () => {
    if (safeScore > 75) return "#10B981";
    if (safeScore > 50) return "#F59E0B";
    return "#EF4444";
  };

  const chartData = {
    datasets: [
      {
        data: [safeScore, 100 - safeScore],
        backgroundColor: [getScoreColor(), "#F3F4F6"],
        borderWidth: 0,
      },
    ],
  };

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    zIndex: 10000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(2px)",
  };

  const popupStyle = {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "24px",
    width: "500px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
    position: "relative",
    fontFamily: "'Inter', sans-serif",
  };

  const closeButtonStyle = {
    position: "absolute",
    top: "16px",
    right: "16px",
    background: "#F3F4F6",
    border: "none",
    borderRadius: "50%",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    ":hover": {
      background: "#E5E7EB",
    },
  };

  const sectionTitleStyle = {
    marginTop: "24px",
    marginBottom: "12px",
    paddingBottom: "8px",
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    borderBottom: "2px solid #E5E7EB",
  };

  const statusBadgeStyle = {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "500",
    backgroundColor: getScoreColor() + "20",
    color: getScoreColor(),
  };

  return (
    <div style={overlayStyle}>
      <div style={popupStyle}>
        <button style={closeButtonStyle} onClick={onClose}>
          &times;
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            marginBottom: "24px",
          }}
        >
          <div style={{ width: "100px", height: "100px" }}>
            <Pie
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: false, tooltip: { enabled: false } },
              }}
            />
          </div>
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "24px",
                fontWeight: "700",
                color: "#1F2937",
              }}
            >
              Security Summary
            </h2>
            <div style={{ marginTop: "12px" }}>
              <span style={statusBadgeStyle}>{safeScore}% Safe</span>
            </div>
          </div>
        </div>

        <div>
          <h3 style={sectionTitleStyle}>Threat Analysis</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                padding: "16px",
                borderRadius: "8px",
                background: "#F9FAFB",
              }}
            >
              <div style={{ fontSize: "14px", color: "#6B7280" }}>
                Malicious
              </div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#EF4444",
                }}
              >
                {data.stats.malicious}
              </div>
            </div>
            <div
              style={{
                padding: "16px",
                borderRadius: "8px",
                background: "#F9FAFB",
              }}
            >
              <div style={{ fontSize: "14px", color: "#6B7280" }}>
                Suspicious
              </div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#F59E0B",
                }}
              >
                {data.stats.suspicious}
              </div>
            </div>
            <div
              style={{
                padding: "16px",
                borderRadius: "8px",
                background: "#F9FAFB",
              }}
            >
              <div style={{ fontSize: "14px", color: "#6B7280" }}>
                Undetected
              </div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#6B7280",
                }}
              >
                {data.stats.undetected}
              </div>
            </div>
            <div
              style={{
                padding: "16px",
                borderRadius: "8px",
                background: "#F9FAFB",
              }}
            >
              <div style={{ fontSize: "14px", color: "#6B7280" }}>Harmless</div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#10B981",
                }}
              >
                {data.stats.harmless}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 style={sectionTitleStyle}>Detailed Results</h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {Object.entries(data.results).map(([url, info]) => (
              <div
                key={url}
                style={{
                  padding: "16px",
                  borderRadius: "8px",
                  background: "#F9FAFB",
                  border: "1px solid #E5E7EB",
                }}
              >
                <div
                  style={{
                    marginBottom: "8px",
                    width: "100%",
                    overflow: "hidden",
                  }}
                >
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#3B82F6",
                      textDecoration: "none",
                      fontWeight: "500",
                      display: "block",
                      width: "100%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      ":hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {url}
                  </a>
                </div>
                <div style={{ display: "flex", gap: "16px", fontSize: "14px" }}>
                  <div style={{ color: "#6B7280" }}>
                    Category:{" "}
                    <span style={{ color: "#1F2937" }}>{info.category}</span>
                  </div>
                  <div style={{ color: "#6B7280" }}>
                    Result:{" "}
                    <span
                      style={{
                        color: info.result === "clean" ? "#10B981" : "#EF4444",
                        fontWeight: "500",
                      }}
                    >
                      {info.result}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPopup;
