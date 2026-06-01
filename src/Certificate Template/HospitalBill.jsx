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
  <p className="ds-kv-label fw-700 fz-16">
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

const Meta = ({ l, v, highlight }) => (
  <div className="ds-meta-block">
    <p className="ds-meta-label">
      {l}
    </p>

    <p
      className={`fz-12 ${highlight
          ? "ds-meta-value-highlight"
          : "ds-meta-value"
        }`}
    >
      {v}
    </p>
  </div>
);

const KV = ({ k, v }) => (
  <div className="ds-kv-wrap">
    <p className="ds-kv-label ">
      {k}
    </p>

    <p className="ds-kv-value">
      {v}
    </p>
  </div>
);


export default function HospitalBill({ pdfLoading, endLoading } = {}) {
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
      const res = await getApiData(`api/comman/bed-invoice/${id}`)
      if (res.success) {
        setAllotmentData(res.allotmentData)
        setPatientData(res.patientData)
        setHospitalData(res.hospitalData)
        setPaymentData(res.paymentData)
        setDischargeData(res.dischargeData)
      } else {
        // toast.error(res.message)
      }
    } catch (error) {
      // toast.error(error?.response?.data?.message)
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
        filename: `HospitalBill-${allotmentData?.customId}.pdf`,
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
                <h1 className="ds-header-title">Hospital Bill</h1>
                <p className="ds-header-sub my-0 lh-sm">
                  {hospitalData?.name}
                </p>

                <p className="ds-header-meta my-0 lh-sm">
                  {hospitalData?.nh12} · Reg. MH-HOSP-2010-00891 · NABH Accredited
                </p>

                <p className="ds-header-meta my-0 lh-sm">
                  {hospitalData?.fullAddress} ,{hospitalData?.city?.name},
                  {hospitalData?.state?.name} -{hospitalData?.pinCode}
                </p>
              </div>
            </div>

            <div className="ds-header-right">
              <div className="ds-badge">NeoHealthCard Network</div>

              <p className="ds-header-system lh-base">
                Fully Automated · Ecosystem Connected
              </p>

              <p className="ds-header-meta my-0 lh-sm">
                {hospitalData?.email} · {hospitalData?.contactNumber}
              </p>
            </div>
          </div>

          {/* META */}
          <div className="ds-meta-strip">
            <Meta l="BILL ID" v={paymentData?.customId} />
            <Meta l="DISCHARGE REF" v={dischargeData?.customId} />
            {paymentData?.payments?.length > 0 && (
              <Meta
                l="BILL DATE"
                v={new Date(
                  Math.max(
                    ...paymentData.payments.map((p) => new Date(p.date))
                  )
                ).toLocaleDateString("en-GB")}
              />
            )}

            <Meta
              l="TOTAL STAY"
              v={`${new Date(
                allotmentData?.allotmentDate
              )?.toLocaleDateString("en-GB")} – ${dischargeData
                  ? new Date(dischargeData?.createdAt)?.toLocaleDateString("en-GB")
                  : "Present"
                } · ${totalStay} Days`}
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
                <KV
                  k="Age / Sex"
                  v={`${calculateAge(
                    patientData?.dob,
                    allotmentData?.createdAt
                  )} / ${patientData?.patientId?.gender || "-"}`}
                />

                <KV k="Email Address" v={patientData?.email} />

                <KV k="Patient ID" v={patientData?.nh12} />

                <KV
                  k="DOB"
                  v={new Date(patientData?.dob)?.toLocaleDateString("en-GB")}
                />

                <KV
                  k="Address"
                  v={`${patientData?.fullAddress || ""} ${patientData?.cityId?.name}`}
                />

                <KV
                  k="Dr Name"
                  v={allotmentData?.primaryDoctorId?.name}
                />

                <KV
                  k="Blood"
                  v={patientData?.bloodGroup || "-"}
                />

                <KV
                  k="Contact no"
                  v={patientData?.contactNumber}
                />

                <KV
                  k="Dr ID"
                  v={allotmentData?.primaryDoctorId?.nh12}
                />
              </div>
            </div>

            <div className="ds-qr-col">
              <div className="ds-qr-box">
                <QRCodeCanvas
                  value={`https://www.neohealthcard.com/hospital-bill/${allotmentData?.customId}`}
                  size={256}
                  style={{
                    height: "auto",
                    maxWidth: "100%",
                    width: "100%",
                  }}
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
            <p className="ds-table-title">
              SERVICES & CHARGES
            </p>

            <table className="ds-table">
              <thead className="ds-thead">
                <tr>
                  <th className="ds-th-left">
                    SERVICE / DESCRIPTION
                  </th>

                  <th className="ds-th-right">
                    TOTAL
                  </th>
                </tr>
              </thead>

              <tbody>

                {paymentData?.bedCharges?.length > 0 && (
                  <tr className="ds-tr-border">
                    <td className="ds-td-left">
                      <div className="fw-700 fz-14">Bed Charges</div>

                      <div className="ds-td-subtext">
                        {totalStay} Days
                      </div>
                    </td>

                    <td className="ds-td-right">
                      ₹{" "}
                      {paymentData?.bedCharges?.reduce(
                        (sum, s) => sum + Number(s.amount || 0),
                        0
                      )}
                    </td>
                  </tr>
                )}

                {paymentData?.ipdPayment?.length > 0 && (
                  <tr className="ds-tr-border">
                    <td className="ds-td-left">
                      <div className="fw-700 fz-14">Nursing Charges</div>

                      <div className="ds-td-subtext">
                        Post-operative nursing & patient care
                      </div>
                    </td>

                    <td className="ds-td-right">
                      ₹{" "}
                      {paymentData?.ipdPayment?.reduce(
                        (sum, s) => sum + Number(s.fees || 0),
                        0
                      )}
                    </td>
                  </tr>
                )}

                {paymentData?.services?.length > 0 && (
                  <tr className="ds-tr-border">
                    <td className="ds-td-left">
                      <div className="fw-700 fz-14">Services</div>

                      <div className="ds-td-subtext">
                        {paymentData?.services
                          ?.map((item) => item?.name)
                          ?.join(",")}
                      </div>
                    </td>

                    <td className="ds-td-right">
                      ₹{" "}
                      {paymentData?.services?.reduce(
                        (sum, s) => sum + Number(s.amount || 0),
                        0
                      )}
                    </td>
                  </tr>
                )}

              </tbody>
            </table>

            <div className="ds-summary-wrap">
              <div className="ds-summary-box">

                <div className="ds-summary-row">
                  <span className="ds-summary-label">
                    Sub Total
                  </span>

                  <span>
                    ₹{paymentData?.totalAmount}
                  </span>
                </div>

                <div className="ds-summary-row">
                  <span className="ds-summary-label">
                    Discount{" "}
                    {`${paymentData?.discountType == "Percentage"
                        ? "(%)"
                        : "₹"
                      }`}
                  </span>

                  <span>
                    -{paymentData?.discountValue}
                  </span>
                </div>

                <div className="ds-summary-total">
                  <span>Grand Total</span>
                  <span>
                    ₹{paymentData?.finalAmount}
                  </span>
                </div>

              </div>
            </div>
          </div>


          <div className="ds-payment-grid">
            <div className="ds-payment-cell-border">
              <Label>Transaction ID</Label>
              <Value>{paymentData?.customId}</Value>
            </div>

            <div className="ds-payment-cell-border">
              <Label>Status</Label>
              <Value>{paymentData?.status}</Value>
            </div>

          </div>
          <div className="ds-footer">
            <span>
              {hospitalData?.name}, Mumbai · {hospitalData?.email} ·{" "}
              {hospitalData?.contactNumber}
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