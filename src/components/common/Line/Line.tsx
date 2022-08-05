import {useRef, FC } from "react";
import './LineStyle.css'

const Line: FC =  () => {
    const line = useRef<HTMLDivElement>(null);
    return(
        <div ref = {line} className="line"  ></div>
    )
}

export default Line;