import PropTypes from "prop-types";
import '../styles/userFeed.css';
import { useEffect, useState } from "react";
import { fetchAllEntries } from "../firebaseOperations";
import LoadingScreen from "./loadingScreen";
import UserPane from "./userPane";
import { UseAuthContext } from "../contexts/authContext";

const UserFeed = (props) => {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false)
    const { user } = UseAuthContext()
    const adminUser = user;

    useEffect(() => {

        async function fetchPosts() {


            setLoading(true)

            const userArray = [];
            //Fetch all the users from the database, and sort them according to the dates.
            const fetchedPosts = await fetchAllEntries( "users", 'username');
            setLoading(false)

            //To make sure that the component is scalable, the users can also be filtered 
            if (props.filter) {
                fetchedPosts.forEach(
                    user => {

                        if (user.id != adminUser.id) {

                            // const user =  await getDoc(post.uid);
                            for (const key in user) {
                                ////console.log("filter: ", props.filter)
                                const element = user[key];

                                if (element == props.filterText && props.filter == key) {
                                    userArray.push(<UserPane key={user.id} id={user.id} userDeets={
                                        {
                                            username: user.username,
                                            id: user.id,
                                            handle: user.handle,
                                            profilePic: user.profilePic,
                                            dateJoined: user.dateJoined,
                                            banned: user.banned,
                                            suspension: user.suspension
                                        }}



                                        postView={false} />)

                                }

                            }

                        }
                    });
            } else {
                fetchedPosts.forEach(
                    user => {
                        ////console.log(user.id)
                        if (user.id != adminUser.id) {

                            userArray.push(<UserPane key={user.id} id={user.id} userDeets={{
                                username: user.username,
                                id: user.id,
                                handle: user.handle,
                                profilePic: user.profilePic,
                                dateJoined: user.dateJoined,
                                banned: user.banned,
                                suspension: user.suspension
                            }} postView={false} />)
                        }
                    });
            }
            setUsers(userArray)
        }
        fetchPosts()
        return;
    }, [])
    return (
        <div className="user-post-feed-box">
            {loading ? <LoadingScreen /> : <></>}

            {users}

        </div>
    );
}

UserFeed.propTypes = {

    filter: PropTypes.string,
    filterText: PropTypes.string

}


export default UserFeed;


