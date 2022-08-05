import react, { useEffect, useRef, useState, FC } from "react";
import './LineStyle.css'

interface LineProps {
  
}


    const Line: FC<LineProps> =  () => {

    const line = useRef<HTMLDivElement>(null);


    return(
        <div ref = {line} className="line"  ></div>
    )
}

export default Line;