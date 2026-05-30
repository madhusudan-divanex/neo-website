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



const PharmacyInvoice = ({ pdfLoading, endLoading } = {}) => {
    const { id } = useParams()
    const [ptData, setPtData] = useState()
    const [orgData, setOrgData] = useState()
    const [sellData, setSellData] = useState()
    const [vital, setVitals] = useState()
    async function fetchSellData() {
        if (!id) {
            return
        }
        try {
            const res = await getApiData(`api/comman/pharmacy-invoice/${id}`)

            if (res.success) {
                setSellData(res.sellData)
                setOrgData(res?.orgData)
                setPtData(res.patientData)
            } else {
                toast.error(res.message)
            }
        } catch (error) {

        }
    }
    useEffect(() => {
        fetchSellData()
    }, [id])
    const invoiceRef = useRef()
    const handleDownload = () => {
        try {

            const element = invoiceRef.current;
            document.body.classList.add("hide-buttons");
            const opt = {
                margin: 0,
                filename: `Pharmacy-invoice-${sellData?.customId || sellData?._id?.slice(-6)}.pdf`,
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
        <>
            <div className="container mt-2 d-flex justify-content-between align-items-center">
                <img src="/logo.png" alt="" srcset="" width={100} height={60} />
                <div>

                    <button className="thm-btn" onClick={handleDownload}>Download</button>
                </div>
            </div>

            {/* <div className="invoice-wrapper d-flex justify-content-center py-5 bg-light" ref={invoiceRef}>
                <div className="invoice-card bg-white shadow" style={{ width: '880px' }}>

                    <div className="d-flex justify-content-between p-4 border-bottom">
                        <div className="d-flex gap-3">
                            <div style={{ width: '34px', height: '34px' }}>
                                <img src={orgData?.logo ?
                                    `${base_url}/${orgData?.logo}` : "/logo.png"} alt="" />
                            </div>
                            <div>
                                <h5 className="fw-semibold mb-1">Pharmacy Invoice</h5>
                                <div className="text-muted small">{orgData?.name}</div>
                                <div className="text-muted small">
                                    {orgData?.address}
                                </div>
                            </div>
                        </div>

                        <div className="text-end">
                            <span className="badge bg-teal text-white px-3 py-2">
                                NeoHealthCard Network
                            </span>
                            <div className="small text-muted mt-2">
                                {orgData?.email}
                            </div>
                            <div className="small text-muted">{orgData?.contactNumber}</div>
                        </div>
                    </div>

             
                    <div className="row g-3 px-4 py-3 border-bottom small text-muted">
                        <Meta title="Invoice ID" value={sellData?.customId || "123589"} />
                        {sellData?.prescriptionId && <Meta title="Prescription Ref" value={sellData?.prescriptionId?.customId} />}
                        <Meta title="Invoice Date" value={new Date(sellData?.createdAt)?.toLocaleDateString('en-GB')} />
                        <Meta title="Pharmacist" value={orgData?.contactPerson} />
                        <Meta title="Status" value={<span className="text-success">{sellData?.paymentStatus} · {sellData?.paymentMethod}</span>} />
                    </div>

                
                    <div className="px-4 py-3 border-bottom">
                        <h6 className="fw-semibold mb-2">{sellData?.patientId?.name}</h6>
                        <div className="row small text-muted">
                            <div className="col">Age: {calculateAge(ptData?.dob, sellData?.createdAt) || '-'}</div>
                            <div className="col">Sex: {ptData?.gender || '-'}</div>
                            <div className="col">Blood:{ptData?.bloodGroup || '-'}</div>
                            <div className="col">Contact: {ptData?.contactNumber}</div>
                        </div>
                    </div>

                
                    <div className="p-4">
                        <table className="table table-borderless invoice-table">
                            <thead className="text-muted small border-bottom">
                                <tr>
                                    <th>Item</th>
                                    <th className="text-center">Batch</th>
                                    <th className="text-center">Qty</th>
                                    <th className="text-center">Price</th>
                                    <th className="text-center">Discount</th>
                                    <th className="text-end">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sellData?.products?.map((item, key) =>
                                    <Row key={key} item={item?.inventoryId?.medicineName} batch={item?.inventoryId?.batchNumber} qty={`${item?.quantity}`} price={`₹${item?.rate}`}
                                        discount={`${item?.discountType == "Fixed" ? '₹' : item?.discountType == "Percenrage" ? '(%)' : ''} ${item?.discountValue || ''}`} total={`₹${item?.totalAmount}`} />)}

                            </tbody>
                        </table>
                    </div>


                    <div className="d-flex justify-content-end px-4 pb-4 border-top">
                        <div className="totals-box">
                         
                            <div className="d-flex gap-2 justify-content-between fw-bold fs-7 border-top pt-2 mt-2">
                                <span>Grand Total </span>
                                <span> ₹{sellData?.products?.reduce(
                                    (sum, s) => sum + Number(s.totalAmount || 0),
                                    0
                                )}</span>
                            </div>
                        </div>
                    </div>

            
                    <div className="row border-top small text-muted">
                        <div className="col p-3">
                            <div className="text-secondary">Payment Mode</div>
                            {sellData?.paymentMethod}
                        </div>
                        <div className="col p-3 border-start">
                            <div className="text-secondary">Transaction ID</div>
                            {sellData?.customId || sellData?._id?.slice(-6)}
                        </div>
                        <div className="col p-3 border-start">
                            <div className="text-secondary">Status</div>
                            <span className="text-success">{sellData?.paymentStatus}</span>
                        </div>
                    </div>

                    <div className="footer-bar text-center text-white py-2">
                        Wishing you a speedy recovery
                    </div>

                </div>
            </div> */}

              <div className="ds-page" ref={invoiceRef}>
  <div className="ds-card">
    <div className="ds-watermark-wrap">
    </div>

    <div className="ds-header d-flex justify-content-between align-items-start">
      <div className="d-flex align-items-start gap-3">
        <div className="ds-logo">
          <img src={orgData?.logo ?
            `${base_url}/${orgData?.logo}` : "/logo.png"} alt="" />
        </div>
        <div>
          <div className="ds-header-title">Pharmacy Invoice</div>
          <div className="ds-header-sub">{orgData?.name}</div>
          <div className="ds-header-meta">
            {orgData?.address}
          </div>
        </div>
      </div>
      <div className="ds-header-right">
        <div className="ds-badge">NeoHealthCard Network</div>
        <p className="ds-header-system lh-base">
          Fully Automated · Ecosystem Connected
        </p>
        <p className="ds-header-meta my-0 lh-sm">{orgData?.email} · {orgData?.contactNumber}</p>
      </div>
    </div>


    <div className="ds-meta-strip">
      <div className="ds-meta-block">
        <div className="ds-meta-label">Invoice ID</div>
        <div className="ds-meta-value fz-12">{sellData?.customId || "123589"}</div>
      </div>
      {sellData?.prescriptionId && (
        <div className="ds-meta-block">
          <div className="ds-meta-label">Prescription Ref</div>
          <div className="ds-meta-value fz-12">{sellData?.prescriptionId?.customId}</div>
        </div>
      )}
      <div className="ds-meta-block">
        <div className="ds-meta-label">Invoice Date</div>
        <div className="ds-meta-value fz-12">{new Date(sellData?.createdAt)?.toLocaleDateString('en-GB')}</div>
      </div>
      <div className="ds-meta-block">
        <div className="ds-meta-label">Pharmacist</div>
        <div className="ds-meta-value fz-12">{orgData?.contactPerson}</div>
      </div>
      <div className="ds-meta-block">
        <div className="ds-meta-label">Status</div>
        <div className="ds-meta-value fz-12 text-success">{sellData?.paymentStatus} · {sellData?.paymentMethod}</div>
      </div>
    </div>


    <div className="ds-patient-section">
      <div className="flex-fill">
        <div className="ds-patient-title">Patient</div>
        <div className="ds-patient-name">{sellData?.patientId?.name}</div>
        <div className="ds-patient-grid">

          <div>
            <h6 className="ds-detail-key mb-0">Age</h6>
            <span className="ds-detail-summary">{calculateAge(ptData?.dob, sellData?.createdAt) || '-'}</span>
          </div>

          <div>
            <h6 className="ds-detail-key mb-0">Email Address</h6>
            <span className="ds-detail-summary">{sellData?.patientId?.email}</span>
          </div>

          <div>
            <h6 className="ds-detail-key mb-0">Patient ID</h6>
            <span className="ds-detail-summary">{sellData?.patientId?.nh12}</span>
          </div>

          <div>
            <h6 className="ds-detail-key mb-0">Sex</h6>
            <span className="ds-detail-summary">{ptData?.gender || '-'}</span>
          </div>

          <div>
            <h6 className="ds-detail-key mb-0">Address</h6>
            <span className="ds-detail-summary">{ptData?.address}</span>
          </div>

          <div>
            <h6 className="ds-detail-key mb-0">Dr Name</h6>
            <span className="ds-detail-summary">{ptData?.name}</span>
          </div>

          <div>
            <h6 className="ds-detail-key mb-0">Blood</h6>
            <span className="ds-detail-summary">{ptData?.bloodGroup || '-'}</span>
          </div>
          <div>
            <h6 className="ds-detail-key mb-0">Contact</h6>
            <span className="ds-detail-summary">{ptData?.contactNumber}</span>
          </div>
           <div>
            <h6 className="ds-detail-key mb-0">Dr ID</h6>
            <span className="ds-detail-summary">{ptData?.pt}</span>
          </div>
        </div>
      </div>

       {/* QR */}
            <div className="ds-qr-col">
              <div className="ds-qr-box">
                <QRCodeCanvas
                  value={`https://www.neohealthcard.com/pharmacy-return/${sellData?.customId}`}
                  size={256}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
              </div>
              <p className="ds-qr-label">Scan to verify</p>
              <p className="mb-0">
                <a href="javascript:void(0)" className="ds-qr-link">verify.neohealthcard.in</a>
              </p>
            </div>

    </div>

    {/* TABLE */}
    <div className="ds-medicines-section">
      <div className="ds-table-title">Items</div>
      <table className="ds-table">
        <thead className="ds-thead">
          <tr>
            <th className="ds-th-left">Item</th>
            <th className="ds-th-left">Batch</th>
            <th className="ds-th-left">Qty</th>
            <th className="ds-th-left">Price</th>
            <th className="ds-th-left">Discount</th>
            <th className="ds-th-left">Total</th>
          </tr>
        </thead>

       <tbody>
  {sellData?.products?.map((item, key) => (
    <tr key={key} className="ds-tr-border">
      <td className="ds-td-left">{item?.inventoryId?.medicineName}</td>

      <td className="ds-td-left">{item?.inventoryId?.batchNumber}</td>

      <td className="ds-td-left">{item?.quantity}</td>

      <td className="ds-td-left">₹{item?.rate}</td>

      <td className="ds-td-left">
        {item?.discountType == "Fixed"
          ? "₹"
          : item?.discountType == "Percenrage"
          ? "(%)"
          : ""}{" "}
        {item?.discountValue || ""}
      </td>

      <td className="ds-td-left">₹{item?.totalAmount}</td>
    </tr>
  ))}
</tbody>
      </table>

      <div className="ds-summary-wrap">
        <div className="ds-summary-box">
          <div className="ds-summary-total">
            <span>Grand Total</span>
            <span>₹{sellData?.products?.reduce(
              (sum, s) => sum + Number(s.totalAmount || 0),
              0
            )}</span>
          </div>
        </div>
      </div>



    </div>

    {/* FOOTER ROWS */}


    <div className="ds-sig-grid">
      <div className="ds-sig-cell">
        <div className="ds-sig-name">Payment Mode</div>
        <div className="ds-sig-sub ">
          {sellData?.paymentMethod}
        </div>
      </div>

      <div className="ds-sig-cell-border">
        <div className="ds-sig-name">Transaction ID</div>
        <div className="ds-sig-sub ">
          {sellData?.customId || sellData?._id?.slice(-6)}
        </div>
      </div>

      <div className="ds-sig-cell-border">
        <div className="ds-sig-name">Status</div>
        <div className="ds-sig-sub ">
         {sellData?.paymentStatus}
        </div>
      </div>
    </div>



    {/* FOOTER */}
    <div className="ds-footer">
      <span>{orgData?.name}, {orgData?.address} · {orgData?.email} · {orgData?.contactNumber}</span>
      <span className="ds-tagline">Wishing you a speedy recovery</span>
    </div>

  </div>
            </div>

        </>
    );
};

const Meta = ({ title, value }) => (
    <div className="col">
        <div className="text-secondary">{title}</div>
        <div className="fw-medium text-dark">{value}</div>
    </div>
);

const Row = ({ item, batch, manufacturer, qty, price, gst, discount, total }) => (
    <tr className="border-bottom">
        <td>{item}</td>
        <td className="text-center">{batch}</td>
        <td className="text-center">x{qty}</td>
        <td className="text-center">{price}</td>
        <td className="text-center">{discount}</td>
        <td className="text-end">{total}</td>
    </tr>
);

const TotalRow = ({ label, value, className }) => (
    <div className={`d-flex justify-content-between ${className}`}>
        <span>{label}</span>
        <span>{value}</span>
    </div>
);

export default PharmacyInvoice;