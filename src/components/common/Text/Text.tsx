import react, { useEffect, useRef, useState, FC } from "react";
import './TextStyle.css'

interface TextProps {
    className?: string,
    textType?: string,
    inner?: string
    setTextShadowToggler?: Function | undefined,
    textShadowToggler?: boolean,
    setCheckResult?: Function | undefined,
    switchToNext?: boolean
} 
const Text: FC<TextProps> = ({textType, className, inner, setTextShadowToggler, textShadowToggler, setCheckResult, switchToNext})=> {
    
    const text = useRef<HTMLHeadingElement | HTMLParagraphElement>(null!)

    useEffect(()=>{
        if(setTextShadowToggler !== undefined) {
            blinkText(text.current, 'app__title_shadow-none', setTextShadowToggler)
        }
        
        if(setCheckResult !== undefined) {
            setCheckResult(text.current)
        }
        fadeText(text.current, 'text-fade')

      })

    function fadeText(texElement: HTMLParagraphElement, className: string) {
        if(switchToNext === false) {
            text.current.classList.remove(className)
        }
        // text.current.ontransitionend = ()=>{
        //     text.current.classList.remove(className)
        //     toggler(false)
        // }
    } 
    function blinkText(texElement: HTMLHeadingElement, className: string, toggler: any) {
        if(textShadowToggler === true) {
            text.current.classList.add(className)
        }
        text.current.ontransitionend = ()=>{
            text.current.classList.remove(className)
            toggler(false)
        }
    }  
    
    if(textType == 'title') {
        return(
            <h1 ref = {text} className = {`title ${className}`} >
                {inner}
            </h1>     
        )
    }
    
    if(textType == 'text') {
        return(
            <p ref = {text} className = {`text ${className}`}>
                {inner}
            </p>     
        )
    }

    else return (
        <div>
            
        </div>
    )
  
}

export default  Text;