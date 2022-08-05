import react, { useEffect, useRef, useState, FC } from "react";
import './LinesBlockStyle.css'
import Line from '../common/Line/Line'

interface linesArrProps {
  setLinesArr: Function,
  setLinesBlockTop: Function,
  setLinesBlockBottom: Function
  
} 
const LinesBlock: FC<linesArrProps> = ({setLinesArr, setLinesBlockTop, setLinesBlockBottom})=> {

      const linesBlock = useRef<HTMLDivElement>(null!)

      
      useEffect(()=>{
      
      
        setLinesArr(document.getElementsByClassName('line') as HTMLCollectionOf<HTMLElement>)
        setLinesBlockTop(linesBlock.current.getBoundingClientRect().top);
        setLinesBlockBottom(linesBlock.current.getBoundingClientRect().top + linesBlock.current.getBoundingClientRect().height);
      })
        

      return(
          <div ref = {linesBlock} className='app-body__middle'>
            <Line/>
            <Line/>
            <Line/>
          </div>
      )
    
    

  
}

export default  LinesBlock;