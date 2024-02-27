
import { useEffect, useState } from "react";
import { Button } from "../common/Button";
import store from "../../store";
import { useSelector } from "react-redux";
import { updateUser } from "../../api/users/users";
import { getUser } from "../../api/users/users";



export const SettingsCard = () => {
    
    const getNotificationState = getUser()
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState( useSelector((state) => state.user))
    // change boolean to activate set username/email etc
   // const unsubscribe = store.subscribe(handleSaveNotifications)
    

    const [enableNotifications, setEnableNotifications] = useState(false)
    const [frequency, setFrequency] = useState("")
    const [disabled, setDisabled] = useState(false)

    
 

    
   
    function select(state) {
        return state.user
    }
    
    // let currentValue
    
    // function handleChange() {
    //     let previousValue = currentValue
    //     currentValue = select(store.getState())
    
    //     if (previousValue !== currentValue) {
    //         setUser(currentValue)
    //     }
    // }
    function handleNotificationChange() {
               setEnableNotifications(!enableNotifications)
               //console.log(allowNotifications)

    }
    function handleSelectFreq(e) {
            // code/logic to follow
            console.log("this: " , e.target.value)
           setFrequency(e.target.value)
            
    }


    // have notifcations toggle hide/show also then push ok?

    async function handleSaveNotifications() {
        // console.group("notifications saved", allowNotifications)
        const user = select(store.getState()) // gets only username
        const updatedNotifications = {
            data: {
                notifications: {
                    recommendations: {
                        enabled: enableNotifications,
                        frequency: frequency
                    }
                    
                }
            }
        };
    
        const response = await updateUser(updatedNotifications, user.username)
       // const userData = await getUser()
        //console.log("this ", userData)
        //setNotificationState(userData.data.notifications.recommendations)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("useeffect firing too much")
              setLoading(true);
              const userData = await getUser();
              //console.log(userData.data.notifications.recommendations)
             setEnableNotifications(userData.data.notifications.recommendations.enabled);
             setFrequency(userData.data.notifications.recommendations.frequency)
              setLoading(false);
             
            } catch (error) {
              console.error("Error fetching user data:", error);
              setLoading(false);
            }
          };
      fetchData()
    }, [])
    

    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex flex-col w-full flex-grow p-4 overflow-scroll max-h-[90%] space-y-2 max-w-[400px]">
               
                <div className="flex text-xs flex-row my-4">
                    <label htmlFor="allow-notifications">Allow notifications</label>
                    <input checked={enableNotifications} onChange={() => handleNotificationChange()} className="p-2 ml-4 h-4 w-4 border border-slate-300 rounded" type="checkbox"></input>
                </div>
                {enableNotifications && <div className="flex text-xs flex-row my-4">
                    <label htmlFor="notification-frequency mt-2">Frequency</label>
                    <select value={frequency} onChange={(e) => handleSelectFreq(e)} id="notification-frequency" className="p-2 pl-3 ml-2 h-3 w-15 border border-slate-300 rounded" type="checkbox">
                        <option  value="60">60 days</option>
                        <option  value="30">30 days</option>
                    </select>
                </div> }
                <div className="flex max-w-[400px]">
                    <Button onClick={() => handleSaveNotifications()} className="cursor-not-allowed" text="Save" />
                </div>

            </div>
        </div>
    )

}




// api calls


import config from '../../config/index'
import store from "../../store";
import { update } from "../../store/user";


const { API_ENDPOINT, APP_ID } = config;

const payloadWithId = (payload) => { return { id_app: APP_ID, ...payload  }}

const getHeaders = () => {
    const token = localStorage.getItem('s:Token');

    const headers = {
        'Authorization' : token === null ? '' : `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept' : 'application/json'                    
    }

    return headers;
}

export const updateUser = async (payload, username) => {
    try {
        const response = await fetch(`${API_ENDPOINT}/users/update`, {
            method: 'PUT',
            headers: {
                ...getHeaders(),
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify({
                application: APP_ID,
                user: {
                    username, ...payload
                }
            })
        });

        console.log('API Response:', response);
        console.log("this," , payload)

        if (!response.ok) {
            console.error('Bad Request:', response.status, response.statusText);
        } else {
            // Assuming the API response contains the updated user data
            const responseData = await response.json();
            const updatedUserData = responseData.user;
            const mergedUserData = { ...payload, ...updatedUserData };

            
            //store.dispatch(update(mergedUserData));
            console.log(mergedUserData)

        
        }

        return response;
    } catch (error) {
        console.error('Error while updating user:', error);
        return error;
    }
};




export const getUser = async () => {
    try {
        const response = await fetch(`${API_ENDPOINT}/users/get`, {
            method: 'GET',
            headers: {
                ...getHeaders(),
                'Content-Type': 'application/json', 
            },
           
        });

        if (!response.ok) {
            console.error('Bad Request:', response.status, response.statusText);
        } else {
            // Assuming the API response contains the updated user data
            const responseData = await response.json();
            const updatedUserData = responseData.payload
            

            // // Dispatch the action to update the user data in the Redux store
            // //store.dispatch(update(mergedUserData));
            // console.log(updatedUserData)
            //console.log(updatedUserData.data)
            return updatedUserData
        
        }

        return response;
    } catch (error) {
        console.error('Error while updating user:', error);
        return error;
    }
};

