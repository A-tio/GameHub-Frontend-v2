import PropTypes from "prop-types";
import '../styles/trendingFeed.css';
import { useEffect, useState } from "react";
import { fetchAllEntries, getEntryById } from "../firebaseOperations";
import LoadingScreen from "./loadingScreen";
import { useNavigate } from "react-router-dom";
import ForwardOutlinedIcon from '@mui/icons-material/ForwardOutlined';
import InsertCommentOutlinedIcon from '@mui/icons-material/InsertCommentOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';

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
        { label: 'year', seconds: 31536000 },
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

const calculateScore = (targetDate) => {
    const now = new Date();
    const target = toDate(targetDate);
    if (!target) return 0;
    const distance = Math.abs((target - now) / (1000 * 60 * 60 * 24));
    return 1 / (1 + distance);
};

const resolvePosterId = (post) => {
    const candidate = post.posterId ?? post.poster ?? post.userRef;
    if (!candidate) return null;
    if (typeof candidate === 'string') return candidate;
    if (candidate?.id) return candidate.id;
    return null;
};

const TrendingFeed = () => {
    const navigate = useNavigate();
    const [postList, setPostList] = useState([]);
    const [rankedPosts, setRankedPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const fetchedPosts = await fetchAllEntries("posts", 'postDate');
            const entries = fetchedPosts.map((post) => ({
                postContent: post,
                user: null,
                comments: [],
                upvotes: [],
                score: 0,
            }));
            setPostList(entries);
        } finally {
            setLoading(false);
        }
    };

    const fetchArrays = async () => {
        if (postList.length === 0) return;
        setLoading(true);
        try {
            const updated = await Promise.all(
                postList.map(async (entry) => {
                    const posterId = resolvePosterId(entry.postContent);
                    const [posterEntry, comments, reactions] = await Promise.all([
                        posterId ? getEntryById('users', posterId) : Promise.resolve(null),
                        fetchAllEntries(`posts/${entry.postContent.id}/comments`, 'createDate'),
                        fetchAllEntries(`posts/${entry.postContent.id}/reactions`, 'createDate'),
                    ]);

                    return {
                        postContent: entry.postContent,
                        user: posterEntry ? { username: posterEntry.username, handle: posterEntry.handle } : entry.user,
                        comments,
                        upvotes: reactions,
                        score: 0,
                    };
                })
            );
            setPostList(updated);
        } finally {
            setLoading(false);
        }
    };

    const displayScores = () => {
        const rankedDraft = postList.map((entry) => {
            let totalScore = 0;
            let latestDate = toDate(entry.postContent.postDate);

            entry.comments.forEach((comment) => {
                totalScore += calculateScore(comment.createDate);
                const commentDate = toDate(comment.createDate);
                if (!latestDate || (commentDate && commentDate > latestDate)) {
                    latestDate = commentDate;
                }
            });

            entry.upvotes.forEach((reaction) => {
                totalScore += calculateScore(reaction.createDate);
                const reactionDate = toDate(reaction.createDate);
                if (!latestDate || (reactionDate && reactionDate > latestDate)) {
                    latestDate = reactionDate;
                }
            });

            return {
                post: entry.postContent,
                score: totalScore,
                commentCount: entry.comments.length,
                upvoteCount: entry.upvotes.length,
                latestUpdate: latestDate ?? toDate(entry.postContent.postDate),
                user: entry.user,
            };
        });

        rankedDraft.sort((a, b) => b.score - a.score);
        setRankedPosts(rankedDraft);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        fetchArrays();
    }, [postList.length]);

    useEffect(() => {
        if (postList.length > 0) {
            displayScores();
        }
    }, [postList]);

    const goToPost = (postId) => {
        navigate(`/postView?postId=${postId}`);
    };

    return (
        <div className="trending-feed-box">
            {loading ? <LoadingScreen /> : null}
            {rankedPosts.map((post, index) => (
                <div className="trending-post-mini-container" key={index}>
                    <div className="trending-title-container">
                        <h3 onClick={() => goToPost(post.post.id)}>{post.post.title}</h3>
                        <p>by: {post.user ? post.user.username : ""} - Last update: {timeAgo(post.latestUpdate)}</p>
                    </div>
                    <div className="trending-row">
                        <div className="trending-column">
                            <div className="icon-container">
                                <ForwardOutlinedIcon className="icon-up" />
                                <p>{post.upvoteCount}</p>
                            </div>
                            <div className="icon-container">
                                <InsertCommentOutlinedIcon className="icon-comment" />
                                <p>{post.commentCount}</p>
                            </div>
                        </div>
                        <p><HistoryOutlinedIcon /> Last update: {timeAgo(post.latestUpdate)}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

TrendingFeed.propTypes = {
    filter: PropTypes.string,
    filterText: PropTypes.string,
};

export default TrendingFeed;


