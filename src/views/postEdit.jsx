import Select from 'react-select'
import "../styles/PostPage.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchAllEntries, getEntryById, updateEntry } from "../firebaseOperations";
import MiniLoadingScreen from "../components/mini-loadingScreen";
import { useAlertContext } from '../contexts/alertContext';
import customStyles from '../styles/selectTagStyle';
import { getDoc } from 'firebase/firestore';

function PostEdit() {
  // const { setPost } = UsePostFeedContext();
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchParams] = useSearchParams();
  const postId = searchParams.get("postId");
  const [postTags, setPostTags] = useState([])
  const [loading, setLoading] = useState(false);
  const alert = useAlertContext();
  const [titleText, setTitle] = useState("")
  const [bodyText, setBody] = useState("")
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState(null);
  const [searcHits, setSearchHits] = useState([])
  const [gameSearchHits, setGameSearchHits] = useState([])


  async function fetchTags() {
    setLoading(true)
    const tagsArr = []
    const gamesArr = []
    const searchHitsArr = []
    const gameSearchHitsArr = []
    const fetchedTags = await fetchAllEntries("tags", 'name');
    const fetchedGames = await fetchAllEntries("featuredGames", 'name');
    setLoading(false)

    fetchedTags.forEach(tag => {
      tagsArr.push(tag)
      searchHitsArr.push({ value: tag.name, label: tag.name, desc: tag.desc })

    });

    fetchedGames.forEach(game => {
      gamesArr.push(game)
      gameSearchHitsArr.push({ value: game.id, label: game.name, imageURL: game.imageURL, id: game.id })
    });


    setGameSearchHits(gameSearchHitsArr);
    setSearchHits(searchHitsArr);
    ////console.log("searching tags..")
  }




  async function fetchPost(postId) {
    try {
      setLoading(true);
      const post = await getEntryById("posts", postId);
      if (!post) {
        return;
      }
      setSelectedPost(post);
      setSelectedGame(post.game ?? null);
      setPostTags(
        (post.tags ?? []).map((tag) => ({
          value: tag,
          label: tag,
        }))
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const submitPost = async () => {
    setLoading(true);
    try {
      await updateEntry("posts", selectedPost.id, {
        title: titleText,
        body: bodyText,
        tags: postTags.map((tag) => tag.label),
        game: selectedGame ?? null,
        hasAttachments: false,
        edited: true,
      });
      alert.success("Posted successfully!");
      navigate('/home');
    } catch (error) {
      console.error(error);
      alert.error("some error happened!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    fetchPost(postId)
    fetchTags()

  }, [])


  useEffect(() => {

    setTitle(selectedPost.title)
    setBody(selectedPost.body)

  }, [selectedPost])


  return loading || !selectedPost ? (
    <MiniLoadingScreen />
  ) : (
    <div className="post-creation-main">

      <div className="post-create-box post-create-child">
        <div className="post-edit-create-header">
          <h1>Edit Your Post</h1>

        </div>
        <div className="post-title post-input-container">
          <div className="post-title-input-container post-input-container">
            <input value={titleText} onChange={(e) => { setTitle(e.target.value) }} className="post-title-input" type="text" name="" id="" placeholder="Post Title..." />
          </div>
        </div>
        <div className="post-content post-input-container">
          <div className="post-create-content">
            <textarea value={bodyText} onChange={(e) => { setBody(e.target.value) }} className="post-edit-content-input" type="text" name="" id="" placeholder="Write Post..." />
          </div>
        </div>
        <div className="post-tags post-input-container">

          <div className="post-tags-container">
            <p>Attach Tags to your post:</p>
            <Select
              options={searcHits}
              isMulti
              value={postTags}
              placeholder="Attach to this post..."
              onChange={setPostTags}
              styles={customStyles}
            />
          </div>

          <div className="post-tags-container game-tag">
            <p>Attach the related game to your post:</p>
            <Select
              options={gameSearchHits}
              placeholder="Pick a game..."
              value={selectedGame}
              onChange={setSelectedGame}
              styles={customStyles}
            />

          </div>
          <div className="post-edit-create-button-row">

            <button className="btn2-cancel">Cancel</button>
            <button className="btn-publish" onClick={() => submitPost()}>Publish</button>
          </div>
        </div>
      </div>

      { 
      selectedGame &&  
      
      <div className="game-pic-page">
        <h3> {selectedGame.label } </h3>
        <div className="image-container">
        <img className="poster-img" src={selectedGame.imageURL} alt="" /></div>
      </div>}

    </div>
  );
}

export default PostEdit;
