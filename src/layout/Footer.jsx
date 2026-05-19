import { faFacebookF, faInstagram, faLinkedinIn, faXTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { GoLocation } from "react-icons/go";
import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { getApiData } from "../Services/api";


function Footer() {
  const [socialLinks, setSocilLinks] = useState([])
  const [firstSection, setFirstSection] = useState()
  async function fetchSocialLink() {
    try {
      const res = await getApiData('api/social-links')
      if (res.success) {
        setSocilLinks(res.data)
      }
    } catch (error) {

    }
  }
  const fetchData = async () => {
    try {
      const res = await getApiData("api/admin/landing/main");
      if (res.success) {
        setFirstSection(res?.data?.firstSection)
      }


    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    Promise.all([fetchData(), fetchSocialLink()])
  }, [])
  return (
    <>
      <footer className="ldp-footer-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
              <div className="d-flex align-items-center mb-3 landing-footer-content">
                <NavLink to="/"><img src="/logo.png" alt="" className="footer-logo" /></NavLink>
                <div>
                  <h6>NeoHealthCard</h6>
                  <p>Transforming healthcare with security, intelligence and care</p>
                </div>
              </div>

              <p className="footer-text">
                {firstSection?.footerData?.aboutNeo}
              </p>

              <div>
                <ul className="doctor-list">
                  <li className="doctor-items"><Link to={'/page/no-ads'} className="no-add-icon"> No ads</Link></li>
                  <li className="doctor-items"> <Link to={'/page/no-data-selling'} className="no-add-icon"> No data selling</Link></li>
                  <li className="doctor-items"> <Link to={'/page/patientcontrolled-consent'} className="no-add-icon"> Patient-controlled consent</Link></li>
                  <li className="doctor-items"> <Link to={'/page/doctor-in-command'} className="no-add-icon"> Doctor-in-command</Link></li>
                  <li className="doctor-items"> <Link to={'/page/audit-ready'} className="no-add-icon"> Audit-ready</Link></li>
                </ul>
              </div>

              <div className="clinical-notice-bx">
                <h5>CLINICAL NOTICE</h5>
                <p>{firstSection?.footerData?.clinicalNote}</p>
              </div>
              <div className="footer-social mt-3">
                <a href={socialLinks?.facebook} className="dv-social-icon-btn" target="_blank">
                  <FontAwesomeIcon icon={faFacebookF} />
                </a>

                <a href={socialLinks?.instagram} className="dv-social-icon-btn" target="_blank">
                  <FontAwesomeIcon icon={faInstagram} />
                </a>

                <a href={socialLinks?.youtube} className="dv-social-icon-btn" target="_blank">
                  <FontAwesomeIcon icon={faYoutube} />
                </a>

                <a href={socialLinks?.twitter} className="dv-social-icon-btn" target="_blank">
                  <FontAwesomeIcon icon={faXTwitter} />
                </a>

                <a href={socialLinks?.linkedin} className="dv-social-icon-btn" target="_blank">
                  <FontAwesomeIcon icon={faLinkedinIn} />
                </a>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12  mb-4">
              <h5 className="dv-innr-title">Quick Link</h5>
              <ul className="footer-links">
                <li className="dv-footer-item"> <a href="https://patient.neohealthcard.com" target="_blank" className="dv-footer-nav-link">Patient</a></li>
                <li className="dv-footer-item"> <a href="https://doctor.neohealthcard.com" target="_blank" className="dv-footer-nav-link">Doctor</a> </li>
                <li className="dv-footer-item"> <a href="https://hospitals.neohealthcard.com" target="_blank" className="dv-footer-nav-link">Hospital</a> </li>
                <li className="dv-footer-item"> <a href="https://laboratory.neohealthcard.com" target="_blank" className="dv-footer-nav-link">Laboratory</a></li>
                <li className="dv-footer-item"> <a href="https://pharmacy.neohealthcard.com" target="_blank" className="dv-footer-nav-link">Pharmacy</a> </li>
                {/* <li className="dv-footer-item"> <Link to="/how-it-work" className="dv-footer-nav-link">How it work</Link> </li> */}
              </ul>
              <div className="my-3">
                <h5 className="dv-innr-title">For institutions</h5>
                <ul className="footer-links">
                  <li className="dv-footer-item"> <NavLink to="/hospital-health-system" className="dv-footer-nav-link">Hospitals & health systems</NavLink></li>
                  <li className="dv-footer-item"> <NavLink to="/labs-pharmacies" className="dv-footer-nav-link">Labs & pharmacies</NavLink ></li>
                  <li className="dv-footer-item"> <NavLink to="/insurance-programs" className="dv-footer-nav-link">Insurance & programs</NavLink> </li>
                  <li className="dv-footer-item"> <NavLink to="/government-public-health" className="dv-footer-nav-link">Government / public health</NavLink ></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
              <h5 className="dv-innr-title">Governance & Compliance</h5>
              <ul className="footer-links">
                <li className="dv-footer-item"> <NavLink to="/clinical-safety-statement" className="dv-footer-nav-link">Clinical Safety statement</NavLink> </li>
                <li className="dv-footer-item"> <NavLink to="/medical-disclaimer" className="dv-footer-nav-link">Medical disclaimer</NavLink> </li>
                <li className="dv-footer-item"> <NavLink to="/privacy-policy" className="dv-footer-nav-link">Privacy & data protection</NavLink> </li>
                <li className="dv-footer-item"> <NavLink to="/access-modal" className="dv-footer-nav-link">Consent & access model</NavLink> </li>
              </ul>

              <div className="my-3">
                <h5 className="dv-innr-title">Standards & interoperability</h5>
                <ul className="footer-links">
                  <li className="dv-footer-item"> <NavLink to="/abdm-ready" className="dv-footer-nav-link">ABDM-ready (india)</NavLink> </li>
                  <li className="dv-footer-item"> <NavLink to="/digital-health" className="dv-footer-nav-link">WHO digital health principles</NavLink> </li>
                  <li className="dv-footer-item"> <NavLink to="/dicom-posture" className="dv-footer-nav-link">HL7 / FHIR / DICOM posture</NavLink> </li>
                  <li className="dv-footer-item"> <NavLink to="/security-roadmap" className="dv-footer-nav-link">ISO-aligned security roadmap</NavLink> </li>
                </ul>
              </div>

              <div className="clinical-notice-bx">
                <h5>TRANSPARENCY</h5>
                <p>{firstSection?.footerData?.transparancy}</p>

              </div>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
              <h5 className="dv-innr-title">Contact</h5>
              <ul className="footer-links">
                {/* <li className="dv-footer-item"> <a className="footer-contact" href="tel:+919876543210">
                                    <FaPhoneAlt className="contact-color" /> +91-9876543210
                                </a></li> */}

                <li className="dv-footer-item">
                  <a
                    className="footer-contact"
                    href={`https://mail.google.com/mail/?view=cm&to=${socialLinks?.email}.com&su=Support%20Request&body=Hello%20Neo%20Health%20Card%20Team%2C`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="far fa-envelope contact-color"></i> {socialLinks?.email}
                  </a>
                </li>
                <li className="dv-footer-item">
                  <p className="footer-contact-box footer-contact">
                    <GoLocation className="fz-22 contact-color" /> {socialLinks?.address}
                  </p>
                </li>
              </ul>

              <div className="clinical-notice-bx">
                <h5>PLATFORM</h5>
                <p><Link to="/clinical-safety-statement" className="footer-link">Clinical Safety statement</Link></p>
                <p className="py-3"><Link to="/medical-disclaimer" className="footer-link">Medical disclaimer</Link></p>
                <p><Link to="/privacy-policy" className="footer-link">Privacy & data protection</Link></p>

              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="new_para mb-0">© 2026 NeoHealthCard Private Limited. All rights reserved.</p>
            <div className="">
              <ul className="footer-links d-flex gap-lg-3 gap-sm-1">
                <li className="dv-footer-item py-0">  <NavLink to="/privacy-policy" className="dv-footer-nav-link">Privacy Policy</NavLink></li>
                <li className="dv-footer-item py-0"> <NavLink to="/term-condition" className="dv-footer-nav-link">Terms of Service </NavLink> </li>
                <li className="dv-footer-item py-0"> <NavLink to="/medical-disclaimer" className="dv-footer-nav-link">Medical disclaimer</NavLink> </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer