import React, {useEffect, useState} from 'react';
import Layout from "../../components/layout";
import Dots from "../../components/dots";
import TicketForm from "./TicketForm";
import {addDoc, writeBatch, arrayUnion} from "firebase/firestore";
import {createPreference, eventRef, firestore, paymentsRef} from "../../globals";
import {useMercadopago} from "react-sdk-mercadopago";
import Body from "../../components/body";
import Error from "../../components/error";

const Buy = () => {
    const [error, setError] = useState(false)
    const mercadopago = useMercadopago.v2(process.env.GATSBY_MP_PUBLIC_KEY, {locale: 'es-MX'});
    const [filled, setFilled] = useState(false)
    const [tickets, setTickets] = useState({0:{}})
    const [quantity, setQuantity] = useState(1)
    const [payLoading, setPayLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [send, setSend] = useState(true)
    
    const handlePay = async () => {
        try {
            setPayLoading(true)
    
            //firestore
            const snapArr = []
            //create a user for each ticket
            for (const tik in tickets) {
                const snapshot = await addDoc(eventRef, {
                    firstName: tickets[tik].first_name,
                    lastName: tickets[tik].last_name,
                    email,
                    ticketStatus: 'pending',
                    dateCreated: new Date(),
                    sendEmails: send
                });
        
                snapArr.push(snapshot)
            }
    
            const payment = await addDoc(paymentsRef, {
                payerId: snapArr[0].id,
                ticketStatus: 'pending',
                dateCreated: new Date(),
            });
            
            //mercadopago
            const D = await createPreference({
                quantity: +quantity,
                payerId: payment.id,
                payer: {email: tickets[0].email,}
            })
    
            const batch = writeBatch(firestore);
    
            snapArr.forEach((doc) => {
                console.log('doc ->', doc)
                
                batch.update(doc, {
                    payments: arrayUnion(payment.id)
                })
            });
    
            await batch.commit();
            
            const checkout = mercadopago.checkout({preference: {id: D.data.preferenceId}})
    
            //localstorage
    
            return checkout.open()
        } catch (e) {
            setError(true)
        }
    }
    
    const handleQuantityChange = ({target: {value}}) => {
        quantity < value && setFilled(false)
        setQuantity(value)
        
        const _tickets = tickets
        delete _tickets[value]
        
        setTickets(_tickets)
    }
    
    
    useEffect(() => {
        setFilled(true)
        for (const tik in tickets) {
            if (!tickets[tik].hasOwnProperty("first_name") || !tickets[tik].first_name) {
                setFilled(false)
            }
            if (!tickets[tik].hasOwnProperty("last_name") || !tickets[tik].last_name) {
                setFilled(false)
            }
        }
    }, [tickets])
    
    if (error) {
        return <Error />
    }
    
    return (
        <Layout>
            <Body>
                <div style={{display: 'flex'}}>
                    <p>cuantos boletos quieres:</p>
                    <select
                        value={quantity}
                        onChange={handleQuantityChange}
                        style={{width:40, textAlign: 'center'}}
                    >
                        {[...Array(10)].map((e, i) => <option value={i+1}>{i+1}</option>)}
                    </select>
                </div>
                
                {[...Array(+quantity)].map((e, i) => (
                    <>
                        <p>entrada {i+1}</p>
                        <TicketForm {...{i, tickets, setTickets}} />
                    </>
                ))}
                <br/>
                <input
                    value={email}
                    onChange={({target: {value}}) => setEmail(value)}
                    type="email"
                    placeholder="e-mail"
                />
                {payLoading
                    ? <Dots />
                    : <p
                        className="link" style={{color: (filled && email) ? 'white' : 'gray',}}
                        onClick={(filled && email) && handlePay}
                    >
                        PAGAR
                    </p>
                }
                <div style={{display: 'flex'}}>
                    <div className="checkboxOverride">
                        <input
                            type="checkbox"
                            name=""
                            id="checkboxInputOverride"
                            checked={send}
                            onChange={() => setSend(!send)}
                        />
                        <label htmlFor="checkboxInputOverride"/>
                    </div>
                    <p style={{fontSize: 14}}>quiero que goma me mande cosas chidas <br/>( ◜‿◝ )♡</p>
                </div>
            </Body>
        </Layout>
    );
};

export default Buy;
