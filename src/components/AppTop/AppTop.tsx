import react, { useEffect, useRef, useState, FC } from "react";
import './AppTopStyle.css'
import iconMain from '../../images/icon.png'
import frame from '../../images/frame.png'
import Text from "../common/Text/Text";
import Image from "../common/Image/Image";

interface AppHeaderProps {
  translatableSentence: string[],
  switchToNext: boolean
}

const AppHeader: FC<AppHeaderProps> = ({translatableSentence, switchToNext})=> {
      return(
        <div className='app-body__top'>
            <Image url = {iconMain} className = 'body-top__icon-main'/>
            <div className='sentense-container bubble'>
              {translatableSentence.map((value, index)=> <Text key = {index} className = 'sentense text-fade' textType = 'text' inner = {value} switchToNext = {switchToNext}/>)}
            </div>
        </div>
      )
}

export default  AppHeader;