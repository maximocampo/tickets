import React, {useEffect, useState} from 'react';
import * as QRCode from "qrcode";

const Ticket = ({firstName, lastName, email, paymentId, id}) => {
    const [qr, setQr] = useState(null)
    
    const generateQr = async () => {
        console.log(`${process.env.GATSBY_URL}/goma5/${id}`)
        const qr = await QRCode.toDataURL(`${process.env.GATSBY_URL}/goma5/${id}`, {
            color: {dark: '#fff', light: '#000'},
            margin: 0,
            scale: 10
        })
        
        setQr(qr)
    }
    
    useEffect(() => { generateQr() }, [])
    
    return (
        <div style={{
            backgroundColor: 'black',
            maxWidth: 400,
            maxHeight: '90vh',
            minHeight: 400,
            overflowY: 'auto',
            border: '0.5px solid white',
            padding: '1%',
            margin: '5%',
        }}>
            <div style={{display: "flex", gap: 10, flexWrap: 'wrap'}}>
                <img src={qr} alt="" style={{width: 100, height: 100}}/>
                <div style={{flex: 1}}>
                    <p>id de compra: {paymentId}</p>
                    <p>nombre: {firstName} {lastName}</p>
                    <p>email: {email}</p>
                    <hr/>
                    <p>evento: goma#05</p>
                    <p>fecha: 23/07/22</p>
                    <p>line up: diles que no me maten, mabe fratti + gibrana cervantes, torso corso</p>
                    <p>lugar: RESIDENCIA OBRERA</p>
                    <p>dirección: RESIDENCIA OBRERA</p>
                </div>
            </div>
        </div>
    );
};

export default Ticket;
