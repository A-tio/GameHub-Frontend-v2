import Select from 'react-select';
import "../styles/PostCreateBox.css";
import { useNavigate } from "react-router-dom";
import { UseAuthContext } from "../contexts/authContext";
import { useAlertContext } from '../contexts/alertContext';
import { useEffect, useRef, useState } from "react";
import { addEntry, fetchAllEntries, laraveLOG } from "../firebaseOperations";
import LoadingScreen from "../components/loadingScreen";
import customStyles from '../styles/selectTagStyle';


function PostCreate() {

  const { user } = UseAuthContext();

  const [sselectedTags, setSelectedTags] = useState([]);
  const [selectedGame, setSelectedGame] = useState({});
  const [searcHits, setSearchHits] = useState([])
  const [gameSearchHits, setGameSearchHits] = useState([])

  const [loading, setLoading] = useState(false);
  const alert = useAlertContext();
  const titleRef = useRef()
  const bodyRef = useRef()
  const navigate = useNavigate();

  // const [file, setFile] = useState(null);
  // const [uploadStatus, setUploadStatus] = useState("");

  // const handleFileChange = (e) => {
  //   setFile(e.target.files[0]);
  // };

  // const handleUpload = async () => {
  //   if (!file) {
  //     alert("Please select a file first!");
  //     return;
  //   }

  //   const storageRef = ref(storage, `uploads/${file.name}`); // Create a reference
  //   try {
  //     const snapshot = await uploadBytes(storageRef, file); // Upload the file
  //     const downloadURL = await getDownloadURL(snapshot.ref); // Get the file URL
  //     setUploadStatus(`File uploaded successfully: ${downloadURL}`);
  //     ////console.log("upload status:", uploadStatus);
  //     ////console.log("File available at:", downloadURL);
  //   } catch (error) {
  //     console.error("Error uploading file:", error);
  //     setUploadStatus("Failed to upload file.");
  //   }
  // };


  useEffect(() => {

    async function fetchTags() {
      setLoading(true)
      const tagsArr = []
      const gamesArr = []
      const searchHitsArr = []
      const gameSearchHitsArr = []
      const fetchedTags = await fetchAllEntries( "tags", 'name');
      const fetchedGames = await fetchAllEntries( "featuredGames", 'name');
      setLoading(false)

      fetchedTags.forEach(tag => {
        tagsArr.push(tag)
        searchHitsArr.push({ value: tag.name, label: tag.name, desc: tag.desc })

      });

      fetchedGames.forEach(game => {
        gamesArr.push(game)
        ////console.log("game:")
        ////console.log(game)
        // if (fetchedUser.preferredTags.includes(tag.name)) {

        //   const tagObj = { value: tag.name, label: tag.name, desc: tag.desc };
        //   preferredTagsArr.push(tagObj);

        // }


        gameSearchHitsArr.push({ value: game.id, label: game.name, imageURL: game.imageURL, id: game.id})
      });


      setGameSearchHits(gameSearchHitsArr);
      setSearchHits(searchHitsArr);
      ////console.log("searching tags..")
    }
    fetchTags()
    return;
  }, [])



  const submitPost = async () => {
    const title = titleRef.current.value
    const body = bodyRef.current.value
    setLoading(true)

    try {
      const tagsArr = []
      sselectedTags.forEach(tag => {
        tagsArr.push(tag.label)
      })

      ////console.log("postSubmission");
      const attachedGame = selectedGame?.id ? { ...selectedGame } : null;
      laraveLOG(`User ID ${user ? `(@${user.handle})${user.id}` : "guest"} has posted with the following details: \n ${JSON.stringify({ title, body, tags: tagsArr, game: attachedGame })}`);
      const postID = await addEntry("posts", {
        title,
        body,
        tags: tagsArr,
        game: attachedGame,
        hasAttachments: false,
        postDate: new Date(),
        posterId: user?.id ?? 'guest',
      })
      alert.success("Posted successfully!")

      ////console.log(postID)
      navigate('/home')

    } catch (error) {
      console.error(error)
      alert.error("some error happened!")
    }
    setLoading(false)

  }

  return (
    <div className="post-creation-main">
      {loading ? <LoadingScreen /> : <></>}

      <div className="post-create-box post-create-child">
        <div className="post-create-header">
          <h4>Create Discussion</h4>

        </div>
        <div className="post-title post-input-container">
          <div className="post-title-input-container post-input-container">
            <input ref={titleRef} className="post-title-input" type="text" name="" id="" placeholder="Post Title..." />
          </div>
        </div>

        <div className="post-content-container">
          <div className="post-content post-input-container">
            <div className="post-create-content">
              <textarea ref={bodyRef} className="post-content-input" type="text" name="" id="" placeholder="Description" />
            </div>
          </div>
          <div className="post-tags post-input-container post-button">

            <div className="post-create-button-row">
              <button className="btn-cancel" onClick={() => { navigate('/home') }} >Cancel</button>
              <button className="btn-publish" onClick={() => submitPost(titleRef.current.value, bodyRef.current.value)}>Publish</button>

            </div>
          </div>

        </div>
        <div className="post-tags-container">
          <p>Attach Tags to your post:</p>
          <Select
            options={searcHits}
            isMulti
            placeholder = "Attach to this post..."
            onChange={setSelectedTags}
            styles={customStyles}
          />

        </div>
        <div className="post-tags-container game-tag">
          <p>Attach the related game to your post:</p>
          <Select
            options={gameSearchHits}
            placeholder = "Pick a game..."
            onChange={setSelectedGame}
            styles={customStyles}
          />

        </div>
        {/* <div className="post-create-tag">
            <input className="post-tag-input" type="text" name="" id="" placeholder="Search Tags..." />
          </div>
          <div className="tag-pillbox">

            {tags}
          </div>
           */}
        {/* <div className="post-create-button-row">
            <button onClick={() => submitPost(titleRef.current.value, bodyRef.current.value)}>Publish</button>
            <button onClick={() => navigate('/home')}>Cancel</button>
          </div> */}


      </div>

      { 
      selectedGame != null ?  <div className="game-pic-page">
        <h3> {selectedGame.label } </h3>
        <div className="image-container">
        <img className="poster-img" src={selectedGame.imageURL} alt="" /></div>
      </div> : <></>}

    </div>


  )
}

export default PostCreate
