import "../styles/AdminPage.css"

import {  useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { UseAuthContext } from "../contexts/authContext";
import { fetchAllEntries } from "../firebaseOperations";

import Upwward from '@mui/icons-material/ArrowUpward';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';


function AdminPanel() {

  const navigate = useNavigate();
  const { user } = UseAuthContext();
  const [newUsers, setNewUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [newPosts, setNewPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [totalNewComments, setTotalNewComments] = useState([]);
  const [totalAllComments, setTotalAllComments] = useState([]);

  const withinThisWeek = (date) => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday

    const inputDate = new Date(date);

    ////console.log(inputDate)

    return inputDate >= startOfWeek && inputDate <= endOfWeek;

  };
  
  async function NewUsers() {
    try {

      const userList = await fetchAllEntries( 'users', 'dateJoined');
      const newUserArr = []
      const allUserArr = []
      userList.forEach(user => {

        if (withinThisWeek(user.dateJoined)) {
          newUserArr.push(user.dateJoined)
        }
        allUserArr.push(user.dateJoined)

      })
      setNewUsers(newUserArr)
      setAllUsers(allUserArr)
    } catch (error) {
      ////console.log(error)

      return 'Some error occured'
    }

  }

  async function NewPosts() {
    try {

      const postList = await fetchAllEntries( 'posts', 'postDate');
      const newpostArr = []
      const allpostArr = []
      postList.forEach(post => {

        if (withinThisWeek(new Date(post.postDate.seconds * 1000))) {
          newpostArr.push(post.id)
        }

        allpostArr.push(post.id)
        NewComments(`posts/${post.id}/comments`);


      })
      setNewPosts(newpostArr)
      setAllPosts(allpostArr)
    } catch (error) {
      ////console.log(error)

      return 'Some error occured'
    }

    allPosts.forEach(
      post => {
        ////console.log(post)
      }
    )

  }

  async function NewComments(collectionRef) {
    try {

      const CommentList = await fetchAllEntries( collectionRef, 'createDate');
      const newComments = [];
      const allComments = [];

      CommentList.forEach(Comment => {
        ////console.log(Comment.createDate)

        if (withinThisWeek(new Date(Comment.createDate.seconds * 1000))) {

          if (!newComments.includes(Comment.id)) {
            newComments.push(Comment.id);
          }
        }
        if (!allComments.includes(Comment.id)) {
          allComments.push(Comment.id)
        }
        try {
          NewComments(collectionRef + '/' + Comment.id + '/replies')
        } catch (error) {
          ////console.log(error)
        }

      })
      newComments.forEach(comment => {
        if (!totalNewComments.includes(comment)) {
          setTotalNewComments((prevComments) => [...prevComments, comment])
        }
      });

      allComments.forEach(comment => {
        if (!totalAllComments.includes(comment)) {
          setTotalAllComments((prevAllComments) => [...prevAllComments, comment])
        }
      });


    } catch (error) {
      
      ////console.log(error)
      return 'Some error occured'
      
    }

  }


  useEffect(() => {
    if (user.role == "admin") {
      navigate
    }
    NewUsers()
    NewPosts()

  }, [])
  return (
    <div className="home">
      <div className="admin-header">
        <h4>Hello, Admin!</h4>
        <h5>What's your plan today?</h5>
      </div>
      <div className="stat-screen" style={{ userSelect: "none" }}>
        <div className="title">
          <h3>Analytics</h3>
        </div>

        <div className="stat-boxes">
          <div className="stat-container box ">
            <h1>New Users</h1>
            <div className="stat-info">
              <h3> {newUsers.length} <Upwward className="AppIcon" /> ({allUsers.length}) </h3>
            </div>

            <p> {newUsers.length > 0 ? `${newUsers.length} new user(s) this week!` : 
            "There have been no new users this week"}</p>
          </div>

          <div className="stat-container box box2">
            <h1>New Threads</h1>
            <div className="stat-info">
              <h3> {newPosts.length} <Upwward className="AppIcon" /> ({allPosts.length}) </h3>
            </div>

            <p> {newPosts.length > 0 ? `${newPosts.length} new thread(s) this week!` : 
            "There have been no new posts this week"}</p>
          </div>

          <div className="stat-container box">
            <h1>Thread Activity</h1>
            <div className="stat-info">
              <h3> {totalNewComments.length} <Upwward className="AppIcon" /> ({totalAllComments.length}) </h3>
            </div>

            <p> {totalNewComments.length > 0 ? `${totalNewComments.length} new interaction(s) this week!` : 
            "There have been no interactions within posts this week"}</p>
          </div>

        </div>
      </div>

      <div className="title">
        <h3>Features</h3>
      </div>
      <div className="options-screen">
        <div className="options-container box ">
          <div className="options-text">
            <h1>Manage Users</h1>
            <p>Manage, Suspend or Ban Users</p>
          </div>
          <div className="options-icon" onClick={() => {navigate('/dashboard/Admin/ManageAccounts')}} >
            <ArrowOutwardIcon className="OutwardIcon"></ArrowOutwardIcon>
          </div>
        </div>


        <div className="options-container box ">
          <div className="options-text">
            <h1>View System Logs</h1>
            <p>Monitor System Activity Thru Logs </p>
          </div>
          <div className="options-icon" onClick={() => {navigate('/dashboard/Admin/ManageLogs')}}>
            <ArrowOutwardIcon className="OutwardIcon"></ArrowOutwardIcon>
          </div>
        </div>

        <div className="options-container box ">
          <div  className="options-text">
            <h1>Manage Tags</h1>
            <p>Manage tags visible to users</p>
          </div>
          <div className="options-icon" onClick={() => {navigate('/dashboard/Admin/ManageTags')}}>
            <ArrowOutwardIcon className="OutwardIcon"></ArrowOutwardIcon>
          </div>
        </div>
      </div>


    </div>
  )
}

export default AdminPanel
