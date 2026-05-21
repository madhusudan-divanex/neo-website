import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getApiData } from '../Services/api'
import Loader from '../Common/Loader'
import { toast } from 'react-toastify'
import PatientProfile from './PatientProfile'
import DoctorProfile from './DoctorProfile'
import LabProfile from './LabProfile'
import PharProfile from './PharProfile'
import HospitalProfile from './HospitalProfile'

function UserProfile() {
    const { id } = useParams()
    const [loading, setLoading] = useState(true)
    const [profileData, setProfileData] = useState()
    async function userData() {
        try {
            const res = await getApiData(`api/neo/profile-data/${id}`)
            if (res?.success) {
                setProfileData(res?.data)
            }
            console.log(res, "res");

        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        userData()
    }, [id])
    return (
        <>
            {loading ? <Loader /> : <>
                {profileData?.role == "patient" && <PatientProfile data={profileData} />}
                {profileData?.role == "doctor" && <DoctorProfile data={profileData} />}
                {profileData?.role == "pharmacy" && <PharProfile data={profileData} />}
                {profileData?.role == "lab" && <LabProfile data={profileData} />}
                {profileData?.role == "hospital" && <HospitalProfile data={profileData} />}
            </>}
        </>
    )
}

export default UserProfile