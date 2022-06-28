import React, {useEffect, useState} from 'react';
import Layout from "../components/layout";
import {collection, doc, getDoc, getFirestore, updateDoc} from "firebase/firestore";
import fb from "gatsby-plugin-firebase-v9.0";
import Dots from "../components/dots";
import Body from "../components/body";

const Goma5 = ({id}) => {
    const [admin, setAdmin] = useState(false)
    const [llego, setLlego] = useState(false)
    const [state, setState] = useState({})
    const [loading, setLoading] = useState(true)
    
    const firestore = getFirestore(fb)
    const eventRef = collection(firestore, '/goma#05');
    
    const handleBlur = ({target: {value}}) => {
        if (value === '12345') {
            setAdmin(true)
            localStorage.setItem('admin', 'true')
        }
    }
    
    const getData = async () => {
        const userRef = doc(firestore, eventRef.path + '/' + id)
        const user = await getDoc(userRef)
    
        setState(user.data())
        setLlego(user.data().llego || false)
        setLoading(false)
    }
    
    const handleToggleLlego = async () => {
        const userRef = doc(firestore, eventRef.path + '/' + id)
    
        setLlego(!llego)
        await updateDoc(userRef, {llego: !llego})
    }
    
    useEffect(() => {getData()}, [])
    
    useEffect(() => {
        if (localStorage) {
            setAdmin(localStorage.getItem('admin'))}
        },
        []
    )
    
    if (llego) {
        return (
            <Body>
                <p>YA LLEGÓ</p>
            </Body>
            )
    }
    
    return (
        <Body>
            {loading ? <Dots /> : (state && admin) ?
                <>
                    <div>
                        <p style={{textAlign: 'center'}}>
                            PAYMENT {state?.ticketStatus.toUpperCase()}
                        </p>
                        <p>nombre: {state?.firstName} {state?.lastName}</p>
                        <p>email: {state?.email}</p>
                        <p>payment id: {state?.paymentId}</p>
                        <hr/>
                        <p>evento: goma#05</p>
                        <p>fecha: 23/07/22</p>
                        <p>line up: diles que no me maten, mabe fratti + gibrana cervantes, torso corso</p>
                        <p>lugar: RESIDENCIA OBRERA</p>
                        <p>dirección: RESIDENCIA OBRERA</p>
                    </div>
                    <p
                        style={{
                            textDecoration: 'underline',
                            cursor:' pointer',
                            zIndex: 2,
                            textAlign: 'center'
                        }}
                        onClick={handleToggleLlego}
                    >
                        NO HA LLEGADO
                    </p>
                </>
                :
                <div>
                    <input
                        type="text"
                        placeholder="contraseña"
                        onBlur={handleBlur}
                    />
                </div>
            }
        </Body>
    );
};

export default Goma5;
