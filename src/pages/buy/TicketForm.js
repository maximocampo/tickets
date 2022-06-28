import React, {useState} from "react";
import {getDocs, query, where} from "firebase/firestore";
import {eventRef} from "../../globals";

const TicketForm = ({
    i = 0,
    tickets = {},
    setTickets,
}) => {
    const [takenEmail, setTakenEmail] = useState(false)
    const handleChange = ({target: {value}}, name) => {
        setTakenEmail(false)
        setTickets({...tickets, [i]: {...tickets[i], [name]: value}})
    }
    
    const handleBlur = async ({target: {value}}) => {
        const q = query(eventRef, where('email', '==', value))
        const takenEmail = await getDocs(q)
    
        setTakenEmail(takenEmail.docs.length > 0)
    }
    
    return (
        <div style={{display: 'flex', flexWrap: 'wrap', position: 'relative'}}>
            <div style={{display: 'flex'}}>
                <input
                    value={tickets[i]?.first_name}
                    onChange={(e) => handleChange(e, 'first_name')}
                    type="text"
                    placeholder="nombre"
                />
                <input
                    value={tickets[i]?.last_name}
                    onChange={(e) => handleChange(e, 'last_name')}
                    type="text"
                    placeholder="apellido"
                />
            </div>
        </div>
    )
}

export default TicketForm
