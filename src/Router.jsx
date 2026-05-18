import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HospitalBill from "./Certificate Template/HospitalBill";
import LabTestOrder from "./Certificate Template/LabTestOrder";
import LabInvoice from "./Certificate Template/LabInvoice";
import PharmacyReturn from "./Certificate Template/PharmacyReturn";
import PharmacyInvoice from "./Certificate Template/PharmacySell";
import LabSampleReceipt from "./Certificate Template/LabSample";
import PatientConsentForm from "./Certificate Template/PatientConsentForm";

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
          element: <TransferCertificate />
        },
        {
          path: "/discharge-invoice/:id",
          element: <DischargeInvoice />
        },
        {
          path: "/lab-report/:id",
          element: <LabReport />
        },
        {
          path: "/ipd-invoice/:id",
          element: <IPDInvoice />
        },
        {
          path: "/doctor-appointment-receipt/:id",
          element: <DoctorAptBookingReceipt />
        },
        {
          path: "/medical-prescription/:id",
          element: <MedicalPrescription />
        },
        {
          path: "/hospital-bill/:id",
          element: <HospitalBill />
        },
        {
          path: "/lab-order/:id",
          element: <LabTestOrder />
        },
        {
          path: "/lab-invoice/:id",
          element: <LabInvoice />
        },
        {
          path: "/lab-sample/:id",
          element: <LabSampleReceipt />
        },
        {
          path: "/pharmacy-return/:id",
          element: <PharmacyReturn />
        },
        {
          path: "/pharmacy-sell/:id",
          element: <PharmacyInvoice />
        },
        {
          path: "/patient-consent-letter/:id",
          element: <PatientConsentForm />
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