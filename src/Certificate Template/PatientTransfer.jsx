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


const KV = ({ k, v }) => (
  <div className="ds-kv-wrap">
    <p className="ds-kv-label ">{k}</p>
    <p className="ds-kv-value">{v}</p>
  </div>
);
const KVS = ({ k, v }) => (
  <div className="ds-kv-wrap d-flex align-items-center justify-content-between">
    <p className="ds-kv-label ">{k}</p>
    <p className="ds-kv-value">{v}</p>
  </div>
);

export default function PatientTransfer() {
  const { id } = useParams()
  const pdfRef = useRef();
  const [transferData, setTransferData] = useState()
  const [organization, setOrganization] = useState()
  const [patientData, setPatientData] = useState()
  async function fetchTransferData(params) {
    try {
      const res = await getApiData(`api/hospital/transfer-data/${id}`)
      if (res.success) {
        setTransferData(res.data)
        setOrganization(res.organization)
        setPatientData(res.patientData)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }
  useEffect(() => {
    fetchTransferData()
  }, [id])
  const handleDownload = () => {
    const element = pdfRef.current;

    const opt = {
      margin: 0,
      filename: `Patient-Transfer-${transferData?.fromHospital?.nh12}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 2, // better quality
        useCORS: true
      },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait"
      }
    };

    html2pdf().set(opt).from(element).save();
  };
  return (
    <>

    <div className="container mt-2 d-flex justify-content-between align-items-center">
                <img src="/logo.png" alt="" srcset="" width={100} height={60} />
                <div>

                    <button className="thm-btn" onClick={handleDownload}>Download</button>
                </div>
            </div>
     
     <div className="ds-page" ref={pdfRef}>
  <div className="ds-card">
    <div className="ds-watermark-wrap">
    </div>

    {/* HEADER */}
    <div className="ds-header">
      <div className="d-flex gap-3">
        <div className="ds-logo">
          <img src={organization?.logoFileId ?
            `${base_url}/api/file/${organization?.logoFileId}` : "/logo.png"} alt="" />
        </div>
        <div>
          <div className="ds-header-title">Patient Transfer Letter</div>
          <div className="ds-header-sub">{organization?.name}</div>
          <div className="ds-header-meta">
            {organization?.nh12}
          </div>
          <div className="ds-header-meta">
            {organization?.address}
          </div>
        </div>
      </div>

      <div className="ds-header-right">
        <div className="ds-badge">NeoHealthCard Network</div>
        <p className="ds-header-system mb-0 lh-sm">Fully Automated · Ecosystem Connected</p>
        <p className="ds-header-meta mb-0 lh-sm">
          {organization?.email} · {organization?.contactNumber}
        </p>
      </div>
    </div>

    {/* META */}
    <div className="ds-meta-strip">
      <KV k="TRANSFER ID" v="NHC-TRF-2026-0412-00001" />
      <KV k="REF: DISCHARGE ID" v="NHC-DS-2026-0412-00001" />
      <KV k="TRANSFER DATE" v="12/04/2026 10:30" />
      <KV k="STATUS" v={transferData?.status} />
    </div>

    {/* PATIENT */}
    <div className="ds-patient-section">
      <div className="ds-patient-left">
        <h2 className="ds-patient-name">
          {transferData?.patientId?.name}
        </h2>
        <div className="ds-patient-grid">
          <KV k="Age / Sex" v={`${calculateAge(patientData?.dob, transferData?.createdAt)} / ${patientData?.gender}`} />
          <KV k="Email Address" v={transferData?.patientId?.email} />
          <KV k="Patient ID" v={transferData?.patientId?.nh12} />

          <KV k="DOB" v={new Date(patientData?.dob)?.toLocaleDateString('en-GB')} />
          <KV k="Address" v={patientData?.fullAddress || '-'} />
          <div />

          <KV k="Blood" v="B+" />
          <KV k="Contact no" v={transferData?.patientId?.contactNumber} />
          <div />
        </div>
      </div>

      <div className="ds-qr-col">
        <div className="ds-qr-box">
          <QRCodeCanvas
            value={`https://www.neohealthcard.com/transfer-certificate/${transferData?._id}`}
            size={256}
            className="qr-codes"
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          />
        </div>
        <p className="ds-qr-label">Scan to verify</p>
        <p className="mb-0">
          <a href="javascript:void(0)" className="ds-qr-link">verify.neohealthcard.in</a>
        </p>
      </div>
    </div>

    {/* FROM / TO */}
    <div className="ds-details-grid">
      <div>
        <p className="ds-detail-section-label">TRANSFERRING FROM</p>
        <div className="ds-detail-rows gap-0">
          <KVS k="Hospital" v={organization?.name} />
          <KVS k="Dept / Ward" v={transferData?.departmentTo?.departmentName} />
          <KVS k="Doctor" v={transferData?.sendingDoctor?.name} />
          <KVS k="Transfer Time" v="12/04/2026 13:00" />
        </div>
      </div>

      <div>
        <p className="ds-detail-section-label">TRANSFERRING TO</p>
        <div className="ds-detail-rows gap-0">
          <KVS k="Hospital" v={transferData?.toHospital?.name} />
          <KVS k="Department" v={transferData?.departmentTo?.departmentName} />
          <KVS k="Doctor" v={transferData?.receivingDoctor?.name} />
          <KVS k="Contact" v={transferData?.toHospital?.contactNumber} />
        </div>
      </div>
    </div>

    {/* TABLE */}
    <div className="ds-medicines-section">
      <p className="ds-detail-section-label mb-2 text-center">
        REASON FOR TRANSFER & CLINICAL SUMMARY
      </p>
      <table className="ds-table">
        <thead className="ds-thead">
          <tr>
            <th className="ds-th-left">Diagnosis</th>
            <th className="ds-th-left">Transfer Reason</th>
            <th className="ds-th-left">Condition</th>
            <th className="ds-th-left">Treatment Given</th>
            <th className="ds-th-left">Documents Sent</th>
          </tr>
        </thead>
        <tbody>
          <tr className="ds-tr-border">
            <td className="ds-td-left">{transferData?.reasonForTransfer?.diagnosis}</td>
            <td className="ds-td-left">{transferData?.reasonForTransfer?.reason}</td>
            <td className="ds-td-left">{transferData?.reasonForTransfer?.conditionAtTransfer}</td>
            <td className="ds-td-left">{transferData?.reasonForTransfer?.treatmentGiven}</td>
            <td className="ds-td-left">{transferData?.documentShared?.dischargeSummary && 'Discharge Summary'} {transferData?.documentShared?.prescriptions && "· Prescriptions"} {transferData?.documentShared?.labReports?.length > 0 && "· Lab Reports"} </td>
          </tr>
        </tbody>
      </table>
    </div>

    {/* SIGNATURES */}
    <div className="ds-sig-grid">
      <div className="ds-sig-cell">
        <div className="ds-sig-name">
          {transferData?.sendingDoctor?.name}
        </div>
        <div className="ds-sig-sub">Transferring Physician</div>
      </div>

      <div className="ds-sig-cell-border">
        <div className="ds-sig-name">
          {organization?.name}
        </div>
        <div className="ds-sig-sub">Authorised Signatory</div>
      </div>

      <div className="ds-sig-cell-border">
        <div className="ds-sig-name">
          Suresh Kumar
        </div>
        <div className="ds-sig-sub">Patient's Guardian</div>
      </div>
    </div>

    {/* FOOTER */}
    <div className="ds-footer">
      <span>
        {organization?.name} · {organization?.email} · {organization?.contactNumber}
      </span>
      <span>Wishing you a speedy recovery</span>
    </div>

  </div>
        </div>
    </>
  );
}