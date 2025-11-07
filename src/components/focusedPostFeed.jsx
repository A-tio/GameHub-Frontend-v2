import PropTypes from "prop-types";
import '../styles/PostFeed.css';
import Post from "./post";
import { useEffect, useState } from "react";
import { fetchAllEntries } from "../firebaseOperations";
import LoadingScreen from "./loadingScreen";

const FocusedPostFeed = (props) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const fallbackPosts = [
        {
            id: 'sample-recent-1',
            title: 'Sample Strategy Build',
            body: 'Try this co-op strat to clear endgame raids faster.',
            tags: ['Strategy', 'Co-op'],
            postDate: new Date(Date.now() - 4 * 60 * 60 * 1000),
            posterId: props.uid ?? 'sample-user',
            comments: 3,
        },
        {
            id: 'sample-recent-2',
            title: 'Weekend Event Checklist',
            body: 'Don’t miss these limited missions before the reset.',
            tags: ['Events', 'Guide'],
            postDate: new Date(Date.now() - 9 * 60 * 60 * 1000),
            posterId: props.uid ?? 'sample-user',
            comments: 1,
        },
    ];

    useEffect(() => {
        const resolvePosterId = (post) => {
            const candidate = post.posterId ?? post.poster ?? post.userRef;
            if (!candidate) return null;
            if (typeof candidate === 'string') return candidate;
            if (candidate?.id) return candidate.id;
            return null;
        };

        const fetchPosts = async () => {
            setLoading(true);
            try {
                const fetchedPosts = await fetchAllEntries("posts", 'postDate');
                const filtered = fetchedPosts.filter((post) => resolvePosterId(post) === props.uid);
                const postArray = (filtered.length > 0 ? filtered : fallbackPosts).map((post) => ({
                    id: post.id,
                    post: <Post key={post.id} id={post.id} postDeets={{ ...post }} postView={false} />,
                }));
                setPosts(postArray);
            } finally {
                setLoading(false);
            }
        };

        if (props.uid) {
            fetchPosts();
        }
    }, [props.uid]);

    return (
        <div className="post-feed-box">
            {loading ? <LoadingScreen /> : null}
            {posts.length >= 1 ? posts.map((post) => post.post) : <>No posts found.</>}
        </div>
    );
};

FocusedPostFeed.propTypes = {
    uid: PropTypes.string,
};

export default FocusedPostFeed;


