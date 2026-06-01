import React, { useEffect, useRef, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { QRCodeCanvas } from "qrcode.react";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import base_url from "../baseUrl";

import "./Template css/Certificate.css"
import "./Template css/DischargeSummary.css"


export default function ViewDeathCertificate({ certificateData }) {
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
      pagebreak: { mode: ['avoid-all'] }
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

      <div className="neo-hp-fitness-page" style={{ padding: 24 }} ref={pdfRef}>
        <div className="neo-hp-fitness-card">

          {/* HEADER */}
          <div className="d-flex justify-content-between align-items-start hp-certificate-bx">
            <div className="d-flex gap-3">
              <div className="neo-hp-fitness-logo">
                <img src={certificateData?.organization?.logo ?
                  `${base_url}/${certificateData?.organization?.logo}` : "/logo.png"} alt="" />
              </div>
              <div>
                <div className="neo-hp-fitness-title">Death Certificate</div>
                <div className="neo-hp-fitness-subtitle">{certificateData?.organization?.name}</div>
                <div className="neo-hp-fitness-meta">
                  {certificateData?.organization?.nh12} · Reg. {certificateData?.license}
                </div>
                <div className="neo-hp-fitness-meta">
                  {certificateData?.address?.fullAddress + ',' + certificateData?.address?.city?.name + ',' + certificateData?.address?.state?.name + ',' + certificateData?.address?.pinCode}
                </div>
              </div>
            </div>

            <div className="text-end">
              <div className="neo-hp-fitness-badge mb-1">NeoHealthCard Network</div>
              <p className="neo-hp-fitness-meta-right-ft mb-0 lh-base">
                Fully Automated · Ecosystem Connected
              </p>
              <p className="neo-hp-fitness-meta-right mb-0 lh-base">
                {certificateData?.organization?.email} · {certificateData?.organization?.contactNumber}
              </p>
            </div>
          </div>

          {/* META */}
          <div className="ds-meta-strip" style={{ borderTop: "1px solid #e6e6e6" }}>
            {[
              ["CERTIFICATE ID", certificateData?.customId],
              ["ISSUE DATE", new Date(certificateData?.createdAt)?.toLocaleDateString('en-GB')],
              ["REGISTRATION NO.", certificateData?.license],
              ["STATUS", "Registered · Verified"]
            ].map((item, i) => (
              <div key={i} className="ds-meta-block">
                <div className="ds-meta-label">{item[0]}</div>
                <div className={`ds-meta-value fz-12 ${i === 3 ? "neo-hp-fitness-status" : ""}`}>
                  {item[1]}
                </div>
              </div>
            ))}
          </div>

          {/* CERTIFICATE BOX */}
          <div className="neo-hp-fitness-box">
            <div className="neo-hp-fitness-box-title">Certificate of Death</div>

            <div className="neo-hp-fitness-box-sub">
              {certificateData?.organization?.name} · {certificateData?.customId} · Govt. of {certificateData?.address?.state?.name}
            </div>

            <div className="neo-hp-fitness-center-text">
              This is to certify that the following person passed away at this hospital:
            </div>

            {/* DETAILS */}
            <div className="neo-dc-details-grid">

              <div className="neo-dc-details-column neo-dc-details-column-left">

                <div className="neo-dc-detail-item">
                  <span className="neo-dc-detail-label">Full Name</span>
                  <div className="neo-dc-detail-value">
                    <b>{certificateData?.fullName}</b>
                  </div>
                </div>

                <div className="neo-dc-detail-item">
                  <span className="neo-dc-detail-label">Gender</span>
                  <div className="neo-dc-detail-value">
                    {certificateData?.gender}
                  </div>
                </div>

                <div className="neo-dc-detail-item">
                  <span className="neo-dc-detail-label">Date of Death</span>
                  <div className="neo-dc-detail-value">
                    {new Date(certificateData?.dateOfDeath)?.toLocaleDateString("en-GB")}
                  </div>
                </div>

                <div className="neo-dc-detail-item">
                  <span className="neo-dc-detail-label">Place of Death</span>
                  <div className="neo-dc-detail-value">
                    {certificateData?.placeOfDeath}
                  </div>
                </div>

                <div className="neo-dc-detail-item">
                  <span className="neo-dc-detail-label">Contributing Cause</span>
                  <div className="neo-dc-detail-value">
                    {certificateData?.contributingCause || "-"}
                  </div>
                </div>

                <div className="neo-dc-detail-item">
                  <span className="neo-dc-detail-label">Certifying Doctor</span>
                  <div className="neo-dc-detail-value">
                    {certificateData?.doctorId?.name}
                  </div>
                </div>

              </div>

              <div className="neo-dc-details-column neo-dc-details-column-right">

                <div className="neo-dc-detail-item">
                  <span className="neo-dc-detail-label">Age at Death</span>
                  <div className="neo-dc-detail-value">
                    {certificateData?.ageAtDeath} Years
                  </div>
                </div>

                {certificateData?.patientId && (
                  <div className="neo-dc-detail-item">
                    <span className="neo-dc-detail-label">NHC-P ID</span>
                    <div className="neo-dc-detail-value">
                      {certificateData?.patientId?.nh12}
                    </div>
                  </div>
                )}

                <div className="neo-dc-detail-item">
                  <span className="neo-dc-detail-label">Time of Death</span>
                  <div className="neo-dc-detail-value">
                    {certificateData?.timeOfDeath}
                  </div>
                </div>

                <div className="neo-dc-detail-item">
                  <span className="neo-dc-detail-label">Cause of Death</span>
                  <div className="neo-dc-detail-value">
                    {certificateData?.causeOfDeath}
                  </div>
                </div>

                <div className="neo-dc-detail-item">
                  <span className="neo-dc-detail-label">Manner of Death</span>
                  <div className="neo-dc-detail-value">
                    {certificateData?.mannerOfDeath || "-"}
                  </div>
                </div>

                <div className="neo-dc-detail-item">
                  <span className="neo-dc-detail-label">Next of Kin</span>
                  <div className="neo-dc-detail-value">
                    {certificateData?.nextOfKin?.name} (
                    {certificateData?.nextOfKin?.relation})
                  </div>
                </div>

              </div>

            </div>

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

          <div className="ds-sig-grid" style={{ borderTop: "1px solid #e6e6e6" }}>
            <div className="ds-sig-cell">
              <div className="ds-sig-name">{certificateData?.doctorId?.name}</div>
              <div className="ds-sig-sub">{certificateData?.specialty} specialist · {certificateData?.organization?.name}</div>
              <div className="neo-hp-fitness-link-small">{certificateData?.doctorId?.nh12}</div>
            </div>

            <div className="ds-sig-cell-border">
              <div className="ds-sig-name">Registrar of Deaths</div>
              <div className="ds-sig-sub">Govt. of {certificateData?.address?.state?.name} · BMC</div>
              <div className="neo-hp-fitness-link-small">Reg. No. {certificateData?.license}</div>
            </div>

            <div className="ds-sig-cell-border">
              <div className="ds-sig-name">{certificateData?.organization?.name}</div>
              <div className="ds-sig-sub">Authorised Signatory</div>
              <div className="neo-hp-fitness-link-small">{certificateData?.organization?.nh12}</div>
            </div>
          </div>

          <div className="neo-hp-fitness-footer-bar">
            <span>
              {certificateData?.organization?.name}, {certificateData?.address?.city?.name} · {certificateData?.organization?.email} · {certificateData?.organization?.contactNumber}
            </span>
            <span style={{ float: "right" }}>Wishing you a speedy recovery</span>
          </div>

        </div>
      </div>


    </>
  );
}