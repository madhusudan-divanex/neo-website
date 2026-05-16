import React, { useEffect, useRef, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { QRCodeCanvas } from "qrcode.react"
import './Template css/medicalCertificate.css'
import { getDaysBetweenDates } from "../Services/globalFunction";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import base_url from "../baseUrl";
const ViewMedicalCertificate = ({ certificateData }) => {
  const pdfRef = useRef()
  const handleDownload = () => {
    const element = pdfRef.current;

    const opt = {
      margin: 0.3,
      filename: `${certificateData?.customId}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 2,
        useCORS: true
      },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait"
      },
      pagebreak: { mode: ['avoid-all'] } // ✅ important
    };

    html2pdf().set(opt).from(element).save();
  };
  console.log(certificateData)
  return (
    <>
      <div className="container mt-2 d-flex justify-content-between">
        <img src="/logo.png" alt="" srcset="" width={100} height={60} />
        <div>

          <button className="thm-btn" onClick={handleDownload}>Download</button>
        </div>
      </div>

      <div ref={pdfRef} className="mc-wrapper d-flex justify-content-center bg-light py-4">
        <div className="mc-a4 bg-white position-relative">

          {/* HEADER */}
          <div className="d-flex justify-content-between p-4 border-bottom">
            <div className="d-flex">
              <div style={{ width: '34px', height: '34px' }}>
                <img src={certificateData?.organization?.logo ?
                  `${base_url}/${certificateData?.organization?.logo}` : "/logo.png"} alt="" />
              </div>
              <div style={{ marginLeft: 10 }}>
                <h5 className="fw-bold mb-1">Medical Certificate</h5>
                <div className="text-muted small">{certificateData?.organization?.name}</div>
                <div className="text-muted small">
                  {certificateData?.address?.fullAddress + ',' + certificateData?.address?.city?.name + ',' + certificateData?.address?.state?.name + ',' + certificateData?.address?.pinCode}
                </div>
              </div>
            </div>

            <div className="text-end">
              <span className="badge bg-teal px-3 py-2">
                NeoHealthCard Network
              </span>
              <div className="small text-muted mt-2">
                {certificateData?.organization?.email}
              </div>
              <div className="small text-muted">{certificateData?.organization?.contactNumber}</div>
            </div>
          </div>

          {/* META */}
          <div className="row px-4 py-3 border-bottom small text-muted">
            <Meta title="Certificate ID" value={certificateData?.customId} />
            <Meta title="Issue Date" value={new Date(certificateData?.createdAt)?.toLocaleDateString('en-GB')} />
            <Meta title="Issued By" value={`Dr. ${certificateData?.doctorId?.name}`} />
            <Meta title="Valid For" value={`${getDaysBetweenDates(certificateData?.rest?.from, certificateData?.rest?.to)} Days`} />
            <Meta title="Status" value={`Verified · ${certificateData?.status}`} />
          </div>

          {/* CERTIFICATE BODY */}
          <div className="certificate-box text-center position-relative">

            {/* WATERMARK */}
            <div className="watermark"></div>

            <h4 className="title text-teal">Medical Certificate</h4>

            <div className="subtitle">
              {certificateData?.organization?.name} · NeoHealthCard Network · {certificateData?.organization?.nh12}
            </div>

            <p className="mt-3">This is to certify that the patient</p>

            <h2 className="patient-name">{certificateData?.patientId?.name}</h2>

            <p className="small text-muted">
              Age: {certificateData?.age} Years · Gender: {certificateData?.gender} · {certificateData?.patientId?.nh12}
            </p>

            <p className="description">
              was examined and found to be suffering from {certificateData?.diagnosis}.
            </p>

            <p className="description">
              The patient was admitted on <strong>{new Date(certificateData?.admitDate)?.toLocaleDateString('en-GB')}</strong> and discharged on <strong>{new Date(certificateData?.dischargeDate)?.toLocaleDateString('en-GB')}</strong>.
            </p>

            {certificateData?.rest?.from && certificateData?.rest?.to &&

              <p className="description">
                The patient is advised rest and is unfit for duty for a period of
                <strong> {getDaysBetweenDates(certificateData?.rest?.from, certificateData?.rest?.to)} Days</strong> (
                {new Date(certificateData?.rest?.from)?.toLocaleDateString('en-GB')} to {new Date(certificateData?.rest?.to)?.toLocaleDateString('en-GB')}
                ).
              </p>

            }

            <p className="description">
              The patient should avoid strenuous activity and report if symptoms worsen.
            </p>

            {/* QR */}
            <div className="qr-box">
              <div className="qr-placeholder">
                <QRCodeCanvas
                  value={`https://www.neohealthcard.com/certificate/${certificateData?.customId}`}
                  size={256}
                  // className="qr-code"
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
              </div>
              <div className="small text-muted mt-2">Scan to verify</div>
              <div className="verify-link">verify.neohealthcard.in</div>
            </div>
          </div>

          {/* SIGNATURE */}
          <div className="row border-top text-center small text-muted">
            <div className="col p-4">
              <div className="fw-semibold">Dr. {certificateData?.doctorId?.name}</div>
              <div>{certificateData?.specialty} specialist</div>
            </div>

            <div className="col p-4 border-start">
              <div className="fw-semibold">Hospital Seal & Stamp</div>
              <div>{certificateData?.organization?.name}</div>
            </div>
          </div>

          <div className="footer-bar text-white text-center py-2 small">
            {certificateData?.organization?.name} · {certificateData?.organization?.contactNumber} · Wishing you a speedy recovery
          </div>

        </div>
      </div>
    </>
  );
};

const Meta = ({ title, value }) => (
  <div className="col">
    <div className="text-secondary">{title}</div>
    <div className="fw-medium text-dark text-capitalize">{value}</div>
  </div>
);

export default ViewMedicalCertificate;
