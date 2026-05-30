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

const LabSampleReceipt = () => {
    const { id } = useParams();
    const [appointmentData, setAppointmentData] = useState(null);
    const [patientData, setPatientData] = useState(null);
    const [labData, setLabData] = useState(null);
    const [sampleList, setSampleList] = useState([]);

    const invoiceRef = useRef();

    // ── Fetch ──────────────────────────────────────────────────────────────────
    async function fetchAllotmentDetail() {
        if (!id) {
            return
        }
        try {
            const res = await getApiData(
                `api/comman/lab-sample/${id}`
            );
            if (res.success) {
                setAppointmentData(res.appointmentData);
                setPatientData(res.patientData);
                setLabData(res.labData);
                setSampleList(res.labSamples || []);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    }

    useEffect(() => {
        if (id) fetchAllotmentDetail();
    }, [id]);

    // ── PDF Download ───────────────────────────────────────────────────────────
    const handleDownload = () => {
        try {
            const element = invoiceRef.current;
            document.body.classList.add("hide-buttons");
            const opt = {
                margin: 0,
                filename: `LabSample-${appointmentData?.customId}.pdf`,
                html2canvas: { scale: 2, useCORS: true, allowTaint: true },
                jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
            };
            html2pdf()
                .from(element)
                .set(opt)
                .save()
                .then(() => document.body.classList.remove("hide-buttons"));
        } catch (_) {
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
    const capitalize = (str) =>
        str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
    return (
        <>
            <div className="container mt-2 d-flex justify-content-between align-items-center">
                <img src="/logo.png" alt="" srcset="" width={100} height={60} />
                <div>
                    <button className="thm-btn" onClick={handleDownload}>Download</button>
                </div>
            </div>

            {/* <div ref={invoiceRef} style={{ background: "#f4f6f8", padding: "24px", fontFamily: "Inter, sans-serif" }}>
                <div style={{ width: '100%', maxWidth: "794px", margin: "0 auto", background: "#ffffff", border: "1px solid #e5e7eb" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "18px 20px", borderBottom: "1px solid #e5e7eb" }}>
                        <div className="d-flex gap-2">
                            <div style={{ width: '34px', height: '34px' }}>
                                <img src={labData?.logo ?
                                    `${base_url}/${labData?.logo}` : "/logo.png"} alt="" />
                            </div>
                            <div>
                                <div style={{ fontSize: "22px", fontWeight: 600 }}>Lab Sample Collection Receipt</div>
                                <div style={{ fontSize: "12px" }}>{labData?.name}</div>
                                <div style={{ fontSize: "11px", color: "#6b7280" }}>{labData?.nh12}</div>
                                <div style={{ fontSize: "11px", color: "#6b7280" }}>{labData?.address}</div>
                            </div>
                        </div>

                        <div style={{ textAlign: "right" }}>
                            <div style={{ border: "1px solid #0ea5a4", padding: "4px 12px", borderRadius: "20px", fontSize: "11px", color: "#0ea5a4" }}>NeoHealthCard Network</div>
                            <div style={{ fontSize: "11px", color: "#6b7280" }}>Fully Automated · Ecosystem Connected</div>
                            <div style={{ fontSize: "11px", color: "#6b7280" }}>{labData?.email} · {labData?.contactNumber}</div>
                        </div>
                    </div>

           <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", borderBottom: "1px solid #e5e7eb" }}>
                        {[
                            ["APPOINTMENT", new Date(appointmentData?.date)?.toLocaleString('en-GB')],
                            ["LAB ID", labData?.nh12],
                            ["LAB ORDER REF", appointmentData?.customId],
                            ["PATIENT ID", patientData?.nh12],
                            ["STATUS", capitalize(appointmentData?.paymentStatus)]
                        ].map((item, i) => (
                            <div key={i} style={{ padding: "10px 14px", borderRight: "1px solid #e5e7eb" }}>
                                <div style={{ fontSize: "10px", color: "#6b7280" }}>{item[0]}</div>
                                <div style={{ fontSize: "12px", fontWeight: 600, color: i === 4 ? "#0ea5a4" : "#111827" }}>{item[1]}</div>
                            </div>
                        ))}
                    </div>

             
                    <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex" }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>{patientData?.name}</div>

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", fontSize: "12px", rowGap: "6px" }}>
                                <div>Age / Sex: {calculateAge(patientData?.dob, appointmentData?.createdAt)} / {patientData?.gender || '-'}</div>
                                <div>Email Address:{patientData?.email}</div>
                                <div>Patient ID: {patientData?.nh12}</div>

                                <div>DOB: {patientData?.dob ? new Date(patientData.dob).toLocaleDateString("en-GB") : "—"}</div>
                                <div>Address: {patientData?.address}</div>
                                <div>Attending Doctor: {appointmentData?.staff?.name}</div>

                                <div className="col">Blood: {patientData?.bloodGroup || '-'}</div>
                                <div className="col">Contact: {patientData?.contactNumber}</div>
                                <div>Lab: {labData?.name}</div>
                            </div>
                        </div>

                        <div style={{ width: "120px", textAlign: "center" }}>
                            <div style={{ width: "90px", height: "90px", border: "1px solid #d1d5db", margin: "0 auto" }}>
                                <QRCodeCanvas
                                    value={`https://www.neohealthcard.com/lab-sample/${appointmentData?.customId}`}
                                    size={256}
                                  
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                />
                            </div>
                            <div style={{ fontSize: "10px" }}>Scan to verify</div>
                            <div style={{ fontSize: "10px", color: "#0ea5a4" }}>verify.neohealthcard.in</div>
                        </div>
                    </div>

             
                    <div style={{ padding: "16px 20px" }}>
                        <div style={{ fontSize: "11px", marginBottom: "6px", color: "#6b7280" }}>SAMPLES COLLECTED</div>

                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                            <thead>
                                <tr style={{ background: "#f3f4f6" }}>
                                    {[
                                        "TEST NAME", "SAMPLE TYPE", "TUBE / CONTAINER", "VOLUME", "FASTING", "COLLECTION TIME", "CONDITION"
                                    ].map((h, i) => (
                                        <th key={i} style={{ border: "1px solid #e5e7eb", padding: "8px", textAlign: "left" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {sampleList?.map((cell, i) => (
                                    <tr key={i}>
                                        <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>{cell?.forTestId?.subCategory}</td>
                                        <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>{cell?.forTestId?.sample?.map(s => s.type).join(',')}</td>
                                        <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>{cell?.sampleContainer}</td>
                                        <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>{cell?.forTestId?.sample?.map(s => s?.volume)}</td>
                                        <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>{cell?.forTestId?.fastingRequired ? 'Yes' : 'No'}</td>
                                        <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>{new Date(cell?.createdAt)?.toLocaleString('en-GB')}</td>
                                        <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>{cell?.condition}</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

            
                    <div style={{ padding: "16px 20px" }}>
                        <div style={{ fontSize: "11px", marginBottom: "6px", color: "#6b7280" }}>SAMPLE ID TRACKING</div>

                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                            <thead>
                                <tr style={{ background: "#f3f4f6" }}>
                                    {["SAMPLE ID", "TEST", "BARCODE", "STORAGE TEMP", "EXPECTED TAT"].map((h, i) => (
                                        <th key={i} style={{ border: "1px solid #e5e7eb", padding: "8px", textAlign: "left" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {sampleList?.map((cell, i) => (
                                    <tr key={i}>
                                        <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>{cell?.customId}</td>
                                        <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>{cell?.forTestId?.subCategory}</td>
                                        <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>{cell?.forTestId?.code}</td>
                                        <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>{cell?.storageDetail}</td>
                                        <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>{cell?.resultExpected}</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                 
                    <div style={{ padding: "16px 20px" }}>
                        <div style={{ fontSize: "11px", marginBottom: "6px", color: "#6b7280" }}>COLLECTION NOTES</div>
                        <ol style={{ fontSize: "12px", marginLeft: "16px" }}>
                            <li>All samples collected under aseptic conditions. Patient was fasting 10 hours for Iron/LFT.</li>
                            <li>Blood culture collected before antibiotic administration – sterile technique used.</li>
                            <li>Samples labelled, bar-coded and entered into NHC Lab system at 09:35.</li>
                            <li>Patient tolerated venipuncture well – no adverse events during collection.</li>
                        </ol>
                    </div>

                   
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", textAlign: "center", padding: "20px", borderTop: "1px solid #e5e7eb" }}>
                        <div>
                            <div>{appointmentData?.staff?.name}</div>
                            <div style={{ fontSize: "11px", color: "#6b7280" }}>Phlebotomist / Lab Technician</div>
                        </div>
                        <div>
                            <div>{labData?.name}</div>
                            <div style={{ fontSize: "11px", color: "#6b7280" }}>Accepted & Processing</div>
                        </div>
                        <div>
                            <div>{patientData?.name}</div>
                            <div style={{ fontSize: "11px", color: "#6b7280" }}>Patient</div>
                        </div>
                    </div>

                  
                    <div style={{ background: "#0ea5a4", color: "#fff", fontSize: "11px", padding: "8px 14px", display: "flex", justifyContent: "space-between" }}>
                        <span>{labData?.name}, {labData?.address} · {labData?.email} · {labData?.contactNumber}</span>
                        <span>Wishing you a speedy recovery</span>
                    </div>

                </div>
            </div> */}

              <div className="ds-page" ref={invoiceRef}>
  <div className="ds-card">
    <div className="ds-watermark-wrap">
    </div>

    {/* HEADER */}
    <div className="ds-header">
      <div className="d-flex gap-3">
        <div className="ds-logo">
          <img src={labData?.logo ?
            `${base_url}/${labData?.logo}` : "/logo.png"} alt="" />
        </div>
        <div>
          <h1 className="ds-header-title">Lab Sample Collection Receipt</h1>
          <p className="ds-header-sub mb-0 lh-sm">{labData?.name}</p>
          <p className="ds-header-meta-top mb-0 lh-sm">{labData?.nh12}</p>
          <p className="ds-header-meta mb-0 lh-sm">{labData?.address}</p>
        </div>
      </div>
      <div className="ds-header-right">
        <div className="ds-badge">NeoHealthCard Network</div>
        <p className="ds-header-system mb-0 lh-sm">Fully Automated · Ecosystem Connected</p>
        <p className="ds-header-meta mb-0 lh-sm">{labData?.email} · {labData?.contactNumber}</p>
      </div>
    </div>

    {/* META STRIP */}
    <div className="ds-meta-strip">
      {[
        ["APPOINTMENT", new Date(appointmentData?.date)?.toLocaleString('en-GB')],
        ["LAB ID", labData?.nh12],
        ["LAB ORDER REF", appointmentData?.customId],
        ["PATIENT ID", patientData?.nh12],
        ["STATUS", capitalize(appointmentData?.paymentStatus)]
      ].map((item, i) => (
        <div key={i} className="ds-meta-block">
          <div className="ds-meta-label">{item[0]}</div>
          <div className={`ds-meta-value fz-12 ${i === 4 ? "text-teal" : ""}`}>{item[1]}</div>
        </div>
      ))}
    </div>

    {/* PATIENT */}
    <div className="ds-patient-section">
      <div className="ds-patient-left">
        <h3 className="ds-patient-title">Patient</h3>
        <h2 className="ds-patient-name">{patientData?.name}</h2>
        <div className="ds-patient-grid">
          <div>
            <h6 className="ds-detail-key mb-0">Age / Sex</h6>
            <span className="ds-detail-summary">{calculateAge(patientData?.dob, appointmentData?.createdAt)} / {patientData?.gender || '-'}</span>
          </div>
          <div>
            <h6 className="ds-detail-key mb-0">Email Address</h6>
            <span className="ds-detail-summary">{patientData?.email}</span>
          </div>
          <div>
            <h6 className="ds-detail-key mb-0">Patient ID</h6>
            <span className="ds-detail-summary ds-mono">{patientData?.nh12}</span>
          </div>

          <div>
            <h6 className="ds-detail-key mb-0">DOB</h6>
            <span className="ds-detail-summary">{patientData?.dob ? new Date(patientData.dob).toLocaleDateString("en-GB") : "—"}</span>
          </div>
          <div>
            <h6 className="ds-detail-key mb-0">Address</h6>
            <span className="ds-detail-summary">{patientData?.address}</span>
          </div>
          <div>
            <h6 className="ds-detail-key mb-0">Attending Doctor</h6>
            <span className="ds-detail-summary">{appointmentData?.staff?.name}</span>
          </div>

          <div>
            <h6 className="ds-detail-key mb-0">Blood</h6>
            <span className="ds-detail-summary">{patientData?.bloodGroup || '-'}</span>
          </div>
          <div>
            <h6 className="ds-detail-key mb-0">Contact</h6>
            <span className="ds-detail-summary">{patientData?.contactNumber}</span>
          </div>
          <div>
            <h6 className="ds-detail-key mb-0">Lab</h6>
            <span className="ds-detail-summary">{labData?.name}</span>
          </div>
        </div>
      </div>

      {/* QR */}
      <div className="ds-qr-col">
        <div className="ds-qr-box">
          <QRCodeCanvas
            value={`https://www.neohealthcard.com/lab-sample/${appointmentData?.customId}`}
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

    {/* SAMPLES TABLE */}
    <div className="ds-medicines-section">
      <p className="ds-table-title">SAMPLES COLLECTED</p>
      <table className="ds-table">
        <thead className="ds-thead">
          <tr>
            {["TEST NAME", "SAMPLE TYPE", "TUBE / CONTAINER", "VOLUME", "FASTING", "COLLECTION TIME", "CONDITION"].map((h, i) => (
              <th key={i} className="ds-th-left">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sampleList?.map((cell, i) => (
            <tr key={i} className="ds-tr-border">
              <td className="ds-td-left">{cell?.forTestId?.subCategory}</td>
              <td className="ds-td-left">{cell?.forTestId?.sample?.map(s => s.type).join(',')}</td>
              <td className="ds-td-left">{cell?.sampleContainer}</td>
              <td className="ds-td-left">{cell?.forTestId?.sample?.map(s => s?.volume)}</td>
              <td className="ds-td-left">{cell?.forTestId?.fastingRequired ? 'Yes' : 'No'}</td>
              <td className="ds-td-left">{new Date(cell?.createdAt)?.toLocaleString('en-GB')}</td>
              <td className="ds-td-left">{cell?.condition}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* TRACKING TABLE */}
    <div className="ds-medicines-section">
      <p className="ds-table-title">SAMPLE ID TRACKING</p>
      <table className="ds-table">
        <thead className="ds-thead">
          <tr>
            {["SAMPLE ID", "TEST", "BARCODE", "STORAGE TEMP", "EXPECTED TAT"].map((h, i) => (
              <th key={i} className="ds-th-left">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sampleList?.map((cell, i) => (
            <tr key={i} className="ds-tr-border">
              <td className="ds-td-left">{cell?.customId}</td>
              <td className="ds-td-left">{cell?.forTestId?.subCategory}</td>
              <td className="ds-td-left">{cell?.forTestId?.code}</td>
              <td className="ds-td-left">{cell?.storageDetail}</td>
              <td className="ds-td-left">{cell?.resultExpected}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* NOTES */}
    <div className="ds-notes-section">
      <div className="ds-notes-summary">
        <p className="ds-detail-section-label-header">COLLECTION NOTES</p>
        <div className="ds-notes-box">
          <ol className="mb-0" style={{ fontSize: "12px", paddingLeft: "10px" }}>
            <li>All samples collected under aseptic conditions. Patient was fasting 10 hours for Iron/LFT.</li>
            <li>Blood culture collected before antibiotic administration – sterile technique used.</li>
            <li>Samples labelled, bar-coded and entered into NHC Lab system at 09:35.</li>
            <li>Patient tolerated venipuncture well – no adverse events during collection.</li>
          </ol>
        </div>
      </div>
    </div>

    {/* SIGNATURE */}
    <div className="ds-sig-grid">
      <div className="ds-sig-cell">
        <div className="ds-sig-name">{appointmentData?.staff?.name}</div>
        <div className="ds-sig-sub">Phlebotomist / Lab Technician</div>
      </div>
      <div className="ds-sig-cell-border">
        <div className="ds-sig-name">{labData?.name}</div>
        <div className="ds-sig-sub">Accepted & Processing</div>
      </div>
      <div className="ds-sig-cell-border">
        <div className="ds-sig-name">{patientData?.name}</div>
        <div className="ds-sig-sub">Patient</div>
      </div>
    </div>

    {/* FOOTER */}
    <div className="ds-footer">
      <span>{labData?.name}, {labData?.address} · {labData?.email} · {labData?.contactNumber}</span>
      <span className="ds-tagline">Wishing you a speedy recovery</span>
    </div>

  </div>
</div>

        </>
    );
};

export default LabSampleReceipt;