import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HospitalBill from "./Certificate Template/HospitalBill";
import LabTestOrder from "./Certificate Template/LabTestOrder";
import LabInvoice from "./Certificate Template/LabInvoice";
import PharmacyReturn from "./Certificate Template/PharmacyReturn";
import PharmacyInvoice from "./Certificate Template/PharmacySell";
import LabSampleReceipt from "./Certificate Template/LabSample";
import PatientConsentForm from "./Certificate Template/PatientConsentForm";
import UserProfile from "./User Profile/UserProfile";
import OPDReceipt from "./Certificate Template/OPDReceipt";
import PatientTransfer from "./Certificate Template/PatientTransfer";
import ViewBirthCertificate from "./Certificate Template/Birth Certificate";
import FollowUpPrescription from "./Certificate Template/FollowUpPrescription";
import DoctorEmpanelmentCertificate from "./Certificate Template/DoctorEmpanelmentCertificate";

const PrivacyPolicy = React.lazy(() => import("./Components/PrivacyPolicy"));
const TermAndCondition = React.lazy(() => import("./Components/TermAndCondition"));



const ClinicalSafetyStatement = React.lazy(() => import("./Components/ClinicalSafetyStatement"));
const MedicalDisclaimer = React.lazy(() => import("./Components/MedicalDisclaimer"));
const AccessModel = React.lazy(() => import("./Components/AccessModel"));
const AbdmReady = React.lazy(() => import("./Components/AbdmReady"));
const DigitalHealthPrinciples = React.lazy(() => import("./Components/DigitalHealthPrinciples"));
const DicomPosture = React.lazy(() => import("./Components/DicomPosture"));
const SecurityRoadmap = React.lazy(() => import("./Components/SecurityRoadmap"));
const GovermentHealth = React.lazy(() => import("./Components/GovernmentHealth"));
const InsuranceProgram = React.lazy(() => import("./Components/InsuranceProgram"));
const LabPharmacies = React.lazy(() => import("./Components/LabPharmacies"));
const HospitalHealth = React.lazy(() => import("./Components/HospitalHealthSystem"));
const Secaurity = React.lazy(() => import("./Components/Secaurity"));
const HowItWorks = React.lazy(() => import("./Components/HowItWorks"));
const Landing = React.lazy(() => import("./Components/Home"));
const AppLayouts = React.lazy(() => import("./layout/AppLayouts"));
const SelectAccountType = React.lazy(() => import("./Components/SelectAccountType"));
const CmsDynamic = React.lazy(() => import("./Components/CmsDynamic"));
const BlogDetails = React.lazy(() => import("./Components/BlogDetail"));
const Blogs = React.lazy(() => import("./Components/Blogs"));
const Certificate = React.lazy(() => import("./Components/Certificate"));
const DoctorAptBookingReceipt = React.lazy(() => import("./Certificate Template/Booking receipt"));
const MedicalPrescription = React.lazy(() => import("./Certificate Template/Medical Prescription"));
const DischargeInvoice = React.lazy(() => import("./Certificate Template/DischargeInvoice"));
const TransferCertificate = React.lazy(() => import("./Certificate Template/TransferCertificate"));
const LabReport = React.lazy(() => import("./Certificate Template/LabReport"));
const IPDInvoice = React.lazy(() => import("./Certificate Template/IPDInvoice"));



function Router() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayouts />,
      // errorElement: <Error />,

      children: [


        {
          index: true,
          element: <Landing />,
        },
        {
          path: "/",
          element: <Landing />,
        },
        {
          path: "/select-account-type",
          element: <SelectAccountType />,
        },
        {
          path: "/privacy-policy",
          element: <PrivacyPolicy />,
        },


        {
          path: "/clinical-safety-statement",
          element: <ClinicalSafetyStatement />,
        },

        {
          path: "/medical-disclaimer",
          element: <MedicalDisclaimer />,
        },

        {
          path: "/access-modal",
          element: <AccessModel />,
        },

        {
          path: "/security",
          element: <Secaurity />,
        },

        {
          path: "/abdm-ready",
          element: <AbdmReady />,
        },


        {
          path: "/digital-health",
          element: <DigitalHealthPrinciples />,
        },

        {
          path: "/dicom-posture",
          element: <DicomPosture />,
        },

        {
          path: "/security-roadmap",
          element: <SecurityRoadmap />,
        },
        {
          path: "/how-it-work",
          element: <HowItWorks />,
        },
        {
          path: "/government-public-health",
          element: <GovermentHealth />,
        },
        {
          path: "/insurance-programs",
          element: <InsuranceProgram />,
        },
        {
          path: "/labs-pharmacies",
          element: <LabPharmacies />,
        },
        {
          path: "/hospital-health-system",
          element: <HospitalHealth />,
        },
        {
          path: "/term-condition",
          element: <TermAndCondition />,
        },
        {
          path: "/page/:slug",
          element: <CmsDynamic />,
        },
        {
          path: "/blogs-detail/:id",
          element: <BlogDetails />
        },
        {
          path: "/blogs",
          element: <Blogs />
        },
        {
          path: "/certificate/:id",
          element: <Certificate />
        },
        {
          path: "/transfer-certificate/:id",
          element: <TransferCertificate /> // done
        },
        {
          path: "/discharge-invoice/:id", // done
          element: <DischargeInvoice />
        },
        {
          path: "/lab-report/:id", //done
          element: <LabReport />
        },
        {
          path: "/ipd-invoice/:id",
          element: <IPDInvoice /> //done
        },
        {
          path: "/opd-receipt/:id", //done
          element: <OPDReceipt />
        },
        {
          path: "/doctor-appointment-receipt/:id", //done
          element: <DoctorAptBookingReceipt />
        },
        {
          path: "/medical-prescription/:id", //done
          element: <MedicalPrescription />
        },
        {
          path: "/hospital-bill/:id", //done
          element: <HospitalBill />
        },
        {
          path: "/lab-order/:id",  //done
          element: <LabTestOrder />
        },
        {
          path: "/lab-invoice/:id", //done
          element: <LabInvoice />
        },
        {
          path: "/lab-sample/:id", //done
          element: <LabSampleReceipt />
        },
        {
          path: "/pharmacy-return/:id", //done
          element: <PharmacyReturn />
        },
        {
          path: "/pharmacy-sell/:id", //pending backend // design done
          element: <PharmacyInvoice />
        },

        {
          path: "/patient-consent-letter/:id", //done
          element: <PatientConsentForm />
        },
        
        {
          path: "/patient-transfer/:id", //done
          element: <PatientTransfer />
        },

        {
          path: "/follow-up-prescription/:id", //done
          element: <FollowUpPrescription />
        },

        {
          path: "/empanelment-certificate/:id", //done
          element: <DoctorEmpanelmentCertificate />
        },


        {
          path: "/user-profile/:id",
          element: <UserProfile />
        }



      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default Router