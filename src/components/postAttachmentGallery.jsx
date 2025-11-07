import PropTypes from "prop-types";
// import { useNavigate } from "react-router-dom";
// import { UseAuthContext } from "../contexts/authContext";
// import { useEffect, useState} from "react";
// import { searchEntry } from "../firebaseOperations";
import '../styles/PostAttachmentGallery.css';  


const PostAttachmentGallery = (props) => {

    // const {user } = UseAuthContext();
    // const navigate = useNavigate();
    // const [posts, setPosts] = useState();

    // const goToPost = (postID) => {

    //     navigate(`/posts/${postID}`)
        
    // }

    // const goToUser = () =>{

    // }

    // const upvote  = (postID) => {

    // }

    // const editPost = (postID) => {

    // }

    // const getPosts = async () => {

    //     setPosts(await searchEntry(user.id, "posts","status","==","active"));

    // }
        
//     useEffect( () => {
//     getPosts();
//     ////console.log(user);
//     return;
//    },[])


    return (
        <div className="post-box">


            
        </div>
    );
}

PostAttachmentGallery.propTypes = {

    attachMentArray: PropTypes.array

}


export default PostAttachmentGallery;
    
    
