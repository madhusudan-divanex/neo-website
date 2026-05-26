import React, { useEffect, useRef, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { QRCodeCanvas } from "qrcode.react";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import base_url from "../baseUrl";
import { getApiData } from "../Services/api";
import { calculateAge, stripHtml } from "../Services/globalFunction";
const styles = {
    page: {
        background: "#f3f4f6",
        padding: "24px",
        fontFamily: "Inter, Arial, sans-serif",
    },
    wrapper: {
        maxWidth: "1150px",
        margin: "0 auto",
        background: "#fff",
        border: "1px solid #e5e7eb",
    },
    header: {
        padding: "16px 20px 10px",
        borderBottom: "1px solid #e5e7eb",
    },
    logo: {
        width: 34,
        height: 34,
    },
    title: {
        fontSize: "22px",
        fontWeight: 600,
        color: "#111827",
    },
    sub: { fontSize: "12px", color: "#6b7280" },
    small: { fontSize: "11px", color: "#6b7280" },
    metaRow: {
        padding: "10px 20px",
        borderBottom: "1px solid #e5e7eb",
        fontSize: "11px",
    },
    patientBlock: {
        padding: "14px 20px",
        borderBottom: "1px solid #e5e7eb",
    },
    patientName: {
        fontSize: "18px",
        fontWeight: 600,
        marginBottom: "6px",
    },
    consentBox: {
        margin: "16px 20px",
        border: "1.5px solid #0ea5a4",
        borderRadius: "10px",
        background: "#f8fffe",
        padding: "18px",
    },
    consentTitle: {
        textAlign: "center",
        color: "#0ea5a4",
        fontWeight: 600,
        fontSize: "18px",
    },
    footerBar: {
        background: "#0ea5a4",
        color: "#fff",
        fontSize: "11px",
        padding: "6px 12px",
        display: "flex",
        justifyContent: "space-between",
    },
};

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

            <div style={styles.page} ref={invoiceRef}>
                <div style={styles.wrapper}>
                    {/* HEADER */}
                    <div className="header" style={styles.header}>
                        <div className="row">
                            <div className="col">
                                <div className="d-flex gap-2">
                                    <div style={styles.logo}>
                                        <img src={hospitalData?.logo ?
                                            `${base_url}/api/file/${hospitalData?.logo}` : "/logo.png"} alt="" />
                                    </div>
                                    <div>
                                        <div style={styles.title}>Patient Consent Form</div>
                                        <div style={styles.sub}>{hospitalData?.name}</div>
                                        <div style={styles.small}>
                                            {hospitalData?.nh12}
                                        </div>
                                        <div style={styles.small}>
                                            {hospitalData?.address}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col" style={{ textAlign: "right" }}>
                                <div
                                    style={{
                                        display: "inline-block",
                                        border: "1px solid #0ea5a4",
                                        borderRadius: "20px",
                                        padding: "4px 10px",
                                        fontSize: "11px",
                                        color: "#0ea5a4",
                                        marginBottom: "4px",
                                    }}
                                >
                                    NeoHealthCard Network
                                </div>
                                <div style={styles.small}>
                                    Fully Automated · Ecosystem Connected
                                </div>
                                <div style={styles.small}>
                                    {hospitalData?.email} · {hospitalData?.contactNumber}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* META */}
                    <div className="row" style={styles.metaRow}>
                        {/* <div className="col">CONSENT ID<br /><b>NHC-INS-PA-2026-0410-00001</b></div> */}
                        <div className="col">DATE & TIME<br /><b>{new Date(consentData?.createdAt)?.toLocaleString('en-GB')}</b></div>
                        <div className="col">ADMISSION REF<br /><b>{consentData?.allotmentId?.customId}</b></div>
                        <div className="col">DOCTOR<br /><b>{consentData?.allotmentId?.primaryDoctorId?.name}</b></div>
                        <div className="col">STATUS<br /><b style={{ color: "#0ea5a4" }}>Signed</b></div>
                    </div>

                    {/* PATIENT */}
                    <div style={styles.patientBlock}>
                        <div className="row">
                            <div className="col-md-9">
                                <div style={styles.patientName}>{patientData?.name}</div>
                                <div className="row" style={{ fontSize: "12px" }}>
                                    <div className="col">Age / Sex: {calculateAge(patientData?.dob, consentData?.createdAt)} / {patientData?.gender}</div>
                                    <div className="col">Email Address: {patientData?.email}</div>
                                    <div className="col">Patient ID: {patientData?.nh12}</div>
                                </div>
                                <div className="row" style={{ fontSize: "12px" }}>
                                    <div className="col">DOB: {new Date(patientData?.dob)?.toLocaleDateString('en-GB')}</div>
                                    <div className="col">Address: {patientData?.address},{patientData?.cityId?.name} </div>
                                    <div className="col">Guardian Name: {patientData?.contact?.emergencyContactName}</div>
                                </div>
                                <div className="row" style={{ fontSize: "12px" }}>
                                    <div className="col">Blood: {patientData?.bloodGroup}</div>
                                    <div className="col">Contact no: {patientData?.contactNumber}</div>
                                    <div className="col">Guardian Contact: {patientData?.contact?.emergencyContactNumber}</div>
                                </div>
                            </div>

                            <div className="col-md-3" style={{ textAlign: "center" }}>
                                <div
                                    style={{
                                        width: "90px",
                                        height: "90px",
                                        border: "1px solid #d1d5db",
                                        margin: "0 auto",
                                    }}
                                >
                                    <QRCodeCanvas
                                        value={`https://www.neohealthcard.com/patient-consent-letter/${id}`}
                                        size={256}
                                        // className="qr-code"
                                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                    />
                                </div>
                                <div style={{ fontSize: "10px", marginTop: "4px" }}>
                                    Scan to verify
                                </div>
                                <div style={{ fontSize: "10px", color: "#0ea5a4" }}>
                                    verify.neohealthcard.in
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CONSENT */}
                    <div style={styles.consentBox}>
                        <div style={styles.consentTitle}>Informed Consent to Treatment</div>
                        <div style={{ textAlign: "center", fontSize: "12px", marginBottom: 10 }}>
                            {hospitalData?.name} · {hospitalData?.nh12}
                        </div>

                        <div style={{ fontSize: "12px", textAlign: "center" }}>
                            I / We, the undersigned, hereby consent to the following
                        </div>

                        <ol style={{ fontSize: "12px", marginTop: 10, textAlign: 'center' }}>
                            <li>Admission and treatment of {patientData?.name}</li>
                            <li>Clinical investigations as deemed necessary</li>
                            <li>Medications, IV fluids, and blood tests</li>
                            <li>Minor procedures including IV insertion</li>
                            <li>Photography for medical purposes</li>
                        </ol>

                        <div style={{ fontSize: "12px", marginTop: 10, textAlign: 'center' }}>
                            <div style={{ textAlign: "center" }}>I understand that:</div>
                            <div>- No guarantee of specific outcome</div>
                            <div>- I may withdraw consent anytime</div>
                            <div>- Medical info may be shared</div>
                            <div>- Records stored digitally</div>
                        </div>
                    </div>

                    {/* PROCEDURES */}
                    <div style={{ padding: "0 20px", fontSize: "12px" }}>
                        <div style={{ marginBottom: 6 }}>
                            PROCEDURES CONSENTED (CHECK APPLICABLE)
                        </div>
                        <div className="row">
                            <div className="col">[✔] IV Fluid Therapy</div>
                            <div className="col">[✔] Blood Transfusion</div>
                            <div className="col">[✔] Surgery</div>
                            <div className="col">[✔] Anesthesia</div>
                        </div>
                        <div className="row">
                            <div className="col">[✔] CBC / Lab Tests</div>
                            <div className="col">[✔] X-Ray / Imaging</div>
                            <div className="col">[✔] ICU Admission</div>
                            <div className="col">[✔] Transfer to Another Hospital</div>
                        </div>
                    </div>

                    {/* SIGNATURES */}
                    <div className="row" style={{ marginTop: 60, textAlign: "center", padding: "0 20px" }}>
                        <div className="col">
                            <div>{consentData?.allotmentId?.primaryDoctorId?.name}</div>
                            <div style={styles.small}>Treating Physician - Apollo</div>
                        </div>
                        <div className="col">
                            <div>{patientData?.name} / {patientData?.contact?.emergencyContactName}</div>
                            <div style={styles.small}>Patient / Guardian</div>
                        </div>
                        <div className="col">
                            <div>Witness</div>
                            <div style={styles.small}>Hospital Staff – Front Desk</div>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div style={styles.footerBar}>
                        <span>
                            {hospitalData?.name}, {hospitalData?.address} · {hospitalData?.email} · {hospitalData?.contactNumber}
                        </span>
                        <span>Wishing you a speedy recovery</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PatientConsentForm;
