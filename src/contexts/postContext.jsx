import { useContext, useState } from "react";
import { createContext } from "react";
import PropTypes from "prop-types";


const PostFeedContext = createContext({

    post: null,

});

export const PostFeedProvider = ({ children }) => {
    

    const [post, _setPost] = useState(() => {
        const storedUser = localStorage.getItem('SELECTED_POST');
        return storedUser ? JSON.parse(storedUser) : "";
    });

    const setPost = (post) => {
        _setPost(post)
        if (post) {
            localStorage.setItem('SELECTED_POST',JSON.stringify(post));
        } else {
            localStorage.removeItem('SELECTED_POST');
        }
    }
    ////console.log(post)
    // localStorage.removeItem('USER_CREDS');
    // localStorage.removeItem('ACCESS_TOKEN');

  
    return (

        <PostFeedContext.Provider value = {{ 
            post,
            setPost
    
         }}>
         {children}
         </PostFeedContext.Provider>

    );
 };
 
PostFeedProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export const UsePostFeedContext = () => useContext(PostFeedContext);
