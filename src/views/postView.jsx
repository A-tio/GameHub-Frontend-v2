import "../styles/PostPage.css";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { UsePostFeedContext } from "../contexts/postContext";
import Post from "../components/post";
import CommentFeed from "../components/commentFeed";
import { getEntryById } from "../firebaseOperations";
import MiniLoadingScreen from "../components/mini-loadingScreen";

function PostView() {
  const { setPost } = UsePostFeedContext();
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null); // Default to `null` for clarity
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const postId = searchParams.get("postId");

  useEffect(() => {
    if (!postId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const post = await getEntryById("posts", postId);
        if (!post || cancelled) {
          return;
        }
        setSelectedPost(post);
        setSelectedGame(post.game ?? null);
        setPost(post);
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setSelectedPost(null);
        }
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
  }, [postId]);

  // Render
  return loading || !selectedPost ? (
    <MiniLoadingScreen />
  ) : (
    <div className="PostView">
      <Post
        key={selectedPost.id}
        id={selectedPost.id}
        postDeets={selectedPost}
        postView
      />

      {selectedGame ? (
        <div className="game-pic-page">
          <h3>{selectedGame.label ?? selectedGame.name}</h3>
          <div className="image-container">
            <img className="poster-img" src={selectedGame.imageURL} alt="" />
          </div>
        </div>
      ) : null}

      <CommentFeed postId={selectedPost.id} />
    </div>
  );
}

export default PostView;
