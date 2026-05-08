import { createBrowserRouter, RouterProvider } from "react-router-dom";

import PrivacyPolicy from "./Components/PrivacyPolicy";
import TermAndCondition from "./Components/TermAndCondition";



import ClinicalSafetyStatement from "./Components/ClinicalSafetyStatement";
import MedicalDisclaimer from "./Components/MedicalDisclaimer";
import AccessModel from "./Components/AccessModel";
import AbdmReady from "./Components/AbdmReady";
import DigitalHealthPrinciples from "./Components/DigitalHealthPrinciples";
import DicomPosture from "./Components/DicomPosture";
import SecurityRoadmap from "./Components/SecurityRoadmap";
import GovermentHealth from "./Components/GovernmentHealth";
import InsuranceProgram from "./Components/InsuranceProgram";
import LabPharmacies from "./Components/LabPharmacies";
import HospitalHealth from "./Components/HospitalHealthSystem";
// import Modules from "./Components/Modules";
import Secaurity from "./Components/Secaurity";
import HowItWorks from "./Components/HowItWorks";
import Landing from "./Components/Home";
import AppLayouts from "./layout/AppLayouts";
import SelectAccountType from "./Components/SelectAccountType";
import CmsDynamic from "./Components/CmsDynamic";
import BlogDetails from "./Components/BlogDetail";
import Blogs from "./Components/Blogs";
import Certificate from "./Components/Certificate";
import DoctorAptBookingReceipt from "./Certificate Template/Booking receipt";
import MedicalPrescription from "./Certificate Template/Medical Prescription";



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
          path:"/blogs-detail/:id",
          element:<BlogDetails/>
        },
         {
          path:"/blogs",
          element:<Blogs/>
        },
         {
          path:"/certificate/:id",
          element:<Certificate/>
        },
         {
          path:"/doctor-appointment-receipt/:id",
          element:<DoctorAptBookingReceipt/>
        },
         {
          path:"/medical-prescription/:id",
          element:<MedicalPrescription/>
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