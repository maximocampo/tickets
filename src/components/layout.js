import React, {useEffect} from "react"
import * as program from "./hotlink";
import { run } from 'play.core-master 2/src/run.js'

export default ({children, justify = true}) => {
    useEffect(() => {
        run(program, { element : document.querySelector('pre') })
            .then(function(e){})
            .catch(function(e) {
                console.warn(e.message)
                console.log(e.error)
            })
    }, [])
    
    return (
    <div className="site-wrapper">
        <pre />
        <div style={{
            position: "absolute",
            width: '100vw',
            height: '100vh',
            top: 0,
            left: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: justify && 'center',
            overflow: 'hidden'
        }}>
            {children}
        </div>
    </div>
  )
}
