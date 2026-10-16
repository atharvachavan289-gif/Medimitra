import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./App.css";
import SafetyAlerts from './SafetyAlerts';

const LANGUAGES = [
  { code: "English", name: "English" },
  { code: "Hindi", name: "Hindi (हिंदी)" },
  { code: "Marathi", name: "Marathi (मराठी)" },
  { code: "Gujarati", name: "Gujarati (ગુજરાતી)" },
  { code: "Bengali", name: "Bengali (বাংলা)" },
  { code: "Tamil", name: "Tamil (தமிழ்)" },
  { code: "Telugu", name: "Telugu (తెలుగు)" },
  { code: "Kannada", name: "Kannada (ಕನ್ನಡ)" },
  { code: "Malayalam", name: "Malayalam (മലയാളം)" },
  { code: "Punjabi", name: "Punjabi (ਪੰਜਾਬੀ)" },
];

const PDF_I18N = {
  english: {
    header: "⚠️ Clinical Safety Alerts",
    recommendationLabel: "Recommendation: "
  },
  hindi: {
    header: "⚠️ नैदानिक सुरक्षा चेतावनियाँ (Clinical Safety Alerts)",
    recommendationLabel: "सलाह: "
  },
  marathi: {
    header: "⚠️ वैद्यकीय सुरक्षा इशारे (Clinical Safety Alerts)",
    recommendationLabel: "सल्ला: "
  },
  gujarati: {
    header: "⚠️ તબીબી સુરક્ષા ચેતવણીઓ (Clinical Safety Alerts)",
    recommendationLabel: "સલાહ: "
  },
  bengali: {
    header: "⚠️ চিকিৎসা সুরক্ষা সতর্কতা (Clinical Safety Alerts)",
    recommendationLabel: "পরামর্শ: "
  },
  tamil: {
    header: "⚠️ மருத்துவ பாதுகாப்பு எச்சரிக்கைகள் (Clinical Safety Alerts)",
    recommendationLabel: "பரிந்துரை: "
  },
  telugu: {
    header: "⚠️ వైద్య భద్రతా హెచ్చరికలు (Clinical Safety Alerts)",
    recommendationLabel: "సలహా: "
  },
  kannada: {
    header: "⚠️ ವೈದ್ಯಕೀಯ ಸುರಕ್ಷತಾ ಎಚ್ಚರಿಕೆಗಳು (Clinical Safety Alerts)",
    recommendationLabel: "ಸಲಹೆ: "
  },
  malayalam: {
    header: "⚠️ ക്ലിനിക്കൽ സുരക്ഷാ മുന്നറിയിപ്പുകൾ (Clinical Safety Alerts)",
    recommendationLabel: "ശിപാർശ: "
  },
  punjabi: {
    header: "⚠️ ਕਲੀਨਿਕਲ ਸੁਰੱਖਿਆ ਚੇਤਾਵਨੀਆਂ (Clinical Safety Alerts)",
    recommendationLabel: "ਸਲਾਹ: "
  }
};

