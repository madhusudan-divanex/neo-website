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
const Label = ({ children }) => (
  <p className="ds-kv-label">
    {children}
  </p>
);

const Value = ({ children, bold }) => (
  <p
    className={
      bold
        ? "ds-kv-value fw-bold"
        : "ds-kv-value"
    }
  >
    {children}
  </p>
);

const KV = ({ k, v }) => (
  <div className="ds-kv-wrap">
    <Label>{k}</Label>

    <Value>{v}</Value>
  </div>
);

const Meta = ({ l, v, highlight }) => (
  <div className="ds-meta-block">

    <p className="ds-meta-label">
      {l}
    </p>

    <p
      className={`fz-12 ${
        highlight
          ? "ds-meta-value-highlight"
          : "ds-meta-value"
      }`}
    >
      {v}
    </p>

  </div>
);

export default function OPDReceipt({ pdfLoading, endLoading } = {}) {
    const { id } = useParams()
    const [ptData, setPtData] = useState()
    const [aptData, setAptData] = useState()
    const [vital, setVitals] = useState()
    async function fetchAptPayment() {
        if (!id) {
            return
        }
        try {
            const res = await getApiData(`api/comman/opd-invoice/${id}`)

            if (res.success) {
                setAptData(res.data)
                setVitals(res?.data?.vitals)
                setPtData(res.ptData)
            } else {
                toast.error(res.message)
            }
        } catch (error) {

        }
    }
    useEffect(() => {
        fetchAptPayment()
    }, [id])
    const invoiceRef = useRef()

    const handleDownload = () => {
        try {

            const element = invoiceRef.current;
            document.body.classList.add("hide-buttons");
            const opt = {
                margin: 0,
                filename: `OPD-Receipt-${aptData?.customId}.pdf`,
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

        // <div style={s.page} ref={invoiceRef}>
        //     <div style={s.card}>

        //         {/* WATERMARK */}
        //         <div style={s.watermarkWrap}>
        //             <div style={s.watermarkCircle} />
        //         </div>

        //         {/* HEADER */}
        //         <div style={s.header}>
        //             <div className="d-flex gap-3">
        //                 <div style={s.logo}>
        //                     <img src={aptData?.logoFileId ?
        //                         `${base_url}/api/file/${aptData?.logoFileId}` : "/logo.png"} alt=""
        //                         onError={(e) => {
        //                             e.target.onerror = null;
        //                             e.target.src = "/logo.png";
        //                         }} />
        //                 </div>
        //                 <div>
        //                     <h1 style={s.headerTitle}>OPD Receipt</h1>
        //                     <p style={s.headerSub}>{aptData?.orgName}</p>
        //                     <p style={s.headerMeta}>{aptData?.orgNh12}</p>
        //                     <p style={s.headerMeta}>{aptData?.orgAddress}</p>
        //                 </div>
        //             </div>
        //             <div style={s.headerRight}>
        //                 <div style={s.badge}>NeoHealthCard Network</div>
        //                 <p style={s.headerMeta}>Fully Automated · Ecosystem Connected</p>
        //                 <p style={s.headerMeta}> {aptData?.orgEmail} · {aptData?.orgContactNumber}</p>
        //             </div>
        //         </div>

        //         {/* META */}
        //         <div style={s.metaStrip}>
        //             <Meta l="OPD RECEIPT ID" v={aptData?.customId} />
        //             <Meta l="DATE & TIME" v={new Date(aptData?.date)?.toLocaleString('en-GB')} />
        //             {/* <Meta l="OPD TOKEN" v="T-042" /> */}
        //             <Meta
        //                 l="STATUS"
        //                 v={`${capitalize(aptData?.paymentStatus)} · ${capitalize(aptData?.status)}`}
        //             />
        //         </div>

        //         {/* PATIENT */}
        //         <div style={s.patientSection}>
        //             <div style={s.patientLeft}>
        //                 <h2 style={s.patientName}>{ptData?.name}</h2>
        //                 <div style={s.patientGrid}>
        //                     <KV k="Age / Sex" v={`${calculateAge(ptData?.dob, aptData?.createdAt)} / ${ptData?.gender?.charAt(0)?.toUpperCase() + ptData?.gender?.slice(1)}`} />
        //                     <KV k="Email Address" v={ptData?.email} />
        //                     <KV k="Patient ID" v={ptData?.nh12} />

        //                     <KV k="DOB" v={new Date(ptData?.dob)?.toLocaleDateString('en-GB')} />
        //                     <KV k="Address" v={ptData?.address || '-'} />
        //                     <KV k="" v="" />
        //                     <KV k="Blood" v={ptData?.bloodGroup} />
        //                     <KV k="Contact no" v={ptData?.contactNumber} />
        //                     <KV k="" v="" />
        //                 </div>
        //             </div>

        //             {/* QR */}
        //             <div style={s.qrCol}>
        //                 <div style={s.qrBox} >
        //                     <QRCodeCanvas
        //                         value={`https://www.neohealthcard.com/opd-invoice/${id}`}
        //                         size={256}
        //                         // className="qr-code"
        //                         style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        //                     />
        //                 </div>
        //                 <p style={s.qrLabel}>Scan to verify</p>
        //                 <p style={s.qrLink}>verify.neohealthcard.in</p>
        //             </div>
        //         </div>

        //         {/* CONSULTATION + VITALS */}
        //         <div style={s.detailsGrid}>
        //             <div style={s.detailGroup}>
        //                 <p style={s.sectionLabel}>CONSULTATION DETAILS</p>
        //                 <KV k="Doctor" v={`${aptData?.doctorName}`} />
        //                 {aptData?.specialization && <KV k="Specialisation" v={aptData?.specialization || ''} />}
        //                 {/* <KV k="Department"     v="OPD · General Medicine" /> */}
        //                 {/* <KV k="Clinic / Room" v="OPD Room 3" /> */}
        //                 {/* <KV k="Visit Type"     v="New Patient" /> */}
        //             </div>
        //             {vital && <div style={s.detailGroup}>
        //                 <p style={s.sectionLabel}>COMPLAINT & VITALS</p>
        //                 <KV k="Height" v={`${vital?.height || '-'} cm`} />
        //                 <KV k="Temp" v={`${vital?.temperature || '-'} °F"`} />
        //                 <KV k="BP" v={`${vital?.bloodPressure || '-'} mmHg`} />
        //                 <KV k="Weight" v={`${vital?.weight || '-'} kg`} />
        //                 {/* <KV k="Referred To"     v="IPD · Admitted" /> */}
        //             </div>}
        //         </div>

        //         {/* TABLE */}
        //         <div style={s.tableSection}>
        //             <p style={s.tableTitle}>OPD CHARGES</p>
        //             <table style={s.table}>
        //                 <thead style={s.thead}>
        //                     <tr>
        //                         <th style={s.thLeft}>DESCRIPTION</th>
        //                         {/* <th style={s.thCenter}>SAC CODE</th>
        //         <th style={s.thCenter}>GST%</th> */}
        //                         <th style={s.thRight}>TOTAL</th>
        //                     </tr>
        //                 </thead>
        //                 <tbody>
        //                     <tr style={s.trBorder}>
        //                         <td style={s.tdLeft}>
        //                             <div>OPD Consultation – {aptData?.doctorName}</div>
        //                             <div style={s.tdSub}>{aptData?.specialization || ''}</div>
        //                         </td>
        //                         <td style={s.tdRight}>₹{aptData?.fees}</td>
        //                     </tr>
        //                     {/* <tr style={s.trBorder}>
        //         <td style={s.tdLeft}>
        //           <div>Registration & File Charges</div>
        //           <div style={s.tdSub}>New patient file opening</div>
        //         </td>
        //         <td style={s.tdCenter}>999311</td>
        //         <td style={s.tdCenter}>18%</td>
        //         <td style={s.tdRight}>₹3,000.00</td>
        //       </tr> */}
        //                 </tbody>
        //             </table>

        //             {/* SUMMARY */}
        //             <div style={s.summaryWrap}>
        //                 <div style={s.summaryBox}>
        //                     <div style={s.summaryRow}>
        //                         <span style={s.summaryLabel}>Sub Total</span>
        //                         <span>₹{aptData?.fees}</span>
        //                     </div>
        //                     <div style={s.summaryRow}>
        //                         <span style={s.summaryLabel}>Discount</span>
        //                         <span>{aptData?.discountType == "Fixed" && "₹"}{aptData?.discountValue} {aptData?.discountType == "Percentage" && "(%)"}</span>
        //                     </div>
        //                     <div style={s.summaryTotal}>
        //                         <span>Grand Total</span>
        //                         <span>₹{aptData?.totalAmount || aptData?.fees}</span>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>

        //         {/* PAYMENT */}
        //         <div style={s.paymentGrid}>
        //             <div style={s.paymentCell}>
        //                 <Label>Payment Mode</Label>
        //                 <Value>{aptData?.paymentMethod}</Value>
        //             </div>
        //             {aptData?.transactionId && <div style={s.paymentCellBorder}>
        //                 <Label>Transaction ID</Label>
        //                 <Value>{aptData?.transactionId}</Value>
        //             </div>}
        //             <div style={s.paymentCellBorder}>
        //                 <Label>Status</Label>
        //                 <Value>{capitalize(aptData?.paymentStatus)}</Value>
        //             </div>
        //         </div>

        //         {/* FOOTER */}
        //         <div style={s.footer}>
        //             <span>{aptData?.orgName}, {aptData?.orgAddress} · {aptData?.orgEmail} · {aptData?.orgContactNumber}</span>
        //             <span>Wishing you a speedy recovery</span>
        //         </div>

        //     </div>
        // </div>
        
        
      <>
      <div className="container mt-2 d-flex justify-content-between align-items-center">
                <img src="/logo.png" alt="" srcset="" width={100} height={60} />
                <div>

                    <button className="thm-btn" onClick={handleDownload}>Download</button>
                </div>
            </div>
      
        <div className="ds-page" ref={invoiceRef}>
  <div className="ds-card">

    {/* WATERMARK */}
    <div className="ds-watermark-wrap">
    </div>

    {/* HEADER */}
    <div className="ds-header">
      <div className="d-flex gap-3">

        <div className="ds-logo">
          <img
            src={
              aptData?.logoFileId
                ? `${base_url}/api/file/${aptData?.logoFileId}`
                : "/logo.png"
            }
            alt=""
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/logo.png";
            }}
          />
        </div>

        <div>
          <h1 className="ds-header-title">
            OPD Receipt
          </h1>

          <p className="ds-header-sub mb-0 lh-sm">
            {aptData?.orgName}
          </p>

          <p className="ds-header-meta-top mb-0 lh-sm">
            {aptData?.orgNh12}
          </p>

          <p className="ds-header-meta mb-0 lh-sm">
            {aptData?.orgAddress}
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
          {aptData?.orgEmail} · {aptData?.orgContactNumber}
        </p>
      </div>
    </div>

    {/* META */}
    <div className="ds-meta-strip">

      <Meta
        l="OPD RECEIPT ID"
        v={aptData?.customId}
      />

      <Meta
        l="DATE & TIME"
        v={new Date(aptData?.date)?.toLocaleString("en-GB")}
      />

      <Meta
        l="STATUS"
        v={`${capitalize(
          aptData?.paymentStatus
        )} · ${capitalize(aptData?.status)}`}
      />
    </div>

    {/* PATIENT */}
    <div className="ds-patient-section">

      <div className="ds-patient-left">

        <h3 className="ds-patient-title">
          Patient
        </h3>

        <h2 className="ds-patient-name">
          {ptData?.name}
        </h2>

        <div className="ds-patient-grid">

          <KV
            k="Age / Sex"
            v={`${calculateAge(
              ptData?.dob,
              aptData?.createdAt
            )} / ${
              ptData?.gender?.charAt(0)?.toUpperCase() +
              ptData?.gender?.slice(1)
            }`}
          />

          <KV
            k="Email Address"
            v={ptData?.email}
          />

          <KV
            k="Patient ID"
            v={ptData?.nh12}
          />

          <KV
            k="DOB"
            v={new Date(
              ptData?.dob
            )?.toLocaleDateString("en-GB")}
          />

          <KV
            k="Address"
            v={ptData?.address || "-"}
          />

          <KV k="" v="" />

          <KV
            k="Blood"
            v={ptData?.bloodGroup}
          />

          <KV
            k="Contact no"
            v={ptData?.contactNumber}
          />

          <KV k="" v="" />

        </div>
      </div>

      {/* QR */}
      <div className="ds-qr-col">

        <div className="ds-qr-box">
          <QRCodeCanvas
            value={`https://www.neohealthcard.com/opd-invoice/${id}`}
            size={256}
            className="qr-codes"
            style={{
              height: "auto",
              maxWidth: "100%",
              width: "100%",
            }}
          />
        </div>

        <p className="ds-qr-label">
          Scan to verify
        </p>

        <p>
          <a
            href="javascript:void(0)"
            className="ds-qr-link"
          >
            verify.neohealthcard.in
          </a>
        </p>
      </div>
    </div>

    {/* CONSULTATION + VITALS */}
    <div className="ds-details-grid">

      <div>
        <p className="ds-detail-section-label">
          CONSULTATION DETAILS
        </p>

        <div className="ds-detail-rows">

          <div className="ds-detail-row">
            <span className="ds-detail-key">
              Doctor
            </span>

            <span className="ds-detail-summary">
              {aptData?.doctorName}
            </span>
          </div>

          {aptData?.specialization && (
            <div className="ds-detail-row">
              <span className="ds-detail-key">
                Specialisation
              </span>

              <span className="ds-detail-summary">
                {aptData?.specialization || ""}
              </span>
            </div>
          )}

        </div>
      </div>

      {vital && (
        <div>

          <p className="ds-detail-section-label">
            COMPLAINT & VITALS
          </p>

          <div className="ds-detail-rows">

            <div className="ds-detail-row">
              <span className="ds-detail-key">
                Height
              </span>

              <span className="ds-detail-summary">
                {vital?.height || "-"} cm
              </span>
            </div>

            <div className="ds-detail-row">
              <span className="ds-detail-key">
                Temp
              </span>

              <span className="ds-detail-summary">
                {vital?.temperature || "-"} °F
              </span>
            </div>

            <div className="ds-detail-row">
              <span className="ds-detail-key">
                BP
              </span>

              <span className="ds-detail-summary">
                {vital?.bloodPressure || "-"} mmHg
              </span>
            </div>

            <div className="ds-detail-row">
              <span className="ds-detail-key">
                Weight
              </span>

              <span className="ds-detail-summary">
                {vital?.weight || "-"} kg
              </span>
            </div>

          </div>
        </div>
      )}
    </div>

    {/* TABLE */}
    <div className="ds-medicines-section">

      <p className="ds-table-title">
        OPD CHARGES
      </p>

      <table className="ds-table">

        <thead className="ds-thead">
          <tr>

            <th className="ds-th-left">
              DESCRIPTION
            </th>

            <th className="ds-th-right">
              TOTAL
            </th>

          </tr>
        </thead>

        <tbody>

          <tr className="ds-tr-border">

            <td className="ds-td-left">

              <div className="fw-700 fz-14">
                OPD Consultation – {aptData?.doctorName}
              </div>

              <div className="ds-td-subtext">
                {aptData?.specialization || ""}
              </div>
            </td>

            <td className="ds-td-right">
              ₹{aptData?.fees}
            </td>

          </tr>

        </tbody>
      </table>

      {/* SUMMARY */}
      <div className="ds-summary-wrap">

        <div className="ds-summary-box">

          <div className="ds-summary-row">
            <span className="ds-summary-label">
              Sub Total
            </span>

            <span>
              ₹{aptData?.fees}
            </span>
          </div>

          <div className="ds-summary-row">
            <span className="ds-summary-label">
              Discount
            </span>

            <span>
              {aptData?.discountType == "Fixed" && "₹"}
              {aptData?.discountValue}{" "}
              {aptData?.discountType == "Percentage" &&
                "(%)"}
            </span>
          </div>

          <div className="ds-summary-total">
            <span>Grand Total</span>

            <span>
              ₹{aptData?.totalAmount || aptData?.fees}
            </span>
          </div>

        </div>
      </div>
    </div>

    {/* PAYMENT */}
    <div className="hp-opd-ds-payment-grid">

      <div className="ds-payment-cell-border">
        <Label>Payment Mode</Label>

        <Value>
          {aptData?.paymentMethod}
        </Value>
      </div>

      {aptData?.transactionId && (
        <div className="ds-payment-cell-border">

          <Label>Transaction ID</Label>

          <Value>
            {aptData?.transactionId}
          </Value>

        </div>
      )}

      <div className="ds-payment-cell-border">

        <Label>Status</Label>

        <Value>
          {capitalize(aptData?.paymentStatus)}
        </Value>

      </div>
    </div>

    {/* FOOTER */}
    <div className="ds-footer">

      <span>
        {aptData?.orgName}, {aptData?.orgAddress} ·{" "}
        {aptData?.orgEmail} ·{" "}
        {aptData?.orgContactNumber}
      </span>

      <span>
        Wishing you a speedy recovery
      </span>

    </div>

  </div>
        </div>
      </>
        
    );
}