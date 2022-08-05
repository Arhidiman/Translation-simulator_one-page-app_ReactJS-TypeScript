import React, { ElementRef, ElementType } from 'react';
import { useState, useRef, useEffect } from 'react';
import './App.css';
import sentencesData from './inputData';
import AppHeader from './components/AppHeader/AppHeader';
import AppTop from './components/AppTop/AppTop'
import WordsCloud from './components/WordsCloud/WordsCloud'
import LinesBlock from './components/LinesBlock/LinesBlock';
import CheckBox from './components/CheckBox/CheckBox';
import AppBody from './components/AppBody/AppBody';

const App = ()=> {
  const [sentenceCounter, setSentenceCounter] = useState<number>(0)
  const [linesArr, setLinesArr] = useState<HTMLCollectionOf<HTMLElement> |undefined>();
  const [linesBlockTop, setLinesBlockTop] = useState<number | undefined>()
  const [linesBlockBottom, setLinesBlockBottom] = useState<number | undefined>()
  const [textShadowToggler, setTextShadowToggler] = useState<boolean>(false)
  const [insertedElementsArray, setInsertedElementsArray] = useState<HTMLElement[]>([])
  const [isCheckResultHidden, setIsCheckResultHidden] = useState<boolean>(false)
  const [isButtonActive, setIsButtonActive] = useState<boolean>(false)
  const [isWordDisabled, setIsWordDisabled] = useState<boolean>(false)
  const [isElementTransiting, setIsElementTransiting] = useState<boolean>(false)
  const [switchToNext, setSwitchToNext] = useState<boolean>(false)

  return (
    <div className="App">
      <div className='app-container'>
        <AppHeader setTextShadowToggler = {setTextShadowToggler} textShadowToggler = {textShadowToggler}/>
        <AppBody>
          <AppTop switchToNext = {switchToNext} translatableSentence = {sentencesData[sentenceCounter].ru}/>
          <LinesBlock
            setLinesArr = {setLinesArr}
            setLinesBlockTop = {setLinesBlockTop}
            setLinesBlockBottom = {setLinesBlockBottom}
          />
          <WordsCloud
            wordsList = {sentencesData[sentenceCounter].wordsList}
            linesArr = {linesArr}
            linesBlockTop = {linesBlockTop}
            linesBlockBottom = {linesBlockBottom}
            setTextShadowToggler = {setTextShadowToggler} 
            textShadowToggler = {textShadowToggler}
            setInsertedElementsArray = {setInsertedElementsArray}
            setIsCheckResultHidden = {setIsCheckResultHidden}
            setIsButtonActive = {setIsButtonActive}
            setIsWordDisabled = {setIsWordDisabled}
            isWordDisabled = {isWordDisabled}
            setIsElementTransiting = {setIsElementTransiting}
            setSwitchToNext = {setSwitchToNext}
            switchToNext = {switchToNext}
          />
          <CheckBox 
            sentencesData = {sentencesData}
            insertedElementsArray = {insertedElementsArray} 
            setIsCheckResultHidden = {setIsCheckResultHidden}
            isCheckResultHidden = {isCheckResultHidden} 
            setIsButtonActive = {setIsButtonActive}
            isButtonActive = {isButtonActive}
            setIsWordDisabled = {setIsWordDisabled}
            isWordDisabled = {isWordDisabled}
            isElementTransiting = {isElementTransiting}
            comparableSentense = {sentencesData[sentenceCounter].en}
            setSentenceCounter = {setSentenceCounter}
            setSwitchToNext = {setSwitchToNext}
            switchToNext = {switchToNext} 
          />
        </AppBody>
      </div>
    </div>
  );
}

export default App;
