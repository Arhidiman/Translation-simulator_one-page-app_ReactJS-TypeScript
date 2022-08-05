import react, { useEffect, useRef, useState, FC } from "react";

import './ImageStyle.css'

interface ImageProps {
    url: string,
    className: string
}
const Image: FC<ImageProps> =({url, className})=> {

    return(
        <img src = {url} className = {className}></img>
    )
}

export default  Image;