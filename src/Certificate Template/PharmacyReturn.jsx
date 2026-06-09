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

const PharmacyReturn = ({ pdfLoading, endLoading } = {}) => {
  const { id } = useParams()
  const [ptData, setPtData] = useState()
  const [orgData, setOrgData] = useState()
  const [sellData, setSellData] = useState()
  const [vital, setVitals] = useState()
  async function fetchSellData() {
    // if (!sellId) {
    //   return
    // }
    try {
      const res = await getApiData(`api/comman/pharmacy-return/${id}`)

      if (res.success) {
        setSellData(res.sellData)
        setOrgData(res?.orgData)
        setPtData(res.patientData)
      } else {
        toast.error(res.message)
      }
    } catch (error) {

    }
  }
  useEffect(() => {
    fetchSellData()
  }, [id])
  const invoiceRef = useRef()
  const handleDownload = () => {
    try {

      const element = invoiceRef.current;
      document.body.classList.add("hide-buttons");
      const opt = {
        margin: 0,
        filename: `Pharmacy-return-${sellData?.customId || sellData?._id?.slice(-6)}.pdf`,
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

      {/* <div ref={invoiceRef} style={{ background: "#f4f6f8", padding: 24, fontFamily: "Inter, sans-serif" }}>
                <div style={{ width: "100%", maxWidth: "760px", margin: "0 auto", background: "#fff", border: "1px solid #e5e7eb" }}>


                    <div style={{ display: "flex", justifyContent: "space-between", padding: "18px 20px", borderBottom: "1px solid #e5e7eb" }}>
                        <div className="d-flex gap-2">
                            <div style={{ width: '40px', height: '40px' }}>
                                <img src={orgData?.logo ?
                                    `${base_url}/${orgData?.logo}` : "/logo.png"} alt="" />
                            </div>
                            <div></div>
                            <div>
                                <div style={{ fontSize: 22, fontWeight: 600 }}>Pharmacy Return</div>
                                <div style={{ fontSize: 12 }}>{orgData?.name}</div>
                                <div style={{ fontSize: 11, color: "#6b7280" }}>
                                    {orgData?.nh12}
                                </div>
                                <div style={{ fontSize: 11, color: "#6b7280" }}>
                                    {orgData?.address}
                                </div>
                            </div>
                        </div>

                        <div style={{ textAlign: "right" }}>
                            <div style={{ border: "1px solid #0ea5a4", padding: "4px 12px", borderRadius: 20, fontSize: 11, color: "#0ea5a4" }}>
                                NeoHealthCard Network
                            </div>
                            <div style={{ fontSize: 11, color: "#6b7280" }}>Fully Automated · Ecosystem Connected</div>
                            <div style={{ fontSize: 11, color: "#6b7280" }}>{orgData?.email} · {orgData?.contactNumber}</div>
                        </div>
                    </div>

            
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", borderBottom: "1px solid #e5e7eb" }}>
                        {[
                            ["Pharmacy ID", orgData?.nh12],
                            ["PRESCRIPTION REF", sellData?.prescriptionId?.customId],
                            ["RETURN DATE", new Date(sellData?.returnDate)?.toLocaleDateString('en-GB')],
                            ["PHARMACIST", orgData?.contactPerson],
                            ["STATUS", sellData?.refundStatus]
                        ].map((item, i) => (
                            <div key={i} style={{ padding: "10px 14px", borderRight: "1px solid #e5e7eb" }}>
                                <div style={{ fontSize: 10, color: "#6b7280" }}>{item[0]}</div>
                                <div style={{ fontSize: 12, fontWeight: 600, color: i === 4 ? "#0ea5a4" : "#111827" }}>
                                    {item[1]}
                                </div>
                            </div>
                        ))}
                    </div>

            
                    <div style={{ display: "flex", padding: "16px 20px", borderBottom: "1px solid #e5e7eb" }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{ptData?.name}</div>

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", fontSize: 12, rowGap: 6 }}>
                                <div>Age / Sex: {calculateAge(ptData?.dob, sellData?.createdAt)} / {ptData?.gender || '-'}</div>
                                <div>Email Address: {ptData?.email}</div>
                                <div>Patient ID: {sellData?.patientId?.nh12}</div>

                                <div>DOB: {ptData?.dob ? new Date(ptData.dob).toLocaleDateString("en-GB") : "—"}</div>
                                <div>Address: {ptData?.address}</div>
                                <div>Pharmacy: {orgData?.name}</div>

                                <div>Blood: {ptData?.bloodGroup}</div>
                                <div>Contact no: {ptData?.contactNumber}</div>
                                <div></div>
                            </div>
                        </div>

                    
                        <div style={{ width: 120, textAlign: "center" }}>
                            <div style={{ width: 90, height: 90, border: "1px solid #d1d5db", margin: "0 auto" }} >
                                <QRCodeCanvas
                                    value={`https://www.neohealthcard.com/pharmacy-return/${sellData?.customId}`}
                                    size={256}
                                    // className="qr-code"
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                />
                            </div>
                            <div style={{ fontSize: 10 }}>Scan to verify</div>
                            <div style={{ fontSize: 10, color: "#0ea5a4" }}>verify.neohealthcard.in</div>
                        </div>
                    </div>

         
                    <div style={{ padding: "16px 20px" }}>
                        <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 6 }}>ITEMS RETURNED</div>

                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                            <thead>
                                <tr style={{ background: "#f3f4f6" }}>
                                    {[
                                        "MEDICINE",
                                        "QTY PURCHASED",
                                        "QTY RETURNED",
                                        "REASON FOR RETURN",
                                        "BATCH NO",
                                        "CONDITION",
                                        "REFUND AMOUNT"
                                    ].map((h, i) => (
                                        <th key={i} style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "left" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {sellData?.returnProducts?.map((item, i) => (
                                    <tr key={i}>
                                        <td style={{ border: "1px solid #e5e7eb", padding: 8 }}>{item?.inventoryId?.medicineName}</td>
                                        <td style={{ border: "1px solid #e5e7eb", padding: 8 }}>
                                            {
                                                sellData?.products?.find(
                                                    p => p?.inventoryId?._id === item?.inventoryId?._id
                                                )?.quantity || 0
                                            }
                                        </td>
                                        <td style={{ border: "1px solid #e5e7eb", padding: 8 }}>{item?.quantity}</td>
                                        <td style={{ border: "1px solid #e5e7eb", padding: 8 }}>{item?.reason}</td>
                                        <td style={{ border: "1px solid #e5e7eb", padding: 8 }}>{item?.inventoryId?.batchNumber}</td>
                                        <td style={{ border: "1px solid #e5e7eb", padding: 8 }}>{item?.condition}</td>
                                        <td style={{ border: "1px solid #e5e7eb", padding: 8 }}>{item?.refundAmount}</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>

                
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
                            <div style={{ width: 260, fontSize: 12 }}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span>Total Refund Amount</span>
                                    <span>Rs. {
                                        sellData?.returnProducts?.reduce(
                                            (total, item) => total + (Number(item?.refundAmount) || 0),
                                            0
                                        )
                                    }</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span>Refund Mode</span>
                                    <span>{sellData?.refundMode}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                                    <span>Refund Status</span>
                                    <span style={{ fontWeight: 600 }}>{sellData?.refundStatus}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                  
                    <div style={{ padding: "16px 20px" }}>
                        <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 6 }}>RETURN POLICY</div>
                        <ol style={{ fontSize: 12, marginLeft: 16 }}>
                            <li>Medicines accepted for return only if unopened, in original packaging, and within 30 days of purchase.</li>
                            <li>Medicines dispensed for scheduled/controlled substances are non-returnable.</li>
                            <li>Refund will be processed to original payment method within 3–5 working days.</li>
                            <li>This return note must be presented for any future disputes.</li>
                        </ol>
                    </div>

              
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", padding: 20, borderTop: "1px solid #e5e7eb", textAlign: "center" }}>
                        <div>
                            <div>{orgData?.contactPerson}</div>
                            <div style={{ fontSize: 11, color: "#6b7280" }}>Pharmacist · {orgData?.name}</div>
                        </div>
                        <div>
                            <div>{sellData?.patientId?.name}</div>
                            <div style={{ fontSize: 11, color: "#6b7280" }}>Patient — Received Medicines</div>
                        </div>
                    </div>

                    
                    <div style={{ background: "#0ea5a4", color: "#fff", fontSize: 11, padding: "8px 14px", display: "flex", justifyContent: "space-between" }}>
                        <span>{orgData?.name}, {orgData?.address} · {orgData?.email} · {orgData?.contactNumber}</span>
                        <span>Wishing you a speedy recovery</span>
                    </div>

                </div>
            </div> */}

      <div className="ds-page" ref={invoiceRef}>
        <div className="ds-card">
          <div className="ds-watermark-wrap">
          </div>

          {/* HEADER */}
          <div className="ds-header d-flex justify-content-between align-items-start">
            <div className="d-flex align-items-start gap-3">
              <div className="ds-logo">
                <img src={orgData?.logo ?
                  `${base_url}/${orgData?.logo}` : "/logo.png"} alt="" />
              </div>
              <div>
                <div className="ds-header-title">Pharmacy Return</div>
                <div className="ds-header-sub">{orgData?.name}</div>
                <div className="ds-header-meta">
                  {orgData?.nh12} <br />
                  {orgData?.address}
                </div>
              </div>
            </div>
            <div className="ds-header-right">
              <div className="ds-badge">NeoHealthCard Network</div>
              <p className="ds-header-system lh-base">
                Fully Automated · Ecosystem Connected
              </p>
              <p className="ds-header-meta my-0 lh-sm">{orgData?.email} · {orgData?.contactNumber}</p>
            </div>
          </div>

          {/* META STRIP */}
          <div className="ds-meta-strip">
            {[
              ["Pharmacy ID", orgData?.nh12],
              ["PRESCRIPTION REF", sellData?.prescriptionId?.customId],
              ["RETURN DATE", new Date(sellData?.returnDate)?.toLocaleDateString('en-GB')],
              ["PHARMACIST", orgData?.contactPerson],
              ["STATUS", sellData?.refundStatus]
            ].map((item, i) => (
              <div key={i} className="ds-meta-block">
                <div className="ds-meta-label">{item[0]}</div>
                <div className={`ds-meta-value fz-12 ${i === 4 ? "text-teal" : ""}`}>
                  {item[1]}
                </div>
              </div>
            ))}
          </div>

          {/* PATIENT */}
          <div className="ds-patient-section">
            <div className="flex-fill">
              <div className="ds-patient-title">Patient</div>
              <div className="ds-patient-name">{ptData?.name}</div>
              <div className="ds-patient-grid">
                <div>
                  <h6 className="ds-detail-key mb-0">Age / Sex</h6>
                  <span className="ds-detail-summary">{calculateAge(ptData?.dob, sellData?.createdAt)} / {ptData?.gender || '-'}</span>
                </div>
                <div>
                  <h6 className="ds-detail-key mb-0">Email Address</h6>
                  <span className="ds-detail-summary">{ptData?.email}</span>
                </div>
                <div>
                  <h6 className="ds-detail-key mb-0">Patient ID</h6>
                  <span className="ds-detail-summary ds-mono">{sellData?.patientId?.nh12}</span>
                </div>

                <div>
                  <h6 className="ds-detail-key mb-0">DOB</h6>
                  <span className="ds-detail-summary">{ptData?.dob ? new Date(ptData.dob).toLocaleDateString("en-GB") : "—"}</span>
                </div>
                <div>
                  <h6 className="ds-detail-key mb-0">Address</h6>
                  <span className="ds-detail-summary">{ptData?.address}</span>
                </div>
                <div>
                  <h6 className="ds-detail-key mb-0">Pharmacy</h6>
                  <span className="ds-detail-summary">{orgData?.name}</span>
                </div>

                <div>
                  <h6 className="ds-detail-key mb-0">Blood</h6>
                  <span className="ds-detail-summary">{ptData?.bloodGroup}</span>
                </div>
                <div>
                  <h6 className="ds-detail-key mb-0">Contact no</h6>
                  <span className="ds-detail-summary">{ptData?.contactNumber}</span>
                </div>
                <div></div>
              </div>
            </div>

            {/* QR */}
            <div className="ds-qr-col">
              <div className="ds-qr-box">
                <QRCodeCanvas
                  value={`https://www.neohealthcard.com/pharmacy-return/${sellData?.customId}`}
                  size={256}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
              </div>
              <p className="ds-qr-label">Scan to verify</p>
              <p className="mb-0">
                <a href="javascript:void(0)" className="ds-qr-link">verify.neohealthcard.in</a>
              </p>
            </div>
          </div>

          {/* TABLE */}
          <div className="ds-medicines-section">
            <div className="ds-table-title">ITEMS RETURNED</div>
            <table className="ds-table">
              <thead className="ds-thead">
                <tr>
                  <th className="ds-th-left" style={{ textWrap: "nowrap" }}>MEDICINE</th>
                  <th className="ds-th-left" style={{ textWrap: "nowrap" }}>QTY PURCHASED</th>
                  <th className="ds-th-left" style={{ textWrap: "nowrap" }}>QTY RETURNED</th>
                  <th className="ds-th-left" style={{ textWrap: "nowrap" }}>REASON FOR RETURN</th>
                  <th className="ds-th-left" style={{ textWrap: "nowrap" }}>BATCH NO</th>
                  <th className="ds-th-left" style={{ textWrap: "nowrap" }}>CONDITION</th>
                  <th className="ds-th-left" style={{ textWrap: "nowrap" }}>REFUND AMOUNT</th>
                </tr>
              </thead>

              <tbody>
                {sellData?.returnProducts?.map((item, i) => (
                  <tr key={i} className="ds-tr-border">
                    <td className="ds-td-left">{item?.inventoryId?.medicineName}</td>
                    <td className="ds-td-left">
                      {sellData?.products?.find(
                        p => p?.inventoryId?._id === item?.inventoryId?._id
                      )?.quantity || 0}
                    </td>
                    <td className="ds-td-left">{item?.quantity}</td>
                    <td className="ds-td-left">{item?.reason}</td>
                    <td className="ds-td-left">{item?.inventoryId?.batchNumber}</td>
                    <td className="ds-td-left">{item?.condition}</td>
                    <td className="ds-td-left">{item?.refundAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>


            <div className="ds-summary-wrap">
              <div className="ds-summary-box">
                <div className="ds-summary-row">
                  <span className="ds-summary-label">
                    Total Refund Amount
                  </span>
                  <span>Rs. {
                    sellData?.returnProducts?.reduce(
                      (total, item) => total + (Number(item?.refundAmount) || 0),
                      0
                    )
                  }</span>
                </div>
                <div className="ds-summary-row">
                  <span>Refund Mode</span>
                  <span>
                    <span>{sellData?.refundMode}</span>
                  </span>
                </div>
                <div className="ds-summary-total">
                  <span className="fz-14"> Refund Status</span>
                  <span className="fz-14">
                    {sellData?.refundStatus}
                  </span>
                </div>

              </div>
            </div>

          </div>




          {/* POLICY */}
          <div className="ds-notes-section">
            <div className="ds-notes-summary">
              <p className="ds-detail-section-label-header">RETURN POLICY</p>
              <div className="ds-notes-box">
                <ol style={{ fontSize: 12, paddingLeft: "10px" }}>
                  <li>Medicines accepted for return only if unopened, in original packaging, and within 30 days of purchase.</li>
                  <li>Medicines dispensed for scheduled/controlled substances are non-returnable.</li>
                  <li>Refund will be processed to original payment method within 3–5 working days.</li>
                  <li>This return note must be presented for any future disputes.</li>
                </ol>
              </div>
            </div>
          </div>

          {/* SIGNATURE */}
          <div className="hp-ds-sig-grid">
            <div className="ds-sig-cell">
              <div className="ds-sig-name">{orgData?.contactPerson}</div>
              <div className="ds-sig-sub">Pharmacist · {orgData?.name}</div>
            </div>
            <div className="ds-sig-cell-border">
              <div className="ds-sig-name">{sellData?.patientId?.name}</div>
              <div className="ds-sig-sub">Patient — Received Medicines</div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="ds-footer">
            <span>{orgData?.name}, {orgData?.address} · {orgData?.email} · {orgData?.contactNumber}</span>
            <span className="ds-tagline">Wishing you a speedy recovery</span>
          </div>

        </div>
      </div>


    </>
  );
};

export default PharmacyReturn;