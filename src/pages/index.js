import React from "react"
import Layout from "../components/layout"
import Link from "gatsby-link";
import Body from "../components/body";

const Index = () => {
    return (
        <Layout>
            <Body>
                <div style={{display:'flex', flexDirection: 'column'}}>
                <p>GOMA</p>
                <p>proximo evento: goma#05</p>
                <p>fecha: 23/07/22</p>
                <p>line up: diles que no me maten, mabe fratti + gibrana cervantes, torso corso</p>
                <p>visuales: scratch house</p>
                <p>lugar: residencia obrera</p>
                <p>precio: $250 (+ cargos)</p>
                <br/>
                <Link to="/buy" className="link">
                    COMPRAR BOLETOS
                </Link>
                </div>
            </Body>
        </Layout>
    )
}

export default Index

