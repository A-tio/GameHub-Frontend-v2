import "../styles/PostPage.css"
import LogFeed from "../components/logFeed";
function LogsView() {


  return (
    <div className="account-view">
      <div className="account-view-header">
        <h1>System Logs</h1>
      </div>

      <div className="view-posts-screen box" style={{ height: "auto", minHeight: "63vh" }}>

        {/* This right here is a jsx component that receives filters to house all the posts later. */}
        <LogFeed />

      </div>
    </div>


  )


}

export default LogsView
