import PropTypes from "prop-types";
// import { useNavigate } from "react-router-dom";
import "../styles/CommentFeed.css";
// import { UseAuthContext } from "../contexts/authContext";
// import { useEffect, useState} from "react";
// import { searchEntry } from "../firebaseOperations";
import Comment from "./comment";
import { useEffect, useRef, useState } from "react";
import { addEntry, fetchAllEntries, laraveLOG } from "../firebaseOperations";
import { UseAuthContext } from "../contexts/authContext";
import { useAlertContext } from "../contexts/alertContext";
import { db } from "../fireBase";
import SendIcon from "@mui/icons-material/Send";

const CommentFeed = (props) => {
  const [comments, setComments] = useState([]);
  const { user } = UseAuthContext();
  const [loading, setLoading] = useState();
  const newCommentRef = useRef();
  const [text, setText] = useState("");
  const alert = useAlertContext();

  async function fetchComments() {
    const postArray = [];
    const fetchedComments = await fetchAllEntries(
      `posts/${props.postId}/comments`,
      "createDate"
    );
    fetchedComments.forEach((comment) => {
      // const user =  await getDoc(comment.uid);
      postArray.push(
        <Comment
          key={comment.id}
          id={comment.id}
          CommentDeets={{
            postId: props.postId,
            body: comment.commentContent,
            postDate: comment.createDate,
            userRef: comment.uid,
            commentRef: `posts/${props.postId}/comments/${comment.id}`,
            // userName:user.name,
            // userHandle: user.handle
          }}
        />
      );
    });
    setComments(postArray);
  }
  async function postComment() {
    if (user != "") {
      setLoading(true);

      laraveLOG(`User ID ${
        user ? `(@${user.handle})` + user.id : "guest"
      } has posted a comment on post REFID${
        props.postId
      } with the following content: \n 
                ${newCommentRef.current.value}`);
      await addEntry(`posts/${props.postId}/comments`, {
        uid: doc(db, "users", user.id),
        createDate: new Date(new Date()),
        commentContent: newCommentRef.current.value,
      });
    } else {
      alert.error("Log in first before commenting!");
    }
    setText("");
    setLoading(false);

    fetchComments();
  }

  useEffect(() => {
    fetchComments();
    return;
  }, []);

  return (
    <div className="post-feed-box">
      <p>Comments - {comments.length}</p>
      <div className="create-new-comment">
        <textarea
          type="text"
          ref={newCommentRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment"
          id="newComment"
        />
        <button
          onClick={() => postComment()}
          disabled={loading || !text.length > 0}
        >
          {" "}
          {user.username ? <SendIcon /> : "Log in"}
        </button>
      </div>
      <hr />
      {comments}
    </div>
  );
};

CommentFeed.propTypes = {
  postId: PropTypes.string,
};

export default CommentFeed;
