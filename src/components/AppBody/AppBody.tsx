import {FC, ReactNode } from "react";
import './AppBodyStyle.css'



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