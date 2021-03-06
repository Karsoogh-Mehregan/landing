import {
    Astronaut,
    BgContainer,
    Btn,
    ErrorText,
    InputContainer,
    InputText,
    RightContainer,
    TextContainer,
} from './welcomeStyle'
import { toPersianNumber } from '../../utils/translateNumber';
import { toEnglishNumber } from '../../utils/translateNumber';
import Modal from '../../components/Modal/Modal';
import React, { useState, useEffect, useCallback } from 'react'
import {useNavigate} from 'react-router-dom'


function Welcome(){
    const [valid,setValid] = useState(false);
    const [accepted, setAccepted] = useState(false);
    const [ID,setID] = useState('1111111111');
    const [showModal, setShowModal] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate()
   
    // const { REACT_APP_API_ENDPOINT } = process.env;

    const handleChange = event => {
        document.getElementById("stuID").value = toPersianNumber(event.target.value);
        setID(event.target.value);
    }
 
    useEffect(() => {
        // const len = ID.length;
        //setValid(len == 10);
        setValid(1);
      },[ID]);
 
    const checkAcceptance = useCallback(async () => {
        try {
          const response = await fetch(process.env.REACT_APP_URL + "/api/checker/", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({student_number: ID})
          });

          const jsonRes = await response.json();

          if (jsonRes['status'] == 'true') {
            setAccepted(true);
            setShowModal(true);
          } else {
            setAccepted(false);
            setShowModal(true);
          }
        } catch (error) {
          console.log(error.message);
        }
      }, [ID]);   
  
    const verify = () => {
      let err = {};

      if (valid)
      checkAcceptance();
      else
        err["ID"] = "کدملی باید ۱۰ رقم باشه.";

      setErrors(err);
    }
    const redirectToSignup = () => {
      navigate('/sign_up', {state:{IDCode: toEnglishNumber(ID)}});
    }
    const redirectToHome = () => {
        navigate('/');
    }
    return(
        <>
         {showModal && accepted && <Modal Title="تبریک!" Text="خسته نباشی، مسیر سختی را پشت سر گذاشتی و خوشحالیم که الان می‌بینیمت. تو دوره تابستونه قراره با هم در یک عالمه کارگاه مختلف شرکت و بازی کنیم و یاد بگیریم. ثبت‌نام یادت نره که تازه قسمت هیجان‌انگیز ماجرا شروع شده :)" onConfirm={redirectToSignup} btnText="ثبت نام" color="#00af52"/>}
         {showModal && !accepted && <Modal Title="به امید دیدار!" Text="متاسفانه در این ایستگاه از سفر فضایی‌مون باید باهات خداحافظی کنیم." onConfirm={redirectToHome} btnText="بازگشت" color="#AF0029"/>}
        <BgContainer >
            <RightContainer>
                <TextContainer>
                    به مرحله سوم از سومین سفر فضایی اینترکارسولار خوش اومدید!
                </TextContainer>
                <InputText>
                    کد ملی خود را وارد کنید:
                </InputText>
                <InputContainer id='stuID' type='text' onChange={handleChange} />
                {errors["ID"] && (<ErrorText> {errors["ID"]}</ErrorText>)}
                <Btn onClick={verify} disabled = {!valid}>ارسال</Btn>
            </RightContainer>
            <Astronaut src = {process.env.PUBLIC_URL + '/RegistrationExtension.png'}/>
        </BgContainer >  
        </>

    )
}
export default Welcome;
