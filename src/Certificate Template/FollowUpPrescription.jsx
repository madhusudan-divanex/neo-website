import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { QRCodeCanvas } from "qrcode.react";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import base_url from "../baseUrl";
import { getApiData } from "../Services/api";
import { calculateAge, stripHtml } from "../Services/globalFunction";
import "./Template css/DischargeSummary.css"

const FollowUpPrescription = ({ allotmentId, pdfLoading, endLoading }) => {
  const { id } = useParams()
  const [allotmentData, setAllotmentData] = useState()
  const [patientData, setPatientData] = useState()
  const [hospitalData, setHospitalData] = useState()
  const [dischargeData, setDischargeData] = useState()
  const [paymentData, setPaymentData] = useState()
  async function fetchAllotmentDetail() {
    // if (!allotmentId) {
    //   return
    // }
    try {
      const res = await getApiData(`api/comman/discharge-summary/${allotmentId || id}`)
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
    if (id || allotmentId) {

      fetchAllotmentDetail()
    }
  }, [id, allotmentId])
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

//   const handleDownload = () => {
//     try {

//       const element = invoiceRef.current;
//       document.body.classList.add("hide-buttons");
//       const opt = {
//         margin: 0,
//         filename: `FollowUp-Prescriptions-${allotmentData?.customId}.pdf`,
//         html2canvas: { scale: 2, useCORS: true, allowTaint: true },
//         jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
//       };

//       html2pdf().from(element).set(opt).save().then(() => {
//         document.body.classList.remove("hide-buttons");
        
//       });
//     } catch (error) {

//     } finally {
//       if (pdfLoading) endLoading();
//       setAllotmentData({});
//     }
//   };

const handleDownload = () => {
  try {
    const element = invoiceRef.current;
    document.body.classList.add("hide-buttons");
    const opt = {
      margin: 0,
      filename: `FollowUp-Prescriptions-${allotmentData?.customId}.pdf`,
      html2canvas: { scale: 2, useCORS: true, allowTaint: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
    };

    html2pdf()
      .from(element)
      .set(opt)
      .save()
      .then(() => {
        document.body.classList.remove("hide-buttons");
        if (pdfLoading) endLoading();
      });
  } catch (error) {
    console.error("PDF generation error:", error);
  } finally {
    document.body.classList.remove("hide-buttons"); 
    if (pdfLoading) endLoading();
  }
};

  const handlePrint = () => {
    document.body.classList.add("hide-buttons");

    setTimeout(() => {
      window.print();
      document.body.classList.remove("hide-buttons");

      if (pdfLoading) endLoading();
      setAllotmentData({});
    }, 500);
  };
  useEffect(() => {
    console.log("callling", allotmentData, patientData, hospitalData, pdfLoading)
    if (allotmentData && patientData && hospitalData && pdfLoading) {
      const timer = setTimeout(() => {
        handleDownload();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [allotmentData, patientData, hospitalData, pdfLoading]);
  return (

    <>
     <div className="container d-flex justify-content-between align-items-center">
                <img src="/logo.png" alt="" srcset="" width={100} height={60} />
                <div>
                    <button className="thm-btn" onClick={handleDownload}>Download</button>
                </div>
            </div>


     <div ref={invoiceRef} className="ds-page">
  <div className="ds-card">
    <div className="ds-watermark-wrap"></div>
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
          <h1 className="ds-header-title">Follow-up Prescription</h1>

          <p className="ds-header-sub mb-0 lh-sm">
            {hospitalData?.name}
          </p>

          <p className="ds-header-meta mb-0 lh-sm">
            {hospitalData?.address}
          </p>
        </div>
      </div>

      <div className="ds-header-right">
        <div className="ds-badge">
          NeoHealthCard Network
        </div>

        <p className="ds-header-system mb-0 lh-sm">
          Fully Automated · Ecosystem Connected
        </p>

        <p className="ds-header-meta mb-0 lh-sm">
          {hospitalData?.email} · {hospitalData?.contactNumber}
        </p>
      </div>
    </div>

    {/* META */}
    <div className="ds-meta-strip">
      <Meta l="DISCHARGE ID" v={dischargeData?.customId} />
      <Meta
        l="ADMISSION"
        v={new Date(allotmentData?.allotmentDate)?.toLocaleDateString("en-GB")}
      />
      <Meta
        l="DISCHARGE"
        v={new Date(dischargeData?.createdAt)?.toLocaleDateString("en-GB")}
      />
      <Meta
        l="TOTAL STAY"
        v={`${totalStay} Days`}
      />
      <Meta
        l="DISCHARGE TYPE"
        v={dischargeData?.dischargeType}
      />
    </div>

    {/* PATIENT */}
    <div className="ds-patient-section">
      <div className="ds-patient-left">
        <h3 className="ds-patient-title">Patient</h3>

        <h2 className="ds-patient-name">
          {patientData?.name}
        </h2>

        <div className="ds-patient-grid">
          <div className="ds-kv-wrap">
            <p className="ds-kv-label">Age / Sex</p>
            <p className="ds-kv-value">
              {calculateAge(patientData?.dob, dischargeData?.createdAt)} /{" "}
              {patientData?.gender || "-"}
            </p>
          </div>
          
          <div className="ds-kv-wrap">
            <p className="ds-kv-label">Email Address</p>
            <p className="ds-kv-value">
              {patientData?.email}
            </p>
          </div>

          <div className="ds-kv-wrap">
            <p className="ds-kv-label">Patient ID</p>
            <p className="ds-kv-value">
              {patientData?.nh12}
            </p>
          </div>

          <div className="ds-kv-wrap">
            <p className="ds-kv-label">DOB</p>
            <p className="ds-kv-value">
              {new Date(patientData?.dob)?.toLocaleDateString("en-GB")}
            </p>
          </div>
          <div className="ds-kv-wrap">
            <p className="ds-kv-label">Address</p>
            <p className="ds-kv-value">
              {patientData?.address}
            </p>
          </div>

          <div className="ds-kv-wrap">
            <p className="ds-kv-label">Dr Name</p>
            <p className="ds-kv-value">
              {allotmentData?.primaryDoctorId?.name}
            </p>
          </div>

          

          <div className="ds-kv-wrap">
            <p className="ds-kv-label">Blood</p>
            <p className="ds-kv-value">
              {patientData?.bloodGroup}
            </p>
          </div>

          <div className="ds-kv-wrap">
            <p className="ds-kv-label">Contact</p>
            <p className="ds-kv-value">
              {patientData?.contactNumber}
            </p>
          </div>

           <div className="ds-kv-wrap">
            <p className="ds-kv-label">Dr ID</p>
            <p className="ds-kv-value">
              {allotmentData?.primaryDoctorId?.nh12}
            </p>
          </div>

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
      <Vital
        label="BP"
        value={dischargeData?.vitals?.bloodPressure}
        unit="mmHg"
      />

      <Vital
        label="TEMPERATURE"
        value={`${dischargeData?.vitals?.temperature}°F`}
        sub="at admission"
      />

      <Vital
        label="PULSE"
        value={dischargeData?.vitals?.pulse}
        unit="bpm"
      />

      <Vital
        label="SpO₂"
        value={dischargeData?.vitals?.oxygenSaturation}
        sub="at discharge"
      />

      <Vital
        label="WEIGHT"
        value={dischargeData?.vitals?.weight}
        unit="kg"
      />
    </div>

    {/* MEDICINES */}
    <div className="ds-medicines-section">
      <p className="ds-table-title">
        MEDICINES PRESCRIBED
      </p>

      <table className="ds-table">
        <thead className="ds-thead">
          <tr>
            <th className="ds-th-left">MEDICINE</th>
            <th className="ds-th-center">FREQUENCY</th>
            <th className="ds-th-center">DURATION</th>
            <th className="ds-th-center">REFILLS</th>
            <th className="ds-th-center">INSTRUCTION</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* ADVICE */}
    <div className="ds-notes-section">
      <div className="ds-notes-summary">
        <p className="ds-detail-section-label-header">
          FOLLOWUP PLAN
        </p>

        <div className="ds-notes-box">
          <div
            className="about-para"
            dangerouslySetInnerHTML={{
              __html: dischargeData?.followUpPlan,
            }}
          />
        </div>
      </div>
    </div>

    {/* SIGN */}
    <div className="hp-ds-sig-grid">
      <div className="ds-sig-cell">
        <p className="ds-sig-name">
          {dischargeData?.doctorSignature?.name}
         
        </p>
         <div className="ds-sig-id">
            {hospitalData?.name}
         </div>
        <div className="ds-sig-sub"> {allotmentData?.primaryDoctorId?.nh12}</div>
        
      </div>

      <div className="ds-sig-cell-border">
        <p className="ds-sig-name">
          {patientData?.name}
        </p>
         <div className="ds-sig-id">Patient</div>
        <div className="ds-sig-sub">{patientData?.nh12}</div>
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
};

const Meta = ({ title, value, highlight }) => (
  <div className="ds-meta-block">
    <p className="ds-meta-label">{title}</p>

    <p
      className={`fz-12 ${
        highlight
          ? "ds-meta-value-highlight"
          : "ds-meta-value"
      }`}
    >
      {value}
    </p>
  </div>
);

const Vital = ({ label, value, unit, sub }) => (
  <div className="ds-vital-card">
    <p className="ds-vital-label">{label}</p>

    <p className="ds-vital-value">{value}</p>

    {unit && (
      <p className="ds-vital-unit">
        {unit}
      </p>
    )}

    {sub && (
      <p className="ds-vital-sub">
        {sub}
      </p>
    )}
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="ds-detail-row">
    <span className="ds-detail-key">
      {label}
    </span>

    <span className="ds-detail-summary">
      {value}
    </span>
  </div>
);

    const MedRow = ({
    name,
    dose,
    freq,
    dur,
    route,
    note,
    }) => (
    <tr className="ds-tr-border">
        <td className="ds-td-left">{name}</td>

        <td className="ds-td-center">{freq}</td>

        <td className="ds-td-center">{dur}</td>

        <td className="ds-td-center">{route}</td>

        <td className="ds-td-center">{note}</td>
    </tr>
    );
export default FollowUpPrescription;