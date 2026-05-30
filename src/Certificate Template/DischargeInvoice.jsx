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



// ── Small components ──────────────────────────────────────────────────────────
// const Label = ({ children }) => <p style={s.metaLabel}>{children}</p>;

const Meta = ({ l, v, highlight }) => (
  <div className="ds-meta-block">
    <p className="ds-meta-label">{l}</p>
    <p className={`fz-12 ${highlight ? "ds-meta-value-highlight" : "ds-meta-value"}`}>{v}</p>
  </div>
);

const KV = ({ k, v }) => (
  <div className="ds-kv-wrap">
    <p className="ds-kv-label">{k}</p>
    <p className="ds-kv-value">{v}</p>
  </div>
);

const Vital = ({ label, value, unit, sub }) => (
  <div className="ds-vital-card">
    <p className="ds-vital-label">{label}</p>
    <p className="ds-vital-value">{value}</p>
    {unit && <p className="ds-vital-unit">{unit}</p>}
    {sub && <p className="ds-vital-sub">{sub}</p>}
  </div>
);

const medicines = [
    ["Paracetamol 500mg", "1 Tab", "Twice daily", "5 Days", "Oral", "After food", "NHC-D-007821"],
    ["Ibuprofen 400mg", "1 Tab", "Thrice daily", "3 Days", "Oral", "Before food", "NHC-D-007821"],
    ["Amoxicillin 250mg", "1 Cap", "Once at night", "7 Days", "Oral", "Before sleep", "NHC-D-007821"],
    ["ORS Sachets", "1 Sachet", "Thrice daily", "5 Days", "Oral", "In 200ml water", "NHC-D-007821"],
];

