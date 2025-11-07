/* eslint-disable react/prop-types */
import Select from 'react-select'
import "../styles/ProfileBox.css"
import PostFeed from "../components/postFeed";
import { useEffect, useState } from "react";
import LoadingScreen from "../components/loadingScreen";
import { fetchAllEntries, getEntryById, updateEntry } from "../firebaseOperations";
import { useSearchParams } from "react-router-dom";
import Edit from '@mui/icons-material/Edit';
import Confirm from '@mui/icons-material/CheckCircle';
import Cancel from '@mui/icons-material/Cancel';
import { UseAuthContext } from "../contexts/authContext";

import customStyles from '../styles/selectTagStyle';
import { useAlertContext } from '../contexts/alertContext';
import FocusedPostFeed from '../components/focusedPostFeed';
import SampleAvatar from "../assets/Emote Pack/Compilation/Frame 2.svg";

const sampleProfile = {
  id: 'sample-user',
  username: 'Sample Player',
  handle: '@sampleplayer',
  dateJoined: 'Joined Jan 1, 2024',
  preferredTags: ['RPG', 'Co-op', 'Strategy'],
  profilePic: "../assets/Emote Pack/Compilation/Frame 2.svg",
};

const Profile = () => {
  const alert = useAlertContext();
  const [setTags] = useState([]);
  const [fetchedUser, setFetchedUser] = useState(sampleProfile);
  const [profilePic, setprofilePic] = useState(SampleAvatar);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState({ username: false, tags: false });
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const { user, setUser } = UseAuthContext();
  
  const initialTagSelection = sampleProfile.preferredTags.map((tag) => ({
    value: tag,
    label: tag,
    desc: '',
  }));
  const [sselectedTags, setSelectedTags] = useState(initialTagSelection);
  const [searcHits, setSearchHits] = useState([]);
  const [editText, setEditText] = useState(sampleProfile.username);

  const tagPillbox = (tags) => {
    if (!Array.isArray(tags) || tags.length === 0) {
      return null;
    }
    const tagList = [];
    tags.forEach((tag) => {
      const tagPill = <li key={tag}>{tag}</li>;
      tagList.push(tagPill);
    });
    return tagList;
  }

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



  async function fetchTags() {
    setLoading(true)
    const tagsArr = []
      const preferredTagsArr = [];
      const searchHitsArr = []
    const fetchedTags = await fetchAllEntries( "tags", 'name');
    setLoading(false)
    fetchedTags.forEach(tag => {
      tagsArr.push(tag)

      if (fetchedUser.preferredTags.includes(tag.name)) {

        const tagObj = { value: tag.name, label: tag.name, desc: tag.desc };
        preferredTagsArr.push(tagObj);
          
      }


      searchHitsArr.push({ value: tag.name, label: tag.name, desc: tag.desc })
    });

    setSearchHits(searchHitsArr);
    setSelectedTags(preferredTagsArr)
    setTags(tagsArr);
    ////console.log("searching tags..")
  }

async function editUsername() {
  setLoading(true)

  try {

    await updateEntry( 'users', user.id, { username: editText })
    alert.success('Edited username Successfully!')
    setUser((prevdeets) => ({ ...prevdeets, username: editText }));
    setEditMode((prevState) => ({...prevState, username:false, }))
    setLoading(false)
    getUser(user.id)

  } catch (error) {
    setLoading(false)
    alert.error('Edit unsuccessful..')
    console.error(error)
  }

}

async function editTags() {
  setLoading(true)

  try {

    const tagsArr = []
    sselectedTags.forEach( tag => {
      tagsArr.push(tag.label)
    })

    await updateEntry( 'users', user.id, { tags: tagsArr })
    alert.success('Edited username Successfully!')
    setUser((prevdeets) => ({ ...prevdeets, tags: editText }));
    setEditMode((prevState) => ({...prevState, tags:false, }))
    setLoading(false)
    getUser(user.id)

  } catch (error) {
    setLoading(false)
    alert.error('Edit unsuccessful..')
    console.error(error)
  }

}


  async function getUser() {

    setLoading(true)

    try {
      const userAcc = await getEntryById( "users", userId);
      if (!userAcc) {
        setLoading(false);
        return;
      }
      setFetchedUser({
        username: userAcc.username || sampleProfile.username,
        id: userAcc.id || sampleProfile.id,
        handle: userAcc.handle || sampleProfile.handle,
        profilePic: userAcc.profilePic || sampleProfile.profilePic,
        dateJoined: userAcc.dateJoined || sampleProfile.dateJoined,
        preferredTags: userAcc.tags?.length ? userAcc.tags : sampleProfile.preferredTags,
      });
      importAsset(userAcc.profilePic || sampleProfile.profilePic).then(setprofilePic);
    } catch (error) {
      setFetchedUser(sampleProfile);
      setprofilePic(SampleAvatar);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  
  useEffect(() => {
    fetchTags()
  }, [fetchedUser])

  useEffect(() => {
    setEditText(fetchedUser.username ?? sampleProfile.username);
    setSelectedTags(
      (fetchedUser.preferredTags ?? sampleProfile.preferredTags).map((tag) => ({
        value: tag,
        label: tag,
        desc: '',
      }))
    );
  }, [fetchedUser])

  ////console.log(sselectedTags)

  return loading || fetchedUser == {} ?
    <LoadingScreen /> : (


      <div className="profile-name">


        <div className="profile-details-row">
          <div className="img-container">
            <img src={profilePic} alt="profile picture" />
          </div>

          <div className="row">
            <div className="profile-column">
              <div className="profile-deets">
                <div className="username-container2">
                  {editMode.username == false ? <h1>{fetchedUser.username}</h1>
                    : <input className="username-edit-box" maxLength={15} type="text" value={editText} onChange={(e) => setEditText(e.target.value)} />
                  }

                  {userId == user.id ? ( editMode.username == false?
                    <div className="profile-edit-button" onClick={() => { setEditMode((prevState) => ({...prevState, username:true, })) }}>
                      <Edit className="AppIcon" fontSize="30" />
                    </div>
                    : <div className="profile-button-column">
                      <div className="profile-edit-button confirm" onClick={() => { editUsername() }}>
                        <Confirm className="AppIcon" fontSize="30" />
                      </div>
                      <div className="profile-edit-button confirm" onClick={() => {setEditMode((prevState) => ({...prevState, username:false, }))}}>
                        <Cancel className="AppIcon" fontSize="30" />
                      </div>
                    </div>) : <></>}

                </div>
                <div className="handle-container">
                  <p>{fetchedUser.handle}</p>

                </div>
                
                <div className='profile-button-row'><p>Is Interested in:</p> 
                  {userId == user.id ? ( editMode.tags == false?
                    <div className="profile-edit-button" onClick={() => { setEditMode((prevState) => ({...prevState, tags:true, })) }}>
                      <Edit className="AppIcon" fontSize="30" />
                    </div>
                    : <div className="profile-button-column">
                      <div className="profile-edit-button confirm" onClick={() => { editTags() }}>
                        <Confirm className="AppIcon" fontSize="30" />
                      </div>
                      <div className="profile-edit-button confirm" onClick={() => {setEditMode((prevState) => ({...prevState, tags:false, })) 
                      fetchTags()}}>
                        <Cancel className="AppIcon" fontSize="30" />
                      </div>
                    </div>) : <></>}
                    </div>
                  

                 { editMode.tags == true ?<div className="edit-body">

                  <div className="tagSearch">

                    <Select
                      value={sselectedTags}
                      options={searcHits}
                      isMulti
                      onChange={setSelectedTags}
                      styles={customStyles}
                    />

                  </div>
                </div>   : 
                <div className="profile-tags-container">  
                  <ul className="tag-list">
                    {tagPillbox(fetchedUser.preferredTags ? fetchedUser.preferredTags : sampleProfile.preferredTags)}
                  </ul>
                </div> }

              </div>
            </div>
            <div className="profile-column">
              <p>Date Joined:</p>
              <p>{fetchedUser.dateJoined}</p>
            </div>

          </div> 


        </div>

        <div className="activity-log-main">
          <div className="recent-activity">

            <div className="recent-post">
              <p>Recent Posts</p>
            </div>

          </div>
          <div className="post-feed">
            <FocusedPostFeed uid={fetchedUser.id}/>
          </div>
        </div>

      </div>
    )

}



export default Profile


