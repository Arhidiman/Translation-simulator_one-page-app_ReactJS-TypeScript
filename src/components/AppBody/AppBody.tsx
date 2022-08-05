import react, { useEffect, useRef, useState, FC, ReactNode } from "react";
import './AppBodyStyle.css'
import Text from "../common/Text/Text";


interface appBodyProps {
  children: ReactNode,
}

const AppBody: FC<appBodyProps> = ({children})=> {
  return(
    <div  className='app-body'>
      {children}
    </div>
  )
}

export default  AppBody;