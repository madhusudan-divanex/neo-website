import React, { useEffect, useRef, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { QRCodeCanvas } from "qrcode.react"
import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";
import base_url from "../baseUrl";

import "./Template css/Certificate.css"
import "./Template css/DischargeSummary.css"


export default function ViewFitnessCertificate({ certificateData }) {
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
  return (
    <>
      <div className="container d-flex justify-content-between align-items-center">
        <img src="/logo.png" alt="" srcset="" width={100} height={60} />
        <div>
          <button className="thm-btn" onClick={handleDownload}>Download</button>
        </div>
      </div>



      <div className="neo-hp-fitness-page" ref={pdfRef}>
        <div className="neo-hp-fitness-card">

          {/* HEADER */}
          <div className="d-flex justify-content-between align-items-start hp-certificate-bx">
            <div className="d-flex gap-3">
              <div className="neo-hp-fitness-logo">
                <img src={certificateData?.organization?.logo ? `${base_url}/${certificateData?.organization?.logo}` : "/logo.png"} alt="" />
              </div>
              <div className="">
                <div className="neo-hp-fitness-title">Fitness Certificate</div>
                <div className="neo-hp-fitness-subtitle">{certificateData?.organization?.name}</div>
                <div className="neo-hp-fitness-meta">
                  {certificateData?.nh12} {certificateData?.address?.fullAddress + ',' + certificateData?.address?.city?.name + ',' + certificateData?.address?.state?.name + ',' + certificateData?.address?.pinCode}
                </div>
              </div>
            </div>

            <div className="text-end">
              <div className="neo-hp-fitness-badge mb-1">NeoHealthCard Network</div>
              <p className="neo-hp-fitness-meta-right-ft mb-0 lh-base">
                Fully Automated · Ecosystem Connected
              </p>
              <p className="neo-hp-fitness-meta-right mb-0 lh-base"> {certificateData?.organization?.email} · {certificateData?.organization?.contactNumber}</p>
            </div>
          </div>

          {/* INFO ROW */}
          <div className="ds-meta-strip" style={{ borderTop: "1px solid #e6e6e6" }}>
            {[
              ["CERTIFICATE ID", certificateData?.customId],
              [
                "ISSUE DATE",
                new Date(certificateData?.examinDate)?.toLocaleDateString("en-GB"),
              ],
              ["PURPOSE", certificateData?.purpose],
              [
                "VALID UNTIL",
                new Date(certificateData?.effectiveDate)?.toLocaleDateString("en-GB"),
              ],
              ["STATUS", `Verified · ${certificateData?.status}`],
            ].map((item, i) => (
              <div key={i} className="ds-meta-block">
                <div className="ds-meta-label">{item[0]}</div>

                <div
                  className={`ds-meta-value fz-12 ${item[0] === "STATUS" ? "neo-hp-fitness-status text-capitalize" : ""
                    }`}
                >
                  {item[1]}
                </div>
              </div>
            ))}
          </div>

          <div className="neo-hp-fitness-box">
            <div className="neo-hp-fitness-box-title">Certificate of Fitness</div>
            <div className="neo-hp-fitness-box-sub">{certificateData?.organization?.name} · {certificateData?.organization?.nh12}</div>

            <div className="neo-hp-fitness-center-text">This is to certify that</div>

            <div className="neo-hp-fitness-name">{certificateData?.patientId?.name}</div>

            <div className="neo-hp-fitness-desc">
              Age: {certificateData?.age} Years · Gender: {certificateData?.gender} · {certificateData?.patientId?.nh12}<br />
              was examined by the undersigned on <b>{new Date(certificateData?.examinDate)?.toLocaleDateString('en-GB')}</b> and is found to be medically FIT to resume<br />
              work / school / normal duties effective <b>{new Date(certificateData?.effectiveDate)?.toLocaleDateString('en-GB')}</b>, subject to the following conditions:
            </div>

            {certificateData?.condition && (
              <div className="neo-hp-fitness-desc">
                Conditions: {certificateData?.condition}
              </div>
            )}

            <div className="neo-hp-fitness-watermark"></div>

            <div className="d-flex align-items-center flex-column justify-content-center mt-5">
              <div className="neo-hp-fitness-qr">
                <QRCodeCanvas
                  value={`https://www.neohealthcard.com/certificate/${certificateData?.customId}`}
                  size={256}
                  className="qr-codes"
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
              </div>
              <div className="neo-hp-fitness-qr-text">Scan to verify</div>
              <div className="neo-hp-fitness-link">verify.neohealthcard.in</div>
            </div>




          </div>

          {/* FOOTER SIGN */}
          <div className="hp-ds-sig-grid" style={{ borderTop: "1px solid #e6e6e6" }}>
            <div className="ds-sig-cell">
              <div className="ds-sig-name">
                {certificateData?.doctorId?.name}
              </div>

              <div className="ds-sig-sub">
                {certificateData?.specialty} specialist ·{" "}
                {certificateData?.organization?.name}
              </div>

              <div className="neo-hp-fitness-link-small">
                {certificateData?.doctorId?.nh12}
              </div>
            </div>

            <div className="ds-sig-cell-border">
              <div className="ds-sig-name">
                Hospital Seal & Stamp
              </div>

              <div className="ds-sig-sub">
                {certificateData?.organization?.name}
              </div>

              <div className="neo-hp-fitness-link-small">
                {certificateData?.organization?.nh12}
              </div>
            </div>
          </div>

          <div className="neo-hp-fitness-footer-bar">
            {certificateData?.organization?.name}, {certificateData?.address?.city?.name} · {certificateData?.organization?.name} · {certificateData?.organization?.contactNumber}
            <span style={{ float: "right" }}>Wishing you a speedy recovery</span>
          </div>

        </div>
      </div>


    </>

  );
}

