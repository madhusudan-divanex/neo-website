import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";
import { useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { getApiData } from "../Services/api";
import { calculateAge } from "../Services/globalFunction";
import "./Template css/DischargeSummary.css"



const KV = ({ k, v }) => (
  <div className="ds-kv-wrap">
    <p className="ds-kv-label ">{k}</p>
    <p className="ds-kv-value">{v}</p>
  </div>
);

export default function DoctorAptBookingReceipt({ paymentId, pdfLoading, endLoading }) {
  const { id } = useParams()
  const [ptData, setPtData] = useState()
  const [aptData, setAptData] = useState()
  async function fetchAptPayment() {
    try {
      const res = await getApiData(`api/comman/doctor-appointment-payment/${paymentId || id}`)

      if (res.success) {
        setAptData(res.data)
        setPtData(res.ptData)
      } else {
        toast.error(res.message)
      }
    } catch (error) {

    }
  }
  useEffect(() => {
    fetchAptPayment()
  }, [paymentId])
  const invoiceRef = useRef()
  const handleDownload = () => {
    try {

      const element = invoiceRef.current;
      document.body.classList.add("hide-buttons");
      const opt = {
        margin: 0,
        filename: `Invoice-${aptData?.transactionId}.pdf`,
        html2canvas: { scale: 2 },
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
  useEffect(() => {
    if (ptData && aptData && pdfLoading) {
      const timer = setTimeout(() => {
        handleDownload();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [ptData, aptData, pdfLoading]);
  return (

    // <div style={styles.page} ref={invoiceRef}>
    //   <div style={styles.sheet}>


    //     <div style={styles.header}>
    //       <div>
    //         <h1 style={styles.h1}>Booking Receipt</h1>
    //         <div style={styles.sub}>{aptData?.orgName}</div>
    //         <div style={styles.small}>
    //           {aptData?.orgNh12}
    //         </div>
    //         <div style={styles.small}>
    //           {aptData?.orgAddress}
    //         </div>
    //       </div>

    //       <div style={{ textAlign: "right" }}>
    //         <div style={styles.badge}>NeoHealthCard Network</div>
    //         <div style={styles.small}>Fully Automated · Ecosystem Connected</div>
    //         <div style={styles.small}>
    //           {aptData?.orgEmail} · {aptData?.orgContactNumber}
    //         </div>
    //       </div>
    //     </div>

    
    //     <div style={{ ...styles.section, ...styles.grid4 }}>
    //       <KV k="BOOKING ID" v={aptData?.bookingId} />
    //       <KV k="TRANSACTION ID" v={aptData?.transactionId} />
    //       <KV k="APPOINTMENT" v={new Date(aptData?.appointmentDate)?.toLocaleDateString('en-GB')} />
    //       <KV k="STATUS" v={aptData?.status?.charAt(0)?.toUpperCase() + aptData?.status?.slice(1)} />
    //     </div>

    
    //     <div style={{ ...styles.section, display: "flex" }}>
    //       <div style={{ flex: 1 }}>
    //         <div style={{ fontSize: 16, fontWeight: 600 }}>
    //           {ptData?.name}
    //         </div>

    //         <div style={{ ...styles.grid3, marginTop: 10 }}>
    //           <KV k="Age / Sex" v={`${calculateAge(ptData?.dob)} / ${ptData?.gender?.charAt(0)?.toUpperCase() + ptData?.gender?.slice(1)}`} />
    //           <KV k="Email Address" v={ptData?.email} />
    //           <KV k="Patient ID" v={ptData?.nh12} />

    //           <KV k="DOB" v={new Date(ptData?.dob)?.toLocaleDateString('en-GB')} />
    //           <KV k="Address" v={ptData?.address || '-'} />
    //           <div />

    //           <KV k="Blood" v={ptData?.bloodGroup} />
    //           <KV k="Contact no" v={ptData?.contactNumber} />
    //           <div />
    //         </div>
    //       </div>

    //       <div style={{
    //         width: 100,
    //         borderLeft: "1px solid #DCDCDC",
    //         paddingLeft: 16,
    //         display: "flex",
    //         flexDirection: "column",
    //         alignItems: "center",
    //       }}>
    //         <div style={styles.qr}>
    //           <QRCodeCanvas
    //             value={`https://www.neohealthcard.com/doctor-appointment-receipt/${paymentId}`}
    //             size={256}
    //             // className="qr-code"
    //             style={{ height: "auto", maxWidth: "100%", width: "100%" }}
    //           />
    //         </div>
    //         <div style={{ ...styles.small, marginTop: 6 }}>Scan to verify</div>
    //         <div style={{ ...styles.small, color: "#14b8a6" }}>
    //           verify.neohealthcard.in
    //         </div>
    //       </div>
    //     </div>

    
    //     <div style={{ ...styles.section, ...styles.grid2 }}>
    //       <div>
    //         <div style={styles.small}>APPOINTMENT DETAILS</div>
    //         <KV k="Doctor" v={` ${aptData?.doctorName}`} />
    //         <KV k="Specialisation" v={aptData?.specialization} />
    //         <KV k="Slot" v={new Date(aptData?.appointmentDate)?.toLocaleString('en-GB')} />
    //         {/* <KV k="Booked Via" v="NeoHealthCard App" /> */}
    //       </div>

    //       <div>
    //         <div style={styles.small}>BOOKING INFO</div>
    //         <KV k="Booked On" v={new Date(aptData?.bookedOn)?.toLocaleString('en-GB')} />
    //         {/* <KV k="Reminder" v="SMS + App · 1 hr before" /> */}
    //         <KV k="Fees Paid" v={`₹${aptData?.fees}`} />
    //       </div>
    //     </div>


    //     <div style={styles.section}>
    //       <div style={styles.totals}>
    //         <div style={{ display: "flex", justifyContent: "space-between" }}>
    //           <span style={styles.small}>Consultation Fee</span>
    //           <span>₹{aptData?.fees}</span>
    //         </div>
    //         <div style={{ display: "flex", justifyContent: "space-between" }}>
    //           <span style={styles.small}>Discount </span>
    //           <span>{aptData?.discountType == "Fixed" && "₹"}{aptData?.discountValue} {aptData?.discountType == "Percentage" && "(%)"}</span>
    //         </div>
    //         <div style={{
    //           display: "flex",
    //           justifyContent: "space-between",
    //           fontWeight: 600,
    //           fontSize: 13,
    //         }}>
    //           <span>Total Paid</span>
    //           <span>₹{aptData?.totalAmount}</span>
    //         </div>
    //       </div>
    //     </div>

    //     <div style={{
    //       display: "grid",
    //       gridTemplateColumns: "1fr 1fr 1fr",
    //       borderBottom: "1px solid #DCDCDC",
    //     }}>
    //       <div style={{ padding: "12px 24px" }}>
    //         <div style={styles.label}>Payment Mode</div>
    //         <div style={styles.value}>{aptData?.paymentMethod}</div>
    //       </div>
    //       <div style={{ padding: "12px 24px", borderLeft: "1px solid #DCDCDC" }}>
    //         <div style={styles.label}>Transaction ID</div>
    //         <div style={styles.value}>{aptData?.transactionId}</div>
    //       </div>
    //       <div style={{ padding: "12px 24px", borderLeft: "1px solid #DCDCDC" }}>
    //         <div style={styles.label}>Status</div>
    //         <div style={styles.value} className="text-uppercase">{aptData?.paymentStatus}</div>
    //       </div>
    //     </div>

        
    //     <div style={styles.section}>
    //       <div style={styles.small}>IMPORTANT NOTES</div>
    //       <ol style={{ fontSize: 10, color: "#868686", marginLeft: 16 }}>
    //         <li>Arrive 10 minutes before your scheduled appointment time.</li>
    //         <li>Carry previous medical records and prescriptions.</li>
    //         <li>Cancellation fee applies if cancelled less than 2 hours before appointment.</li>
    //         <li>Appointment timings may vary slightly due to emergencies.</li>
    //       </ol>
    //     </div>

   
    //     <div style={styles.footerBar}>
    //       <span>
    //         {aptData?.orgName}, Mumbai · {aptData?.orgEmail} · {aptData?.orgContactNumber}
    //       </span>
    //       <span>Wishing you a speedy recovery</span>
    //     </div>

    //   </div>
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
     <div className="ds-watermark-wrap">
    </div>
    {/* HEADER */}
    <div className="ds-header">
      <div>
        <h1 className="ds-header-title">Booking Receipt</h1>

        <div className="ds-header-sub">
          {aptData?.orgName}
        </div>

        <div className="ds-header-meta-top">
          {aptData?.orgNh12}
        </div>

        <div className="ds-header-meta">
          {aptData?.orgAddress}
        </div>
      </div>

      <div className="ds-header-right">
        <div className="ds-badge">
          NeoHealthCard Network
        </div>

        <div className="ds-header-system">
          Fully Automated · Ecosystem Connected
        </div>

        <div className="ds-header-meta">
          {aptData?.orgEmail} · {aptData?.orgContactNumber}
        </div>
      </div>
    </div>

    {/* META */}
    <div className="ds-meta-strip">
      <KV k="BOOKING ID" v={aptData?.bookingId} />
      <KV k="TRANSACTION ID" v={aptData?.transactionId} />
      <KV
        k="APPOINTMENT"
        v={new Date(aptData?.appointmentDate)?.toLocaleDateString("en-GB")}
      />
      <KV
        k="STATUS"
        v={
          aptData?.status?.charAt(0)?.toUpperCase() +
          aptData?.status?.slice(1)
        }
      />
    </div>

    {/* PATIENT */}
    <div className="ds-patient-section">
      <div className="ds-patient-left">
        <div className="ds-patient-name">
          {ptData?.name}
        </div>

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
            v={new Date(ptData?.dob)?.toLocaleDateString("en-GB")}
          />

          <KV
            k="Address"
            v={ptData?.address || "-"}
          />

          <div />

          <KV
            k="Blood"
            v={ptData?.bloodGroup}
          />

          <KV
            k="Contact no"
            v={ptData?.contactNumber}
          />

          <div />
        </div>
      </div>

      <div className="ds-qr-col">
        <div className="ds-qr-box">
          <QRCodeCanvas
            value={`https://www.neohealthcard.com/doctor-appointment-receipt/${paymentId}`}
            size={256}
            className="qr-codes"
            style={{
              height: "auto",
              maxWidth: "100%",
              width: "100%",
            }}
          />
        </div>

        <div className="ds-qr-label">
          Scan to verify
        </div>

        <div className="ds-qr-link">
          verify.neohealthcard.in
        </div>
      </div>

    </div>

    {/* DETAILS */}
    <div className="ds-details-grid">

      <div>
        <div className="ds-detail-section-label">
          APPOINTMENT DETAILS
        </div>

        <div className="ds-detail-rows">
          <div className="ds-detail-row">
            <span className="ds-detail-key">
              Doctor
            </span>

            <span className="ds-detail-summary">
              {aptData?.doctorName}
            </span>
          </div>

          <div className="ds-detail-row">
            <span className="ds-detail-key">
              Specialisation
            </span>

            <span className="ds-detail-summary">
              {aptData?.specialization}
            </span>
          </div>

          <div className="ds-detail-row">
            <span className="ds-detail-key">
              Slot
            </span>

            <span className="ds-detail-summary">
              {new Date(aptData?.appointmentDate)?.toLocaleString("en-GB")}
            </span>
          </div>
        </div>
      </div>

      <div>
        <div className="ds-detail-section-label">
          BOOKING INFO
        </div>

        <div className="ds-detail-rows">

          <div className="ds-detail-row">
            <span className="ds-detail-key">
              Booked On
            </span>

            <span className="ds-detail-summary">
              {new Date(aptData?.bookedOn)?.toLocaleString("en-GB")}
            </span>
          </div>

          <div className="ds-detail-row">
            <span className="ds-detail-key">
              Fees Paid
            </span>

            <span className="ds-detail-summary">
              ₹{aptData?.fees}
            </span>
          </div>

        </div>
      </div>

    </div>

    {/* TOTAL */}
    <div className="ds-summary-wrap" style={{padding : "15px 24px", borderBottom : "1px solid #e6e6e6", marginTop : "0"}}>
      <div className="ds-summary-box">

        <div className="ds-summary-row">
          <span className="ds-summary-label">
            Consultation Fee
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
            {aptData?.discountType == "Percentage" && "(%)"}
          </span>
        </div>

        <div className="ds-summary-total">
          <span>Total Paid</span>

          <span>
            ₹{aptData?.totalAmount}
          </span>
        </div>

      </div>
    </div>

    <div className="ds-sig-grid">
      <div className="ds-sig-cell">
        <div className="ds-sig-name">Payment Mode</div>
        <div className="ds-sig-sub ">
           {aptData?.paymentMethod}
        </div>
      </div>

      <div className="ds-sig-cell-border">
        <div className="ds-sig-name">Transaction ID</div>
        <div className="ds-sig-sub ">
           {aptData?.transactionId}
        </div>
      </div>

      <div className="ds-sig-cell-border">
        <div className="ds-sig-name">Status</div>
        <div className="ds-sig-sub ">
          {aptData?.paymentStatus}
        </div>
      </div>
    </div>

    



    {/* NOTES */}

     <div className="ds-notes-section">
      <div className="ds-notes-summary">
        <p className="ds-detail-section-label-header">IMPORTANT NOTES</p>
        <div className="ds-notes-box">
        <ol className="ds-header-meta" style={{paddingLeft : "10px"}}>
          <li>
            Arrive 10 minutes before your scheduled appointment time.
          </li>

          <li>
            Carry previous medical records and prescriptions.
          </li>

          <li>
            Cancellation fee applies if cancelled less than 2 hours before appointment.
          </li>

          <li>
            Appointment timings may vary slightly due to emergencies.
          </li>
        </ol>
        </div>
      </div>
    </div>



    {/* FOOTER */}
    <div className="ds-footer">
      <span>
        {aptData?.orgName}, Mumbai · {aptData?.orgEmail} ·{" "}
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