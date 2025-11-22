import PropTypes from "prop-types";
// import { useNavigate } from "react-router-dom";
import "../styles/comment.css";
// import { useEffect, useState} from "react";
// import { onSnapshot, doc } from "firebase/firestore";
// import { db } from "../fireBase";

import Replies from "@mui/icons-material/Reply";
import Upvote from "@mui/icons-material/ArrowUpwardTwoTone";
import { useEffect, useRef, useState } from "react";
import {
  addEntry,
  deleteEntry,
  fetchAllEntries,
  laraveLOG,
} from "../firebaseOperations";
import { UseAuthContext } from "../contexts/authContext";
import { db } from "../fireBase";
import { useNavigate } from "react-router-dom";
const Comment = (props) => {
  const [CommentUser, setCommentUser] = useState({});
  const [upvoters, setUpvoters] = useState([]);
  const [replies, setReplies] = useState([]);
  const [upvotes, setUpvotes] = useState([]);
  const [replyEntry, setText] = useState("");
  const [loading, setLoading] = useState();
  const [showReply, setShowReply] = useState(false);
  const { user } = UseAuthContext();
  const [profilePic, setprofilePic] = useState();

  const newCommentRef = useRef();
  const navigate = useNavigate();

  // ////console.log(props.CommentDeets)

  const importAsset = async (fileName) => {
    try {
      //This is used to fetch the preset profile pictures from the assets.
      /* @vite-ignore */
      /* @vite-ignore */
      const asset = await import(fileName); // Adjust the path to match your project structure
      ////console.log(asset)
      return asset.default; // Webpack and similar bundlers expose the file path as the default export
    } catch (error) {
      console.error("Error loading asset:", error);
      return null;
    }
  };

  async function upvoteComment(upvoted) {
    event.stopPropagation(); // Stops the event from propagating to parent elements
    ////console.log("upvote intiated")

    if (user.id == null || user == null) {
      navigate("/login");
    }

    if (!upvoted) {
      laraveLOG(
        `User ID ${
          user ? `(@${user.handle})` + user.id : "guest"
        } has upvoted on comment REFID  ${props.CommentDeets.commentRef}`
      );

      await addEntry(`${props.CommentDeets.commentRef}/reactions`, {
        createDate: new Date(new Date()),
        reactType: 1,
        userID: user.id,
        userRef: doc(db, "users", user.id),
      });
    } else {
      laraveLOG(
        `User ID ${
          user ? `(@${user.handle})` + user.id : "guest"
        } has revoked their upvote on comment REFID  ${
          props.CommentDeets.commentRef
        }`
      );

      await deleteEntry(
        `${props.CommentDeets.commentRef}/reactions`,
        upvotes[upvoters.indexOf(user.id)].id
      );
    }

    ////console.log("upvote completed")
    fetchUpvotes();
  }

  async function fetchReplies() {
    const replyArray = [];
    const fetchedPosts = await fetchAllEntries(
      `${props.CommentDeets.commentRef}/replies`,
      "createDate"
    );
    fetchedPosts.forEach((reply) => {
      // const user =  await getDoc(reply.uid);
      replyArray.push(
        <Comment
          key={reply.id}
          id={reply.id}
          CommentDeets={{
            body: reply.commentContent,
            postDate: reply.createDate,
            userRef: reply.uid,
            commentRef: `${props.CommentDeets.commentRef}/replies/${reply.id}`,
            // userName:user.name,
            // userHandle: user.handle
          }}
        />
      );

      // ////console.log(reply)
    });
    setReplies(replyArray);
  }

  async function fetchUpvotes() {
    ////console.log("foobar")
    const upvoteArray = [];
    const upvotersArray = [];

    const fetchedPosts = await fetchAllEntries(
      `${props.CommentDeets.commentRef}/reactions`,
      "createDate"
    );
    fetchedPosts.forEach((reaction) => {
      // const user =  await getDoc(reply.uid);
      upvotersArray.push(reaction.userID);
      upvoteArray.push(reaction);
    });
    setUpvoters(upvotersArray);
    setUpvotes(upvoteArray);
  }

  async function getUserDeets(uidDoc) {
    const docSnap = await getDoc(uidDoc);

    if (!docSnap.exists()) {
      ////console.log("No such document!");
      return null;
    }
    const { username, handle, profilePic } = docSnap.data();
    //   ////console.log("comment title:", props.CommentDeets.userRef);
    ////console.log("uname:", username);
    ////console.log("handle:", handle);
    importAsset(profilePic).then(setprofilePic);

    setCommentUser({ username: username, handle: handle });
  }

  useEffect(() => {
    getUserDeets(props.CommentDeets.userRef);
    fetchReplies();
    fetchUpvotes();
  }, []);

  function timeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString.seconds * 1000);
    // ////console.log(now, date)
    const diffInSeconds = Math.floor((now - date) / 1000);

    const intervals = [
      { label: "second", seconds: 1 },
      { label: "minute", seconds: 60 },
      { label: "hour", seconds: 3600 },
      { label: "day", seconds: 86400 },
      { label: "month", seconds: 2592000 },
      { label: "year", seconds: 31536000 },
    ];

    for (let i = intervals.length - 1; i >= 0; i--) {
      const interval = intervals[i];
      const intervalValue = Math.floor(diffInSeconds / interval.seconds);

      if (intervalValue > 0) {
        return `${intervalValue} ${interval.label}${
          intervalValue > 1 ? "s" : ""
        } ago`;
      }
    }

    return "just now"; // For cases like 0 seconds difference
  }

  async function postReply() {
    if (user != "") {
      setLoading(true);

      laraveLOG(`User ID ${
        user ? `(@${user.handle})` + user.id : "guest"
      } has posted a reply comment REFID  ${
        props.CommentDeets.commentRef
      } with the following content: \n 
                ${replyEntry}`);
      await addEntry(`${props.CommentDeets.commentRef}/replies`, {
        uid: doc(db, "users", user.id),
        createDate: new Date(new Date()),
        commentContent: replyEntry,
      });
    } else {
      alert.error("Log in first before commenting!");
    }
    setLoading(false);
    setText("");
    fetchReplies();
  }
  const replyText = () => (showReply ? "Hide" : "Show");

  return (
    <div className="Comment-box">
      <div className="Comment-header Comment-child">
        <div className="comment-user-box">
          <div
            className="profile-image-container"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/profile?userId=${props.CommentDeets.id}`);
            }}
          >
            <img
              src={props.CommentDeets.profilePic ? profilePic : profilePic}
              alt=""
            />
          </div>
          <div className="username-container">
            <p>
              <strong>
                {CommentUser.username ? CommentUser.username : "sampleUser"}
              </strong>
            </p>
            <p>@{CommentUser.handle ? CommentUser.handle : "sampleHandle"}</p>
          </div>
          <div className="time-ago-container">
            <p title={new Date(props.CommentDeets.postDate.seconds * 1000)}>
              {props.CommentDeets.postDate
                ? timeAgo(props.CommentDeets.postDate)
                : "---"}
            </p>
          </div>
        </div>
      </div>
      <div className="Comment-content-box Comment-child ">
        <div className="Comment-content">
          <p>
            {" "}
            {props.CommentDeets.body
              ? props.CommentDeets.body
              : "Donec vestibulum efficitur cursus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur mi arcu, dignissim a gravida id, dignissim non magna. Nunc cursus nunc eget porta luctus. Praesent interdum erat id ultrices molestie. Aenean varius felis non dolor commodo, eget cursus ante scelerisque. Nullam nec magna volutpat, dapibus odio non, tempor tellus. Suspendisse sit amet bibendum ipsum. Suspendisse tempus purus nec eleifend volutpat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas."}{" "}
          </p>
        </div>
        <div className="Comment-stats-container ">
          <div
            className="upvotes upvote2"
            onClick={(e) => {
              e.stopPropagation();
              upvoteComment(upvoters.includes(user.id));
            }}
          >
            <Upvote />
            <p>
              {Object.keys(upvotes).length > 0
                ? Object.keys(upvotes).length
                : ""}
            </p>
          </div>
          <div
            className="comments"
            title="Show the replies to this comment"
            onClick={() => setShowReply(!showReply)}
          >
            <Replies />
            <p>
              {Object.keys(replies).length > 0
                ? replyText() + " replies (" + Object.keys(replies).length + ")"
                : ""}
            </p>
          </div>
        </div>
      </div>

      <div
        className="reply-feed"
        style={{ display: showReply ? "block" : "none" }}
      >
        {replies}
        <div className="create-new-comment">
          <textarea
            type="replyEntry"
            ref={newCommentRef}
            value={replyEntry}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a reply comment"
            id="newComment"
          />
          <button onClick={() => postReply()} disabled={loading}>
            Post Reply
          </button>
        </div>
      </div>
    </div>
  );
};

Comment.propTypes = {
  CommentDeets: PropTypes.object,
};

export default Comment;
