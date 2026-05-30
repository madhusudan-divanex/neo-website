import React, { useEffect, useRef, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { QRCodeCanvas } from "qrcode.react"
import { getDaysBetweenDates } from "../Services/globalFunction";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import base_url from "../baseUrl";

import "./Template css/Certificate.css"
import "./Template css/DischargeSummary.css"


const ViewMedicalCertificate = ({ certificateData }) => {
  const pdfRef = useRef()
  const handleDownload = () => {
    const element = pdfRef.current;

    const opt = {
      margin: 0,
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
  return (
    <>
      <div className="container mt-2 d-flex justify-content-between align-items-center">
        <img src="/logo.png" alt="" srcset="" width={100} height={60} />
        <div>

          <button className="thm-btn" onClick={handleDownload}>Download</button>
        </div>
      </div>

      <div className="ds-page" ref={pdfRef}>
          <div  className="ds-card position-relative">
            <div className="ds-header">
              <div className="d-flex gap-3">
                <div className="ds-logo">
                  <img src={certificateData?.logo ?
                    `${base_url}/${certificateData?.logo}` : "/logo.png"} alt="" />
                </div>
                <div>
                  <h5 className="ds-header-title">Medical Certificate</h5>
                  <div className="ds-header-sub">{certificateData?.organization?.name}</div>
                  <div className="ds-header-meta">
                    {certificateData?.address?.fullAddress + ',' + certificateData?.address?.city?.name + ',' + certificateData?.address?.state?.name + ',' + certificateData?.address?.pinCode}
                  </div>
                </div>
              </div>

              <div className="ds-header-right">
                <div className="ds-badge">NeoHealthCard Network</div>
               <p className="ds-header-system lh-base fw-500">
              Fully Automated · Ecosystem Connected
              </p>
                <p className="ds-header-meta my-0 lh-sm">
                  {certificateData?.organization?.email} · {certificateData?.organization?.contactNumber}
                </p>
              </div>

            </div>

            {/* META */}
            <div className="ds-meta-strip">
              <Meta title="Certificate ID" value={certificateData?.customId} />
              <Meta title="Issue Date" value={new Date(certificateData?.createdAt)?.toLocaleDateString('en-GB')} />
              <Meta title="Issued By" value={` ${certificateData?.doctorId?.name}`} />
              <Meta title="Valid For" value={`${getDaysBetweenDates(certificateData?.rest?.from, certificateData?.rest?.to)} Days`} />
              <Meta title="Status" value={`Verified · ${certificateData?.status}`} />
            </div>

            {/* CERTIFICATE BODY */}
            <div className="certificate-box text-center position-relative">

              {/* WATERMARK */}
              <div className="watermark"></div>

          <div className="pb-5">
                <h4 className="c-title">Medical Certificate</h4>

              <div className="c-subtitle">
                {certificateData?.organization?.name} · NeoHealthCard Network · {certificateData?.organization?.nh12}
              </div>

              <p className="c-neo-title">This is to certify that the patient</p>

              <h2 className="patient-name">{certificateData?.patientId?.name}</h2>

              <p className="c-description">
                Age: {certificateData?.age} Years · Gender: {certificateData?.gender} · {certificateData?.patientId?.nh12}
              </p>

              <p className="c-description">
                was examined and found to be suffering from {certificateData?.diagnosis}.
              </p>

              <p className="c-description">
                The patient was admitted on <strong>{new Date(certificateData?.admitDate)?.toLocaleDateString('en-GB')}</strong> and discharged on <strong>{new Date(certificateData?.dischargeDate)?.toLocaleDateString('en-GB')}</strong>.
              </p>

              {certificateData?.rest?.from && certificateData?.rest?.to &&

                <p className="c-description">
                  The patient is advised rest and is unfit for duty for a period of
                  <strong> {getDaysBetweenDates(certificateData?.rest?.from, certificateData?.rest?.to)} Days</strong> (
                  {new Date(certificateData?.rest?.from)?.toLocaleDateString('en-GB')} to {new Date(certificateData?.rest?.to)?.toLocaleDateString('en-GB')}
                  ).
                </p>

              }

              <p className="c-description">
                The patient should avoid strenuous activity and report if symptoms worsen.
              </p>
          </div>

              {/* QR */}
              <div className="d-flex align-items-center flex-column justify-content-center">
                <div className="ds-qr-box">
                  <QRCodeCanvas
                    value={`https://www.neohealthcard.com/certificate/${certificateData?.customId}`}
                    size={256}
                    className="qr-codes"
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  />
                </div>
                <p className="ds-qr-label">Scan to verify</p>
                <p className="mb-0 lh-1">
                  <a href="javascript:void(0)" className="ds-qr-link fz-14">verify.neohealthcard.in</a>
               </p>
              </div>


            </div>

            {/* SIGNATURE */}
            <div className="hp-ds-sig-grid" style={{borderTop : "1px solid #e6e6e6"}}>
              <div className="ds-sig-cell">
                <div className="ds-sig-name"> {certificateData?.doctorId?.name}</div>
                <div className="ds-sig-sub">{certificateData?.specialty} specialist</div>
              </div>

              <div className="ds-sig-cell-border">
                <div className="ds-sig-name">Hospital Seal & Stamp</div>
                <div  className="ds-sig-sub">{certificateData?.organization?.name}</div>
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
  <div className="ds-meta-block">
    <div className="ds-meta-label">{title}</div>
    <div className="fz-12 ds-meta-value text-capitalize">{value}</div>
  </div>
);

export default ViewMedicalCertificate;
