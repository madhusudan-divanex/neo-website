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

const LabInvoice = ({ pdfLoading, endLoading } = {}) => {
    const { id } = useParams();
    const [appointmentData, setAppointmentData] = useState(null);
    const [patientData, setPatientData] = useState(null);
    const [labData, setLabData] = useState(null);
    const [labPayment, setPaymentData] = useState([]);

    const invoiceRef = useRef();

    // ── Fetch ──────────────────────────────────────────────────────────────────
    async function fetchAllotmentDetail() {
        if (!id) {
            return
        }
        try {
            const res = await getApiData(
                `api/comman/lab-invoice/${id}`
            );
            if (res.success) {
                setAppointmentData(res.appointmentData);
                setPatientData(res.patientData);
                setLabData(res.labData);
                setPaymentData(res.labPayment || []);
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
                filename: `LabInvoice-${labPayment?.customId}.pdf`,
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

            {/* <div ref={invoiceRef} style={{
                background: "#f4f6f8", padding: "24px", fontFamily: "Inter, sans-serif", inHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <div style={{ width: "794x", margin: "0 auto", background: "#fff", border: "1px solid #e5e7eb" }}>

     
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "18px 20px", borderBottom: "1px solid #e5e7eb" }}>
                        <div className="d-flex align-items-center gap-2">
                            <div style={{ width: '40px', height: '40px' }}>
                                <img src={labData?.logo ?
                                    `${base_url}/${labData?.logo}` : "/logo.png"} alt="" />
                            </div>
                            <div>
                                <div style={{ fontSize: "22px", fontWeight: 600 }}>Lab Invoice</div>
                                <div style={{ fontSize: "12px" }}>{labData?.name}</div>
                                <div style={{ fontSize: "11px", color: "#6b7280" }}>
                                    {labData?.nh12}
                                </div>
                                <div style={{ fontSize: "11px", color: "#6b7280" }}>
                                    {[labData?.address, labData?.city?.name, labData?.state?.name, labData?.pinCode]
                                        .filter(Boolean).join(", ")}
                                </div>
                            </div>
                        </div>

                        <div style={{ textAlign: "right" }}>
                            <div style={{ border: "1px solid #0ea5a4", padding: "4px 12px", borderRadius: "20px", fontSize: "11px", color: "#0ea5a4" }}>
                                NeoHealthCard Network
                            </div>
                            <div style={{ fontSize: "11px", color: "#6b7280" }}>
                                Fully Automated · Ecosystem Connected
                            </div>
                            <div style={{ fontSize: "11px", color: "#6b7280" }}>
                                {labData?.email} · {labData?.contactNumber}
                            </div>
                        </div>
                    </div>

           
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderBottom: "1px solid #e5e7eb" }}>
                        {[
                            ["INVOICE ID", labPayment?.customId],
                            ["LAB ORDER REF", appointmentData?.customId],
                            
                            ["DATE", new Date(labPayment?.createdAt)?.toLocaleDateString('en-GB')],
                            ["STATUS", capitalize(appointmentData?.paymentStatus)]
                        ].map((item, i) => (
                            <div key={i} style={{ padding: "10px 14px", borderRight: "1px solid #e5e7eb" }}>
                                <div style={{ fontSize: "10px", color: "#6b7280" }}>{item[0]}</div>
                                <div style={{ fontSize: "12px", fontWeight: 600, color: item[0] === "STATUS" ? "#0ea5a4" : "#111827" }}>
                                    {item[1]}
                                </div>
                            </div>
                        ))}
                    </div>

            
                    <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex" }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>Vijay Kumar</div>

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", fontSize: "12px", rowGap: "6px" }}>
                                <div>Age / Sex: {calculateAge(patientData?.dob, appointmentData?.createdAt)} / {patientData?.gender || '-'}</div>
                                <div>Email Address: {patientData?.email}</div>
                                <div>Patient ID: {patientData?.nh12}</div>

                                <div>DOB: {patientData?.dob ? new Date(patientData.dob).toLocaleDateString("en-GB") : "—"}</div>
                                <div>Address: {patientData?.address}</div>
                                <div>Attending Doctor: {appointmentData?.staff?.name}</div>

                                <div>Blood: {patientData?.bloodGroup}</div>
                                <div>Contact no: {patientData?.contactNumber}</div>
                                <div>Lab: {labData?.name}</div>
                            </div>
                        </div>

                        <div style={{ width: "120px", textAlign: "center" }}>
                            <div style={{ width: "90px", height: "90px", border: "1px solid #d1d5db", margin: "0 auto" }} >
                                <QRCodeCanvas
                                    value={`https://www.neohealthcard.com/lab-invoice/${appointmentData?.customId}`}
                                    size={256}
                                
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                />
                            </div>
                            <div style={{ fontSize: "10px" }}>Scan to verify</div>
                            <div style={{ fontSize: "10px", color: "#0ea5a4" }}>verify.neohealthcard.in</div>
                        </div>
                    </div>

                
                    <div style={{ padding: "16px 20px" }}>
                        <div style={{ fontSize: "11px", marginBottom: "6px", color: "#6b7280" }}>TEST CHARGES</div>

                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                            <thead>
                                <tr style={{ background: "#f3f4f6" }}>
                                    {["TEST NAME", "SAC CODE", "AMOUNT"].map((h, i) => (
                                        <th key={i} style={{ border: "1px solid #e5e7eb", padding: "8px", textAlign: "left" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {appointmentData?.tests.map((test, i) => (
                                    <>
                                        <tr key={i}>
                                            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>{test?.category?.name}</td>
                                            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>{test?.subCatId?.code}</td>
                                            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>{test?.categoryPrice}</td>
                                        </tr>
                                        {test?.subCat?.map((cell, j) => (
                                            <tr key={i} >
                                                <td key={j} style={{ border: "1px solid #e5e7eb", padding: "8px", paddingLeft: '20px' }}>{cell?.subCatId?.subCategory}</td>
                                                <td key={j} style={{ border: "1px solid #e5e7eb", padding: "8px" }}>{cell?.subCatId?.code}</td>
                                                <td key={j} style={{ border: "1px solid #e5e7eb", padding: "8px" }}>{test?.categoryPrice ? '' : cell?.subCatPrice}</td>
                                            </tr>
                                        ))}
                                    </>
                                ))}
                            </tbody>
                        </table>

                        {(() => {
                     
                            const subTotal = appointmentData?.tests?.reduce((sum, testEntry) => {
                                if (testEntry?.categoryPrice) return sum + (testEntry.categoryPrice || 0)
                                return sum + (testEntry?.subCat?.reduce((s, sub) => s + (sub?.subCatPrice || 0), 0) || 0)
                            }, 0) || 0

                            const discount = Number(labPayment?.discount || 0)
                            const taxes = Number(labPayment?.taxes || 0)

                            const discountAmount = (subTotal * discount) / 100
                            const afterDiscount = subTotal - discountAmount
                            const taxAmount = (afterDiscount * taxes) / 100
                            const grandTotal = Math.round((afterDiscount + taxAmount) * 100) / 100

                            return (
                                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px" }}>
                                    <div style={{ width: "280px", fontSize: "12px" }}>

                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                                            <span>Sub Total</span>
                                            <span>₹ {subTotal.toFixed(2)}</span>
                                        </div>

                                        {discount > 0 && (
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                                                <span>Discount ({discount}%)</span>
                                                <span>- ₹ {discountAmount.toFixed(2)}</span>
                                            </div>
                                        )}

                                        {taxes > 0 && (
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                                                <span>GST ({taxes}%)</span>
                                                <span>+ ₹ {taxAmount.toFixed(2)}</span>
                                            </div>
                                        )}

                                        <div style={{
                                            display: "flex", justifyContent: "space-between",
                                            fontWeight: 600, marginTop: "8px",
                                            borderTop: "1px solid #e5e7eb", paddingTop: "6px"
                                        }}>
                                            <span>Grand Total</span>
                                            <span>₹ {grandTotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })()}
                    </div>

                    
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderTop: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb" }}>
                        <div style={{ padding: "14px" }}>
                            <div style={{ fontSize: "11px", color: "#6b7280" }}>Payment Mode</div>
                            <div style={{ fontSize: "12px" }}>{labPayment?.paymentType}</div>
                        </div>
                        <div style={{ padding: "14px" }}>
                            <div style={{ fontSize: "11px", color: "#6b7280" }}>Transaction ID</div>
                            <div style={{ fontSize: "12px" }}>{labPayment?.customId}</div>
                        </div>
                        <div style={{ padding: "14px" }}>
                            <div style={{ fontSize: "11px", color: "#6b7280" }}>Status</div>
                            <div style={{ fontSize: "12px", textTransform: 'capitalize' }}>{appointmentData?.paymentStatus}</div>
                        </div>
                    </div>

                   
                    <div style={{ padding: "16px 20px" }}>
                        <div style={{ fontSize: "11px", marginBottom: "6px", color: "#6b7280" }}>LAB TERMS</div>
                        <ol style={{ fontSize: "12px", marginLeft: "16px" }}>
                            <li>Reports will be available on NeoHealthCard app as soon as processed.</li>
                            <li>Critical values will be immediately communicated to ordering doctor.</li>
                            <li>Sample storage: 72 hours post-reporting for repeat testing if required.</li>
                            <li>Disputes regarding results must be raised within 7 days of report date.</li>
                        </ol>
                    </div>

                 
                    <div style={{ background: "#0ea5a4", color: "#fff", fontSize: "11px", padding: "8px 14px", display: "flex", justifyContent: "space-between" }}>
                        <span>Apollo General Hospital, Mumbai · {labData?.email} · {labData?.contactNumber}</span>
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
          <h1 className="ds-header-title">Lab Invoice</h1>
          <p className="ds-header-sub mb-0 lh-sm">{labData?.name}</p>
          <p className="ds-header-meta-top mb-0 lh-sm">{labData?.nh12}</p>
          <p className="ds-header-meta mb-0 lh-sm">
            {[labData?.address, labData?.city?.name, labData?.state?.name, labData?.pinCode]
              .filter(Boolean).join(", ")}
          </p>
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
        ["INVOICE ID", labPayment?.customId],
        ["LAB ORDER REF", appointmentData?.customId],
        ["DATE", new Date(labPayment?.createdAt)?.toLocaleDateString('en-GB')],
        ["STATUS", capitalize(appointmentData?.paymentStatus)]
      ].map((item, i) => (
        <div key={i} className="ds-meta-block">
          <div className="ds-meta-label">{item[0]}</div>
          <div className={`ds-meta-value fz-12 ${item[0] === "STATUS" ? "text-teal" : ""}`}>{item[1]}</div>
        </div>
      ))}
    </div>

    {/* PATIENT */}
    <div className="ds-patient-section">
      <div className="ds-patient-left">
        <h3 className="ds-patient-title">Patient</h3>
        <h2 className="ds-patient-name">Vijay Kumar</h2>
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
            <span className="ds-detail-summary">{patientData?.bloodGroup}</span>
          </div>
          <div>
            <h6 className="ds-detail-key mb-0">Contact no</h6>
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
            value={`https://www.neohealthcard.com/lab-invoice/${appointmentData?.customId}`}
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

    {/* TABLE */}
    <div className="ds-medicines-section">
      <p className="ds-table-title">TEST CHARGES</p>
      <table className="ds-table">
        <thead className="ds-thead">
          <tr>
            {["TEST NAME", "SAC CODE", "AMOUNT"].map((h, i) => (
              <th key={i} className="ds-th-left">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {appointmentData?.tests.map((test, i) => (
            <>
              <tr key={i} className="ds-tr-border">
                <td className="ds-td-left">{test?.category?.name}</td>
                <td className="ds-td-left">{test?.subCatId?.code}</td>
                <td className="ds-td-left">{test?.categoryPrice}</td>
              </tr>
              {test?.subCat?.map((cell, j) => (
                <tr key={j} className="ds-tr-border">
                  <td className="ds-td-left" style={{ paddingLeft: '20px' }}>{cell?.subCatId?.subCategory}</td>
                  <td className="ds-td-left">{cell?.subCatId?.code}</td>
                  <td className="ds-td-left">{test?.categoryPrice ? '' : cell?.subCatPrice}</td>
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>

      {/* TOTALS */}
      {(() => {
        const subTotal = appointmentData?.tests?.reduce((sum, testEntry) => {
          if (testEntry?.categoryPrice) return sum + (testEntry.categoryPrice || 0)
          return sum + (testEntry?.subCat?.reduce((s, sub) => s + (sub?.subCatPrice || 0), 0) || 0)
        }, 0) || 0

        const discount = Number(labPayment?.discount || 0)
        const taxes = Number(labPayment?.taxes || 0)

        const discountAmount = (subTotal * discount) / 100
        const afterDiscount = subTotal - discountAmount
        const taxAmount = (afterDiscount * taxes) / 100
        const grandTotal = Math.round((afterDiscount + taxAmount) * 100) / 100

        return (
          <div className="ds-summary-wrap">
            <div className="ds-summary-box">

              <div className="ds-summary-row">
                <span className="ds-summary-label">Sub Total</span>
                <span>₹ {subTotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="ds-summary-row">
                  <span className="ds-summary-label">Discount ({discount}%)</span>
                  <span>- ₹ {discountAmount.toFixed(2)}</span>
                </div>
              )}

              {taxes > 0 && (
                <div className="ds-summary-row">
                  <span className="ds-summary-label">GST ({taxes}%)</span>
                  <span>+ ₹ {taxAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="ds-summary-total">
                <span>Grand Total</span>
                <span>₹ {grandTotal.toFixed(2)}</span>
              </div>

            </div>
          </div>
        )
      })()}
    </div>

    {/* PAYMENT */}
    <div className="ds-sig-grid">
      <div className="ds-sig-cell">
        <div className="ds-sig-name">Payment Mode</div>
        <div className="ds-sig-sub">{labPayment?.paymentType}</div>
      </div>
      <div className="ds-sig-cell-border">
        <div className="ds-sig-name">Transaction ID</div>
        <div className="ds-sig-sub">{labPayment?.customId}</div>
      </div>
      <div className="ds-sig-cell-border">
        <div className="ds-sig-name">Status</div>
        <div className="ds-sig-sub" style={{ textTransform: 'capitalize' }}>{appointmentData?.paymentStatus}</div>
      </div>
    </div>

    {/* NOTES */}
    <div className="ds-notes-section">
      <div className="ds-notes-summary">
        <p className="ds-detail-section-label-header">LAB TERMS</p>
        <div className="ds-notes-box">
          <ol className="mb-0" style={{ fontSize: "12px", paddingLeft: "10px" }}>
            <li>Reports will be available on NeoHealthCard app as soon as processed.</li>
            <li>Critical values will be immediately communicated to ordering doctor.</li>
            <li>Sample storage: 72 hours post-reporting for repeat testing if required.</li>
            <li>Disputes regarding results must be raised within 7 days of report date.</li>
          </ol>
        </div>
      </div>
    </div>

    {/* FOOTER */}
    <div className="ds-footer">
      <span>Apollo General Hospital, Mumbai · {labData?.email} · {labData?.contactNumber}</span>
      <span className="ds-tagline">Wishing you a speedy recovery</span>
    </div>

  </div>
</div>
            
        </>
    );
};

export default LabInvoice;