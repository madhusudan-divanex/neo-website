import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faDownload, faEye, faFilePdf, faPrint } from "@fortawesome/free-solid-svg-icons";
import { TbGridDots } from "react-icons/tb";
import { HiChevronDoubleLeft, HiChevronDoubleRight, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import base_url from "../baseUrl";

function HospitalProfile({ data }) {
    const [activeTab, setActiveTab] = useState("info");

    const imgUrl = (path) =>
        path ? `${base_url}/api/file/${path}` : null;
    return (
        <>
            <div className="container main-content flex-grow-1 p-3 overflow-auto">


                <div className="new-mega-card">
                    <div className="row">
                        <div className="col-lg-12">
                            {/* ── TABS ── */}
                            <div className="employee-tabs">
                                <ul className="nav nav-tabs gap-3 bg-white" id="hosTab" role="tablist">
                                    {[["info", "Hospital Info"], ["contact", "Contact Person"], ["test", "Lab Tests"]].map(([key, label]) => (
                                        <li className="nav-item" key={key}>
                                            <button className={`nav-link ${activeTab === key ? "active" : ""}`}
                                                onClick={() => { setActiveTab(key); if (key === "card") setTimeout(initCard, 100); }}>
                                                {label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-4">

                                {/* ══ TAB 1: HOSPITAL INFO ══ */}
                                {activeTab === "info" && (
                                    <div>
                                        {/* Basic Info */}
                                        <div className="doctor-information-card mb-4">
                                            <div className="doctor-main-profile-card">
                                                <div className="lab-personal-pic">
                                                    <img src={data?.logo || "/profile.png"} alt=""
                                                        onError={e => { e.target.src = "/profile-tab-avatar.png" }}
                                                        width={150} height={150} />
                                                </div>
                                                <div className="doctor-content-details">
                                                    <div className="doctor-info-heading">
                                                        <h4>{data?.name || "—"}</h4>
                                                        <p>{`${data?.nh12}` || "—"}</p>
                                                    </div>
                                                    <div className="doctor-info-list">
                                                        {[
                                                            ["Mobile Number", data?.contactNumber],
                                                            ["Email", data?.email],
                                                            ["GST Number", data?.hospitalId?.gstNumber],
                                                            ["License ID", data?.hospitalId?.licenseId],
                                                        ].map(([l, v]) => v ? (
                                                            <div className="doctor-info-item" key={l}>
                                                                <h6>{l}</h6><p>{v}</p>
                                                            </div>
                                                        ) : null)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* About */}
                                        {data?.hospitalId?.about && (
                                            <fieldset className="address-fieldset mb-4">
                                                <legend className="float-none w-auto px-3 legend-title">About</legend>
                                                <p>{data?.hospitalId.about}</p>
                                            </fieldset>
                                        )}

                                        {/* Images */}
                                        {data?.images?.length > 0 && (
                                            <fieldset className="address-fieldset mb-4">
                                                <legend className="float-none w-auto px-3 legend-title">Hospital Images</legend>
                                                <div className="row">
                                                    {data?.images.map((img, i) => (
                                                        <div className="col-lg-4 col-md-6 mb-3" key={i}>
                                                            <div className="lab-thumb-bx">
                                                                <h5>{img.type === "thumbnail" ? "Thumbnail" : img.caption || `Image ${i + 1}`}</h5>
                                                                <img src={imgUrl(img.fileId) || "/pharmacy-pic-one.png"}
                                                                    alt="" style={{ width: "100%", borderRadius: 8, maxHeight: 200, objectFit: "cover" }}
                                                                    onError={e => { e.target.src = "/pharmacy-pic-one.png" }} />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </fieldset>
                                        )}

                                        {/* Address */}
                                        {data?.hospitalAddress && (
                                            <fieldset className="address-fieldset mb-4">
                                                <legend className="float-none w-auto px-3 legend-title">Address</legend>
                                                <div className="doctor-content-details mb-3">
                                                    <div className="doctor-info-list">
                                                        <div className="doctor-info-item"><h6>Full Address</h6><p>{data?.hospitalAddress?.fullAddress || "—"}</p></div>
                                                    </div>
                                                </div>
                                                <div className="doctor-content-details">
                                                    <div className="doctor-info-list">
                                                        {[
                                                            ["Country", data?.hospitalAddress?.country?.name],
                                                            ["State", data?.hospitalAddress?.state?.name],
                                                            ["City", data?.hospitalAddress?.city?.name],
                                                            ["Pincode", data?.hospitalAddress?.pinCode],
                                                        ].map(([l, v]) => (
                                                            <div className="doctor-info-item" key={l}><h6>{l}</h6><p>{v || "—"}</p></div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </fieldset>
                                        )}

                                        {/* Certificates */}
                                        {data?.licenses?.length > 0 && (
                                            <fieldset className="address-fieldset mb-4">
                                                <legend className="float-none w-auto px-3 legend-title">License & Certificates</legend>
                                                <div className="row">
                                                    {data?.licenses.map((cert, i) => (
                                                        <div className="col-lg-3 mb-3" key={i}>
                                                            <div className="lab-thumb-bx">
                                                                <h5>{cert.certificateType || "Certificate"}</h5>
                                                                <div className="lab-license-bx">
                                                                    <h6>License Number</h6>
                                                                    <p>{cert.licenseNumber || "—"}</p>
                                                                    {cert.fileUrl && (
                                                                        <div className="lab-certificate-dwn">
                                                                            <h6><FontAwesomeIcon icon={faFilePdf} style={{ color: "#EF5350" }} /> {cert.fileName || "Document.pdf"}</h6>
                                                                            <a href={cert.fileUrl} target="_blank" rel="noreferrer">
                                                                                <button className="notifi-remv-btn"><FontAwesomeIcon icon={faDownload} /></button>
                                                                            </a>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </fieldset>
                                        )}
                                    </div>
                                )}

                                {/* ══ TAB 2: CONTACT PERSON ══ */}
                                {activeTab === "contact" && (
                                    <div>
                                        {data?.contactPerson ? (
                                            <div className="doctor-information-card mb-4">
                                                <div className="doctor-main-profile-card">
                                                    <div className="doctor-profile-pic">
                                                        <img src={data?.contactPerson?.profilePhotoId ? `${base_url}/api/file/${data?.contactPerson?.profilePhotoId}`
                                                            : "/profile.png"} alt=""
                                                            onError={e => { e.target.src = "/profile.png" }}
                                                            width={150} height={150} />
                                                    </div>
                                                    <div className="doctor-content-details justify-content-evenly">
                                                        <div className="doctor-info-heading">
                                                            <h4>{data?.contactPerson?.name || "—"}</h4>
                                                        </div>
                                                        <div className="doctor-info-list">
                                                            {[
                                                                ["Mobile Number", data?.contactPerson?.mobileNumber],
                                                                ["Email", data?.contactPerson?.email],
                                                                ["Gender", data?.contactPerson?.gender],
                                                            ].map(([l, v]) => (
                                                                <div className="doctor-info-item" key={l}><h6>{l}</h6><p>{v || "—"}</p></div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-muted p-3">No contact person found.</p>
                                        )}
                                    </div>
                                )}

                                {activeTab === "test" && <div className="row">
                                    {data?.tests?.map((test, i) => <div className="col-lg-12 ps-0">
                                        <div className="ovrview-bx  d-flex justify-content-between">
                                            <h4 className="new_title">{test?.category?.name || "Other"}</h4>
                                            <h4 className="new_title">₹ {test?.totalAmount} (Full Package)</h4>
                                        </div>

                                        <div className="row ms-3">
                                            {test?.subCatData?.map(s => <div className="col-3 d-flex justify-content-between">
                                                <p className="">{s?.subCat?.subCategory}</p>
                                                <p>₹{s?.price}</p>
                                            </div>)}

                                        </div>
                                    </div>)}
                                </div>}


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HospitalProfile;