export default function DischargeInvoice() {
    const { id } = useParams()
    const [allotmentData, setAllotmentData] = useState()
    const [patientData, setPatientData] = useState()
    const [hospitalData, setHospitalData] = useState()
    const [dischargeData, setDischargeData] = useState()
    const [paymentData, setPaymentData] = useState()
    async function fetchAllotmentDetail() {
        if (!id) {
            return
        }
        try {
            const res = await getApiData(`api/comman/discharge-summary/${id}`)
            if (res.success) {
                setAllotmentData(res.allotmentData)
                setPatientData(res.patientData)
                setHospitalData(res.hospitalData)
                setPaymentData(res.paymentData)
                setDischargeData(res.dischargeData)
            } else {
                toast.error(res.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    }
    useEffect(() => {
        if (id) {

            fetchAllotmentDetail()
        }
    }, [id])
    const getDays = (start, end) => {
        if (!start || !end) return 0;

        const d1 = new Date(start);
        const d2 = new Date(end);

        const diffTime = d2 - d1; // ms difference
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
    };
    const totalStay = getDays(allotmentData?.allotmentDate, dischargeData?.createdAt || new Date())
    const invoiceRef = useRef()
    const handleDownload = () => {
        try {

            const element = invoiceRef.current;
            document.body.classList.add("hide-buttons");
            const opt = {
                margin: 0,
                filename: `Discharge-Summary-${allotmentData?.customId}.pdf`,
                html2canvas: { scale: 2, useCORS: true, allowTaint: true },
                jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
            };

            html2pdf().from(element).set(opt).save().then(() => {
                document.body.classList.remove("hide-buttons");
            });
        } catch (error) {

        }
    };
    const handlePrint = () => {
        document.body.classList.add("hide-buttons");

        setTimeout(() => {
            window.print();
            document.body.classList.remove("hide-buttons");
        }, 500);
    };
    useEffect(() => {
        if (allotmentData && patientData && hospitalData) {
            const timer = setTimeout(() => {
                // handleDownload();

            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [allotmentData, patientData, hospitalData]);
    return (
        <>
            <div className="container mt-2 d-flex justify-content-between align-items-center">
                <img src="/logo.png" alt="" srcset="" width={100} height={60} />
                <div>

                    <button className="thm-btn" onClick={handleDownload}>Download</button>
                </div>
            </div>

             <div className="ds-page" ref={invoiceRef}>
      <div className="ds-card">

        {/* Watermark */}
        <div className="ds-watermark-wrap">
          {/* <div className="ds-watermark-circle" /> */}
        </div>

        {/* HEADER */}
        <div className="ds-header">
          <div className="d-flex gap-3">
            <div className="ds-logo">
              <img
                src={
                  hospitalData?.logoFileId
                    ? `${base_url}/api/file/${hospitalData?.logoFileId}`
                    : "/logo.png"
                }
                alt=""
              />
            </div>
            <div>
              <h1 className="ds-header-title">Discharge Summary</h1>
              <p className="ds-header-sub mb-0 lh-sm">{hospitalData?.name}</p>
              <p className="ds-header-meta-top mb-0 lh-sm">{hospitalData?.nh12}</p>
              <p className="ds-header-meta mb-0 lh-sm">{hospitalData?.address}</p>
            </div>
          </div>
          <div className="ds-header-right">
            <div className="ds-badge">NeoHealthCard Network</div>
            <p className="ds-header-system mb-0 lh-sm">Fully Automated · Ecosystem Connected</p>
            <p className="ds-header-meta mb-0 lh-sm">
              {hospitalData?.email} · {hospitalData?.contactNumber}
            </p>
          </div>
        </div>

        {/* META */}
        <div className="ds-meta-strip">
          <Meta l="DISCHARGE ID" v={dischargeData?.customId} />
          <Meta l="ADMISSION" v={new Date(allotmentData?.allotmentDate)?.toLocaleDateString("en-GB")} />
          <Meta l="DISCHARGE" v={new Date(dischargeData?.createdAt)?.toLocaleString("en-GB")} />
          <Meta l="TOTAL STAY" v={`${totalStay} Days `} />
          <Meta l="DISCHARGE TYPE" v={dischargeData?.dischargeType} />
          <Meta l="STATUS" v={allotmentData?.status} highlight />
        </div>

        {/* PATIENT */}
        <div className="ds-patient-section">
          <div className="ds-patient-left">
            <h3 className="ds-patient-title">Patient</h3>
            <h2 className="ds-patient-name">{patientData?.name}</h2>
            <div className="ds-patient-grid">
              <KV k="Age / Sex" v={`${calculateAge(patientData?.dob, dischargeData?.createdAt)} / ${patientData?.gender || "-"}`} />
              <KV k="Email Address" v={patientData?.email} />
              <KV k="Patient ID" v={patientData?.nh12} />
              <KV k="DOB" v={new Date(patientData?.dob)?.toLocaleDateString("en-GB")} />
              <KV k="Address" v={patientData?.address} />
              <KV k="Dr Name" v={allotmentData?.primaryDoctorId?.name} />
              <KV k="Blood" v={patientData?.bloodGroup} />
              <KV k="Contact no" v={patientData?.contactNumber} />
              <KV k="Dr ID" v={allotmentData?.primaryDoctorId?.nh12} />
            </div>
          </div>
          <div className="ds-qr-col">
            <div className="ds-qr-box">
              <QRCodeCanvas
                value={`https://www.neohealthcard.com/discharge-invoice/${allotmentData?._id}`}
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              />
            </div>
            <p className="ds-qr-label">Scan to verify</p>
            <p className="ds-qr-link">
              <a href="javascript:void(0)" className="ds-qr-link">
                verify.neohealthcard.in
              </a>
            </p>
          </div>
        </div>

        {/* VITALS */}
        <div className="ds-vitals-row">
          <Vital label="BP" value={dischargeData?.vitals?.bloodPressure} unit="mmHg" />
          <Vital label="TEMPERATURE" value={`${dischargeData?.vitals?.temperature}°F`} sub="at admission" />
          <Vital label="PULSE" value={dischargeData?.vitals?.pulse} unit="bpm" />
          <Vital label="SpO₂" value={dischargeData?.vitals?.oxygenSaturation} sub="at discharge" />
          <Vital label="WEIGHT" value={dischargeData?.vitals?.weight} unit="kg" />
        </div>

        {/* DETAILS */}
        <div className="ds-details-grid">
          <div>
            <p className="ds-detail-section-label">ADMISSION DETAILS</p>
            <div className="ds-detail-rows">
              {[
                ["Dept / Ward", allotmentData?.departmentId?.departmentName],
                ["Bed / Room", allotmentData?.bedId?.bedName + "-" + allotmentData?.bedId?.roomId?.roomName],
                ["Primary Diagnosis", allotmentData?.admissionReason],
              ].map(([k, v]) => (
                <div key={k} className="ds-detail-row">
                  <span className="ds-detail-key">{k}</span>
                  <span className="ds-detail-summary">{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="ds-detail-section-label">DISCHARGE STATUS</p>
            <div className="ds-detail-rows">
              {[
                ["Condition at Discharge", stripHtml(dischargeData?.conditionOfDischarge)],
                ["Discharge Type", dischargeData?.dischargeType],
                ["Follow-up Plan", stripHtml(dischargeData?.followUpPlan)],
                ["Red Flag Signs", stripHtml(dischargeData?.redFlag)],
                [
                  "Vitals at Discharge",
                  `BP ${dischargeData?.vitals?.bloodPressure} · Temp ${dischargeData?.vitals?.temperature}°F · SpO₂ ${dischargeData?.vitals?.oxygenSaturation}`,
                ],
              ].map(([k, v]) => (
                <div key={k} className="ds-detail-row">
                  <span className="ds-detail-key">{k}</span>
                  <span className="ds-detail-summary">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MEDICINES */}
        {allotmentData?.prescriptionId && (
          <div className="ds-medicines-section">
            <p className="ds-table-title">MEDICINES PRESCRIBED AT DISCHARGE</p>
            <table className="ds-table">
              <thead className="ds-thead">
                <tr>
                  <th className="ds-th-left">MEDICINE</th>
                  <th className="ds-th-center">FREQUENCY</th>
                  <th className="ds-th-center">DURATION</th>
                  <th className="ds-th-center">REFILLS</th>
                  <th className="ds-th-center">INSTRUCTION</th>
                  <th className="ds-th-center">PRESCRIBED BY</th>
                </tr>
              </thead>
              <tbody>
                {allotmentData?.prescriptionId?.medications.map((r, i) => (
                  <tr key={i} className="ds-tr-border">
                    <td className="ds-td-left">{r?.name}</td>
                    <td className="ds-td-center">{r?.frequency}</td>
                    <td className="ds-td-center">{r?.duration}</td>
                    <td className="ds-td-center">{r?.refills || "-"}</td>
                    <td className="ds-td-center">{r?.instructions}</td>
                    <td className="ds-td-center">{allotmentData?.prescriptionId?.doctorId?.nh12}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* NOTES */}
        <div className="ds-notes-section">
          <div className="ds-notes-summary">
            <p className="ds-detail-section-label-header">DOCTOR'S REMARKS & DISCHARGE NOTES</p>
            <div className="ds-notes-box">
              Patient responded well to IV fluid therapy and antipyretics. Fever resolved by Day 2.
              Advised complete bed rest, adequate fluid intake (3L/day), light meals. Avoid cold drinks
              and self-medication. Return immediately if fever exceeds 102°F, breathlessness, or
              persistent vomiting develops.
            </div>
          </div>
        </div>

        {/* SIGNATURES */}
        <div className="ds-sig-grid">
          <div className="ds-sig-cell">
            <p className="ds-sig-name">{dischargeData?.doctorSignature?.name}</p>
            <p className="ds-sig-sub">
              {hospitalData?.doctorSpecialty} · {hospitalData?.doctorRole}
            </p>
            <p className="ds-sig-id">{dischargeData?.doctorSignature?.nh12}</p>
          </div>
          <div className="ds-sig-cell-border">
            <p className="ds-sig-name">Nurse In-Charge</p>
            <p className="ds-sig-sub">{dischargeData?.nurseSignature?.name}</p>
            <p className="ds-sig-id">{dischargeData?.nurseSignature?.nh12}</p>
          </div>
          <div className="ds-sig-cell-border">
            <p className="ds-sig-name">{patientData?.name}</p>
            <p className="ds-sig-sub">Patient / Authorised Representative</p>
            <p className="ds-sig-id">{patientData?.nh12}</p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="ds-footer">
          <span>
            {hospitalData?.name}, {hospitalData?.address} · {hospitalData?.email} ·{" "}
            {hospitalData?.contactNumber}
          </span>
          <span>Wishing you a speedy recovery</span>
        </div>

      </div>
    </div>

        </>
    );
}