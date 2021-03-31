 import React, { createContext, useReducer } from 'react'
import { IdentityReducer } from './IdentityReducer'
 
export const IdentityContext = createContext<any>(null)

 const user: any = null

 export const IdentityProvider = ({children}) => {

    const [state, dispatch] = useReducer(IdentityReducer, user)

    const addUser = (user: string) => {
        dispatch({
            type: "ADD_USER",
            payload: {
                user: user
            }
        })
    }
     return (
         <IdentityContext.Provider value={{
             user: state,
             addUser
         }}>
             {children}
         </IdentityContext.Provider>
     )
 }
 