import { faCalendar, faDroplet, faEnvelope, faEye, faLocationDot, faPerson, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import base_url from '../baseUrl';
import { calculateAge } from '../Services/globalFunction';

function PatientProfile({ data }) {
    return (
        <div className="container mt-3">
            <div className='view-employee-bx'>
                <div className="row">
                    <div className="col-lg-3 col-md-3 col-sm-12 mb-3">
                        <div className="view-employee-bx patients-personal-info-card">
                            <div>
                                <div className="view-avatr-bio-bx text-center">
                                    <img src={data?.logo || "/admin-tb-logo.png"} alt=""
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "/profile.png";
                                        }}
                                        width={150} height={150} />
                                    <h4>{data?.name}</h4>
                                    <p><span className="vw-id">ID:</span> {data?.nh12}</p>
                                    <h6 className="vw-activ text-capitalize">{data?.patientId?.status}</h6>

                                </div>

                                <div>
                                    <ul className="vw-info-list">
                                        <li className="vw-info-item">
                                            <span className="vw-info-icon"><FontAwesomeIcon icon={faPerson} /></span>
                                            <div>
                                                <p className="vw-info-title">Age</p>
                                                <p className="vw-info-value">{calculateAge(data?.demographic?.dob)} Year</p>
                                            </div>
                                        </li>

                                        <li className="vw-info-item">
                                            <span className="vw-info-icon"><FontAwesomeIcon icon={faCalendar} /></span>
                                            <div>
                                                <p className="vw-info-title">Gender </p>
                                                <p className="vw-info-value">{data?.patientId?.gender}</p>
                                            </div>
                                        </li>

                                        <li className="vw-info-item">
                                            <span className="vw-info-icon"><FontAwesomeIcon icon={faDroplet} /></span>
                                            <div>
                                                <p className="vw-info-title">Blood  Group </p>
                                                <p className="vw-info-value">{data?.demographic?.bloodGroup}</p>
                                            </div>
                                        </li>

                                        <li className="vw-info-item">
                                            <span className="vw-info-icon"><FontAwesomeIcon icon={faEnvelope} /></span>
                                            <div>
                                                <p className="vw-info-title">Email </p>
                                                <p className="vw-info-value">{data?.email}</p>
                                            </div>
                                        </li>

                                        <li className="vw-info-item">
                                            <span className="vw-info-icon"><FontAwesomeIcon icon={faPhone} /></span>
                                            <div>
                                                <p className="vw-info-title">Phone </p>
                                                <p className="vw-info-value">{data?.contactNumber}</p>
                                            </div>
                                        </li>

                                        {data?.demographic?.contact?.emergencyContactName && <li className="vw-info-item">
                                            <span className="vw-info-icon"><FontAwesomeIcon icon={faPhone} /></span>
                                            <div>
                                                <p className="vw-info-title">Emergency Contact Name </p>
                                                <p className="vw-info-value"><span className="fw-700">({data?.demographic?.contact?.emergencyContactName}) </span> {data?.demographic?.contact?.emergencyContactNumber}</p>
                                            </div>
                                        </li>}

                                        <li className="vw-info-item">
                                            <span className="vw-info-icon"><FontAwesomeIcon icon={faLocationDot} /></span>
                                            <div>
                                                <p className="vw-info-title">Address</p>
                                                <p className="vw-info-value">{data?.address}</p>
                                            </div>
                                        </li>

                                    </ul>

                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-lg-8 ms-5">
                        <div className="">
                            <div className="ovrview-bx mb-3">
                                <h4 className="new_title">Medical History</h4>
                                {/* <p className="">Robert Davis is a board-certified cardiologist with over 8 years of experience in diagnosing and treating heart conditions. She specializes in preventive cardiology and heart failure management.</p> */}
                            </div>

                            <div className="medical-history-content">
                                <div>
                                    <h4 className="fz-16 fw-700">Do you have any chronic conditions?</h4>
                                    <h5 className="hearth-disese">{data?.medicalHistory?.chronicCondition}</h5>
                                </div>

                                <div className="mt-3">
                                    <h4 className="fz-16 fw-700">Are you currently on any medications?</h4>
                                    <h5 className="hearth-disese">{data?.medicalHistory?.onMedication ? 'Yes' : 'No'}</h5>
                                </div>

                            </div>

                            <div className="medical-history-content my-3">
                                <div>
                                    <h4 className="fz-16 fw-700">Medication Details</h4>
                                    <p>{data?.medicalHistory?.medicationDetail}</p>
                                </div>

                                <div className="mt-3">
                                    <h4 className="fz-16 fw-700">Allergies</h4>
                                    <p>{data?.medicalHistory?.allergies}</p>
                                </div>

                            </div>

                            <div className="ovrview-bx mb-3">
                                <h4 className="new_title">Family Medical History</h4>
                            </div>
                            <div className="medical-history-content my-3">
                                <div>
                                    <h4 className="fz-16 fw-700">Any family history of chronic disease?</h4>
                                    <h5 className="hearth-disese">{data?.medicalHistory?.familyHistory?.chronicHistory}</h5>

                                </div>

                                <div className="mt-3">
                                    <h4 className="fz-16 fw-700">Chronic Diseases in Family</h4>
                                    <p> {data?.medicalHistory?.familyHistory?.diseasesInFamily}</p>
                                </div>

                            </div>

                            <div className="ovrview-bx mb-3">
                                <h4 className="new_title">Prescriptions and Reports</h4>
                            </div>

                            <div className="row">
                                {data?.patientPrescriptions?.prescriptions?.length > 0 &&
                                    data?.patientPrescriptions?.prescriptions?.map((item, key) =>
                                        <div className="col-lg-6 mb-3" key={key}>
                                            <div className="prescription-patients-card">
                                                <div className="prescription-patients-picture">
                                                    <img src={item?.fileUrl ?
                                                        `${base_url}/${item?.fileUrl}` : "/patient-card-one.png"} alt="" />
                                                </div>
                                                <div className="card-details-bx">
                                                    <div className="card-info-title">
                                                        <h3>{item?.name}</h3>
                                                        {/* <p>8/21/2025</p> */}
                                                    </div>

                                                    <div className="">
                                                        <a href={`${base_url}/${item?.fileUrl}`} target="_blank" className="card-sw-btn d-inline-block"><FontAwesomeIcon icon={faEye} /></a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PatientProfile