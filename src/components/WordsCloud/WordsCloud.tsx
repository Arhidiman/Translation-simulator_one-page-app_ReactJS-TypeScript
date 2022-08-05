import react, { useEffect, useRef, useState, FC, ReactNode } from "react";
import './WordsCloudStyle.css'
import Word from '../common/Word/Word'

interface wordsCloudProps {
  wordsList: string[],
  linesArr: HTMLCollectionOf<HTMLElement> |undefined,
  linesBlockTop: number | undefined,
  linesBlockBottom: number | undefined
  setTextShadowToggler: Function, 
  textShadowToggler: boolean
  setInsertedElementsArray: Function
  setIsCheckResultHidden: Function,
  setIsButtonActive: Function,
  setIsWordDisabled: Function, 
  isWordDisabled: boolean,
  setIsElementTransiting: Function,
  setSwitchToNext: Function,
  switchToNext: boolean

} 
const WordsCloud: FC<wordsCloudProps> = ({linesArr,
    wordsList,
    linesBlockTop,  
    linesBlockBottom,    
    setTextShadowToggler,   
    textShadowToggler, 
    setInsertedElementsArray, 
    setIsCheckResultHidden, 
    setIsButtonActive,
    setIsWordDisabled,
    isWordDisabled,
    setIsElementTransiting,
    switchToNext
                      })=> {

      const wordsCloud = useRef<HTMLDivElement>(null!);
      const [nextWordLineIndex, setNextWordLineIndex] =  useState<number>(0)
      const [maxWordsInLine, setMaxWordsInLine] =  useState<number>(6)
      const [wordsCloudTop, setWordsCloudTop] = useState<number | undefined>()
      const [listItem, setListItem] = useState<ReactNode[]>()
      
      useEffect(()=>{
        setIsWordDisabled(false)
        setWordsCloudTop(wordsCloud.current.getBoundingClientRect().top);
        setListItem(wordsList.map((value: string, index: number)=> <Word 
          key = {index}
          inner = {value}
          className = ''
          containerClass = ''
          wordIndex = {index}
          wordsList = {wordsList}
          linesArr = {linesArr}
          nextWordLineIndex = {nextWordLineIndex}
          maxWordsInLine = {maxWordsInLine}
          wordsCloudTop = {wordsCloudTop}
          isWordDisabled = {isWordDisabled}
          setIsWordDisabled = {setIsWordDisabled}
          linesBlockTop = {linesBlockTop}
          linesBlockBottom = {linesBlockBottom}
          setTextShadowToggler = {setTextShadowToggler}
          textShadowToggler = {textShadowToggler}
          setInsertedElementsArray = {setInsertedElementsArray}
          setIsCheckResultHidden = {setIsCheckResultHidden}
          setIsButtonActive = {setIsButtonActive}
          setIsElementTransiting = {setIsElementTransiting}
          />))

          if(listItem !== undefined && switchToNext === true) {
            setListItem(listItem.map(()=>listItem.splice(0,1)))
          }
      },[wordsList,
        linesBlockTop,  
        linesBlockBottom,    
        setTextShadowToggler,   
        textShadowToggler, 
        setInsertedElementsArray, 
        setIsCheckResultHidden, 
        setIsButtonActive,
        setIsWordDisabled,
        isWordDisabled,
        setIsElementTransiting,
        switchToNext
        ])


      return(
        <div ref = {wordsCloud} className='app-body__bottom words-cloud' draggable = 'false'>
          <div className="words-cloud-container">{listItem}</div>
          
        </div> 
      )
    
    

  
}

export default  WordsCloud;