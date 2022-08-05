import react, { useEffect, useRef, useState, FC, ReactNode } from "react";
import './CheckBoxStyle.css'
import Button from "../common/Button/Button";
import Text from '../common/Text/Text'


interface checkBoxProps {
  sentencesData: any[],
  insertedElementsArray: HTMLElement[],
  setIsCheckResultHidden: Function,
  isCheckResultHidden: boolean,
  setIsButtonActive: Function,
  isButtonActive: boolean,
  setIsWordDisabled: Function,
  isWordDisabled: boolean,
  isElementTransiting: boolean,
  comparableSentense: string,
  setSentenceCounter: Function
  setSwitchToNext: Function,
  switchToNext: boolean
            
}


const CheckBox: FC<checkBoxProps> = ({
  sentencesData,
  insertedElementsArray, 
  setIsCheckResultHidden,
  isCheckResultHidden, 
  setIsButtonActive, 
  isButtonActive,
  setIsWordDisabled,
  isWordDisabled,
  isElementTransiting,
  comparableSentense,
  setSentenceCounter,
  setSwitchToNext,
  switchToNext
                })=> {

  const [checkResult, setCheckResult] = useState<HTMLParagraphElement>(null!)

  return(
    <div className='app-body__checkbox'>
      <Text className = 'check-result' textType = 'text' inner = 'Something Wrong' setCheckResult = {setCheckResult}/>
      <Button
        sentencesData = {sentencesData} 
        className = 'check-button check-button_disabled' 
        insertedElementsArray = {insertedElementsArray} 
        checkResult = {checkResult} 
        setIsCheckResultHidden = {setIsCheckResultHidden}
        isCheckResultHidden = {isCheckResultHidden} 
        isButtonActive = {isButtonActive}
        setIsButtonActive = {setIsButtonActive}
        setIsWordDisabled = {setIsWordDisabled}
        isWordDisabled = {isWordDisabled}
        isElementTransiting = {isElementTransiting}
        comparableSentense = {comparableSentense}
        setSentenceCounter = {setSentenceCounter}
        setSwitchToNext = {setSwitchToNext}
        switchToNext = {switchToNext}
        
       
      >
          Check
      </Button> 
    </div>
  )
}

export default  CheckBox;