function App() {
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [downloading, setDownloading] = useState(false);

  const pdfRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a prescription image or PDF file.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setResponseData(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", language);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Server error occurred.");
      }

      if (data.ai_structured_data && data.ai_structured_data.error) {
        setErrorMsg(data.ai_structured_data.error);
      } else {
        setResponseData(data);
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;

    setDownloading(true);
    try {
      const element = pdfRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`MediMitra_Report_${language}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to export PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const aiData = responseData?.ai_structured_data || {};

  return (
    <div className="app-container">
      {/* Header Bar */}
      <header className="navbar">
        <div className="brand">
          <span className="brand-icon">💊</span>
          <div>
            <div className="brand-title">MediMitra</div>
            <div className="brand-subtitle">AI PRESCRIPTION INTERPRETER</div>
          </div>
        </div>
        <div className="status-badge">Stage 8 Active</div>
      </header>

      {/* Main Dashboard Layout */}
      <div className="dashboard-grid">
        {/* Sidebar */}
        <aside>
          <div className="card-panel">
            <h2 className="panel-title">📄 Upload Document</h2>
            <form onSubmit={handleUpload}>
              <div className="form-group">
                <label className="form-label">Prescription File (Image/PDF)</label>
                <label className="dropzone">
                  <svg
                    className="dropzone-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span className="dropzone-text">Click to choose file</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="hidden-input"
                  />
                </label>
                {file && <p className="file-selected-tag">📄 {file.name}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Target Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="select-control"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Analyzing..." : "Analyze Prescription"}
              </button>
            </form>
          </div>

          {responseData && (
            <div className="card-panel">
              <h4 style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "0.75rem" }}>
                DOCUMENT METADATA
              </h4>
              <p style={{ fontSize: "0.85rem", marginBottom: "0.4rem" }}>
                <strong>File:</strong> {responseData.filename}
              </p>
              <p style={{ fontSize: "0.85rem", marginBottom: "0.4rem" }}>
                <strong>Type:</strong> {responseData.content_type}
              </p>
              <p style={{ fontSize: "0.85rem" }}>
                <strong>Language:</strong> {responseData.target_language}
              </p>

              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="btn-secondary"
              >
                {downloading ? "Generating PDF..." : "📥 Download PDF Summary"}
              </button>
            </div>
          )}
        </aside>

        {/* Main Display Area */}
        <main>
          {errorMsg && (
            <div className="error-banner">
              ⚠️ <strong>Processing Error:</strong> {errorMsg}
            </div>
          )}

          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p style={{ color: "#64748b", fontWeight: 500 }}>
                Processing text and standardizing drug names...
              </p>
            </div>
          )}

          {!loading && !responseData && !errorMsg && (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3 style={{ marginBottom: "0.5rem" }}>No Document Loaded</h3>
              <p style={{ color: "#64748b", maxWidth: "400px", margin: "0 auto" }}>
                Upload a doctor's prescription (Image or PDF) from the left panel to translate dosages and instructions into your preferred regional language.
              </p>
            </div>
          )}

          {responseData && !errorMsg && (
            <div className="card-panel" ref={pdfRef}>
              {/* Header Branding */}
              <div style={{ borderBottom: "2px solid #2563eb", paddingBottom: "8px", marginBottom: "1rem" }}>
                <h2 style={{ color: "#1e3a8a", margin: 0 }}>MediMitra Prescription Summary</h2>
                <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                  Generated via Multimodal Healthcare Interpreter
                </span>
              </div>

              {/* Patient Banner */}
              <div className="patient-banner">
                <div>
                  <div className="patient-info-label">Patient Name</div>
                  <div className="patient-info-val">{aiData.patient?.name || "Not Specified"}</div>
                </div>
                <div>
                  <div className="patient-info-label">Age / Gender</div>
                  <div className="patient-info-val">{aiData.patient?.age || "N/A"}</div>
                </div>
                <div>
                  <div className="patient-info-label">Target Language</div>
                  <div className="patient-info-val">{responseData.target_language}</div>
                </div>
              </div>

              {/* Medication Table */}
              <h3 className="panel-title">💊 Medication Guidance</h3>
              <div className="table-wrapper">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Medicine</th>
                      <th>Dosage</th>
                      <th>Shorthand</th>
                      <th>Purpose ({responseData.target_language})</th>
                      <th>Instructions ({responseData.target_language})</th>
                    </tr>
                  </thead>
                  <tbody>
  {aiData.medicines && aiData.medicines.length > 0 ? (
    aiData.medicines.map((med, idx) => (
      <tr key={idx}>
        <td>{idx + 1}</td>
        <td style={{ fontWeight: "700" }}>
          {med.name || med.medicine_name || "N/A"}
        </td>
        <td>
          <span className="badge-dosage">{med.dosage || "N/A"}</span>
        </td>
        <td>
          <code className="code-shorthand">
            {med.frequency || med.shorthand || "N/A"}
          </code>
        </td>
        <td>{med.purpose || "N/A"}</td>
        <td style={{ fontWeight: "500" }}>{med.instructions || "N/A"}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={6} style={{ textAlign: "center", padding: "1.5rem" }}>
        No medications detected.
      </td>
    </tr>
  )}
</tbody>
                </table>
              </div>

              {/* Lab Tests & Safety Precautions (2-Column Grid) */}
              <div className="two-col-grid">
                {aiData.lab_tests && aiData.lab_tests.length > 0 && (
                  <div className="card-lab">
                    <h3>🧪 Lab Tests Requested</h3>
                    <ul>
                      {aiData.lab_tests.map((lab, i) => (
                        <li key={i}>
                          <strong>{lab.test_name}</strong> {lab.value && `- ${lab.value} ${lab.unit}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {aiData.safety_notes && aiData.safety_notes.length > 0 && (
                  <div className="card-safety">
                    <h3>⚠️ Safety Precautions</h3>
                    <ul>
                      {aiData.safety_notes.map((note, i) => (
                        <li key={i}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* ⚠️ CLINICAL SAFETY ALERTS BANNER (Outside two-col-grid for Full Width) */}
              {aiData.safety_warnings && aiData.safety_warnings.length > 0 && (
                <div style={{ width: '100%', marginTop: '1.5rem' }}>
                  <SafetyAlerts warnings={aiData.safety_warnings} />
                </div>
              )}

            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;