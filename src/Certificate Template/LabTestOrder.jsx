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



// ─── Component ────────────────────────────────────────────────────────────
export default function LabTestOrder({ pdfLoading, endLoading } = {}) {
    const { id } = useParams();
    const [appointmentData, setAppointmentData] = useState(null);
    const [patientData, setPatientData] = useState(null);
    const [labData, setLabData] = useState(null);
    const [orgData, setOrgData] = useState();

    const invoiceRef = useRef();

    // ── Fetch ──────────────────────────────────────────────────────────────────
    async function fetchAllotmentDetail() {
        try {
            const res = await getApiData(
                `api/comman/lab-order/${id}`
            );
            if (res.success) {
                setAppointmentData(res.orderData);
                setPatientData(res.ptData);
                setLabData(res.orgData);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    }

    useEffect(() => {
        if (id) fetchAllotmentDetail();
    }, [id,]);

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

    return (
        <>
             <div className="container d-flex justify-content-between align-items-center">
                <img src="/logo.png" alt="" srcset="" width={100} height={60} />
                <div>
                    <button className="thm-btn" onClick={handleDownload}>Download</button>
                </div>
            </div>

           <div className="ds-page" ref={invoiceRef}>
        <div className="ds-card">
            <div className="ds-watermark-wrap">
    </div>

    {/* ── HEADER ── */}
    <div className="ds-header d-flex justify-content-between align-items-start">
      <div className="d-flex align-items-start gap-3">
        <div className="ds-logo">
          <img src={labData?.logo ?
            `${base_url}/${labData?.logo}` : "/logo.png"} alt="" />
        </div>
        <div>
          <div className="ds-header-title">Lab Test Order</div>
          <div className="ds-header-sub">{labData?.name}</div>
          <div className="ds-header-meta">
            {labData?.nh12} <br />
            {labData?.address}
          </div>
        </div>
      </div>
      <div className="ds-header-right">
       <div className="ds-badge">NeoHealthCard Network</div>
        <p className="ds-header-system lh-base">
          Fully Automated · Ecosystem Connected
        </p>
        <p className="ds-header-meta my-0 lh-sm">{labData?.email} · {labData?.contactNumber}</p>
      </div>
    </div>

    {/* ── META STRIP ── */}
    <div className="ds-meta-strip">
      <div className="ds-meta-block">
        <div className="ds-meta-label">Lab ID</div>
        <div className="ds-meta-value fz-12">{labData?.nh12}</div>
      </div>
      <div className="ds-meta-block">
        <div className="ds-meta-label">Date &amp; Time</div>
        <div className="ds-meta-value fz-12">{new Date(appointmentData?.date)?.toLocaleString('en-GB')}</div>
      </div>
      {/* <div className="ds-meta-block">
        <div className="ds-meta-label">Urgency</div>
        <div className="ds-meta-value">Urgent</div>
      </div> */}
      <div className="ds-meta-block">
        <div className="ds-meta-label">Report To</div>
        <div className="ds-meta-value fz-12">{labData?.name} · {labData?.nh12}</div>
      </div>
    </div>

    {/* ── PATIENT ── */}
    <div className="ds-patient-section">
      <div className="flex-fill">
        <div className="ds-patient-title">Patient</div>
        <div className="ds-patient-name">{appointmentData?.patientId?.name}</div>
        <div className="ds-patient-grid">
          <div>
            <h6 className="ds-detail-key mb-0">Age / Sex</h6>      <span className="ds-detail-summary">{calculateAge(patientData?.dob, appointmentData?.createdAt)}/ {patientData?.gender}</span>
          </div>
          <div>
            <h6 className="ds-detail-key mb-0">Email Address</h6>   <span className="ds-detail-summary">{patientData?.email}</span>
          </div>

          <div>
            <h6 className="ds-detail-key mb-0">DOB</h6>             <span className="ds-detail-summary">{new Date(patientData?.dob)?.toLocaleDateString('en-GB')}</span>
          </div>
          <div>
            <h6 className="ds-detail-key mb-0">Address</h6>         <span className="ds-detail-summary">{patientData?.address}</span>
          </div>

          <div>
            <h6 className="ds-detail-key mb-0">Blood</h6>           <span className="ds-detail-summary">{patientData?.bloodGroup}</span>
          </div>
          <div>
            <h6 className="ds-detail-key mb-0">Patient ID</h6>      <span className="ds-detail-summary ds-mono">{patientData?.nh12}</span>
          </div>

          <div>
            <h6 className="ds-detail-key mb-0">Contact no</h6>      <span className="ds-detail-summary">{patientData?.contactNumber}</span>
          </div>
          <div>
            <h6 className="ds-detail-key mb-0">Dr Name</h6>         <span className="ds-detail-summary">{appointmentData?.staff?.name}</span>
          </div>

          <div>
            <h6 className="ds-detail-key mb-0"></h6>                 <span className="ds-detail-summary"></span>
          </div>
          <div>
            <h6 className="ds-detail-key mb-0">Dr ID</h6>           <span className="ds-detail-summary ds-mono">{appointmentData?.staff?.nh12}</span>
          </div>
        </div>
      </div>

      <div className="ds-qr-col">
        <div className="ds-qr-box" >
          <QRCodeCanvas
            value={`https://www.neohealthcard.com/lab-order/${appointmentData?.customId}`}
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          />
        </div>
      <p className="ds-qr-label">Scan to verify</p>
                <p>
                        <a href="javascript:void(0)" className="ds-qr-link">verify.neohealthcard.in</a>
                      </p>
      </div>
    </div>

    {/* ── TESTS TABLE ── */}
    <div className="ds-medicines-section">
      <div className="ds-table-title">Tests Ordered</div>
      <table className="ds-table">
        <thead className="ds-thead">
          <tr>
            <th className="ds-th-left">Test Name</th>
            <th className="ds-th-left">Panel / Group</th>
            <th className="ds-th-left">Sample Type</th>
            <th className="ds-th-left">Code</th>
          </tr>
        </thead>
        <tbody>
          {appointmentData?.tests?.map((item, key) =>
            item?.subCat.map((sub, i) => (
              <tr key={i} className="ds-tr-border">
                <td className="ds-td-left">{sub?.subCatId?.subCategory}</td>
                <td className="ds-td-left">{sub?.subCatId?.category?.name}</td>
                <td className="ds-td-left">{sub?.subCatId?.sample?.map(s => s?.type).join(', ')}</td>
                <td className="ds-td-left">{sub?.subCatId?.code}</td>
              </tr>
            )))}
        </tbody>
      </table>
    </div>

    {/* ── CLINICAL NOTES ── */}
    <div className="ds-notes-section">
      <div className="ds-notes-summary">
        <p className="ds-detail-section-label-header">Clinical Notes for Lab</p>
        <div className="ds-notes-box">
          Patient presenting with 3-week history of fever (103°F), weight loss (32kg underweight),
          and CBC showing Hb 8.5 g/dl. Requesting urgent panel to rule out infectious cause of fever
          and investigate anemia aetiology. Please report all values with reference ranges. Contact
          ordering doctor immediately if any critical values found.
        </div>
      </div>
    </div>

    {/* ── SIGNATURES ── */}
    <div className="hp-ds-sig-grid">
      <div className="ds-sig-cell">
        <div className="ds-sig-name">{appointmentData?.staff?.name}</div>
        <div className="ds-sig-sub">{appointmentData?.staff?.n12}</div>
        <div className="ds-sig-id">{appointmentData?.staff?.contactNumber}</div>
      </div>
      <div className="ds-sig-cell-border">
        <div className="ds-sig-name">{labData?.name}</div>
        <div className="ds-sig-sub">Accepted &amp; Registered</div>
        <div className="ds-sig-id">{labData?.nh12}</div>
      </div>
    </div>

    {/* ── FOOTER ── */}
    <div className="ds-footer">
      <span>{labData?.name}, {labData?.address} · {labData?.email} · {labData?.contactNumber}</span>
      <span className="ds-tagline">Wishing you a speedy recovery</span>
    </div>

  </div>
            </div>

        </>
    );
}
