import React from 'react'
import{FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faHome} from "@fortawesome/free-solid-svg-icons"
import { useNavigate,useLocation } from 'react-router-dom'

const DashFooter = () => {
    const navigate =useNavigate()

    const {pathname} =useLocation()

    const onGoHomeClicked = ()=> navigate('/dash')

    let goHomeButton =null

    if(pathname !== '/dash'){
        goHomeButton =(
            <button
                className='dash-footer__button icon-button'
                title="home"
                onClick={onGoHomeClicked}
            >

                <FontAwesomeIcon icon={faHome}/>
                
            </button>
        )
    }
  const content=(
    <footer className='dash-footer'>
        {goHomeButton}
        <p>Current User:</p>
        <p>Status:</p>

    </footer>
  )
  
    return content
}

export default DashFooter
