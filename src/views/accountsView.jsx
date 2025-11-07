import "../styles/PostPage.css"
import { useNavigate } from "react-router-dom";
import { UseAuthContext } from "../contexts/authContext";
import Forum_icon from "../assets/images/forum_icon.png";
import Comment_icon from "../assets/images/comment_icon.png";
import UserFeed from "../components/userFeed";
function AccountView() {


  return (
    <div className="account-view">

      <div className="account-view-header">
        <h1>Manage Accounts</h1>
      </div>

      <div className="view-posts-screen box" style={{ height: "auto", minHeight: "63vh" }}>

        {/* This right here is a jsx component that receives filters to house all the posts later. */}
        <UserFeed filter={""} />

      </div>
    </div>


  )


}

export default AccountView
