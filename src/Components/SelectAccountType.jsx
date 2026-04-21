import {
    faArrowRight,
    faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink } from "react-router-dom";

function SelectAccountType() {
    return (
        <>
            <section className="admin-login-section nw-hero-section ">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-12 col-sm-12">
                            <div className="admin-pisture-bx">
                                <div className="position-relative">
                                    <Link to='/' className="login-back-btn"> <FontAwesomeIcon icon={faChevronLeft} /> </Link>
                                </div>

                                <img src="new-login-bnnr.png" alt="" />
                            </div>
                        </div>

                        <div className="col-lg-5 col-md-12 col-sm-12 d-flex flex-column justify-content-center pb-3">

                            <div className="nw-form-container">
                                <div className="login-logo">
                                    <img src="/logo.png" alt="" />
                                </div>

                                <div className="admin-vndr-login my-3">
                                    <h3 className="heading-grad">Select Account Type </h3>
                                    <p>Sign up and Login Account</p>
                                </div>

                                <a href='https://doctor.neohealthcard.com' target="_blank" className="doctor-type-bx d-inline-block mb-3">
                                    <div className="doctor-mega-type-bx">
                                        <div className="doctor-type-content">
                                            <img src="/doctor-type-pic.png" alt="" />
                                            <div className="nw-content-type">
                                                <h4>I am a Doctor</h4>
                                                <p>Access verified doctor tools, create e-prescriptions, manage patients, and get AI clinical support.</p>
                                            </div>
                                        </div>
                                        <div>
                                            <a href='https://doctor.neohealthcard.com' target="_blank" className="go-nw-doctr-btn"><FontAwesomeIcon icon={faArrowRight} /></a>
                                        </div>
                                    </div>
                                </a>

                                <a href='https://patient.neohealthcard.com' target="_blank" className="doctor-type-bx d-inline-block mb-3">
                                    <div className="doctor-mega-type-bx">
                                        <div className="doctor-type-content">
                                            <img src="/patient-type-pic.png" alt="" />
                                            <div className="nw-content-type">
                                                <h4>I am a Patient</h4>
                                                <p>Create your digital health card, view
                                                    prescriptions, upload reports, and get personalized health</p>
                                            </div>
                                        </div>
                                        <div>
                                            <a href='https://patient.neohealthcard.com' target="_blank" className="go-nw-doctr-btn"><FontAwesomeIcon icon={faArrowRight} /></a>
                                        </div>
                                    </div>
                                </a>
                                <a  href='https://laboratory.neohealthcard.com' target="_blank" className="doctor-type-bx d-inline-block mb-3">
                                    <div className="doctor-mega-type-bx">
                                        <div className="doctor-type-content">
                                            <img src="/add-lab.png" alt="" />
                                            <div className="nw-content-type">
                                                <h4>Login as a Laboratory</h4>
                                                <p>Manage test requests, upload diagnostic reports, track sample status, and share results directly with doctors and patients.
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <a href='https://laboratory.neohealthcard.com' target="_blank" className="go-nw-doctr-btn"><FontAwesomeIcon icon={faArrowRight} /></a>
                                        </div>
                                    </div>
                                </a>
                                <a  href='https://pharmacy.neohealthcard.com' target="_blank" className="doctor-type-bx d-inline-block mb-3">
                                    <div className="doctor-mega-type-bx">
                                        <div className="doctor-type-content">
                                            <img src="/pharmacy-pic-one.png" alt="" style={{ borderRadius: '100%' }} />
                                            <div className="nw-content-type">
                                                <h4>Login as a Pharmacy</h4>
                                                <p>Verify e-prescriptions, manage medicine inventory, dispense medicines, and update prescription fulfillment status in real-time.
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <a href='https://pharmacy.neohealthcard.com' target="_blank" className="go-nw-doctr-btn"><FontAwesomeIcon icon={faArrowRight} /></a>
                                        </div>
                                    </div>
                                </a>
                                <a href='https://hospitals.neohealthcard.com' target="_blank"  className="doctor-type-bx d-inline-block mb-3">
                                    <div className="doctor-mega-type-bx">
                                        <div className="doctor-type-content">
                                            <img src="/building-pic.png" alt="" />
                                            <div className="nw-content-type">
                                                <h4>Login as a Hospital</h4>
                                                <p>Manage departments, doctors, patient records, appointments, admissions, and centralized health data in one secure platform.
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <a href='https://hospitals.neohealthcard.com' target="_blank" className="go-nw-doctr-btn"><FontAwesomeIcon icon={faArrowRight} /></a>
                                        </div>
                                    </div>
                                </a>


                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default SelectAccountType