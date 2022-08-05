import react, { useEffect, useRef, useState, FC } from "react";
import './AppHeaderStyle.css'
import Text from "../common/Text/Text";
interface appHeaderProps {
  setTextShadowToggler: Function
  textShadowToggler: boolean
}

const AppHeader: FC<appHeaderProps> = ({setTextShadowToggler, textShadowToggler})=> {

  const appHeader = useRef<HTMLDivElement>(null!)


  return(
    <div ref = {appHeader} className='app-header app__title_shadow-none'>
      <Text setTextShadowToggler = {setTextShadowToggler} textShadowToggler = {textShadowToggler} className = 'app__title' textType = 'title' inner = 'Translate this sentense'/>
    </div>
  )
}

export default  AppHeader;