import React from 'react'
import { useSelector } from 'react-redux'


function Profile() {
    const isAutheticated = useSelector((state) => state.authenticate.isAutheticated)

    return (
        <div>Profile</div>
    )
}

export default Profile