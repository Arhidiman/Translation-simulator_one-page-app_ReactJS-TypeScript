import react, { useEffect, useRef, useState, FC } from "react";
import { text } from "stream/consumers";
import { createImportSpecifier } from "typescript";
import './WordStyle.css'


interface WordProps {
    wordsList: string[],
    inner: string,
    className: string,
    containerClass: string,
    wordIndex: number,
    linesArr: HTMLCollectionOf<HTMLElement> | undefined,
    nextWordLineIndex: number,
    maxWordsInLine: number,
    isWordDisabled: boolean | undefined,
    setIsWordDisabled: Function
    wordsCloudTop: number | undefined,
    linesBlockTop: number | undefined,
    linesBlockBottom: number | undefined,
    setTextShadowToggler: Function,
    textShadowToggler: boolean
    setInsertedElementsArray: Function
    setIsCheckResultHidden: Function
    setIsButtonActive: Function,
    setIsElementTransiting: Function,
}

const Word:  FC<WordProps> = ({
    wordsList,
    inner,
    className,
    containerClass,
    wordIndex,
    linesArr,
    nextWordLineIndex,
    maxWordsInLine,
    isWordDisabled,
    setIsWordDisabled,
    wordsCloudTop,
    linesBlockTop,
    linesBlockBottom,
    setTextShadowToggler,
    textShadowToggler,
    setInsertedElementsArray,
    setIsCheckResultHidden,
    setIsButtonActive,
    setIsElementTransiting,
        })=> {
    const word = useRef<HTMLLIElement>(null!)
    const container = useRef<HTMLDivElement>(null!)
    const isWordTransiting = useRef(false);
    const isWordMoved = useRef(false);
    const isElementDragged = useRef(false)
    const isElementInserted = useRef<boolean>(false)
    const [wordWidth, setWordWidth] = useState<number>(57); 
    const [wordHeight, setWordHeight] = useState<number>(19); 


    useEffect(()=> {
        console.log(isWordDisabled)
        if(isWordDisabled === true && word.current.classList.contains('swapped') === false) {
            console.log('disactivate all words')
            word.current.classList.remove('activated')
            word.current.classList.add('disactivated')
            word.current.onmouseup = null
        }

        if (isWordDisabled === false) {
            word.current.classList.remove('disactivated')
            word.current.classList.add('activated')
        }
    
        word.current.onmousedown = (e)=> {
            word.current.style.zIndex = '100'
            let count: number = 0;
            let wordsElements = document.getElementsByClassName('word') as HTMLCollectionOf<HTMLElement>
            let insertedWordsElements = document.getElementsByClassName('inserted') as HTMLCollectionOf<HTMLElement>
            let allElementsArray: HTMLElement[] = []
            let insertedElementsArray: HTMLElement[] = []
            let insertFieldCells: any[] = []
            let chooseElementsArray: HTMLElement[] = []
            let chooseElementFieldCells: any = []
            removeAllTransitionEvents(wordsElements)
   
            for(let i = 0; i < linesArr!.length; i++) {     
                for(let j = 0; j < maxWordsInLine; j++) {   
                    if(count < wordsElements.length) {
                        insertFieldCells.push({})
                        insertFieldCells[count].coords = {}   
                        insertFieldCells[count].index = {}
                        insertFieldCells[count].coords.x = getCoordsOfInserting(i, j).left
                        insertFieldCells[count].coords.y = getCoordsOfInserting(i, j).top
                        insertFieldCells[count].index.xIndex = j
                        insertFieldCells[count].index.yIndex = i
                        insertFieldCells[count].lineElement = linesArr![i]
                        insertFieldCells[count].element = insertedWordsElements[count]
                        if(wordsElements[i].classList.contains('inserted') === true) {
                            insertFieldCells[count].element = insertedWordsElements[count]
                        }
                        count ++
                    }     
                }
            }
            // Создание массива облака слов и задание координат с его помощью  
            for(let i = 0; i < wordsElements.length; i ++) {
                allElementsArray.push(wordsElements[i])
                if(wordsElements[i].classList.contains('inserted') === false) {
                    chooseElementsArray.push(wordsElements[i])
                }
                if(wordsElements[i].classList.contains('inserted') === true) {
                    insertedElementsArray.push(wordsElements[i])
                }
            }
            let wordsCellsContainers = document.getElementsByClassName('word-container') as HTMLCollectionOf<HTMLElement>
            for(let i = 0; i < wordsCellsContainers.length; i ++) {
                chooseElementFieldCells.push({})
                chooseElementFieldCells[i].coords = {}
                chooseElementFieldCells[i].container = wordsCellsContainers[i]
                if(chooseElementsArray[i] !== undefined && chooseElementsArray[i].classList.contains('inserted') === false) {
                    chooseElementFieldCells[i].element = chooseElementsArray[i]
                } 
                if(chooseElementsArray[i] === undefined) {
                    chooseElementFieldCells[i].element = null;
                }
                chooseElementFieldCells[i].coords.x = wordsCellsContainers[i].getBoundingClientRect().left + window.pageXOffset
                chooseElementFieldCells[i].coords.y = wordsCellsContainers[i].getBoundingClientRect().top + window.pageYOffset
                chooseElementFieldCells[i].sequenceIndex = null
            }

            if(word.current.classList.contains('inserted')) {
                isElementInserted.current = true
            } else {
                isElementInserted.current = false
            }
            word.current.classList.remove('inserted')

      
            for(let i = 0; i < chooseElementsArray.length; i ++) {
                chooseElementsArray[i].classList.add('activated')
                chooseElementsArray[i].style.top = chooseElementFieldCells[i].coords.y + 'px'
                chooseElementsArray[i].style.left = chooseElementFieldCells[i].coords.x + 'px'              
            }


            // activateAllElements(word.current, )


            let wordCoords = getElementCurrentCoords(word.current)
            let shiftX = e.pageX - wordCoords.left
            let shiftY = e.pageY - wordCoords.top

            word.current.ondragstart = function() {
                return false;
            };

            // 2. размещаем элемент на том же месте, но в абсолютных координатах
            word.current.classList.add('dragged')

            // 3. перемещаем в body, чтобы элемент был точно не внутри блока с position:relative
            if(isWordMoved.current === false) {
                document.body.appendChild(word.current)
            }

            
            // 4. показываем элемент над другими элементами
            word.current.style.zIndex = '1000';
            
            // 5. передвигаем элемент под координаты курсора
            moveAt(e);

           


            // 6. перемещение по экрану
            document.onmousemove = (e)=> {
                isWordMoved.current = true;
                moveAt(e)
                swapWords();   
                isElementDragged.current = true        
            }

            // 7. предотвращаем случайный повторный захват элемента во время его перехода
            if(isWordTransiting.current === true) {
                word.current.onmousemove = null;
            }

            //XXX делаем все слова находящиеся в поле ввода активными, т.е. добавляем возможность поменять слова местами
            if(word.current.classList.contains('inserted')) {
                let insertedWords = document.getElementsByClassName('inserted') as HTMLCollectionOf<HTMLElement>
                let insertedWordsNumber = insertedWords.length
                for(let i = 0; i < insertedWordsNumber; i++) {
                    document.body.appendChild(insertedWords[i])
                    insertedWords[i].classList.add('activated')
                }
            }
            
            // 8. отслеживаем окончание переноса
            word.current.onmouseup = (e)=> {
                word.current.classList.add('transition')
                document.onmousemove = null;
                word.current.ontransitionstart = ()=> {
                    word.current.classList.remove('dragged', 'activated')
                    disactivateAllElements(word.current)
                    setTextShadowToggler(!textShadowToggler)
                    setIsButtonActive(false)
                    setIsCheckResultHidden(true)
                    setIsElementTransiting(true)
                    console.log('start')
                }
              
                // 8.1 сброс слова в поле ввода
                if(e.y <= linesBlockBottom!) {
                    // Сброс слова ИЗ облака слов В поле ввода (вставка нового слова из облака слов)
                    if(word.current.classList.contains('inserted') === false && isElementInserted.current === false) {
                        let index = getNextWordIndex(insertFieldCells) 
                        transitionAt(word.current, insertFieldCells, getNextWordIndex(insertFieldCells)) 
                        word.current.ontransitionend = ()=>{
                            insertFieldCells[index].element = word.current
                            appendAllToWordsCloud() 
                            appendAllToInsertField()   
                            activateAllElements(word.current, allElementsArray) 
                            removeAllTransitionEvents(wordsElements)
                            setTextShadowToggler(!textShadowToggler) 
                            setInsertedElementsArray(document.getElementsByClassName('inserted'))   
                            setIsCheckResultHidden(true)
                            setIsButtonActive(true)
                        }
                        //Сортировка облака слов
                        sortElements(word.current, chooseElementFieldCells, chooseElementsArray)
                        chooseElementFieldCells[chooseElementsArray.length].element = null
                    }
                    // Сброс слова ИЗ поля ввода В поле ввода (постановка вставленного слова на своё место, в случае смены местами с другим словом)
                    if(word.current.classList.contains('dragged') === true && isElementInserted.current === true && word.current.classList.contains('swapped') === true) {
                        word.current.classList.remove('swapped')             
                    }
                    
                    // Сброс слова ИЗ поля ввода В поле ввода (постановка вставленного слова на своё место,
                    //в случае его смещения из строки, в которой оно находится без смены местоположения с другим элементом)
                    if(word.current.classList.contains('dragged') === true  &&  isElementInserted.current === true && word.current.classList.contains('swapped') === false) {
                        transitionAt(word.current, insertFieldCells, getReturnElementIndex(word.current, insertFieldCells))
                        word.current.ontransitionend = ()=>{   
                            appendAllToInsertField()
                            appendAllToWordsCloud()
                            activateAllElements(word.current, allElementsArray) 
                            setTextShadowToggler(!textShadowToggler)
                            setInsertedElementsArray(document.getElementsByClassName('inserted')) 
                            setIsButtonActive(true)
                            setIsElementTransiting(false)
                        }
                    }
                }          
                // 8.2 Сброс слова В облако слов
                if(e.y >= wordsCloudTop!) {
                    //Сброс слова ИЗ облака слов В облако слов (перемещение слова на своё изначальное место, в случае если слово не было перемещено за пределы облака слов)
                    if(isWordMoved.current === true && word.current.classList.contains('inserted') === false) {
                        transitionAt(word.current, chooseElementFieldCells, getReturnElementIndex(word.current, chooseElementFieldCells))      
                        word.current.ontransitionend = ()=>{                             
                            appendAllToWordsCloud()
                            activateAllElements(word.current, allElementsArray) 
                            setTextShadowToggler(!textShadowToggler)
                            setInsertedElementsArray(document.getElementsByClassName('inserted')) 
                            setIsCheckResultHidden(true)
                            setIsButtonActive(true)
                            setIsElementTransiting(false)
                        }  
                    }  
                    //Сброс слова ИЗ поля ввода В облако слов
                    if(isWordMoved.current === true && isElementInserted.current === true) {

                        transitionAt(word.current, chooseElementFieldCells, getNextWordIndex(chooseElementFieldCells))
                        
                        sortElements(word.current, insertFieldCells, insertedElementsArray)
                        if(isElementInserted.current ===  true) {
                            word.current.ontransitionend = ()=>{    
                                word.current.classList.remove('inserted')                         
                                let sequenceIndex = word.current.value
                                let returnIndex = getReturnSortingIndex(chooseElementFieldCells, sequenceIndex)
                                if(getNextWordIndex(chooseElementFieldCells) === returnIndex) {
                                    appendAllToWordsCloud()
                                    appendAllToInsertField() 
                                    activateAllElements(word.current, allElementsArray)
                                }  else {
                                    transitionAt(word.current, chooseElementFieldCells, returnIndex)
                                    setTextShadowToggler(!textShadowToggler)
                                    setIsCheckResultHidden(true)
                                    setIsElementTransiting(false)
                                    for(let i = chooseElementFieldCells.length - 1; i > returnIndex; i--) { 
                                        if(chooseElementFieldCells[i - 1].element !== null) {
                                            chooseElementFieldCells[i].element = chooseElementFieldCells[i - 1].element
                                            transitionAt(chooseElementFieldCells[i].element, chooseElementFieldCells, i)                                              
                                        }
                                    }  
                                    chooseElementFieldCells[returnIndex].element = word.current
                                    word.current.ontransitionend = ()=>{
                                        word.current.ontransitionend = ()=>{ 
                                            appendAllToWordsCloud()
                                            appendAllToInsertField() 
                                            activateAllElements(word.current, allElementsArray)   
                                            setIsButtonActive(true)
                                            setIsElementTransiting(false)
                                        }
                                    } 
                                }   
                            }  
                        }
                    }
                } 
                if(isElementDragged.current === false) {
                    appendAllToWordsCloud()
                }       
            }
        
            //функция перемещения элемента по экрану
            function moveAt(event: MouseEvent) {
                word.current.style.left = event.pageX - shiftX + 'px';
                word.current.style.top = event.pageY - shiftY + 'px';
               
            }  

            interface ICoords {
                xLeft: number,
                xRight: number,
                yTop: number,
                yBottom: number
            }

            function getElementCoords(element: HTMLElement) : ICoords {
                return(
                    {
                        xLeft: element.getBoundingClientRect().left + window.pageXOffset,
                        xRight: element.getBoundingClientRect().right + window.pageXOffset,
                        yTop: element.getBoundingClientRect().top + window.pageYOffset,
                        yBottom: element.getBoundingClientRect().bottom + window.pageYOffset,
                    }
                )
            }

            function swapWords() {
                let {xLeft: currentWordXLeft, xRight: currentWordXRight, yTop: currentWordYTop, yBottom: currentWordYBottom} = getElementCoords(word.current)
                for(let i = 0; i < insertFieldCells.length; i++) {
                    if(insertFieldCells[i].element !== undefined) {
                        let {xLeft: wordXLeft, xRight: wordXRight, yTop: wordYTop, yBottom: wordYBottom} = getElementCoords(insertFieldCells[i].element)
                        if(insertFieldCells[i].element.classList.contains('transition')) {
                            word.current.style.pointerEvents = 'auto'
                        }
                        if((currentWordYTop > linesBlockTop!) && (currentWordYTop + wordHeight < linesBlockBottom!)) {                
                            if(
                                isElementInserted.current === true 
                            &&
                            (((currentWordXLeft < wordXLeft + wordWidth/2 && currentWordXLeft > wordXLeft && insertFieldCells[i].element.classList.contains('transition') === false) 
                            ||
                            (currentWordXRight > wordXRight - wordWidth/2 && currentWordXRight < wordXRight && insertFieldCells[i].element.classList.contains('transition') === false)))
                            && 
                            ((currentWordYBottom >= wordYTop && currentWordYBottom <= wordYBottom && insertFieldCells[i].element.classList.contains('transition') === false)
                            || (currentWordYTop <= wordYBottom && currentWordYTop >= wordYTop && insertFieldCells[i].element.classList.contains('transition') === false))
                            ) {                
                                let currentElementIndex = getReturnElementIndex(word.current, insertFieldCells) 
                                let swappedElementIndex = getReturnElementIndex(insertFieldCells[i].element, insertFieldCells)
                                transitionAt(insertFieldCells[i].element , insertFieldCells, currentElementIndex)
                                insertFieldCells[i].element.classList.add('transition')
                                let currentElement = insertFieldCells[currentElementIndex].element
                                let swappedElement = insertFieldCells[swappedElementIndex].element
                                insertFieldCells[currentElementIndex].element = swappedElement
                                insertFieldCells[swappedElementIndex].element = currentElement
                                swappedElement.ontransitionend = ()=>{
                                    swappedElement.classList.remove('transition')
                                    setIsButtonActive(true)
                                    setIsElementTransiting(false)
                                }                                  
                                word.current.classList.add('swapped')                   
                            }
                        }
                    }
                } 
            }

            function getElementCurrentCoords(element: HTMLElement) {
                let wordBox = element.getBoundingClientRect()
                return {
                    top: wordBox.top + window.pageYOffset,
                    left: wordBox.left + window.pageXOffset
                }
            }

            interface IInsert {
                top: number,
                left: number
            }

            function getCoordsOfInserting(lineIndex: number, wordIndex: number): IInsert {
                if(linesArr !== undefined) {
                    return {     
                        top: linesArr[lineIndex].getBoundingClientRect().top + (linesArr[lineIndex].offsetHeight - wordHeight)/2 + window.pageYOffset - 1,
                        left: linesArr[nextWordLineIndex].getBoundingClientRect().left + wordWidth*wordIndex + ((linesArr[lineIndex].offsetWidth - 6*wordWidth)/12)*(wordIndex*2) + 4.5 + window.pageXOffset 
                    }
                }
                else return {
                    top: 0,
                    left:0
                }
            }

            function getNextWordIndex(insertFieldCells: any[]) : number {
                let index = 0
                for(let i = 0;  i < insertFieldCells.length; i++) {
                    if(insertFieldCells[i].element === undefined || insertFieldCells[i].element === null) {
                        index = i
                        return index
                    }
                }
                return(index)
            }

            function getReturnElementIndex(element: HTMLElement, cellsArray: any[]) : number {
                let index = 0
                for(let i = 0;  i < cellsArray.length; i++) {
                    if(cellsArray[i].element === element) {
                        index = i
                        return index
                    }
                }
                return(index)
            }


            function getReturnSortingIndex(cellsArray: any[], sequenceIndex: number) {
                let returnIndex = 0
                for(let i = 0; i < cellsArray.length; i++) {            
                    if(cellsArray[i].element === null) {
                        returnIndex = i; 
                        return returnIndex    
                    }
                    if(i !== 0 && i !== cellsArray.length - 1 && sequenceIndex > cellsArray[i -1].element.value && sequenceIndex < cellsArray[i].element.value) {  
                        returnIndex = i; 
                        return returnIndex    
                    }
                    if(i === 0 && sequenceIndex < cellsArray[i].element.value) {
                        returnIndex = i;
                        return returnIndex
                    }
                    if(i === cellsArray.length - 1 && sequenceIndex > cellsArray[i - 1].element.value) {  
                        returnIndex = i;  
                        return returnIndex    
                    }
                }
                return returnIndex
            }

            function sortElements(element: HTMLElement, cellsArray: any[], sortedElementsArray: HTMLElement[]) {
                let startSortingWordIndex = 0;
                for(let i = 0; i < cellsArray.length; i++) {  
                    if(element === cellsArray[i].element) {
                        startSortingWordIndex = i
                        sortedElementsArray.splice(i, 1)
                    }
                }
                cellsArray[startSortingWordIndex].element = null
                for(let i = startSortingWordIndex; i < sortedElementsArray.length; i ++) {
                    if((sortedElementsArray[i].classList.contains('transititon') === false)) {
                        cellsArray[i].element = cellsArray[i + 1].element
                        transitionAt(cellsArray[i].element, cellsArray, i)
                    }        
                }
                cellsArray[sortedElementsArray.length].element = null
            }   

            function transitionAt(element: HTMLElement, cellsArray: any[], index: number) {   
                let coords = cellsArray[index].coords
                // element.style.transition = 'all ease 2s'
                element.classList.add('transition')
                element.style.left = coords.x + window.pageXOffset + 'px' 
                element.style.top = coords.y + window.pageYOffset + 'px'
            }
             
            function appendAllToInsertField() {
                for(let i = 0;  i < insertFieldCells.length; i++) {
                    if(insertFieldCells[i].element !== undefined && insertFieldCells[i].element !== null) {
                        insertFieldCells[i].lineElement.appendChild(insertFieldCells[i].element)
                        insertFieldCells[i].element.classList.add('inserted')
                        insertFieldCells[i].element.classList.remove('activated')
                        insertFieldCells[i].element.onmouseup = null;
                    }
                }
            }

            function appendAllToWordsCloud() {
                for(let i = 0;  i < chooseElementFieldCells.length; i++) {    
                    if((chooseElementFieldCells[i].element !== null) && (chooseElementFieldCells[i].element !== undefined)) {
                        chooseElementFieldCells[i].container.appendChild(chooseElementFieldCells[i].element) 
                        chooseElementFieldCells[i].element.classList.remove('activated')
                        // chooseElementFieldCells[i].element.style.position = 'static'
                        chooseElementFieldCells[i].elementonmouseup = null;
                    }  
                }
            }  

            function removeAllTransitionEvents(elements: HTMLCollectionOf<HTMLElement>) {
                for(let i = 0; i < elements.length; i++) {
                    elements[i].ontransitionend = null;
                    elements[i].ontransitionstart = null
                }
            }

            function disactivateAllElements(element: HTMLElement) {
                word.current.classList.add('transition')
                setIsWordDisabled(true)
                isWordTransiting.current = true;
                if(word.current.classList.contains('swapped') === false) {
                    // word.current.style.pointerEvents = 'none'
                }
            }

            function activateAllElements(element: HTMLElement, elements: HTMLElement[]) {
                setIsWordDisabled(false)
                isWordTransiting.current = false;
                isElementDragged.current = false
                if(element.classList.contains('swapped') === false) {
                    isWordMoved.current = false;
                }
                elements.forEach((elem: HTMLElement)=>{
                    elem.classList.remove('transition')
                    // elem.style.pointerEvents = 'auto'
                    // elem.style.transition = 'auto'
                    elem.style.zIndex = 'auto'
                })
            }
        }

    })

    return(
        <div ref = {container} className = {`word-container ${containerClass}`}>
            <li ref = {word} draggable = 'false' className = {`word ${className}`} value = {wordIndex}>
                {inner}
            </li> 
        </div>    
    )
}

export default  Word;