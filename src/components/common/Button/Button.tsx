
import { useEffect, useRef, useState, FC, ReactNode } from "react";
import './ButtonStyle.css'

interface IButton {
    children?: ReactNode,
    sentencesData: any[],
    className: string,
    insertedElementsArray: HTMLElement[],
    checkResult: HTMLParagraphElement,
    setIsCheckResultHidden: Function,
    isCheckResultHidden: boolean,
    setIsButtonActive: Function,
    isButtonActive: boolean,
    setIsWordDisabled: Function,
    isWordDisabled: boolean
    isElementTransiting: boolean,
    comparableSentense: string,
    setSentenceCounter: Function,
    setSwitchToNext: Function,
    switchToNext: boolean
}

const Button: FC<IButton> = ({
    children, 
    sentencesData,
    className, 
    insertedElementsArray, 
    checkResult, 
    setIsCheckResultHidden,
    isCheckResultHidden, 
    isButtonActive, 
    setIsWordDisabled,
    isElementTransiting,
    comparableSentense,
    setSentenceCounter,
    setSwitchToNext,
    switchToNext
                 })=> {
    
    const checkedSentence = useRef<string>('')
    const button = useRef<HTMLButtonElement>(null!);
    const [wordElements, setWordElements] = useState<any>(document.getElementsByClassName('word'))
    const [wordContainers, setWordContainers] = useState<any>(document.getElementsByClassName('word-container'))
    const [isResultRight, setIsResultRight] = useState<boolean>(false)
    const [voice, setVoice] = useState<{}>(window.speechSynthesis.getVoices())
   
    
    useEffect(()=>{
        if(switchToNext === true) {
            setSwitchToNext(false)
        }
        setVoice(window.speechSynthesis.getVoices()[1])
        let wordElementsArray: HTMLElement[] = []
        let wordContainersArray: HTMLElement[] = []
        for(let i = 0; i < wordElements.length; i++) {
            wordElementsArray.push(wordElements[i])
        }
        for(let i = 0; i < wordContainers.length; i++) {
            wordContainersArray.push(wordContainers[i])
        }

        button.current.classList.add('check-button_inactive')

        if(isButtonActive === true) {
            button.current.classList.remove('check-button_disabled')
            button.current.classList.remove('check-button_inactive')
        }

        if(isButtonActive === false) {
            button.current.classList.add('check-button_inactive')
        }

        if(insertedElementsArray.length === 0) {
            button.current.classList.add('check-button_disabled')
        }
        if(insertedElementsArray.length === 0 && isElementTransiting === true) {
            button.current.classList.remove('check-button_disabled')
            button.current.classList.add('check-button_inactive')
        }

        if(isCheckResultHidden === true &&  button.current.classList.contains('check-button_result-show')) {
            setIsWordDisabled(true)
            button.current.classList.add('check-button_result-hide')
            button.current.classList.remove('check-button_result-show')  
            checkResult.classList.remove('check-result-visible')
            button.current.ontransitionend =()=>{
                setIsWordDisabled(false)
                button.current.classList.remove('check-button_result-hide')
            }
        }
        button.current.onclick = !isResultRight? ()=> checkSentence(compareResult, pushButton, button.current, checkResult) :
        ()=> clearAll(wordElementsArray, wordContainersArray, button.current, showNextSentence)      
    })

    function checkSentence(compareResult: Function, pushButton: Function, buttonElement: HTMLButtonElement, checkResultMessage: HTMLElement ) { 
        compareResult(checkResultMessage)
        pushButton(buttonElement, checkResultMessage, pronounceUtterance)
    }

    function compareResult(checkResultMessage: HTMLElement) {
        for(let i = 0; i < insertedElementsArray.length; i++) {
            checkedSentence.current = (i !== insertedElementsArray.length - 1 ? checkedSentence.current + insertedElementsArray[i].innerHTML + ' ' : checkedSentence.current + insertedElementsArray[i].innerHTML)
        }
        if(comparableSentense === checkedSentence.current) {
            checkResultMessage.innerHTML = 'SUCCESS!'
            checkResultMessage.style.color = 'green'
        } else {
            checkResultMessage.innerHTML = 'SOMETHING WRONG'
            checkResultMessage.style.color = 'red'
            checkedSentence.current = ''
        }
    }

    function pushButton(buttonElement: HTMLButtonElement, checkResultMessage: HTMLElement, pronounceUtterance: Function) {
        buttonElement.classList.add('check-button_inactive')
        buttonElement.classList.add('check-button_shadow-none')
        setIsWordDisabled(true)
        buttonElement.ontransitionend = ()=>{
            buttonElement.classList.remove('check-button_shadow-none')
            buttonElement.classList.add('check-button_shadow-inset')
            buttonElement.ontransitionend = ()=>{
                checkResultMessage.classList.add('check-result-visible')
                buttonElement.classList.remove('check-button_result-hide')
                buttonElement.classList.add('check-button_result-show')
                buttonElement.classList.remove('check-button_shadow-inset')
                buttonElement.classList.add('check-button_shadow-none')
                buttonElement.ontransitionend = ()=>{
                    buttonElement.classList.remove('check-button_shadow-none')
                    buttonElement.ontransitionend = ()=>{
                        setIsWordDisabled(false)
                        setIsCheckResultHidden(false)
                        if(comparableSentense === checkedSentence.current) {
                            pronounceUtterance(comparableSentense, voice)
                            buttonElement.classList.add('check-button_text-fade')
                            buttonElement.ontransitionend = ()=>{
                                buttonElement.ontransitionend = ()=>{
                                    setIsResultRight(true)
                                    buttonElement.innerHTML = 'NEXT'
                                    buttonElement.classList.remove('check-button_text-fade')
                                    checkedSentence.current = ''
                                    buttonElement.classList.remove('check-button_result-show')
                                    buttonElement.classList.add('check-button_next')
                                } 
                            }
                        }
                    }
                }
            }
        }
    }

    function clearAll(wordElements: HTMLElement[], containerElements: HTMLElement[], buttonElement: HTMLButtonElement, showNextSentence: Function) {
        for(let i = 0; i < wordElements.length; i++) {
            wordElements[i].classList.add('fade')
            containerElements[i].classList.add('fade')
            wordElements[i].ontransitionend = ()=> {
                if(wordElements[i] !== undefined && wordElements[i] !== null) {
                    wordElements[i].remove()  
                }
            }
        }
        showNextSentence(buttonElement)
    }
    function pronounceUtterance(utterance: string, pronunciationVoice : SpeechSynthesisVoice) {
        const speech = new SpeechSynthesisUtterance(utterance);
        speech.pitch = 0.5
        speech.rate = 0.5
        speech.voice = pronunciationVoice
        window.speechSynthesis.speak(speech);
    }

    function showNextSentence(buttonElement: HTMLButtonElement) {
        buttonElement.classList.remove('check-button_next')
        buttonElement.classList.add('check-button_text-fade')
        buttonElement.ontransitionend = ()=>{
            buttonElement.ontransitionend = ()=>{
                buttonElement.classList.remove('check-button_text-fade')   
                setIsResultRight(false)
                buttonElement.innerHTML = 'CHECK' 
                buttonElement.ontransitionend = null 
                setSentenceCounter(Math.round(Math.random()*(sentencesData.length - 1)))
                buttonElement.onclick = null;
                setSwitchToNext(true)
                setIsCheckResultHidden(false)
            } 
        }
    }

    return(
        <button ref = {button} className = {`button ${className}`}>
            {children}
        </button>     
    )
}

export default  Button;