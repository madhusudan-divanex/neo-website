
import React, { useEffect, useRef, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { QRCodeCanvas } from "qrcode.react";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import base_url from "../baseUrl";
import { getApiData } from "../Services/api";
import { calculateAge, stripHtml } from "../Services/globalFunction";
import "./Template css/DischargeSummary.css"



const LabReport = ({ reportId, pdfLoading, endLoading }) => {
   const { id } = useParams();
  const [appointmentData, setAppointmentData] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [labData, setLabData] = useState(null);
  const [testReports, setTestReports] = useState([]);
  const [sampleData, setSampleData] = useState()
 
  const invoiceRef = useRef();
 
  // ── Fetch ──────────────────────────────────────────────────────────────────
  async function fetchAllotmentDetail() {
   
    try {
      const res = await getApiData(
        `api/comman/lab-report/${reportId || id}`
      );
      if (res.success) {
        setAppointmentData(res.appointmentData);
        setPatientData(res.patientData);
        setLabData(res.labData);
        setTestReports(res.testReports || []);
        setSampleData(res.sampleData);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
 
  useEffect(() => {
    if (id || reportId) fetchAllotmentDetail();
  }, [id, reportId]);

    // ── PDF Download ───────────────────────────────────────────────────────────
    const handleDownload = () => {
        try {
            const element = invoiceRef.current;
            document.body.classList.add("hide-buttons");
            const opt = {
                margin: 0,
                filename: `LabReport-${appointmentData?.customId}.pdf`,
                html2canvas: { scale: 2, useCORS: true, allowTaint: true },
                jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
            };
            html2pdf()
                .from(element)
                .set(opt)
                .save()
                .then(() => document.body.classList.remove("hide-buttons"));
        } catch (_) {
        } finally {
            if (pdfLoading) endLoading();
        }
    };

    useEffect(() => {
        if (appointmentData && patientData && labData && pdfLoading) {
            const timer = setTimeout(handleDownload, 1500);
            return () => clearTimeout(timer);
        }
    }, [appointmentData, patientData, labData, pdfLoading]);

    // ── Helpers ────────────────────────────────────────────────────────────────
    const statusStyle = (status) => {
        if (!status) return {};
        const s = status.toLowerCase();
        if (s === "high") return { color: "#dc2626", fontWeight: 600 };
        if (s === "low") return { color: "#d97706", fontWeight: 600 };
        if (s === "normal") return { color: "#16a34a" };
        return {};
    };

    const computeStatus = (resultStr, minRange, maxRange) => {
        const num = parseFloat(resultStr);
        if (isNaN(num)) return "—";
        if (num < minRange) return "Low";
        if (num > maxRange) return "High";
        return "Normal";
    };

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <>
            <div className="container mt-2 d-flex justify-content-between align-items-center">
                <img src="/logo.png" alt="" srcset="" width={100} height={60} />
                <div>

                    <button className="thm-btn" onClick={handleDownload}>Download</button>
                </div>
            </div>

            <div className="ds-page"  ref={invoiceRef}>
      <div className="ds-card position-relative">
        <div className="ds-watermark-wrap"></div>
        <div className="ds-header">
          <div className="d-flex gap-3">
 
            <div className="ds-logo">
              <img
                src={
                  labData?.logo
                    ? `${base_url}/${labData?.logo}`
                    : "/logo.png"
                }
                alt=""
              />
            </div>
 
            <div>
              <h1 className="ds-header-title">
                Lab Report
              </h1>
 
              <div className="ds-header-sub">
                {labData?.name}
              </div>
 
              <div className="ds-header-meta">
                {[labData?.address, labData?.city?.name, labData?.state?.name, labData?.pinCode]
                  .filter(Boolean)
                  .join(", ")}
              </div>
            </div>
          </div>
 
          <div className="ds-header-right">
            <div className="ds-badge">
              NeoHealthCard Network
            </div>
 
            <div className="ds-header-system">
              Fully Automated · Ecosystem Connected
            </div>
 
            <div className="ds-header-meta">
              {labData?.email} ·  {labData?.contactNumber}
            </div>
 
 
          </div>
        </div>
        <div className="ds-meta-strip">
          <div className="ds-meta-block">
            <div className="ds-meta-label">
              Report Id
            </div>
 
            <div className="ds-meta-value">
              {testReports[0]?.customId}
            </div>
          </div>
          <div className="ds-meta-block">
            <div className="ds-meta-label">
              Sample Id
            </div>
 
            <div className="ds-meta-value">
              {sampleData?.customId}
            </div>
          </div>
          <div className="ds-meta-block">
            <div className="ds-meta-label">
              Lab Order Ref
            </div>
 
            <div className="ds-meta-value">
              {appointmentData?.customId}
            </div>
          </div>
 
          <div className="ds-meta-block">
            <div className="ds-meta-label">
              Collected
            </div>
 
            <div className="ds-meta-value">
              {new Date(sampleData?.createdAt)?.toLocaleString('en-GB')}
            </div>
          </div>
 
          <div className="ds-meta-block">
            <div className="ds-meta-label">
              Reported
            </div>
 
            <div className="ds-meta-value">
              {testReports[0]?.createdAt
                ? new Date(testReports[0].createdAt).toLocaleString("en-GB")
                : "—"}
            </div>
          </div>
 
        </div>
        {/* ── PATIENT ── */}
        <div className="ds-patient-section">
 
          <div className="ds-patient-left">
 
            <h2 className="ds-patient-name">
              {patientData?.name}
            </h2>
 
            <div className="ds-patient-grid">
 
              <div>
                <div className="ds-detail-key">
                  Age / Sex
                </div>
 
                <div className="ds-detail-summary">
                  {`${calculateAge(
                    patientData?.dob,
                    appointmentData?.createdAt
                  )} / ${patientData?.gender || "-"}`}
                </div>
              </div>
 
              <div>
                <div className="ds-detail-key">
                  Email Address
                </div>
 
                <div className="ds-detail-summary">
                  {patientData?.email}
                </div>
              </div>
              <div>
                <div className="ds-detail-key">
                  Patient ID
                </div>
 
                <div className="ds-detail-summary">
                  {patientData?.nh12}
                </div>
              </div>
 
              <div>
                <div className="ds-detail-key">
                  DOB
                </div>
 
                <div className="ds-detail-summary">
                  {patientData?.dob
                    ? new Date(patientData.dob).toLocaleDateString("en-GB")
                    : "—"}
                </div>
              </div>
 
              <div>
                <div className="ds-detail-key">
                  Address
                </div>
 
                <div className="ds-detail-summary">
                  {patientData?.address || "-"}
                </div>
              </div>
 
              <div>
                <div className="ds-detail-key">
                  Dr Name
                </div>
 
                <div className="ds-detail-summary">
                  {appointmentData?.staff?.name || "-"}
                </div>
              </div>
              <div>
                <div className="ds-detail-key">
                  Contact
                </div>
 
                <div className="ds-detail-summary">
                  {patientData?.contactNumber}
                </div>
              </div>
 
 
              <div>
                <div className="ds-detail-key">
                  Blood
                </div>
 
                <div className="ds-detail-summary">
                  {patientData?.bloodGroup || "-"}
                </div>
              </div>
              <div>
                <div className="ds-detail-key">
                  Dr ID
                </div>
 
                <div className="ds-detail-summary">
                  {appointmentData?.staff?.nh12 || "-"}
                </div>
              </div>
 
 
            </div>
          </div>
 
          <div className="ds-qr-col">
            <div className="ds-qr-box">
              <QRCodeCanvas
                value={`https://www.neohealthcard.com/doctor-appointment-receipt/${reportId}`}
                size={256}
                className="qr-codes"
                style={{
                  height: "auto",
                  maxWidth: "100%",
                  width: "100%",
                }}
              />
            </div>
 
            <div className="ds-qr-label">
              Scan to verify
            </div>
 
            <div className="ds-qr-link">
              verify.neohealthcard.in
            </div>
          </div>
 
        </div>
 
        {testReports.length === 0 && (
          <div className="ds-notes-section text-center">
            <div className="ds-header-meta">
              No test reports available.
            </div>
          </div>
        )}
 
        {testReports.map((report, rIdx) => {
          const subCat = report?.subCatId;
          const subCatName = subCat?.subCategory ?? `Test ${rIdx + 1}`;
          const definitions = subCat?.component ?? [];
          const results = report?.component ?? [];
          const upload = report?.upload;
 
          const resultMap = {};
 
          results.forEach((r) => {
            if (r.cmpId) resultMap[r.cmpId] = r;
          });
 
          return (
            <div
              className="ds-medicines-section"
              key={report?._id || rIdx}
            >
 
              <p className="ds-table-title text-center">
                {subCatName}
              </p>
 
              <table className="ds-table">
 
                <thead className="ds-thead">
                  <tr>
                    <th className="ds-th-left">
                      Test
                    </th>
 
                    <th className="ds-th-right">
                      Result
                    </th>
 
                    <th className="ds-th-right">
                      Reference Range
                    </th>
 
                    <th className="ds-th-right">
                      Unit
                    </th>
                  </tr>
                </thead>
 
                <tbody>
 
                  {definitions.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        className="ds-td-left text-center"
                      >
                        No parameters defined.
                      </td>
                    </tr>
                  )}
 
                  {definitions.map((cmp, cIdx) => {
                    const cmpIdStr = cmp._id?.toString();
                    const res = resultMap[cmpIdStr] || {};
 
                    const resultVal =
                      res.result !== undefined &&
                        res.result !== ""
                        ? res.result
                        : res.textResult || "—";
 
                    const range =
                      cmp.optionType == "text"
                        ? `${cmp.minRange} – ${cmp.maxRange}`
                        : "Positve-Negative";
 
                    const status =
                      res.status ||
                      (cmp.minRange !== undefined &&
                        cmp.maxRange !== undefined &&
                        res.result
                        ? computeStatus(
                          res.result,
                          cmp.minRange,
                          cmp.maxRange
                        )
                        : "—");
 
                    const showTitle =
                      cmp.title &&
                      (cIdx === 0 ||
                        definitions[cIdx - 1]?.title !== cmp.title);
 
                    return (
                      <React.Fragment key={cmp._id || cIdx}>
 
                        <tr className="ds-tr-border">
                          <td className="ds-td-left">
                            {cmp.name}
                          </td>
 
                          <td className="ds-td-right">
                            {resultVal}
                          </td>
 
                          <td className="ds-td-right">
                            {range}
                          </td>
 
                          <td className="ds-td-right">
                            {cmp.unit}
                          </td>
                        </tr>
 
                      </React.Fragment>
                    );
                  })}
 
                </tbody>
              </table>
 
              {/* Remark */}
              {report?.remark && (
                <div className="ds-header-meta mt-2">
                  <strong>Remark:</strong> {report.remark}
                </div>
              )}
            </div>
          );
        })}
 
        <div className="ds-notes-section">
          <div className="ds-notes-summary">
            <p className="ds-detail-section-label-header">
              GENERAL INSTRUCTION
            </p>
 
            <div className="ds-notes-box">
 
              <ol className="mb-2 ps-3">
 
                <li>
                  Please consult your doctor before making any medical decisions based on these results.
                </li>
 
                <li>
                  Results are specific to the sample collected on the mentioned date.
                </li>
 
                <li>
                  Clinical correlation is advised.
                </li>
 
                <li>
                  Follow up as recommended by your physician.
                </li>
 
              </ol>
 
              <div>
                Clinical correlation advised. Follow up in 3 days.
              </div>
 
            </div>
          </div>
        </div>
 
        <div className="ds-sig-grid">
 
          <div className="ds-sig-cell">
            <div className="ds-sig-name">
              Lab Technician
            </div>
 
            <div className="ds-sig-sub ">
              {labData?.name}
            </div>
 
            <div className="ds-sig-id my-0">
              {labData?.nh12}
            </div>
          </div>
 
          <div className="ds-sig-cell-border d-flex flex-column">
            <div className="ds-sig-name">
              Lab Doctor
            </div>
 
            <div className="ds-sig-sub">
              {appointmentData?.staff?.name}
            </div>
 
            <div className="ds-sig-id my-0">
              {appointmentData?.staff?.nh12}
            </div>
          </div>
 
          <div className="ds-sig-cell-border d-flex flex-column">
            <div className="ds-sig-name">
              Patient
            </div>
 
            <div className="ds-sig-sub ">
              {patientData?.name}
            </div>
 
            <div className="ds-sig-id my-0">
              {patientData?.nh12}
            </div>
          </div>
 
        </div>
 
        {/* ── FOOTER ── */}
        <div className="ds-footer">
          <span>
            {patientData?.orgName}, Mumbai · {patientData?.orgEmail} ·{" "}
            {patientData?.orgContactNumber}
          </span>
 
          <span>
            Wishing you a speedy recovery
          </span>
        </div>
 
      </div>
            </div>
        </>
    );
};

// ── Helper ────────────────────────────────────────────────────────────────────
const MetaCol = ({ title, value }) => (
    <div className="col">
        <div className="text-secondary">{title}</div>
        <div className="fw-medium text-dark">{value || "—"}</div>
    </div>
);

export default LabReport;