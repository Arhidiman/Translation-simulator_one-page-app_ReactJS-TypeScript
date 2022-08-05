import react, { useEffect, useRef, useState } from "react";
import './LinkStyle.css'
import YouTubeLogo from '../../../images/YouTube-logo.png'

function Link(props) {

    const className = props.className;
    const href = props.href;
    const url = props.url;
    const text = props.text;
    const superscript = props.superscript;

    return(
        <a className = {`link ${className}`} href = {href}>
            <img className = "link__image" src = {url}></img>
            <p className = "link__text">{text}<sup className = 'link__text-superscript'>{superscript}</sup></p>
        </a>       
    )
}

export default  Link;