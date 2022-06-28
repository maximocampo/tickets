import React, {useEffect, useState} from 'react';
import {getDocs, query, where} from "firebase/firestore";
import {eventRef} from "../globals";
import Body from "../components/body";

const Data = () => {
    const [s, setS] = useState('')
    const get = async () => {
        const q = query(eventRef, where('ticketStatus', '==', 'approved'))
        const app = await getDocs(q)
        
        let log = ''
        
        app.docs.forEach(doc => {
            const {
                firstName,
                lastName,
                email,
                llego
            } = doc.data()
            log = `${log}${doc.id}\t${firstName}\t${lastName}\t${email}\t${llego || false}
            `
        })
    
        console.log(log)
        navigator.clipboard.writeText(log);
    
    }
    useEffect(() => {
        get()
    }, [])
    
    return (
        <Body>
        </Body>
    );
};

export default Data;
