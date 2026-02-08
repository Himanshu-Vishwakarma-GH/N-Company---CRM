import { useState } from "react";
import { legalContent } from "../data/legalContent";
import "./LegalCompliance.css";

const LegalCompliance = () => {
  const [selectedDoc, setSelectedDoc] = useState("terms");

  return (
    <div className="legal-page">
      <div className="legal-header">
        <h2>Legal & Compliance</h2>
        <p className="subtitle">Company policies and legal documents</p>
      </div>

      <div className="legal-container">
        {/* ===== SIDEBAR ===== */}
        <div className="legal-sidebar">
          <h3 className="sidebar-title">Documents</h3>

          <div className="doc-list">
            <button
              className={`doc-item ${
                selectedDoc === "terms" ? "active" : ""
              }`}
              onClick={() => setSelectedDoc("terms")}
            >
              Terms & Conditions
            </button>

            <button
              className={`doc-item ${
                selectedDoc === "privacy" ? "active" : ""
              }`}
              onClick={() => setSelectedDoc("privacy")}
            >
              Privacy Policy
            </button>

            <button
              className={`doc-item ${
                selectedDoc === "sla" ? "active" : ""
              }`}
              onClick={() => setSelectedDoc("sla")}
            >
              Service Level Agreement
            </button>
          </div>
        </div>

        {/* ===== CONTENT ===== */}
        <div className="legal-content">
          <pre className="content-paragraph">
            {legalContent[selectedDoc]}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default LegalCompliance;
