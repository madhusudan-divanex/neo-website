import React, { useEffect, useRef, useState, } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCalendar, faChevronLeft, faChevronRight, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink } from "react-router-dom";
import { PiGlobe } from "react-icons/pi";
import { GoLocation } from "react-icons/go";
import { faLock, } from "@fortawesome/free-solid-svg-icons"
import { HiOutlineShieldCheck } from "react-icons/hi2";
import { IoLayersSharp } from "react-icons/io5";
import { FaRoute } from "react-icons/fa6";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { FiDatabase } from "react-icons/fi";
import { MdKey, MdOutlineWifiOff } from "react-icons/md";
import { TbAlertHexagon, TbFileCheck } from "react-icons/tb";
import { TbLock } from "react-icons/tb";
import { PiStarFourBold } from "react-icons/pi";
import { CiCircleCheck, CiHospital1 } from "react-icons/ci";
import { PiTestTubeFill } from "react-icons/pi";
import { RiCapsuleLine } from "react-icons/ri";
// import { FaHeartPulse } from "react-icons/fa6";
import { FiUsers } from "react-icons/fi";
import { FaUserDoctor } from "react-icons/fa6";
import { CiCreditCard1 } from "react-icons/ci";
import { HiChip } from "react-icons/hi";
import { BsToggles } from "react-icons/bs";
import { GoGlobe } from "react-icons/go";
import { LuHeartPulse } from "react-icons/lu";
import { PiTestTubeLight } from "react-icons/pi";
import { IoLayersOutline } from "react-icons/io5";
import AOS from "aos";
import "aos/dist/aos.css";
import { CiLock } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import { WiStars } from "react-icons/wi";
import { Users } from "lucide-react";
import { getApiData } from "../Services/api";
import base_url from "../baseUrl";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide.min.css";
import ContactQuery from "./ContactQuery";
function Landing() {

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }, []);
  const [menuOpen, setMenuOpen] = useState(false);
  // const [selectedLocation, setSelectedLocation] = useState("Jaipur, India");

  // const locations = ["English", "Delhi"];

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };



  useEffect(() => {
    const onScroll = () => {
      document
        .querySelector(".navbar")
        ?.classList.toggle("fixed", window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  const [firstSection, setFirstSection] = useState()
  const [testCat, setTestCat] = useState([])
  const [specialityData, setSpecialityData] = useState([])
  const [fourthData, setFourthData] = useState([])
  const [connectedData, setConnectedData] = useState()
  const [howItWorks, setHowItWorks] = useState([])
  const [serviceData, setServiceData] = useState([])
  const fetchData = async () => {
    try {
      const res = await getApiData("api/admin/landing/main");
      if (res.success) {
        setFirstSection(res?.data?.firstSection)
        setFourthData(res?.data?.fourthSection)
        setConnectedData(res?.data?.thirdSection)
        setHowItWorks(res?.data?.secondSection)
      }


    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const [blogData, setBlogData] = useState('')
  const [blogUrl, setBlogUrl] = useState('')
  async function fetchBlog() {

    const result = await getApiData(`api/admin/blogs?page=1&limit=8`)
    if (result.success) {
      setBlogData(result.data)
      setBlogUrl(result.baseUrl)
    }
  }
  useEffect(() => {
    fetchBlog()
  }, [])
   const splideRef = useRef(null);

  const nextSlide = () => {
    splideRef.current.splide.go(">");
  };

  const prevSlide = () => {
    splideRef.current.splide.go("<");
  };

  return (
    <>

      <div className="neo-doctor-wrapper">
        {/* {mode === "dark" && <Glow />} */}

        <div className="relative">







          {/* <section className="mx-auto max-w-6xl px-4 pt-14 md:pt-20">
          <motion.div {...fade} className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <div className="flex flex-wrap gap-2">
                <Chip icon={I.Shield} label="Verified doctor network • Consent-first" theme={theme} />
                <Chip icon={I.Lock} label="Secure rooms • Audit trails" theme={theme} />
              </div>

              <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">
                Your practice, upgraded.
                <span className="block">Verified identity. Global reach. Real trust.</span>
              </h1>

              <p className={`mt-4 text-base leading-relaxed ${theme.subtle}`}>
                NeoHealthCard helps doctors access verified patient timelines, run secure consultations, and build professional credibility with
                accountable reviews — powered by NeoAI and protected by governance-grade security. Video calls and group rooms support secure file
                sharing during meetings with audit trails.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button className={`rounded-2xl ${theme.solidBtn}`}>Apply for Verification</Button>
                <Button variant="outline" className={`rounded-2xl ${theme.outlineBtn}`}>
                  See Doctor ID
                </Button>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3">
                <Stat label="Faster charting" value="↓ 40%" theme={theme} />
                <Stat label="Safer handoffs" value="↑ 3×" theme={theme} />
                <Stat label="Audit-ready" value="Always" theme={theme} />
              </div>

              <div className={`mt-5 text-xs ${theme.subtle}`}>
                NeoAI is assistive (summaries, drafting, safety prompts). Final clinical decisions remain with the licensed clinician.
              </div>
            </div>


            <div className="relative">
              <div className="absolute -inset-6 rounded-[40px] bg-white/5 blur-2xl" />
              <div className={`relative overflow-hidden rounded-[36px] border shadow-2xl ${theme.card}`}>
                <div className={`flex items-center justify-between border-b px-5 py-4 ${mode === "light" ? "border-zinc-200" : "border-white/10"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`h-2.5 w-2.5 rounded-full ${theme.mutedDot}`} />
                    <div className={`h-2.5 w-2.5 rounded-full ${theme.mutedDot}`} />
                    <div className={`h-2.5 w-2.5 rounded-full ${theme.mutedDot}`} />
                  </div>
                  <Badge className={theme.pill}>Doctor App UI</Badge>
                </div>
                <div className="p-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className={`rounded-3xl border p-4 ${theme.subcard}`}>
                      <div className={`text-xs font-semibold ${theme.strong}`}>Screenshots (your app)</div>
                      <div className={`mt-1 text-xs ${theme.subtle}`}>Dashboard • Timeline • Chat • Rooms</div>
                      <div className="mt-4 grid gap-3">
                        <MiniShot label="Patient Timeline" theme={theme} />
                        <MiniShot label="Secure Room" theme={theme} />
                      </div>
                    </div>
                    <div className="grid gap-3">
                      <MiniShot label="Appointment Requests" theme={theme} />
                      <MiniShot label="Approvals" theme={theme} />
                      <MiniShot label="NeoAI Assist" theme={theme} />
                    </div>
                  </div>
                  <div className={`mt-5 rounded-2xl border px-4 py-3 text-xs ${theme.subtle} ${theme.subcard}`}>
                    Designed for real clinics: approvals, appointments, history, staff, permissions, scanning, secure chat, and NeoAI.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section> */}

          <section className="dc-health-care-section">
            <div className="container">
              <div className="row  align-items-center">

                <div className="col-md-6 mb-3">
                  {/* Chips */}
                  <div className="mb-3">
                    <ul className="neo-chip-list">
                      {firstSection?.topShot?.map(t =>
                        <li className="neo-chip-item">{t}</li>)}
                    </ul>
                  </div>

                  <div className="doctor-heading-content">
                    <h2 className="heading-grad  mt-3">
                      {firstSection?.title}
                    </h2>

                    <p className="mt-3 ">
                      {firstSection?.description}
                    </p>
                  </div>

                  <div className="mt-4 d-flex flex-column flex-sm-row gap-2">
                    {/* <a href={firstSection?.btnLink?.first} target="_blank" className="dc-thm-btn">Explore Modules →</a> */}
                    <a href={'#security'} className="dc-thm-btn outline">Governance & Compliance →</a>
                  </div>

                  {/* Stats */}
                  <div className="mt-4 row g-2">
                    {firstSection?.bottomShot?.map(b => <div className="col-lg-3 mb-3">
                      <div className="dc-module-cards">
                        <h5>{b?.label}</h5>
                        <p>{b?.value}</p>

                      </div>
                    </div>)}




                  </div>

                  <div className="neo-ai-content">
                    <p> NeoAI is assistive (summaries, drafting, safety prompts). Final clinical decisions remain with the licensed clinician.</p>
                  </div>
                </div>


                <div className="col-md-6 position-relative">
                  <div class="nhc-wrapper">
                    <div class="nhc-header">
                      <div class="nhc-logo"><h5>NEOHEALTHCARD</h5></div>
                      <h6 class="nhc-audit-btn d-flex align-items-center gap-1 mb-0">
                        <span class="nhc-shield"><VscWorkspaceTrusted />
                        </span>
                        Audit Trail
                      </h6>
                    </div>

                    <div class="nhc-consent-box">
                      <div class="nhc-consent-top">
                        <div>
                          <h2 class="nhc-title">{firstSection?.neoHealthCard?.title}</h2>
                          <p class="nhc-sub">
                            {firstSection?.neoHealthCard?.subTitle}
                          </p>
                        </div>
                        <div class="standardize-title"><MdKey />
                        </div>
                      </div>

                      <div class="nhc-role-list">
                        {firstSection?.neoHealthCard?.topShot?.map(t =>
                          <span class="nhc-chip">{t}</span>)}
                      </div>
                    </div>

                    <div class="nhc-info-grid">
                      {firstSection?.neoHealthCard?.feature?.map(f =>
                        <div class="nhc-info-card">
                          <div class="standardize-title flex-shrink-0">
                            <img src={`${base_url}/${f?.image}`} alt="" srcset="" />
                          </div>
                          <div>
                            <h3>{f?.title}</h3>
                            <p>{f?.desc}</p>
                          </div>
                        </div>)}

                    </div>

                    <div class="nhc-ai-box">
                      <h3><WiStars />
                        NeoAI (Clinician-oversight)</h3>
                      <p>
                        {firstSection?.neoHealthCard?.neoAiDesc}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>


          {/* <section id="capabilities" className="mx-auto max-w-6xl px-4 pt-14 md:pt-18">
          <motion.div {...fade}>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Doctor-first capabilities</h2>
            <p className={`mt-3 max-w-3xl text-sm leading-relaxed ${theme.subtle}`}>
              Built to reduce friction, protect time, and increase clinical continuity — without turning medicine into a marketplace.
            </p>
          </motion.div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {capabilities.map((c) => (
              <FeatureCard key={c.title} icon={c.icon} title={c.title} desc={c.desc} bullets={c.bullets} theme={theme} />
            ))}
          </div>
        </section> */}

          <section id="capabilities" className="capabilities-section">
            <div className="container">
              <div class="doctor-works-content">
                <h6 class="section-label"><span className="built-title">HOW IT WORKS</span></h6>
                <h2 class="section-title">
                  {howItWorks?.title}
                </h2>
                <p class="section-description">
                  {howItWorks?.description}
                </p>
              </div>

              <div className="row">
                {howItWorks?.model?.map(m =>
                  <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                    <div className="work-card h-100">
                      <div className="protection-box mb-3">
                        <div className="">
                          <span className="standardize-title"><Users size={18} /></span>
                        </div>
                        <div className="protection-title">
                          <h5 className="">{m?.name}</h5>
                        </div>
                      </div>
                      <p className=" mb-2">{m?.description}</p>

                    </div>
                  </div>)}

              </div>
            </div>
          </section>


          {/* <section id="ecosystem" className="mx-auto max-w-6xl px-4 pt-14 md:pt-18">
          <motion.div {...fade}>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">One system, many modules</h2>
            <p className={`mt-3 max-w-3xl text-sm leading-relaxed ${theme.subtle}`}>
              NeoHealthCard connects doctors to verified patients, pharmacies, labs, hospitals, and institutions through secure identity,
              consent, and standards-ready interoperability.
            </p>
          </motion.div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {modules.map((m) => (
              <ModuleTile key={m.title} icon={m.icon} title={m.title} bullets={m.bullets} footer={m.footer} theme={theme} />
            ))}
          </div>
        </section> */}

          <section id="ecosystem" className="container pt-5 pt-md-6 neo-section">
            <div class="doctor-works-content">
              <h6 class="section-label"><span className="built-title">EVERYTHING CONNECTED</span></h6>
              <h2 class="section-title">
                {connectedData?.title}
              </h2>
              <p class="section-description">
                {connectedData?.description}
              </p>
            </div>

            <div className="row" id="security"> 
              {connectedData?.model?.map(m =>
                <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                  <div className="work-card h-100">
                    <div className="protection-box mb-3">
                      <div className="">
                        <span className="standardize-title"><Users size={18} /></span>
                      </div>
                      <div className="protection-title">
                        <h5 className="">{m?.name}</h5>
                      </div>
                    </div>
                    <p className=" mb-2">{m?.description}</p>

                  </div>
                </div>)}


            </div>
          </section>


          {/* <section id="trust" className="mx-auto max-w-6xl px-4 pt-14 md:pt-18">
          <motion.div {...fade}>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Trust, quality and protection</h2>
            <p className={`mt-3 max-w-3xl text-sm leading-relaxed ${theme.subtle}`}>
              NeoHealthCard replaces anonymous ratings with accountable feedback from verified patients — while protecting doctors with
              tamper-evident audit trails and medico-legal safeguards.
            </p>
          </motion.div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {trust.map((t) => (
              <TrustCard key={t.title} icon={t.icon} title={t.title} bullets={t.bullets} theme={theme} />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {[
              "Blockchain audit trails",
              "Consent-first access",
              "Verified patients",
              "Accountable reviews",
              "Emergency-safe",
              "WHO-aligned principles",
              "ABDM-ready posture",
            ].map((x) => (
              <Badge key={x} className={theme.pill}>
                {x}
              </Badge>
            ))}
          </div>
        </section> */}

          <section  className="container  pt-md-6 neo-section">

            <div class="doctor-works-content">
              <h6 class="section-label"><span className="built-title">GOVERNANCE & COMPLIANCE</span></h6>
              <h2 class="section-title">
                {fourthData?.compliance?.title}
              </h2>
              <p class="section-description">
                {fourthData?.compliance?.description}
              </p>
            </div>


            {/* Trust cards */}
            <div className="row ">
              {/* Trust Card 1 */}
              {fourthData?.compliance?.feature?.map(f =>
                <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                  <div className="work-card h-100">
                    <div className="protection-box mb-3">

                      <div className="protection-title">
                        <h5 className="">{f?.name}</h5>
                      </div>
                    </div>
                    <p className=" mb-2">{f?.description}</p>

                  </div>
                </div>)}





            </div>


            {/* <div className="mt-3 d-flex flex-wrap gap-2">
    <span className="neo-badge">Blockchain audit trails</span>
    <span className="neo-badge">Consent-first access</span>
    <span className="neo-badge">Verified patients</span>
    <span className="neo-badge">Accountable reviews</span>
    <span className="neo-badge">Emergency-safe</span>
    <span className="neo-badge">WHO-aligned principles</span>
    <span className="neo-badge">ABDM-ready posture</span>
  </div> */}
          </section>


          {/* <section id="doctorid" className="mx-auto max-w-6xl px-4 pt-14 md:pt-18 pb-16">
          <div className={`relative overflow-hidden rounded-[40px] border p-8 md:p-10 ${theme.card}`}>
            <div aria-hidden className="absolute -top-28 right-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div aria-hidden className="absolute -bottom-40 left-0 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

            <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <div className={theme.chip}>
                  <I.Id className={theme.chipIcon} />
                  <span>One verified identity</span>
                </div>
                <h3 className="mt-4 text-3xl font-semibold tracking-tight">One verified identity. One global practice.</h3>
                <p className={`mt-3 text-sm leading-relaxed ${theme.subtle}`}>
                  After verification, doctors receive a NeoHealthCard Doctor ID that connects them with verified patients and care networks worldwide —
                  securely and professionally.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button className={`rounded-2xl ${theme.solidBtn}`}>Apply for Verification</Button>
                <Button variant="outline" className={`rounded-2xl ${theme.outlineBtn}`}>
                  Talk to NeoHealthCard
                </Button>
              </div>
            </div>
          </div>
        </section> */}

          <section id="governance" className="doctor-id-section" >
            <div className="container ">
              <div className="row  align-items-center">
                <div className="col-md-6">
                  <div className="mb-3">
                    <span className="read-insti-bx"> Institutional readiness</span>
                  </div>

                  <h3 className="neo-heading mb-2">
                    {fourthData?.readiness?.title}
                  </h3>

                  <p className="neo-paragraph">
                    {fourthData?.readiness?.description}
                  </p>

                  <div className="d-flex align-items-start gap-2 mt-3 mt-md-0">
                    <Link to="/select-account-type" className="dc-lg-btn">Get NeoHealthCard</Link>
                    <a href="#" data-bs-toggle="modal" data-bs-target="#contactQuery" className="dc-lg-outline-btn">Talk to Partnerships</a>
                  </div>

                </div>




                <div className="col-md-6 ">
                  <div class="feature-wrapper">

                    {fourthData?.readiness?.feature?.map(f =>
                      <div class="feature-item">
                        <div class="check-badge">✓</div>
                        {f}
                      </div>)}

                    {/* <div class="feature-item">
                                            <div class="check-badge">✓</div>
                                            Role-based staff access
                                        </div>

                                        <div class="feature-item">
                                            <div class="check-badge">✓</div>
                                            Consent and audit trails
                                        </div>

                                        <div class="feature-item">
                                            <div class="check-badge">✓</div>
                                            Secure file sharing & messaging
                                        </div> */}

                  </div>
                </div>
              </div>
            </div>
          </section>
           {blogData?.length > 0 && 
           <section className='blog-section'>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">

              <div className="nw-arrow-bx  mb-2">
                <div>
                  <h4 className="heading-grad fz-40 mb-2">Latest Blogs</h4>
                  <p>{firstSection?.blogDesc}</p>
                </div>

                <div className="rating-arrows">
                  <button onClick={prevSlide} className="rating-prev me-2">
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                  <Link to="/blogs" className="view-all-btn">View All</Link>
                  <button onClick={nextSlide} className="rating-next">
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </div>
              </div>


              <Splide
                ref={splideRef}
                options={{
                  type: "loop",
                  perPage: 4,
                  perMove: 1,
                  autoplay: true,
                  pagination: false,
                  interval: 2500,
                  speed: 800,
                  arrows: false,
                  gap: "20px",
                  breakpoints: {
                    992: { perPage: 2, gap: "15px" },
                    767: { perPage: 1, gap: "10px" },
                  },
                }}
              >

                {blogData?.map((item, key) =>
                  <SplideSlide key={key}>
                    <div className="bloging-card">
                      <div class="blog-picture">
                        <img src={item?.image ?
                          `${blogUrl}${item.image}` : "/hospital-pic.jpg"} alt="example" class="img-scale" />
                      </div>
                      <div className="blog-content mt-2">
                        <h4>{item.title}</h4>

                        <div className="d-flex gap-3 my-3">
                          <span className="blog-user-title"><FontAwesomeIcon icon={faUser} /> Admin</span>
                          <span className="blog-user-title"><FontAwesomeIcon icon={faCalendar} />
                            {new Date(item?.createdAt)?.toLocaleDateString(('en-GB'), {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}</span>
                        </div>

                        <p className="blog-para">{item?.description}</p>

                        <div className="text-center mt-4">
                          <Link to={`/blogs-detail/${item._id}`} className="nw-thm-btn w-75">Read More</Link>
                        </div>
                      </div>
                    </div>
                  </SplideSlide>)}
              </Splide>


            </div>
          </div>
        </div>
      </section>}


          {/* <footer className={`border-t backdrop-blur-xl ${theme.footer}`}>
          <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="grid gap-10 md:grid-cols-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${theme.card}`}>
                    <I.Stethoscope className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">NeoHealthCard</div>
                    <div className={`text-xs ${theme.subtle}`}>Doctor App</div>
                  </div>
                </div>
                <div className={`mt-4 text-sm leading-relaxed ${theme.subtle}`}>
                  Built on consent. Secured by audit trails. Powered by NeoAI.
                </div>
              </div>

              {[ 
                {
                  title: "For Doctors",
                  links: ["Doctor App", "Verification & Onboarding", "Telemedicine", "Clinical Tools", "Global Practice"],
                },
                {
                  title: "Ecosystem",
                  links: ["NeoAI", "NeoMiddleware", "NeoEdge", "Blockchain Security", "Emergency Network"],
                },
                {
                  title: "Trust & Compliance",
                  links: ["Privacy Policy", "Terms of Service", "Medical Disclaimer", "WHO Digital Health", "ABDM (India)"],
                },
              ].map((col) => (
                <div key={col.title}>
                  <div className={`text-sm font-semibold ${theme.strong}`}>{col.title}</div>
                  <ul className={`mt-3 space-y-2 text-sm ${theme.subtle}`}>
                    {col.links.map((l) => (
                      <li key={l}>
                        <a className={navHover} href="#">
                          {l}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <Separator className={`my-8 ${theme.sep}`} />

            <div className={`flex flex-col gap-3 text-xs md:flex-row md:items-center md:justify-between ${theme.subtle}`}>
              <div>© {new Date().getFullYear()} NeoHealthCard. All rights reserved.</div>
              <div className="flex flex-wrap gap-4">
                <span className="inline-flex items-center gap-2">
                  <I.Shield className="h-3.5 w-3.5" /> Audit-ready
                </span>
                <span className="inline-flex items-center gap-2">
                  <I.Lock className="h-3.5 w-3.5" /> Consent-first
                </span>
                <span className="inline-flex items-center gap-2">
                  <I.Brain className="h-3.5 w-3.5" /> Clinician oversight
                </span>
              </div>
            </div>
          </div>
        </footer> */}

        </div>
      </div>
<ContactQuery/>




    </>
  )
}

export default Landing