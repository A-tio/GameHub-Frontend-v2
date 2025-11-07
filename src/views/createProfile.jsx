import { useNavigate } from "react-router-dom";
import { UseAuthContext } from '../contexts/authContext';

import {  useEffect, useState } from "react";
import '../styles/createProfile.css'
import { fetchAllEntries, searchEntry, updateEntry } from "../firebaseOperations";

import pic1 from "../assets/Emote Pack/Compilation/Frame 2.svg"
import pic2 from "../assets/Emote Pack/Compilation/Frame 3.svg"
import pic3 from "../assets/Emote Pack/Compilation/Frame 4.svg"
import pic4 from "../assets/Emote Pack/Compilation/Frame 5.svg"
import pic5 from "../assets/Emote Pack/Compilation/Frame 6.svg"
import pic6 from "../assets/Emote Pack/Compilation/Frame 8.svg"
import pic7 from "../assets/Emote Pack/Compilation/Frame 9.svg"
import pic8 from "../assets/Emote Pack/Compilation/Frame 11.svg"
import pic9 from "../assets/Emote Pack/Compilation/Frame 12.svg"
import LoadingScreen from "../components/loadingScreen";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { useAlertContext } from "../contexts/alertContext";

function CreateProfile() {

  const { user, token, setUser } = UseAuthContext();
  const navigate = useNavigate();
  // const [renderedField, setRenderedField] = useState();
  const [handleText, setHandleText] = useState("");
  const [usernameText, setusernameText] = useState("");
  const [tagSearchText, settagSearchText] = useState("");
  const [profilePicIndex, setProfilePicIndex] = useState(null);
  const [preferredTags, setpreferredTags] = useState([]);
  const [tags, setTags] = useState([])
  const [chosenTags, setChosenTags] = useState([]);
  const [visibleTags, setVisibleTags] = useState([]);
  const profilePicDivs = [];
  const alert = useAlertContext();
  const [loading, setLoading] = useState();
  const [steps, setSteps] = useState([
    'handle',
    'username',
    'preferredTags',
    'profilePic',
  ])

  const profilePics = [
    [pic1, "../assets/Emote Pack/Compilation/Frame 2.svg"],
    [pic2, "../assets/Emote Pack/Compilation/Frame 3.svg"],
    [pic3, "../assets/Emote Pack/Compilation/Frame 4.svg"],
    [pic4, "../assets/Emote Pack/Compilation/Frame 5.svg"],
    [pic5, "../assets/Emote Pack/Compilation/Frame 6.svg"],
    [pic6, "../assets/Emote Pack/Compilation/Frame 8.svg"],
    [pic7, "../assets/Emote Pack/Compilation/Frame 9.svg"],
    [pic8, "../assets/Emote Pack/Compilation/Frame 11.svg"],
    [pic9, "../assets/Emote Pack/Compilation/Frame 12.svg"]
  ]

  profilePics.forEach((pic, index) => {
    profilePicDivs.push(<div key={index} id={`profilePic-${index}`} className="profile-image-container2"><img src={pic[0]} alt="" id={index} onClick={() => { selectProfilePicname(index) }} /></div>
    )
  })

  function selectProfilePicname(index) {

    const otherContainers = document.querySelectorAll('.profile-image-container')
    const profileContainer = document.getElementById(`profilePic-${index}`)


    otherContainers.forEach(element => {
      element.classList.remove("selected");
    })

    profileContainer.classList.add("selected")

    setProfilePicIndex(index)

  }

  const removeStep = (step) => {
    ////console.log('Removing step:', step);
    setSteps((prevSteps) => prevSteps.filter((t) => t !== step));
  };

  useEffect(() => {
    ////console.log('Updated steps:', steps);
    if (steps.length <= 0) {
      navigate('/home')
    }
  }, [steps]); // Logs the updated steps whenever the state changes


  async function setHandle(input) {
    ////console.log("setHandle function fired")
    try {
      setLoading(true)

      const accountCheck = await searchEntry( `users`, 'handle', '==', input);
      setLoading(false)

      if (accountCheck.length == 0) {
        setLoading(true)

        const updatedAcc = await updateEntry( `users`, user.id, { handle: input })
        ////console.log(updatedAcc)


        setLoading(false)
        setUser((prevUser) => ({
          ...prevUser,
          handle: input, // Adding a new property
        }));
        alert.success('Handle set up complete!',);
        removeStep('handle')

      } else {
        alert.error('This handle is already taken..',);
      }

    } catch (error) {
      setLoading(false)

      alert.error('Please try again!',);
      console.error(error)
    }

  }


  async function setUsername(input) {
    ////console.log("setUsername function fired")
    try {
      setLoading(true)
      const updatedAcc = await updateEntry( `users`, user.id, { username: input })
      ////console.log(updatedAcc)
      setLoading(false)
      setUser((prevUser) => ({
        ...prevUser,
        username: input, // Adding a new property
      }));
      alert.success('username set up complete!',);

      removeStep('username')

    } catch (error) {
      setLoading(false)

      alert.error('Please try again!',);
      console.error(error)
    }

  }


  async function setPrefferedTags() {
    ////console.log("setPrefferedTags function fired")
    ////console.log(preferredTags)
    try {
      setLoading(true)
      const updatedAcc = await updateEntry( `users`, user.id, { tags: preferredTags })
      ////console.log(updatedAcc)
      setUser((prevUser) => ({
        ...prevUser,
        preferredTags: preferredTags, // Adding a new property
      }));
      setLoading(false)
      removeStep('preferredTag')
      ////console.log(steps)
      alert.success('Preferred tags set up complete!',);

    } catch (error) {
      setLoading(false)

      alert.error('Please try again!',);
      console.error(error)
    }

  }


  async function setUserProfilePic(index) {
    ////console.log("setUserProfilePic function fired")
    try {
      setLoading(true)
      const updatedAcc = await updateEntry( `users`, user.id, { profilePic: profilePics[index][1] })
      ////console.log(updatedAcc)
      setUser((prevUser) => ({
        ...prevUser,
        profilePic: profilePics[index][1], // Adding a new property
      }));
      setLoading(false)
      removeStep('profilePic')
      alert.success('Profile Picture set up complete!',);

      ////console.log(steps)
    } catch (error) {
      setLoading(false)

      alert.error('Please try again!',);
      console.error(error)
    }

  }

  const addTag = (tag) => {
    const tagPill = document.getElementById(tag);
    ////console.log(tag);
    settagSearchText("")
    filterTags("")

    setpreferredTags((prevTags) => {
      if (!prevTags.includes(tag)) {
        tagPill.classList.add("active-tag");
        ////console.log("added");
        return [...prevTags, tag]; // Add the tag
      } else {
        tagPill.classList.remove("active-tag");
        ////console.log("spliced");
        return prevTags.filter((t) => t !== tag); // Remove the tag
      }
    });

    setTags((prevTags) => {
      if (!prevTags.includes(tag)) {
        tagPill.classList.add("active-tag");
        ////console.log("added");
        return [...prevTags, tag]; // Add the tag
      } else {
        tagPill.classList.remove("active-tag");
        ////console.log("spliced");
        return prevTags.filter((t) => t !== tag); // Remove the tag
      }
    });

  }

  // This sets the visible tags each time a user types in the searchbar. This list appears above the chosen tags list.
  function filterTags(searchTerm) {
    const searchHits = []
    tags.forEach(
      tag => {
        // ////console.log(tag,  searchTerm)

        if (tag.toLowerCase().includes(searchTerm.toLowerCase())) {
          searchHits.push(<li key={tag} id={tag} className="tag" onClick={() => {
            addTag(tag)
          }} >{tag}</li>)
          ////console.log("detected" + searchTerm)
        }
      }
    )

    setVisibleTags(<ul className="tag-list"> {searchHits} </ul>)

  }

  function checkSteps() {

    ////console.log(user.handle != "")
    ////console.log(user.username != "")
    ////console.log(user.profilePic != "")
    ////console.log(user.preferredTags != [])

    if (user.handle != "") {
      removeStep('handle')
    }
    if (user.username != "") {
      removeStep('username')
    }
    if (user.preferredTags.length > 0) {
      removeStep('preferredTags')
    }
    if (user.profilePic != "") {
      removeStep('profilePic')
    }

    ////console.log("steps")
    ////console.log(steps)
  }


  // Every time the preferred Tag array changes, the change is reflected in the tag list below the visible tag list. 


  useEffect(() => {
    filterTags("")
    return;
  }, [tags])



  useEffect(() => {

    const preferredTagArr = []
    ////console.log("tags have changed!")
    preferredTags.forEach((tag, index) => {
      preferredTagArr.push(<li key={index} id={tag} className="tag" onClick={() => addTag(tag)}>{tag}</li>)
    })

    setChosenTags(<ul key={"parent-tag"} className="tag-list">{preferredTagArr}</ul>)
    ////console.log(preferredTags)
    ////console.log(chosenTags)
    return;

  }, [preferredTags])

  useEffect(() => {

    if (token == "" && user == "") {
      navigate('/home');
      ////console.log("User has redirected successfully to home section from the createProfile section");
    }

    async function fetchTags() {
      const tagArray = [];
      const fetchedTags = await fetchAllEntries( "tags", 'name');
      fetchedTags.forEach(tag => {
        tagArray.push(tag.name)
      });
      setTags(tagArray)
      ////console.log(preferredTags)
    }
    fetchTags()
    return;
  }, [])


  useEffect(() => {
    ////console.log(user)
    checkSteps()
    return;
  }, [user])


  // if (token && user) {
  //     navigate('/home');
  //     ////console.log("User has redirected successfully to guest section");    
  // }


  return (
    <div className="create-profile-container overlay">
      {loading ? <LoadingScreen /> : <></>}

      <div className="create-handle-field create-profile-field" style={{ display: steps[0] == 'handle' ? "flex" : "none" }}>
        <div className="handle-info">
          <h2>Set your account&apos;s handle!</h2>
          <p>Your handle helps others find you.</p>
        </div>
        <div className="handle-input">
          <p>@</p>

          <input type="text"
            maxLength={15}
            value={handleText}
            onChange={(e) => setHandleText(e.target.value)}
            placeholder="Type your handle here" title="handleInput" />
        </div>
        <div>

          <button className="btn-next" onClick={() => { setHandle(handleText) }}> Next <ArrowRightAltIcon />  </button>

        </div>

      </div>


      <div className="create-handle-field create-profile-field" style={{ display: steps[0] == 'username' ? "flex" : "none" }}>
        <div className="handle-info">
          <h2>Pick your username</h2>
          <p>Choose a username that suits you!</p>
        </div>

        <div className="handle-input ">
          <input type="text"
            maxLength={15}
            value={usernameText}
            onChange={(e) => setusernameText(e.target.value)}
            placeholder="Type your username here" id="usernameInput" />
        </div>
        <div>
          <button className="btn-next" onClick={() => { setUsername(usernameText) }}> Confirm </button>

        </div>

      </div>

      <div className="create-handle-field create-profile-field" style={{ display: steps[0] == 'preferredTags' ? "block" : "none" }}>
        <div className="container-field">
          <h2>What type of stuff are you into? Pick at least three tags~</h2>
          <div className="search-tag-input">
            <input type="text"
              maxLength={15}
              value={tagSearchText}
              onChange={(e) => {
                settagSearchText(e.target.value)
                filterTags(e.target.value)
              }}
              placeholder="Search Tags" id="tagSearch" /></div>

          <div className="searched-tags">
            {visibleTags}
          </div>

          <div className="chosen-tags">
            {chosenTags}
          </div>
          <button className="btn-confirm" disabled={!(preferredTags.length >= 3)} onClick={() => { setPrefferedTags() }}> Confirm </button>
        </div>
      </div>
      <div className="create-profilePic-field create-profile-field" style={{ display: steps[0] == 'profilePic' ? "block" : "none" }}>
        <h2>Pick your profile picture!</h2>

        <div className="profile-pic-selection-container">
          {profilePicDivs}

        </div>
        <div>
          <button className="btnconfirm" disabled={profilePicIndex == null} onClick={() => { setUserProfilePic(profilePicIndex) }}>Confirm</button>
        </div>
      </div>



    </div>
  )
}

export default CreateProfile  
