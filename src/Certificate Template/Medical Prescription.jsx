import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { QRCodeCanvas } from "qrcode.react";
import { calculateAge } from "../Services/globalFunction";
import { getApiData } from "../Services/api";
import "./Template css/DischargeSummary.css"

// ── Component ────────────────────────────────────────────────────────────
export default function MedicalPrescription({ presId, pdfLoading, endLoading }) {
  const { id } = useParams()
  const [ptData, setPtData] = useState()
  const [aptData, setAptData] = useState()
  const [prescription, setPrescription] = useState()
  async function fetchAptPayment() {
    try {
      const res = await getApiData(`api/comman/prescription/${presId || id}`)

      if (res.success) {
        setAptData(res.data)
        setPtData(res.ptData)
        setPrescription(res.prescription)
      } else {
        toast.error(res.message)
      }
    } catch (error) {

    }
  }
  useEffect(() => {
    fetchAptPayment()
  }, [presId])
  const invoiceRef = useRef()
  const handleDownload = () => {
    try {

      const element = invoiceRef.current;
      document.body.classList.add("hide-buttons");
      const opt = {
        margin: 0,
        filename: `Prescription-${prescription?.customId}.pdf`,
        html2canvas: { scale: 2, useCORS: true, allowTaint: true },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
      };

      html2pdf().from(element).set(opt).save().then(() => {
        document.body.classList.remove("hide-buttons");
      });
    } catch (error) {

    } finally {
      if (pdfLoading) endLoading();
    }
  };
  return (
    <>
      <div className="container mt-2 d-flex justify-content-between align-items-center align-items-center">
        <img src="/logo.png" alt="" srcset="" width={100} height={60} />
        <div>

          <button className="thm-btn" onClick={handleDownload}>Download</button>
        </div>
      </div>
      <>
      

     <div className="ds-page" ref={invoiceRef}>
    <div className="ds-card">
      <div className="ds-watermark-wrap">
    </div>

      {/* ── HEADER ── */}
      <div className="ds-header d-flex justify-content-between align-items-start">
        <div className="d-flex align-items-start gap-3">
          <div className="ds-logo">
            <img src="/logo.png" alt="" srcset="" />
          </div>
          <div>
            <div className="ds-header-title">Medical Prescription</div>
            <div className="ds-header-sub">{aptData?.orgName}</div>
            <div className="ds-header-meta">
              {aptData?.orgNh12}<br />
              {aptData?.orgAddress ? aptData?.orgAddress : ''}
            </div>
          </div>
        </div>

        <div className="ds-header-right">
          <div className="ds-badge">NeoHealthCard Network</div>
          <p className="ds-header-system lh-base">
          Fully Automated · Ecosystem Connected
        </p>
          <p className="ds-header-meta my-0 lh-sm" >{aptData?.orgEmail} · {aptData?.orgContactNumber}</p>
        </div>
      </div>

      {/* ── META STRIP ── */}
      <div className="ds-meta-strip">
        <div className="ds-meta-block">
          <p className="ds-meta-label">Prescription ID</p>
          <p className="fz-12 ds-meta-value">{prescription?.customId}</p>
        </div>
        <div className="ds-meta-block">
          <div className="ds-meta-label">Date &amp; Time</div>
          <div className="fz-12 ds-meta-value">{new Date(prescription?.createdAt)?.toLocaleString('en-GB')}</div>
        </div>
        <div className="ds-meta-block">
          <div className="ds-meta-label">Diagnosis</div>
          <div className="fz-12 ds-meta-value">{prescription?.diagnosis}</div>
        </div>
        {/* <div className="ds-mc">
          <div className="ds-ml">Valid For</div>
          <div className="ds-mv">30 Days</div>
        </div> */}
      </div>

      {/* ── PATIENT ── */}
      <div className="ds-patient-section">
        <div className="flex-fill">
          <div className="ds-patient-title">Patient</div>
          <div className="ds-patient-name">{ptData?.name}</div>
          <div className="ds-patient-grid">
          <div>
              <h6 className="ds-detail-key mb-0">Age / Sex</h6>      <span className="ds-detail-summary text-capitalize">{calculateAge(ptData?.dob)}/ {ptData?.gender}</span>
          </div>

           <div>
             <h6 className="ds-detail-key mb-0">Email Address</h6>   <span className="ds-detail-summary">{ptData?.email}</span>
           </div>

           <div>
             <h6 className="ds-detail-key mb-0">Patient ID</h6>      <span className="ds-detail-summary ds-mono">{ptData?.nh12}</span>
           </div>

            <div>
              <h6 className="ds-detail-key mb-0">DOB</h6>             <span className="ds-detail-summary">{new Date(ptData?.dob)?.toLocaleDateString('en-GB')}</span>
            </div>

            <div>
              <h6 className="ds-detail-key mb-0">Address</h6>         <span className="ds-detail-summary">{ptData?.address}</span>
            </div>

               <div>
              <h6 className="ds-detail-key mb-0">Dr Name</h6>         <span className="ds-detail-summary"> {aptData?.doctorName}</span>
            </div>

            <div>
              <h6 className="ds-detail-key mb-0">Blood</h6>           <span className="ds-detail-summary">{ptData?.bloodGroup}</span>
            </div>

           

            <div>
              <h6 className="ds-detail-key mb-0">Contact no</h6>      <span className="ds-detail-summary">+91 {ptData?.contactNumber}</span>
            </div>
         

    
            <div>
              <h6 className="ds-detail-key mb-0">Dr ID</h6>           <span className="ds-detail-summary ds-mono">{aptData?.doctorNh12}</span>
            </div>
          </div>
        </div>

        <div className="ds-qr-col">
          <div className="ds-qr-box">
            <QRCodeCanvas
              value={`https://www.neohealthcard.com/medical-prescription/${prescription?.customId}`}
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

      {/* ── SERVICES TABLE ── */}
      <div className="ds-medicines-section">
        <div className="ds-table-title">Services &amp; Charges</div>
        <table className="ds-table">
          <thead className="ds-thead">
            <tr>
              {["Medication Name", "Refills", "Frequency", "Duration", "Instruction"].map(h => (
                <th key={h} className="ds-th-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {prescription?.medications.map((m, i) => (
              <tr key={i} className="ds-tr-border">
                <td className="ds-td-left">
                  <div className="fw-700 fz-14">{m.name}</div>
                  {/* {m.sub && <div className="ds-td-subtext">{m.sub}</div>} */}
                </td>
                <td className="ds-td-left">{m.refills}</td>
                <td className="ds-td-left">{m.frequency}</td>
                <td className="ds-td-left">{m.duration}</td>
                <td className="ds-td-left">{m.instructions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── GENERAL INSTRUCTION ── */}
      <div className="ds-notes-section">
        <div className="ds-notes-summary">
          <p className="ds-detail-section-label-header">General Instruction</p>
          <div className="ds-notes-box">
            <ol className="mb-0 ps-3">
              <li>{prescription?.notes}</li>
              {/* {instructions.map(({ num, text }) => (
                <li key={num} value={num}>{text}</li>
              ))} */}
            </ol>
          </div>
        </div>
      </div>

     
      {/* ── SIGNATURES ── */}
      <div className="hp-ds-sig-grid" >
        <div className="ds-sig-cell">
          <div className="ds-sig-name"> {aptData?.doctorName}</div>
          <div className="ds-sig-sub">{aptData?.specialization}  · {aptData?.orgName}</div>
          <div className="ds-sig-id">{aptData?.doctorNh12}</div>
        </div>
        <div className="ds-sig-cell-border">
          <div className="ds-sig-name">{ptData?.name}</div>
          <div className="ds-sig-sub">Patient / Authorised Representative</div>
          <div className="ds-sig-id">{ptData?.nh12}</div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className="ds-footer">
        <span>{aptData?.orgName}, {aptData?.orgAddress} · {aptData?.orgEmail} · {aptData?.orgContactNumber}</span>
        <span className="ds-tagline">Wishing you a speedy recovery</span>
      </div>

    </div>
  </div>

      </>
    </>
  );
}
