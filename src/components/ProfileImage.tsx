import { useEffect, useState } from 'react'
import { useAuth0 } from "../react-auth0-spa";

function ProfileImage() {
    const { user } = useAuth0();
    const [image, setImage] = useState(null)

    useEffect(() => {
        async function fetchImage() {
            const response = await fetch(`/profile/image`)
            const image = await response.blob()
            setImage(URL.createObjectURL(image))
        }
        if (user) fetchImage()
    }, [user])

    if (!image) return null

    return <img src={image} alt="Profile" />
}

export default ProfileImage
