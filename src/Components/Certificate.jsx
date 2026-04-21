import React, { useEffect, useRef, useState } from 'react'
import { getApiData } from '../Services/api';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import ViewFitnessCertificate from '../Certificate Template/Fitness certificate';
import ViewMedicalCertificate from '../Certificate Template/Medical certificate';
import ViewDeathCertificate from '../Certificate Template/Death Certificate';
import ViewBirthCertificate from '../Certificate Template/Birth Certificate';
import Loader from '../Common/Loader';

function Certificate() {
    const { id } = useParams()
    const pdfRef = useRef();
    const navigate=useNavigate()
    const [loading,setLoading]=useState(true)
    const [certificateData, setCertificateData] = useState()
    const [type, setType] = useState()
    async function fetchCertificateData(params) {
        try {
            const res = await getApiData(`api/certificate/verify/${id}`)
            if (res.success) {
                setCertificateData(res.data)
                setType(res.type)
            }
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message)
            // navigate(-1)
        } finally{
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchCertificateData()
    }, [id])
    return (
        <>
            {loading? <Loader/>:<>
                {type == "fitness" && <ViewFitnessCertificate certificateData={certificateData} />}
                {type == "death" && <ViewDeathCertificate certificateData={certificateData} />}
                {type == "medical" && <ViewMedicalCertificate certificateData={certificateData} />}
                {type == "birth" && <ViewBirthCertificate certificateData={certificateData} />}
            </>}
        </>
    )
}

export default Certificate
