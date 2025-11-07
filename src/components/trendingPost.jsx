import PropTypes from "prop-types";
import '../styles/Post.css';
import Comment from '@mui/icons-material/Comment';
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addEntry, deleteEntry, fetchAllEntries, getEntryById } from "../firebaseOperations";
import { UseAuthContext } from "../contexts/authContext";
import LoadingScreen from "./loadingScreen";
const Post = (props) => {
    const [upvotes, setUpvotes] = useState([]);
    const [upvoters, setUpvoters] = useState([]);
    const [postUser, setpostUser] = useState({});
    const [moreOptions, toggleMoreOptions] = useState(false);
    const [loading, setLoading] = useState(false);
    const timeoutIdRef = useRef(null);
    const [profilePic, setprofilePic] = useState();
    const { user } = UseAuthContext()
    // ////console.log(props.postDeets)
    const navigate = useNavigate();

    const importAsset = async (fileName) => {
        try {
            /* @vite-ignore */
const asset = await import(fileName); // Adjust the path to match your project structure
            ////console.log(asset)
            return asset.default; // Webpack and similar bundlers expose the file path as the default export
        } catch (error) {
            console.error('Error loading asset:', error);
            return null;
        }
    };



    // const [data, setData] = useState();
    // const [postSnapshot, setPostSnapshot] = useState();

    // const goToUser = (postID) => {

    //     navigate(`/posts/${postID}`)

    // }

    // const upvote  = (postID) => {

    // }

    // const editPost = (postID) => {

    // }

    // useEffect(() => {
    //     const unsub = onSnapshot(doc(db, props.postDeets.collectionName, props.postDeets.docId), (doc) => {
    //       if (doc.exists()) {
    //         setData(doc.data());
    //       }
    //     });

    //     return () => unsub(); // Cleanup
    //   }, [props.postDeets.docId, props.postDeets.collectionName ]);


    const tagPillbox = (tags) => {

        if (tags.length > 0) {

            const tagList = [];
            tags.forEach(tag => {
                const tagPill = <li key={tag}>{tag}</li>;
                tagList.push(tagPill);
            });

            return tagList;

        } else return null;

    }

    async function upvotePost(upvoted) {
        if (!user) {
            return;
        }

        if (!upvoted) {
            await addEntry(`posts/${props.postDeets.id}/reactions`, {
                createDate: new Date(),
                reactType: 1,
                userID: user.id,
            });
        } else {
            const index = upvoters.indexOf(user.id);
            if (index >= 0) {
                await deleteEntry(`posts/${props.postDeets.id}/reactions`, upvotes[index].id);
            }
        }

        fetchUpvotes();
    }

    async function fetchUpvotes() {
        const upvoteArray = [];
        const upvotersArray = [];
        const fetchedPosts = await fetchAllEntries(`posts/${props.postDeets.id}/reactions`, 'createDate');
        fetchedPosts.forEach(
            reaction => {
                upvoteArray.push(reaction);
                upvotersArray.push(reaction.userID);
            });
        setUpvoters(upvotersArray);
        setUpvotes(upvoteArray);
    }

    async function getUserDeets(userId) {
        if (!userId) return;
        const docSnap = await getEntryById('users', userId);
        if (!docSnap) {
            return;
        }
        const { username, handle, profilePic } = docSnap;
        if (profilePic?.startsWith?.('http') || profilePic?.startsWith?.('data:')) {
            setprofilePic(profilePic);
        } else if (profilePic) {
            importAsset(profilePic).then(setprofilePic);
        }
        setpostUser({ username, handle, profilePic, id: docSnap.id });
    }

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            setLoading(true);
            await getUserDeets(props.postDeets.posterId ?? props.postDeets.poster);
            await fetchUpvotes();
            if (mounted) {
                setLoading(false);
            }
        };
        load();
        return () => {
            mounted = false;
        };
    }, [props.postDeets.posterId, props.postDeets.poster, props.postDeets.id]);

    function timeAgo(sourceDate) {
        if (!sourceDate) {
            return '---';
        }
        const date = sourceDate instanceof Date ? sourceDate : new Date(sourceDate?.seconds ? sourceDate.seconds * 1000 : sourceDate);
        if (Number.isNaN(date.getTime())) {
            return '---';
        }
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        const intervals = [
            { label: 'second', seconds: 1 },
            { label: 'minute', seconds: 60 },
            { label: 'hour', seconds: 3600 },
            { label: 'day', seconds: 86400 },
            { label: 'month', seconds: 2592000 },
            { label: 'year', seconds: 31536000 }
        ];

        for (let i = intervals.length - 1; i >= 0; i--) {
            const interval = intervals[i];
            const intervalValue = Math.floor(diffInSeconds / interval.seconds);

            if (intervalValue > 0) {
                return `${intervalValue} ${interval.label}${intervalValue > 1 ? 's' : ''} ago`;
            }
        }

        return 'just now';  // For cases like 0 seconds difference
    }

    function goToPost() {


        if (!props.postView) {
            navigate(`/postView?postId=${props.postDeets.id}`)
        } else {
            ////console.log("already on post")
        }



    }


    
    // const startTimeout = () => {
    //     timeoutIdRef.current = setTimeout(() => {
    //       toggleMoreOptions(false)
    //     }, 3000);
    //   };
    
    //   const clearMyTimeout = () => {
    //     if (timeoutIdRef.current) {
    //       clearTimeout(timeoutIdRef.current);
    //       ////console.log("Timeout cleared!");
    //     }
    //   };
    return (
        <div className="post-box" onClick={() => { goToPost() }}>

            {loading ? <LoadingScreen /> : <></>}

            <div className="post-header post-child">
                <div className="user-box">
                    <div className="profile-image-container"

                        onClick={(e) => { e.stopPropagation(); navigate(`/profile?userId=${postUser.id}`) }}
                    >
                        <img src={profilePic ?? postUser.profilePic ?? ''} alt="" />
                    </div>
                    <div className="post-stats-container">
                        <div className="upvotes" onClick={(e) => { e.stopPropagation(); upvotePost(upvoters.includes(user.id)) }}>
                            <svg
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 429.658 429.658"
                                width="24px"
                                height="24px"
                            >
                                <g>
                                    <g>
                                        <path
                                            d="M235.252,13.406l-0.447-0.998c-3.417-7.622-11.603-12.854-19.677-12.375l-0.3,0.016l-0.302-0.016
                    C214.194,0.011,213.856,0,213.524,0c-7.706,0-15.386,5.104-18.674,12.413l-0.452,0.998L13.662,176.079
                    c-6.871,6.183-6.495,12.657-4.971,16.999c2.661,7.559,10.361,13.373,18.313,13.82l1.592,0.297c0.68,0.168,1.356,0.348,2.095,0.427
                    c23.036,2.381,45.519,2.876,64.472,3.042l5.154,0.048V407.93c0,11.023,7.221,15.152,11.522,16.635l0.967,0.33l0.77,0.671
                    c3.105,2.717,7.02,4.093,11.644,4.093h179.215c4.626,0,8.541-1.376,11.639-4.093l0.771-0.671l0.965-0.33
                    c4.307-1.482,11.532-5.611,11.532-16.635V210.706l5.149-0.048c18.961-0.17,41.446-0.666,64.475-3.042
                    c0.731-0.079,1.407-0.254,2.082-0.422l1.604-0.302c7.952-0.447,15.65-6.262,18.312-13.82c1.528-4.336,1.899-10.811-4.972-16.998
                    L235.252,13.406z M344.114,173.365c-11.105,0.18-22.216,0.254-33.337,0.254c-5.153,0-9.363,1.607-12.507,4.768
                    c-3.372,3.4-5.296,8.48-5.266,13.932l0.005,0.65l-0.157,0.629c-0.437,1.767-0.64,3.336-0.64,4.928v194.001H137.458V198.526
                    c0-1.597-0.201-3.161-0.638-4.928l-0.157-0.629l0.005-0.65c0.031-5.456-1.892-10.537-5.271-13.937
                    c-3.141-3.161-7.353-4.763-12.507-4.768c-11.124,0-22.224-0.074-33.337-0.254l-13.223-0.218L214.834,44.897l142.503,128.249
                    L344.114,173.365z"
                                            fill={upvoters.includes(user.id) ? "#75f94c" : "#969696"}
                                        />
                                    </g>
                                </g>
                            </svg>

                            <p>{upvotes.length > 0 ? upvotes.length : ""}</p>
                        </div>
                        <div className="comments">
                            <Comment />
                            <p>{props.postDeets.comments ? props.postDeets.comments : ""}</p>
                        </div>
                    </div>

                </div>


            </div>
            <div className="post-content-box post-child">

                <div className="row">
                    <div className="profile-details-container"

                        onClick={(e) => { e.stopPropagation(); navigate(`/profile?userId=${postUser.id}`) }}
                    >
                        <h3>
                            <p>{postUser.username ? postUser.username : "sampleUser"}</p>
                            <p className="time" title={"joe nuts"}> {props.postDeets.postDate ? timeAgo(props.postDeets.postDate) : "---"}</p>
                        </h3>
                        <p>{postUser.handle ? postUser.handle : "sampleHandle"}</p>
                    </div>
                    <div className="more-options-container">

                        {/* <div className="" 
                        
                        onClick={(e) => { 
                            e.stopPropagation(); 
                            toggleMoreOptions(!moreOptions) 
                            startTimeout()}}
                            
                            >

                            <More />
                        </div> */}
                        {/* <div className="more-options-box" 
                        
                        onMouseEnter={()=> { clearMyTimeout()}}
                        onMouseLeave={()=> startTimeout()}

                        
                        style={{
                            display: moreOptions ? "block" : "none"
                        }}>
                            <ul>
                                <li 

                                onClick={() => navigate(`/dashboard/postEdit?postId=${props.postDeets.id}`)}
                                style={{
                                    display: postUser.id == user.id ? "flex" : "none"
                                }}
                                >  
                                    <Edit />
                                    <p>Edit Post</p>
                                </li>
                                <li
                                style={{
                                    display: postUser.id == user.id ? "flex" : "none"
                                }}
                                >
                                    <Delete />
                                    <p>Delete Post</p>
                                </li>
                                <li
                                style={{
                                    display: postUser.id != user.id ? "flex" : "none"
                                }}
                                >
                                    <Report />
                                    <p>Report Post</p>
                                    
                                </li>
                            </ul>
                        </div> */}

                    </div>
                </div>

                <div className="post-title">

                    <div className="post-title-child">
                        <h2 onClick={() => goToPost()}  >{props.postDeets.title ? props.postDeets.title : "This is a sample post title"}  </h2>

                    </div>


                    <div className="tags-container">
                        <ul className="tag-list">
                            {tagPillbox(props.postDeets.tags ? props.postDeets.tags : ["->VAs", "ASMR Newbie", "Ohogoe", "Lovey-dovey"])}
                        </ul>
                    </div>
                </div>



                <div className="post-content">
                    <p> {props.postDeets.body ? props.postDeets.body : "Donec vestibulum efficitur cursus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur mi arcu, dignissim a gravida id, dignissim non magna. Nunc cursus nunc eget porta luctus. Praesent interdum erat id ultrices molestie. Aenean varius felis non dolor commodo, eget cursus ante scelerisque. Nullam nec magna volutpat, dapibus odio non, tempor tellus. Suspendisse sit amet bibendum ipsum. Suspendisse tempus purus nec eleifend volutpat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas."} </p>
                </div>
                <div className="post-attachment">

                </div>
            </div>



        </div>
    );
}

Post.propTypes = {

    postDeets: PropTypes.object,
    postView: PropTypes.bool

}


export default Post;


