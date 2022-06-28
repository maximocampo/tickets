import React, {useEffect, useMemo, useState} from 'react';
import {query, where, getDocs, writeBatch, updateDoc, doc} from "firebase/firestore";
import {eventRef, getPayment, seachToObj, firestore, sendMail, paymentsRef} from "../../globals";
import {InvalidPayment} from "../../components/_index";
import Layout from "../../components/layout";
import Dots from "../../components/dots";
import Ticket from "./Ticket";
import Body from "../../components/body";
import Error from "../../components/error";

const Mpapproved = ({location: {search}}) => {
    const [error, setError] = useState(false)
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [payment, setPayment] = useState(null)
    const [status, setStatus] = useState(null)
    
    //update all users' info in firestore to what mercadopago sent
    const updateUsers = async ({docs, data}) => {
        try {
            const batch = writeBatch(firestore);
    
            docs.forEach((doc) => {
                batch.update(doc.ref, {
                    ticketStatus: data?.body?.status,
                    paymentId: data?.body?.id,
                    mpEmail: data?.body?.payer?.email,
                })
            });
    
            await batch.commit();
        } catch (e) {
            setError(true)
        }
    }
    
    //add users for tickets to map to
    const handlePaymentApproved = ({docs}) => {
        try {
            const _users = users
            docs.forEach(doc => {
                sendMail({...doc.data(), id: doc.id})
                _users.push({...doc.data(), id: doc.id})
            })
    
    
            setUsers(_users)
        } catch (e) {
            setError(true)
        }
    }
    
    const checkIfPayed = async ({payment_id}) => {
        try {
            const {data} = await getPayment({id: payment_id})
            console.log('stat', data)
            
            setPayment(data.body)
            setStatus(data?.body?.status)
    
            const q = query(eventRef, where('payments', 'array-contains', data?.body?.external_reference))
            const fsUsers = await getDocs(q)
    
            await updateUsers({docs: fsUsers.docs, data})
    
            if (data.body.status === 'approved') {
                const paymentRef = doc(firestore, paymentsRef.path + '/' + data?.body?.external_reference)
                updateDoc(paymentRef, {ticketStatus: 'approved'})
                handlePaymentApproved({docs: fsUsers.docs})
            }
    
            return setLoading(false)
    
            setLoading(false)
            return setStatus('invalid')
        } catch (e) {
            setError(true)
        }
    }
    
    useEffect(() => {
        search
            ? checkIfPayed(seachToObj(search))
            : setLoading(false)
    }, [search])
    
    if (error) {
        return <Error />
    }
    if (loading) {
        return <Layout><Body><Dots /></Body></Layout>
    }
    
    if (status === 'approved') {
        return (
            <Layout justify={false}>
                <div style={{display: 'flex', overflow: 'auto', width:'100%', justifyContent: 'center', paddingBottom: 50}}>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                    <Body style={{maxWidth: 400, minHeight: 100, maxHeight: '90vh', width: 'unset'}}>
                        <p>gracias</p>
                        <p>estos son tus boletos, además los mandamos a tu mail</p>
                        <p>
                            para cualquier duda o aclaracion, por favor mandanos un mail a
                            gomagoma.mx@gmail.com o md a @goma.mx en instagram
                        </p>
                    </Body>
                    {users.map((u, i) => <Ticket {...u} key={i} />) }
                    </div>
                </div>
            </Layout>
        )
    }
    
    return (
        <Layout><Body><InvalidPayment /></Body></Layout>
    );
};

export default Mpapproved;
