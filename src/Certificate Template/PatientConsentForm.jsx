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



const PatientConsentForm = () => {
    const { id } = useParams()
    const [hospitalData, setHospitalData] = useState(null);
    const [nh12, setNh12] = useState()
    const [patientData, setPatientData] = useState()
    const [consentData, setConsentData] = useState()
    const [isDownloaded, setIsDownloaded] = useState(false);

    const invoiceRef = useRef();

    const handleDownload = () => {
        try {
            const element = invoiceRef.current;
            document.body.classList.add("hide-buttons");
            const opt = {
                margin: 0,
                filename: `Consent-letter-${patientData?.nh12}.pdf`,
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

    async function fetchConsentData() {
        if (!id) {
            return
        }
        try {
            const res = await getApiData(`api/comman/consent-letter/${id}`);
            if (res.success) {
                setHospitalData(res.hospitalData);
                setNh12(res.customId)
                setConsentData(res.consent)
                setPatientData(res.ptData)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    }

    // ✅ Fetch data when insert comes
    useEffect(() => {
        if (id) {
            fetchConsentData(); // FIXED
        }
    }, [id]);

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
    <div className="ds-watermark-wrap">
    </div>

    {/* HEADER */}
    <div className="ds-header d-flex justify-content-between align-items-start">
      <div className="d-flex align-items-start gap-3">
        <div className="ds-logo">
          <img src={hospitalData?.logo ?
            `${base_url}/api/file/${hospitalData?.logo}` : "/logo.png"} alt="" />
        </div>
        <div>
          <div className="ds-header-title">Patient Consent Form</div>
          <div className="ds-header-sub">{hospitalData?.name}</div>
          <div className="ds-header-meta">
            {hospitalData?.nh12} <br />
            {hospitalData?.address}
          </div>
        </div>
      </div>
      <div className="ds-header-right">
        <div className="ds-badge">NeoHealthCard Network</div>
        <p className="ds-header-system lh-base">
          Fully Automated · Ecosystem Connected
        </p>
        <p className="ds-header-meta my-0 lh-sm">{hospitalData?.email} · {hospitalData?.contactNumber}</p>
      </div>
    </div>

    {/* META STRIP */}
    <div className="ds-meta-strip">
      <div className="ds-meta-block">
        <div className="ds-meta-label">DATE & TIME</div>
        <div className="ds-meta-value fz-12">{new Date(consentData?.createdAt)?.toLocaleString('en-GB')}</div>
      </div>
      <div className="ds-meta-block">
        <div className="ds-meta-label">ADMISSION REF</div>
        <div className="ds-meta-value fz-12">{consentData?.allotmentId?.customId}</div>
      </div>
      <div className="ds-meta-block">
        <div className="ds-meta-label">DOCTOR</div>
        <div className="ds-meta-value fz-12">{consentData?.allotmentId?.primaryDoctorId?.name}</div>
      </div>
      <div className="ds-meta-block">
        <div className="ds-meta-label">STATUS</div>
        <div className="ds-meta-value fz-12 text-teal">Signed</div>
      </div>
    </div>

    {/* PATIENT */}
    <div className="ds-patient-section">
      <div className="flex-fill">
        <div className="ds-patient-title">Patient</div>
        <div className="ds-patient-name">{patientData?.name}</div>
        <div className="ds-patient-grid">
          <div>
            <h6 className="ds-detail-key mb-0">Age / Sex</h6>
            <span className="ds-detail-summary">{calculateAge(patientData?.dob, consentData?.createdAt)} / {patientData?.gender}</span>
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
            <span className="ds-detail-summary">{new Date(patientData?.dob)?.toLocaleDateString('en-GB')}</span>
          </div>
          <div>
            <h6 className="ds-detail-key mb-0">Address</h6>
            <span className="ds-detail-summary">{patientData?.address},{patientData?.cityId?.name}</span>
          </div>
          <div>
            <h6 className="ds-detail-key mb-0">Guardian Name</h6>
            <span className="ds-detail-summary">{patientData?.contact?.emergencyContactName}</span>
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
            <h6 className="ds-detail-key mb-0">Guardian Contact</h6>
            <span className="ds-detail-summary">{patientData?.contact?.emergencyContactNumber}</span>
          </div>
        </div>
      </div>

      {/* QR */}
      <div className="ds-qr-col">
        <div className="ds-qr-box">
          <QRCodeCanvas
            value={`https://www.neohealthcard.com/patient-consent-letter/${id}`}
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

    {/* CONSENT */}
    <div className="ds-medicines-section">
      <div className="pt-ds-notes-box">
      <h4 className="">Informed Consent to Treatment</h4>
        <h5>
          {hospitalData?.name} · {hospitalData?.nh12}
        </h5>
        <p >
          I / We, the undersigned, hereby consent to the following
        </p>
        <ol className="mb-0">
          <li>1. Admission and treatment of {patientData?.name}</li>
          <li>2. Clinical investigations as deemed necessary</li>
          <li>3. Medications, IV fluids, and blood tests</li>
          <li>4. Minor procedures including IV insertion</li>
          <li>5. Photography for medical purposes</li>
        </ol>

        <ol className="mb-0">
          <li>I understand that:</li>
          <li>
- No guarantee of specific outcome can be given. <br />
- I may withdraw consent at any time (DAMA / LAMA procedure applies). <br />
- My medical information may be shared with treating doctors and insurers. <br />
- NeoHealthCard ecosystem will digitally store records with patient access.</li>
        </ol>
      </div>
    </div>


    <div className="ds-notes-section">
      <div className="">
        <p className="fw-700 mb-0" style={{color : "#888888",  fontSize : "10px"}}>PROCEDURES CONSENTED (CHECK APPLICABLE)</p>
        <div className="pt-ds-patient-grid">
          <div><span className="ds-detail-summary">[✔] IV Fluid Therapy</span></div>
          <div><span className="ds-detail-summary">[✔] Blood Transfusion</span></div>
          <div><span className="ds-detail-summary">[✔] Surgery</span></div>
          <div><span className="ds-detail-summary">[✔] Anesthesia</span></div>
          <div><span className="ds-detail-summary">[✔] CBC / Lab Tests</span></div>
          <div><span className="ds-detail-summary">[✔] X-Ray / Imaging</span></div>
          <div><span className="ds-detail-summary">[✔] ICU Admission</span></div>
          <div><span className="ds-detail-summary">[✔] Transfer to Another Hospital</span></div>
        </div>
      </div>
    </div>

    {/* SIGNATURES */}
    <div className="ds-sig-grid">
      <div className="ds-sig-cell">
        <div className="ds-sig-name">{consentData?.allotmentId?.primaryDoctorId?.name}</div>
        <div className="ds-sig-sub">Treating Physician - Apollo</div>
      </div>
      <div className="ds-sig-cell-border">
        <div className="ds-sig-name">{patientData?.name} / {patientData?.contact?.emergencyContactName}</div>
        <div className="ds-sig-sub">Patient / Guardian</div>
      </div>
      <div className="ds-sig-cell-border">
        <div className="ds-sig-name">Witness</div>
        <div className="ds-sig-sub">Hospital Staff – Front Desk</div>
      </div>
    </div>

    {/* FOOTER */}
    <div className="ds-footer">
      <span>{hospitalData?.name}, {hospitalData?.address} · {hospitalData?.email} · {hospitalData?.contactNumber}</span>
      <span className="ds-tagline">Wishing you a speedy recovery</span>
    </div>

  </div>
</div>
            
        </>
    );
};

export default PatientConsentForm;
