import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faDownload, faEye, faFilePdf, faPrint } from "@fortawesome/free-solid-svg-icons";
import { TbGridDots } from "react-icons/tb";
import { HiChevronDoubleLeft, HiChevronDoubleRight, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import base_url from "../baseUrl";

function PharProfile({ data }) {

    return (
        <>
            <div className="container main-content flex-grow-1 p-3 overflow-auto">
                <div className='new-mega-card'>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="employee-tabs">
                                <ul className="nav nav-tabs gap-3 bg-white" id="myTab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <a
                                            className="nav-link active"
                                            id="home-tab"
                                            data-bs-toggle="tab"
                                            href="#home"
                                            role="tab"
                                        >
                                            Pharmacy Profile
                                        </a>
                                    </li>

                                    <li className="nav-item" role="presentation">
                                        <a
                                            className="nav-link"
                                            id="profile-tab"
                                            data-bs-toggle="tab"
                                            href="#profile"
                                            role="tab"
                                        >
                                            Contact Person
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div className="mt-4">
                                <div className="tab-content" id="myTabContent">
                                    <div
                                        className="tab-pane fade show active"
                                        id="home"
                                        role="tabpanel"
                                    >

                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="doctor-information-card mb-4">
                                                    <div className="doctor-main-profile-card">
                                                        <div className="lab-personal-pic">
                                                            <img src={data?.logo || "/profile.jpg"} alt=""
                                                                width={150} height={150} />
                                                        </div>
                                                        <div className="doctor-content-details">
                                                            <div className="doctor-info-heading">
                                                                <h4>{data?.name}</h4>
                                                                <p>{data?.nh12}</p>
                                                            </div>

                                                            <div className="doctor-info-list">
                                                                <div className="doctor-info-item">
                                                                    <h6>Mobile Number</h6>
                                                                    <p>{data?.contactNumber}</p>
                                                                </div>

                                                                <div className="doctor-info-item">
                                                                    <h6>Email</h6>
                                                                    <p>{data?.email}</p>
                                                                </div>

                                                                <div className="doctor-info-item">
                                                                    <h6>Gst Number</h6>
                                                                    <p>{data?.pharId?.gstNumber}</p>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>

                                                <fieldset className="address-fieldset mb-4">
                                                    <legend className="float-none w-auto px-3 legend-title">
                                                        About
                                                    </legend>

                                                    <p>{data?.pharId?.about}</p>


                                                </fieldset>

                                                <fieldset className="address-fieldset mb-4">
                                                    <legend className="float-none w-auto px-3 legend-title">
                                                        PharmacyImages
                                                    </legend>

                                                    <div className="row">
                                                        <div className="col-lg-4 mb-3">
                                                            <div className="lab-thumb-bx">
                                                                <h5>Thumbnail image</h5>
                                                                <img src={data?.images?.thumbnail ? `${base_url}/${data?.images.thumbnail}` : ''} alt="thumbnail" />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 mb-3">
                                                            <div className="lab-thumb-bx">
                                                                <h5>Pharmacy images</h5>
                                                                {data?.images?.labImg?.map((img, i) => (
                                                                    <img
                                                                        key={i}
                                                                        src={`${base_url}/${img}`}
                                                                        alt="lab"
                                                                        className="me-2 mb-2"
                                                                        style={{ width: 120 }}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>

                                                    </div>
                                                </fieldset>


                                                <fieldset className="address-fieldset mb-4">
                                                    <legend className="float-none w-auto px-3 legend-title">
                                                        Address
                                                    </legend>
                                                    <div className="doctor-content-details mb-3">
                                                        <div className="doctor-info-list ">
                                                            <div className="doctor-info-item">
                                                                <h6>Full Address</h6>
                                                                <p>{data?.labAddress?.fullAddress}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="doctor-content-details">
                                                        <div className="doctor-info-list">
                                                            <div className="doctor-info-item">
                                                                <h6>Country</h6>
                                                                <p>{data?.labAddress?.countryId?.name}</p>
                                                            </div>

                                                            <div className="doctor-info-item">
                                                                <h6>State</h6>
                                                                <p>{data?.labAddress?.stateId?.name}</p>
                                                            </div>

                                                            <div className="doctor-info-item">
                                                                <h6>City </h6>
                                                                <p>{data?.labAddress?.cityId?.name}</p>
                                                            </div>

                                                            <div className="doctor-info-item">
                                                                <h6>Pincode </h6>
                                                                <p>{data?.labAddress?.pinCode}</p>
                                                            </div>
                                                        </div>

                                                    </div>


                                                </fieldset>

                                                <fieldset className="address-fieldset mb-4">
                                                    <legend className="float-none w-auto px-3 legend-title">
                                                        License And Certificate
                                                    </legend>

                                                    <div className="row">
                                                        <div className="col-lg-3 mb-3">
                                                            <div className="lab-thumb-bx">
                                                                <h5>License </h5>

                                                                <div className="lab-license-bx ">
                                                                    <h6>PharmacyLicense Number</h6>
                                                                    <p>{data?.labLicense?.labLicenseNumber}</p>

                                                                    <div className="lab-certificate-dwn">
                                                                        <div>
                                                                            <h6 ><FontAwesomeIcon icon={faFilePdf} style={{ color: "#EF5350" }} /> Pharmacy License</h6>
                                                                        </div>
                                                                        <div className="">
                                                                            <button type="" className="notifi-remv-btn"><FontAwesomeIcon icon={faDownload} /></button>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-3 mb-3">
                                                            <div className="lab-thumb-bx">
                                                                <h5>Certificate</h5>

                                                                {data?.labLicense?.labCert?.map((cert) => (
                                                                    <div key={cert._id} className="lab-license-bx">
                                                                        <h6>Certified Name</h6>
                                                                        <p>{cert.certName}</p>

                                                                        <div className="lab-certificate-dwn">
                                                                            <h6>
                                                                                <FontAwesomeIcon icon={faFilePdf} style={{ color: "#EF5350" }} />{" "}
                                                                                Certificate
                                                                            </h6>

                                                                            <a
                                                                                href={`${base_url}/${cert.certFile}`}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                            >
                                                                                <button className="notifi-remv-btn">
                                                                                    <FontAwesomeIcon icon={faDownload} />
                                                                                </button>
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>


                                                        </div>
                                                    </div>


                                                </fieldset>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="tab-pane fade" id="profile" role="tabpanel">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="doctor-information-card mb-4">
                                                    <div className="doctor-main-profile-card">
                                                        <div className="doctor-profile-pic">
                                                            <img
                                                                src={
                                                                    data?.contactPerson?.photo
                                                                        ? base_url + '/' + data?.contactPerson.photo
                                                                        : "/doctor-info-pic.png"
                                                                }
                                                                onError={(e) => {
                                                                    e.target.src = "/doctor-info-pic.png"
                                                                }}
                                                                width={80}
                                                                alt="person"
                                                            />
                                                        </div>
                                                        <div className="doctor-content-details justify-content-evenly">
                                                            <div className="doctor-info-heading">
                                                                <h4>{data?.contactPerson?.name}</h4>
                                                            </div>

                                                            <div className="doctor-info-list">
                                                                <div className="doctor-info-item">
                                                                    <h6>Mobile Number</h6>
                                                                    <p>{data?.contactPerson?.contactNumber}</p>
                                                                </div>

                                                                <div className="doctor-info-item">
                                                                    <h6>Gender</h6>
                                                                    <p>{data?.contactPerson?.gender}</p>
                                                                </div>

                                                                <div className="doctor-info-item">
                                                                    <h6>Email</h6>
                                                                    <p>{data?.contactPerson?.email}</p>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>


                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </>
    )
}

export default PharProfile