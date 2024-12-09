// import  { useState } from 'react'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Home from './components/Home/Home.jsx';
import URL from './components/URL/URL.jsx';
import Card from './components/Card/Card.jsx';

import IMG from './components/IMG/IMG.JSX';

import Text from './components/Text/Text.jsx';  

import Wifi from './components/Wifi/Wifi.jsx';

import Email from './components/Email/Email.jsx';

import SMS from './components/SMS/SMS.jsx';
import Event from './components/Event/Event.jsx';
import Payment from './components/Payment/Payment.jsx';
import Map from './components/Maps/Map.jsx';
import Video from './components/Video/Video.jsx';
import BulkQR from './components/BulkQR/BulkQR.jsx';
// import PDF from './components/PDF/PDF.jsx';
// import Business from './components/Business/Business/.jsx';
// import Facebook from './components/Facebook/Facebook.jsx';
// import Social_media from './components/Social_media/Social_media.jsx';
// import Apps from './components/apps/apps.jsx';
// import Menu from './components/Menu/Menu.jsx';
// import StyleQR from './components/StyleQR';


import Error from './Error'

function App() {
  return (
    <>
    <Router>
      <Routes> 
            <Route path="/" element={<Home/>} />   
            <Route path="/URL"  element = {<URL/>} /> 
            <Route path="/Card"  element = {<Card/>} /> 
            <Route path="/IMG"  element = {<IMG/>} /> 

            <Route path='/Email' element={<Email/>} />
            <Route path="/SMS"  element = {<SMS/>} /> 

            <Route path="/Text"  element = {<Text/>} /> 
            <Route path="/Event"  element = {<Event/>} />

            <Route path="/Payment"  element = {<Payment/>} /> 
            <Route path="/Map"  element = {<Map/>} /> 

            <Route path="/Wifi"  element = {<Wifi/>} />
            <Route path="/Video"  element = {<Video/>} /> 
            
            <Route path="/BulkQR"  element = {<BulkQR/>} />


            {/* <Route path="/PDF"  element = {<PDF/>} />  */}
            {/* <Route path="/Social_media"  element = {<Social_media/>} />  */}
            {/* <Route path="/Business"  element = {<Business/>} />  */}
            {/* <Route path="/Facebook"  element = {<Facebook/>} />  */}
            {/* <Route path="/apps"  element = {<Apps/>} />  */}
            {/* <Route path="/Menu"  element = {<Menu/>} />  */}
            <Route path='*' element={<Error/>}></Route>
      </Routes>
    </Router>
    </>
  )
}

export default App




