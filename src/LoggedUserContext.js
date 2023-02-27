import React, {createContext, useState} from 'react';
const LoggedUserContext = createContext();

function LoggedUserProvider(props){
    const [loggedUser, setLoggedUser] = useState('ola');
    return(
            <LoggedUserContext.Provider value = {{loggedUser, setLoggedUser}}>
                {props.children}
            </LoggedUserContext.Provider>    

    )
};

export {LoggedUserContext, LoggedUserProvider};