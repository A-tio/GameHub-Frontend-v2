import PropTypes from "prop-types";
import '../styles/Post.css';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import More from '@mui/icons-material/MoreHoriz';
import Comment from '@mui/icons-material/Comment';
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addEntry, deleteEntry, fetchAllEntries, laraveLOG, getEntryById } from "../firebaseOperations";
import { UseAuthContext } from "../contexts/authContext";
import LoadingScreen from "./loadingScreen";
import { useAlertContext } from '../contexts/alertContext';

const Post = (props) => {
    const [upvotes, setUpvotes] = useState([]);
    const [upvoters, setUpvoters] = useState([]);
    const [postUser, setPostUser] = useState({});
    const [postGame, setPostGame] = useState(null);
    const [moreOptions, toggleMoreOptions] = useState(false);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const timeoutIdRef = useRef(null);
    const [profilePic, setProfilePic] = useState();
    const alert = useAlertContext();
    const { user } = UseAuthContext();
    const navigate = useNavigate();

    const resolveAsset = async (fileName) => {
        if (!fileName) return null;
        if (fileName.startsWith?.('http') || fileName.startsWith?.('data:')) {
            return fileName;
        }
        try {
            const asset = await import(fileName);
            return asset.default;
        } catch (error) {
            console.error('Error loading asset:', error);
            return null;
        }
    };

    const tagPillbox = (tags) => {
        if (!Array.isArray(tags) || tags.length === 0) {
            return null;
        }
        return tags.map((tag) => <li key={tag}>{tag}</li>);
    };

    const toDate = (value) => {
        if (!value) return null;
        if (value instanceof Date) return value;
        if (typeof value === 'number') return new Date(value);
        if (typeof value === 'string') {
            const parsed = new Date(value);
            return Number.isNaN(parsed.getTime()) ? null : parsed;
        }
        if (value?.seconds) return new Date(value.seconds * 1000);
        return null;
    };

    const timeAgo = (value) => {
        const date = toDate(value);
        if (!date) return '---';
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
        return 'just now';
    };

    const deletePost = async (e) => {
        e.stopPropagation();
        setDeleting(true);
        try {
            await deleteEntry("posts", props.postDeets.id);
            alert.success("Delete successful!");
            laraveLOG(`User ID ${user ? `(@${user.handle})${user.id}` : "guest"} deleted post ID ${props.postDeets.id}`);
            navigate('/home');
        } catch (error) {
            console.error(error);
            alert.error("Delete failed");
        } finally {
            setDeleting(false);
        }
    };

    const upvotePost = async (e, upvoted) => {
        e.stopPropagation();
        if (!user) {
            navigate("/login");
            return;
        }
        if (!upvoted) {
            laraveLOG(`User ID ${user ? `(@${user.handle})${user.id}` : "guest"} upvoted post ID ${props.postDeets.id}`);
            await addEntry(`posts/${props.postDeets.id}/reactions`, {
                createDate: new Date(),
                reactType: 1,
                userID: user.id,
            });
        } else {
            laraveLOG(`User ID ${user ? `(@${user.handle})${user.id}` : "guest"} removed upvote on post ID ${props.postDeets.id}`);
            const index = upvoters.indexOf(user.id);
            if (index >= 0) {
                await deleteEntry(`posts/${props.postDeets.id}/reactions`, upvotes[index].id);
            }
        }
        fetchUpvotes();
    };

    const fetchUpvotes = async () => {
        const fetchedReactions = await fetchAllEntries(`posts/${props.postDeets.id}/reactions`, 'createDate');
        setUpvotes(fetchedReactions);
        setUpvoters(fetchedReactions.map((reaction) => reaction.userID));
    };

    const getUserDeets = async (userId) => {
        if (!userId) return;
        const entry = await getEntryById('users', typeof userId === 'string' ? userId : userId?.id);
        if (!entry) return;
        resolveAsset(entry.profilePic).then(setProfilePic);
        setPostUser({ username: entry.username, handle: entry.handle, profilePic: entry.profilePic, id: entry.id });
    };

    const getGameDeets = (gameData) => {
        setPostGame(gameData ?? null);
    };

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            setLoading(true);
            try {
                await getUserDeets(props.postDeets.posterId ?? props.postDeets.poster);
                getGameDeets(props.postDeets.game);
                await fetchUpvotes();
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, [props.postDeets.id, props.postDeets.posterId, props.postDeets.poster, props.postDeets.game]);

    const startTimeout = () => {
        timeoutIdRef.current = setTimeout(() => {
            toggleMoreOptions(false);
        }, 3000);
    };

    const clearMyTimeout = () => {
        if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current);
        }
    };

    return (
        <>
            {loading || deleting ? <LoadingScreen /> : null}
            <div className="post-box" onClick={() => {
                laraveLOG(`User ID ${user ? `(@${user.handle})${user.id}` : "guest"} opened post ID ${props.postDeets.id}`);
                navigate(`/postView?postId=${props.postDeets.id}`);
            }}>
                <div className="post-header post-child">
                    <div className="user-box">
                        <div
                            className="profile-image-container"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (postUser.id) {
                                    laraveLOG(`User ID ${user ? `(@${user.handle})${user.id}` : "guest"} opened profile ID ${postUser.id}`);
                                    navigate(`/profile?userId=${postUser.id}`);
                                }
                            }}
                        >
                            <img src={profilePic ?? postUser.profilePic ?? ''} alt="" />
                        </div>
                        <div className="post-stats-container">
                            <div className="upvotes" onClick={(e) => upvotePost(e, upvoters.includes(user?.id))}>
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
                                                fill={upvoters.includes(user?.id) ? "#75f94c" : "#969696"}
                                            />
                                        </g>
                                    </g>
                                </svg>
                                <p>{upvotes.length > 0 ? upvotes.length : ""}</p>
                            </div>
                            <div className="comments">
                                <Comment />
                                <p>{props.postDeets.comments ?? ""}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="post-content-box post-child">
                    <div className="row">
                        <div
                            className="profile-details-container"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (postUser.id) {
                                    navigate(`/profile?userId=${postUser.id}`);
                                }
                            }}
                        >
                            <h3>
                                <p>{postUser.username ?? "sampleUser"}</p>
                                <p className="time">{timeAgo(props.postDeets.postDate)}</p>
                            </h3>
                            <p>@{postUser.handle ?? "sampleHandle"}</p>
                        </div>
                        {user?.id === postUser.id ? (
                            <div className="more-options-container">
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleMoreOptions((value) => !value);
                                        startTimeout();
                                    }}
                                >
                                    <More />
                                </div>
                                {moreOptions ? (
                                    <div
                                        className="more-options-box"
                                        onMouseEnter={() => clearMyTimeout()}
                                        onMouseLeave={() => startTimeout()}
                                    >
                                        <ul>
                                            <li onClick={() => navigate(`/dashboard/postEdit?postId=${props.postDeets.id}`)}>
                                                <Edit />
                                                <p>Edit Post</p>
                                            </li>
                                            <li onClick={deletePost}>
                                                <Delete />
                                                <p>Delete Post</p>
                                            </li>
                                        </ul>
                                    </div>
                                ) : null}
                            </div>
                        ) : null}
                    </div>

                    <div className="post-title">
                        <div className="post-title-child">
                            <div className="title-and-game">
                                <h2
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/postView?postId=${props.postDeets.id}`);
                                    }}
                                >
                                    {props.postDeets.title ?? "This is a sample post title"}
                                </h2>
                                <h4>{postGame ? `Game: ${postGame.label ?? postGame.name}` : ""}</h4>
                            </div>
                        </div>
                        <div className="tags-container">
                            <ul className="tag-list">
                                {tagPillbox(props.postDeets.tags)}
                            </ul>
                        </div>
                    </div>

                    <div className="post-content">
                        <p>
                            {props.postDeets.body ??
                                "Donec vestibulum efficitur cursus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur mi arcu, dignissim a gravida id, dignissim non magna."}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

Post.propTypes = {
    postDeets: PropTypes.object,
    postView: PropTypes.bool,
};

export default Post;


