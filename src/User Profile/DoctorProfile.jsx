import { TbGridDots } from "react-icons/tb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBuilding,
    faCalendar,
    faCheck,
    faClock,
    faDownload,
    faEnvelope,
    faFilePdf,
    faFilter,
    faHome,
    faLocationDot,
    faMoneyBill,
    faPhone,
    faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import base_url from "../baseUrl";


function DoctorProfile({ data }) {

    return (
        <>
            <div className="container main-content flex-grow-1 p-3 overflow-auto">


                <div className="view-employee-bx">
                    <div className="row">
                        <div className="col-lg-3 col-md-12 col-sm-12 mb-3">
                            <div className="view-employee-bx">
                                <div>
                                    <div className="view-avatr-bio-bx text-center">
                                        <img
                                            src={
                                                data?.logo || "/profile.png"
                                            }
                                            alt=""
                                            width={150}
                                            height={150}
                                            style={{ objectFit: "cover", borderRadius: '50%' }}
                                        />
                                        <h4>{data?.name}</h4>
                                        <p>
                                            <span className="vw-id">ID:</span>{" "}
                                            {data?.nh12}
                                        </p>
                                        <h6 className="vw-activ text-capitalize">{data?.doctorId?.status || "active"}</h6>
                                    </div>

                                    <div>
                                        <ul className="vw-info-list">


                                            <li className="vw-info-item">
                                                <span className="vw-info-icon">
                                                    <FontAwesomeIcon icon={faCalendar} />
                                                </span>
                                                <div>
                                                    <p className="vw-info-title">Date of Birth</p>
                                                    <p className="vw-info-value">
                                                        {data?.doctorId?.dob
                                                            ? new Date(data?.doctorId?.dob).toDateString()
                                                            : "-"}
                                                    </p>
                                                </div>
                                            </li>

                                            <li className="vw-info-item">
                                                <span className="vw-info-icon">
                                                    <FontAwesomeIcon icon={faCalendar} />
                                                </span>
                                                <div>
                                                    <p className="vw-info-title">Gender </p>
                                                    <p className="vw-info-value">
                                                        {data?.doctorId?.gender}
                                                    </p>
                                                </div>
                                            </li>



                                            <li className="vw-info-item">
                                                <span className="vw-info-icon">
                                                    <FontAwesomeIcon icon={faEnvelope} />
                                                </span>
                                                <div>
                                                    <p className="vw-info-title">Email </p>
                                                    <p className="vw-info-value">
                                                        {data?.email}
                                                    </p>
                                                </div>
                                            </li>

                                            <li className="vw-info-item">
                                                <span className="vw-info-icon">
                                                    <FontAwesomeIcon icon={faPhone} />
                                                </span>
                                                <div>
                                                    <p className="vw-info-title">Phone </p>
                                                    <p className="vw-info-value">
                                                        {data?.contactNumber}
                                                    </p>
                                                </div>
                                            </li>

                                            {data?.doctorAbout?.emergencyContactName && <li className="vw-info-item">
                                                <span className="vw-info-icon">
                                                    <FontAwesomeIcon icon={faPhone} />
                                                </span>
                                                <div>
                                                    <p className="vw-info-title">
                                                        Emergency Contact Name{" "}
                                                    </p>
                                                    <p className="vw-info-value">
                                                        <span className="fw-700">
                                                            ({data?.doctorAbout?.emergencyContactName})
                                                        </span>{" "}
                                                        {data?.doctorAbout?.emergencyContactNumber}
                                                    </p>
                                                </div>
                                            </li>}

                                            <li className="vw-info-item">
                                                <span className="vw-info-icon">
                                                    <FontAwesomeIcon icon={faLocationDot} />
                                                </span>
                                                <div>
                                                    <p className="vw-info-title">Address</p>
                                                    <p className="vw-info-value">
                                                        {data?.address}
                                                    </p>
                                                </div>
                                            </li>

                                            {/* <li className="vw-info-item">
                        <span className="vw-info-icon">
                          <FontAwesomeIcon icon={faClock} />
                        </span>
                        <div>
                          <p className="vw-info-title">Experience</p>
                          <p className="vw-info-value">
                            {aboutDoctor.experience || "-"}
                          </p>
                        </div>
                      </li> */}

                                            <li className="vw-info-item">
                                                <span className="vw-info-icon">
                                                    <FontAwesomeIcon icon={faMoneyBill} />
                                                </span>
                                                <div>
                                                    <p className="vw-info-title"> Fees</p>
                                                    <p className="vw-info-value">
                                                        ₹ {data?.doctorAbout?.fees}
                                                    </p>
                                                </div>
                                            </li>

                                            {/* <li className="vw-info-item">
                                                <span className="vw-info-icon"><FontAwesomeIcon icon={faMoneyBill} /></span>
                                                <div>
                                                    <p className="vw-info-title">Fees</p>
                                                    <p className="vw-info-value">$25</p>
                                                </div>
                                            </li> */}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-9 col-md-12 col-sm-12">
                            <div className="view-employee-bx">
                                <div className="employee-tabs">
                                    <ul
                                        className="nav nav-tabs gap-3 ps-2"
                                        id="myTab"
                                        role="tablist"
                                    >
                                        <li className="nav-item" role="presentation">
                                            <a
                                                className="nav-link active"
                                                id="home-tab"
                                                data-bs-toggle="tab"
                                                href="#home"
                                                role="tab"
                                            >
                                                Overview
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
                                                Qualifications
                                            </a>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <a
                                                className="nav-link"
                                                id="appointement-tab"
                                                data-bs-toggle="tab"
                                                href="#appointement"
                                                role="tab"
                                            >
                                                Slots
                                            </a>
                                        </li>
                                        {data?.clinic && <li className="nav-item" role="presentation">
                                            <a
                                                className="nav-link"
                                                id="appointement-tab"
                                                data-bs-toggle="tab"
                                                href="#clinic"
                                                role="tab"
                                            >
                                                Clinic
                                            </a>
                                        </li>}
                                    </ul>
                                </div>
                                <div className="">
                                    <div className="patient-bio-tab ">
                                        <div className="tab-content" id="myTabContent">
                                            <div
                                                className="tab-pane fade show active"
                                                id="home"
                                                role="tabpanel"
                                            >
                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <div className="ovrview-bx mb-3">
                                                            <h4 className="new_title">About</h4>
                                                            <p>{data?.doctorAbout?.aboutYou || "-"}</p>
                                                        </div>

                                                        <div className="ovrview-bx mb-3">
                                                            <h4 className="new_title">Specialization </h4>
                                                            <p>
                                                                {data?.doctorAbout?.specialty?.name || "-"}
                                                            </p>
                                                        </div>
                                                        <div className="ovrview-bx mb-3">
                                                            <h4 className="new_title">Treatment Areas </h4>
                                                            <p>
                                                                {data?.doctorAbout?.treatmentAreas?.length
                                                                    ? data?.doctorAbout.treatmentAreas.map(area => area?.name).join(', ')
                                                                    : "-"}
                                                            </p>
                                                        </div>
                                                        <div className="text-end mb-3">
                                                            <a className="nw-thm-btn" href={`https://patient.neohealthcard.com/book-doctor-appointment/${data?.name}/${data?._id}`} target="_blank">Book Appointment</a>
                                                        </div>


                                                        {/* <div className="ovrview-bx mb-3">
                                <h4 className="new_title">Other </h4>
                                <div className="vw-contract-bx">
                                  <div>
                                    <h6 className="">Employment Type</h6>
                                    <p>
                                      {employementData?.employmentType ||
                                        "-"}
                                    </p>
                                  </div>

                                  <div>
                                    <h6 className="">Reporting To</h6>
                                    <p>
                                      <span className="reprting-name">
                                        {employementData?.reportingTo || "-"}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </div> */}
                                                    </div>
                                                </div>
                                            </div>

                                            <div
                                                className="tab-pane fade"
                                                id="profile"
                                                role="tabpanel"
                                            >
                                                <div className="row">
                                                    <div className="col-lg-12 ps-0">
                                                        <div className="ovrview-bx mb-3">
                                                            <h4 className="new_title">Education</h4>
                                                        </div>

                                                        <div className="ovrview-bx vw-qualification-main-bx mb-3">
                                                            {data?.doctorEdu?.education?.length > 0 ? (
                                                                data?.doctorEdu?.education?.map(
                                                                    (edu, i) => (
                                                                        <div
                                                                            key={i}
                                                                            className="vw-contract-bx vw-qualification-bx"
                                                                        >
                                                                            <div>
                                                                                <h6 className="vw-qualification-title">
                                                                                    {edu.degree}
                                                                                </h6>
                                                                                <p>{edu.university}</p>
                                                                            </div>

                                                                            <div>
                                                                                <p>
                                                                                    {edu.startYear} to {edu.endYear}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                )
                                                            ) : (
                                                                <p>-</p>
                                                            )}
                                                        </div>

                                                        <div className="ovrview-bx mb-3">
                                                            <h4 className="new_title">Medical License </h4>

                                                            <div className="vw-contract-bx d-block ">
                                                                {data?.medicalLicense?.medicalLicense?.length > 0 ? (
                                                                    data?.medicalLicense?.medicalLicense?.map((cert, i) => (
                                                                        <div key={i} className="custom-frm-bx">
                                                                            <div className="form-control border-0 lablcense-frm-control align-content-center rounded-3" >
                                                                                <div className="lablcense-bx">
                                                                                    <div>
                                                                                        <h6>
                                                                                            <FontAwesomeIcon
                                                                                                icon={faFilePdf}
                                                                                                style={{ color: "#EF5350" }}
                                                                                            />
                                                                                            {cert?.certName}
                                                                                        </h6>
                                                                                    </div>
                                                                                    <div className="">
                                                                                        {cert?.certFile && (
                                                                                            <a
                                                                                                href={`${base_url}/${cert?.certFile}`}
                                                                                                target="_blank"
                                                                                                rel="noreferrer"
                                                                                                className="pdf-download-tbn"
                                                                                            >
                                                                                                Download
                                                                                            </a>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <p>-</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12 ps-0">
                                                        <h4 className="new_title">Work Experience</h4>
                                                        {data?.doctorEdu?.work?.length > 0 ? (
                                                            data?.doctorEdu?.work?.map((work, i) => (
                                                                <div className="ovrview-bx vw-qualification-main-bx mb-3" key={i}>
                                                                    <div className="vw-contract-bx vw-qualification-bx">
                                                                        <div>
                                                                            <h6 className="vw-qualification-title">
                                                                                {work?.organization}
                                                                            </h6>
                                                                            {/* <p>{work?.designation}</p> */}
                                                                        </div>
                                                                        <div className="vw-qualification-year-bx">
                                                                            <p>
                                                                                {work?.totalYear} - {work?.present ? "Present" : work?.month}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="ovrview-bx vw-qualification-main-bx mb-3">
                                                                <div className="vw-contract-bx vw-qualification-bx">
                                                                    <p>-</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div
                                                className="tab-pane fade"
                                                id="appointement"
                                                role="tabpanel"
                                            >
                                                <div className="row">
                                                    {data?.slots?.map((slot, i) => <div className="col-lg-12 ps-0">
                                                        <div className="ovrview-bx mb-3">
                                                            <h4 className="new_title">{slot?.day}</h4>

                                                        </div>
                                                        <div className="row">
                                                            {slot?.slots?.map(s => <div className="col-3">
                                                                <p className="">{s?.startTime} - {s?.endTime}</p>
                                                            </div>)}

                                                        </div>
                                                    </div>)}
                                                </div>
                                            </div>
                                            {data?.clinic &&
                                                <div
                                                    className="tab-pane fade"
                                                    id="clinic"
                                                    role="tabpanel"
                                                >
                                                    <div className="row">
                                                        <div className="col-lg-12 ps-0">
                                                            <img src={`${base_url}/${data?.clinic?.clinicImage}`} alt="" srcset="" />
                                                            <div className="ovrview-bx mb-3">
                                                                <h4 className="new_title">{data?.clinic?.clinicName}</h4>

                                                            </div>
                                                            <div className="">
                                                                <p>License Number <br />{data?.clinic?.licenseNumber}</p>
                                                                <div className="d-flex flex-column gap-3 justify-content-center">                                                                    <p>License Image</p>
                                                                    <img style={{ width: 300, height: 300 }} src={`${base_url}/${data?.clinic?.licenseImage}`} alt="" srcset="" />
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                {/* {clinic?.slots?.map(s => <div className="col-3">
                                                                    <p className="">{s?.startTime} - {s?.endTime}</p>
                                                                </div>)} */}

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DoctorProfile;
