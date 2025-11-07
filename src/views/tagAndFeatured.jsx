import "../styles/ManageTags.css";
import Select from 'react-select';
import { useAlertContext } from '../contexts/alertContext';
import { useEffect, useState } from "react";
import Add from '@mui/icons-material/AddCircleOutlineOutlined';
import Edit from '@mui/icons-material/Edit';
import { addEntry, fetchAllEntries, laraveLOG, searchEntry, updateEntry } from "../firebaseOperations";
import LoadingScreen from "../components/loadingScreen";
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';
import ImageIcon from '@mui/icons-material/Image';
import { UseAuthContext } from "../contexts/authContext";
import ApexPoster from "../assets/images/apex.png";
import CounterStrikePoster from "../assets/images/counterstrike.png";
import FortnitePoster from "../assets/images/fortnite.png";
import GTAPoster from "../assets/images/gta.png";
import LeaguePoster from "../assets/images/lol.png";
import MinecraftPoster from "../assets/images/minecraft.png";
import RobloxPoster from "../assets/images/roblox.png";
import ValorantPoster from "../assets/images/valorant.png";
function TagsAndFeaturedGames() {

  const alert = useAlertContext();
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(false);
  const [featuredGames, setfeaturedGames] = useState([])
  const [newItem, setNewItem] = useState({})
  const [selectedItem, setselectedItem] = useState({})
  const [selectedTags, setselectedTags] = useState([])
  const [editType, setEditType] = useState("")
  const [file, setFile] = useState(null);
  const [editText, setEditText] = useState("")
  const [type, setType] = useState("")
  const [searcHits, setSearchHits] = useState([])
  const [tempImage, setTempImage] = useState(null)
  const [posterData, setPosterData] = useState(null);
  const {user } = UseAuthContext();

  //Style for tag search and select.
  const customStyles = {
    


    control: (provided) => ({
      ...provided,
      backgroundColor: 'black',
      color: 'green',
    }),
    input: (provided) => ({
      ...provided,
      color: 'greenyellow', // Change search input text color to red
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? 'black' : 'black',
      color: state.isSelected ? 'green' : 'white',
    }),
  };


  const handleChange = (option) => {
    ////console.log(option)
    setNewItem((prevItem) => ({ ...prevItem, tags: option }))
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];

    if (!allowedTypes.includes(file.type)) {
      alert.error("Invalid file type. Please upload an image (PNG, JPG, or GIF).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPosterData(reader.result);
      setTempImage(reader.result);
    };
    reader.readAsDataURL(file);
  };
  


  async function searchDuplicate(colName, input) {
    const nameCheck = await searchEntry(colName, 'name', '==', input);
    return nameCheck.length !== 0;
  }

  async function confirmEditPoster() {
    try {
      setLoading(true);

      const url = posterData ?? selectedItem.imageURL;
      if (!url) {
        alert.error('Upload a poster first.');
        setLoading(false);
        return;
      }

      const updatedEntry = await updateEntry('featuredGames', selectedItem.id, { ...newItem, imageURL: url });
      alert.success('Edited successfully!');
      laraveLOG(`Admin user  (${user.handle}) ${user.id} has added a edited a game's poster REFID(${selectedItem.id}) with the following details: \n ` + JSON.stringify({ imageURL: url }));

      fetchFeaturedGames();

      setLoading(false);
    } catch (error) {
      alert.error('Please Try again');

      setLoading(false);

      console.error(error);
    }
    setNewItem({})
    setEdit("", "")
    setPosterData(null)
    setTempImage(null)
  }

  async function confirmEdit(colName, itemId, field) {
    try {

      if (editText == "") {
        alert.success('Dont leave empty spaces!')
        return
      }


      setLoading(true)
      const updatedEntry = await updateEntry(user.id, colName, itemId, { [field]: editText })
      alert.success('Edited successfully!')
      ////console.log(updatedEntry)
      laraveLOG(`Admin user  (${user.handle}) ${user.id} has added a edited a tags REFID(${selectedItem.id}) with the following details: \n ` + JSON.stringify({ [field]: editText  }))
      if (colName == "tags") {
        fetchTags();
      } else {
        fetchFeaturedGames();
      }

      setEdit("", "")
      setselectedItem((prevItemVersion) => ({ ...prevItemVersion, [field]: editText }))

      setLoading(false)

    } catch (error) {
      alert.success('Please Try again')

      setLoading(false)

      console.error(error)
    }
    // reset()
  }


  async function confirmEditGameTags() {
    try {

      if (!selectedTags.length >= 1) {
        alert.error('Games must have at least one tag!')
        return
      }


      setLoading(true)
      const updatedEntry = await updateEntry(user.id, 'featuredGames', selectedItem.id, { tags: selectedTags })
      alert.success('Edited successfully!')
      ////console.log(updatedEntry)
      laraveLOG(`Admin user  (${user.handle}) ${user.id} has added a edited a game's tags REFID(${selectedItem.id}) with the following details: \n ` + JSON.stringify({ selectedTags }))
      fetchFeaturedGames();

      setEdit("", "")
      setselectedItem((prevItemVersion) => ({ ...prevItemVersion, tags: selectedTags }))

      setLoading(false)

    } catch (error) {
      alert.success('Please Try again')

      setLoading(false)

      console.error(error)
    }
  }
  // reset()

  async function addNewItem(colName) {
    ////console.log(newItem)
    try {


      if (newItem.name == "" || newItem.desc == "" || !newItem.name || !newItem.desc) {
        alert.error("Don't Leave empty areas.")
        return
      }

      if (!newItem.category && colName == "tags") {

        alert.error("Pick a category.")
        return

      }

      if (colName == "featuredGame") {
        if (!newItem.tags) {
          alert.error("Set the tags properly!")
          return
        } else if (!posterData) {
          alert.error("Featured games need an image!.");
          setLoading(false);
          return;
        }

      }

      if (await searchDuplicate(colName, newItem.name)) {
        alert.error('That tag/game exists in the database already.');
        setLoading(false);
        return;
      }


      setLoading(true)

      if (colName == "tags") {
        
        laraveLOG(`Admin user  (${user.handle}) ${user.id} has added a tag with the following details: \n ` + JSON.stringify({ newItem }))
        const updatedEntry = await addEntry(colName, { ...newItem })
        alert.success('Added successfully!')
        ////console.log(updatedEntry)
        fetchTags();

      } else {
        laraveLOG(`Admin user  (${user.handle}) ${user.id} has added a featured game with the following details: \n ` + JSON.stringify({ newItem, imageURL: posterData }))
        await addEntry(colName, { ...newItem, imageURL: posterData })
        alert.success('Added successfully!')
        ////console.log(updatedEntry)

        fetchFeaturedGames();
      }

      setLoading(false)

    } catch (error) {
      alert.success('Please Try again')

      setLoading(false)

      console.error(error)
    }
    setNewItem({})
    setType("")
    setPosterData(null)
    setTempImage(null)
    setEdit("", "")
  }

  function reset() {
    const otherselected = document.querySelectorAll('.selected-mtg-item')
    otherselected.forEach(element => {
      element.classList.remove('selected-mtg-item')
    })
    setselectedItem({})
    setType("")
    setPosterData(null)
    setTempImage(null)
    setEdit("", "")
  }



  function selectItem(type, object) {
    reset();
    const targetTag = document.getElementById(object.name);
    if (targetTag) {
      targetTag.classList.add('selected-mtg-item');
    }
    setselectedItem(object)
    setType(type)
    setPosterData(null)
    setTempImage(null)
  }

  function getFeaturedGameTags() {
    if (selectedItem.tags != undefined) {
      const gameTags = [];
      selectedItem.tags.forEach((tag) => {
        const tagObj = { value: tag.value, label: tag.label, desc: tag.desc };

        // setSearchHits((prevTags) => {
        //   const updatedTags = prevTags.filter(
        //     (t) => !(t.label === tagObj.label)
        //   );
        //   ////console.log("Updated Tags:", updatedTags); // Debugging
        //   return updatedTags;
        // });

        gameTags.push(tagObj);
      });
      setselectedTags(gameTags);
    }
  }


  function renderTag(tagCategory) {
    const tagsArr = []
    tags.forEach(tag => {
      if (tag.category == tagCategory) {

        const tagContainer = <div key={tag.name} title={tag.desc} onClick={() => selectItem("tag", tag)} className="tag-item">
          <p id={tag.name} key={tag.name}> {tag.name}</p>
        </div>
        tagsArr.push(tagContainer)

      }
    });

    return tagsArr
  }


  function setEdit(editContent, editArea) {
    if (editArea == editType) {
      setEditType("")
    } else {
      setEditText(editContent)
      setEditType(editArea)
    }
  }


  async function fetchTags() {
    setLoading(true)
    const tagsArr = []
    const searchHitsArr = []
    const fetchedTags = await fetchAllEntries( "tags", 'name');
    setLoading(false)
    fetchedTags.forEach(tag => {
      tagsArr.push(tag)
      searchHitsArr.push({ value: tag.name, label: tag.name, desc: tag.desc })
    });

    setSearchHits(searchHitsArr);
    setTags(tagsArr);
    ////console.log("searching tags..")
  }

  const defaultFeaturedGames = [
    { id: 'featured-apex', name: 'Apex Legends', desc: 'Squad up and outplay rivals in high-speed battle royale firefights.', imageURL: ApexPoster, tags: [{ value: 'Battle Royale', label: 'Battle Royale', desc: 'Drop in and survive to the end.' }, { value: 'Shooter', label: 'Shooter', desc: 'Fast-paced competitive FPS action.' }] },
    { id: 'featured-counterstrike', name: 'Counter-Strike 2', desc: 'Tactical round-based FPS showdowns with precise gunplay.', imageURL: CounterStrikePoster, tags: [{ value: 'Shooter', label: 'Shooter', desc: 'Fast-paced competitive FPS action.' }, { value: 'Esports', label: 'Esports', desc: 'Favored by top competitive teams worldwide.' }] },
    { id: 'featured-fortnite', name: 'Fortnite', desc: 'Build, battle, and express yourself across evolving worlds.', imageURL: FortnitePoster, tags: [{ value: 'Battle Royale', label: 'Battle Royale', desc: 'Drop in and survive to the end.' }, { value: 'Creative', label: 'Creative', desc: 'Create games, worlds, and experiences.' }] },
    { id: 'featured-gta', name: 'GTA Online', desc: 'Create your criminal empire across Los Santos with friends.', imageURL: GTAPoster, tags: [{ value: 'Open World', label: 'Open World', desc: 'Explore vast cities and diverse missions.' }, { value: 'Action', label: 'Action', desc: 'High-octane heists and pursuits.' }] },
    { id: 'featured-lol', name: 'League of Legends', desc: 'Master champions and own the Rift with your squad.', imageURL: LeaguePoster, tags: [{ value: 'MOBA', label: 'MOBA', desc: 'Team-based battles across strategic lanes.' }, { value: 'Esports', label: 'Esports', desc: 'Favored by top competitive teams worldwide.' }] },
    { id: 'featured-minecraft', name: 'Minecraft', desc: 'Craft, explore, and survive in endless blocky worlds.', imageURL: MinecraftPoster, tags: [{ value: 'Sandbox', label: 'Sandbox', desc: 'Build anything your imagination sparks.' }, { value: 'Survival', label: 'Survival', desc: 'Gather, craft, and thrive in every biome.' }] },
    { id: 'featured-roblox', name: 'Roblox', desc: 'Play millions of user-created games or design your own.', imageURL: RobloxPoster, tags: [{ value: 'Creative', label: 'Creative', desc: 'Create games, worlds, and experiences.' }, { value: 'Community', label: 'Community', desc: 'Join massive player-made experiences.' }] },
    { id: 'featured-valorant', name: 'Valorant', desc: 'Combine sharp gunplay with agent abilities in tactical 5v5 clashes.', imageURL: ValorantPoster, tags: [{ value: 'Shooter', label: 'Shooter', desc: 'Fast-paced competitive FPS action.' }, { value: 'Esports', label: 'Esports', desc: 'Favored by top competitive teams worldwide.' }] },
  ];

  async function fetchFeaturedGames() {
    setLoading(true);
    let fetchedGames = await fetchAllEntries("featuredGames", 'name');
    const existingIds = new Set(fetchedGames.map((game) => game.id || game.name));
    const missingDefaults = defaultFeaturedGames.filter((game) => !existingIds.has(game.id) && !existingIds.has(game.name));
    if (missingDefaults.length) {
      for (const game of missingDefaults) {
        await addEntry("featuredGames", game);
      }
      fetchedGames = await fetchAllEntries("featuredGames", 'name');
    }
    setLoading(false);
    const gamesArr = [];
    fetchedGames.forEach(game => {
      gamesArr.push(
        <div key={game.id} className="featured-game-item" onClick={() => selectItem("featuredG", game)}>
          <h3 id={game.name}>{game.name}</h3>
          <div className="image-container">
            <img className="poster-img" src={game.imageURL || tempImage} alt="" />
          </div>
        </div>
      );
    });
    setfeaturedGames(gamesArr);
  }

  useEffect(() => {

    fetchTags();
    fetchFeaturedGames();
    setLoading(false)

    // Cleanup event listeners on unmount
    return () => {
    };

  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    getFeaturedGameTags()
    ////console.log(searcHits)
    ////console.log(selectedTags)
  }, [selectedItem])

  ////console.log(searcHits)

  return (
    <div className="tag-Management-Container">
      {loading ? <LoadingScreen /> : <></>}

      <div className="tag-management-left-side tag-manage-column">
        <div className="tag-and-feature-banner-box">
          <div className="icon-container containertag">
            <ExploreOutlinedIcon className="TopAppIcon" />
            <h4>
              Tags & Featured Games <br></br><span>Manage the tags and Featured Games visible to the users.</span>
            </h4>
          </div>

        </div>

        <div className="tags-and-categories manage-tagNfeature-container">
          <div className="tagNfeature-header-box">
            <div className="tagNfeature-header">
              <LocalOfferOutlinedIcon className="AppIcon" />
              <h3>Tags</h3>
            </div>
            <div className="add-button-div" onClick={() => setType("addTag")}>
              <Add className="AppIcon" />
              <button >Add Tag</button>
            </div>
          </div>
          <div className="body-box">

            <div className="tags-row">

              <div className="tags-column">
                <h4>General</h4>
                <p>
                  {renderTag("General Tags")}
                </p>
              </div>


              <div className="tags-column">
                <h4>Technical</h4>
                <p>
                  {renderTag("Technical Tags")}
                </p>
              </div>

              <div className="tags-column">
                <h4>Game-Specific</h4>
                <p>
                  {renderTag("Game-Specific Tags")}
                </p>
              </div>

              <div className="tags-column">

                <h4>Community</h4>
                <p>
                  {renderTag("Community Tags")}
                </p>
              </div>

              <div className="tags-column">

                <h4>Platforms</h4>
                <p>
                  {renderTag("Platforms")}
                </p>
              </div>

            </div>
          </div>
        </div>

        <div className="featured-games manage-tagNfeature-container">

          <div className="tagNfeature-header-box">
            <div className="tagNfeature-header">
              <SportsEsportsOutlinedIcon className="AppIcon" />
              <h3>Featured Games</h3>
            </div>
            <div className="add-featured-button-div" onClick={() => setType("addFeaturedGame")}>
              <Add className="AppIcon" />
              <button>Add Featured Games</button>
            </div>
          </div>
          <div className="fg-box">

            <div className="fg-row">
              {featuredGames}
            </div>
          </div>
        </div>

      </div>
      <div className="tag-management-right-side tag-manage-column">

        {type == 'tag' ? <div className="tag-edit-area edit-area">
          <div className="edit2-header">
            <h2>Tag</h2>
            <h4>{selectedItem.name}</h4>
          </div>
          <div className="edit-body">
            <div className="edit2-title">
              <p>Category</p>
              <div className="edit-button" onClick={() => { setEdit(selectedItem.desc, "tag-desc") }}>
                <Edit className="AppIcon" fontSize="30" />
              </div>
            </div>
            <div className="category-combox">
              <select name="" id=""
                onChange={(e) => setEditText(e.target.value)}
                disabled={!(editType == 'tag-category')}
              >
                <option selected={selectedItem.category == "General Tags"} value="General Tags">General Tags</option>
                <option selected={selectedItem.category == "Technical Tags"} value="Technical Tags">Technical Tags</option>
                <option selected={selectedItem.category == "Game-Specific Tags"} value="Game-Specific Tags">Game-SpecificTags</option>
                <option selected={selectedItem.category == "Community Tags"} value="Community Tags">Community Tags</option>
                <option selected={selectedItem.category == "Platforms"} value="Platforms">Platforms</option>
              </select>
            </div>

            <div className="confirm-button-containers" style={{ display: editType == "tag-category" ? "block" : "none" }}>
              <button onClick={() => { confirmEdit("tags", selectedItem.id, "category", "tag") }}>Confirm</button>
              <button onClick={() => { setEdit("", "") }} >Cancel</button>
            </div>
          </div>
          <div className="edit-body">
            <div className="edit2-title">
              <p>Description</p>
              <div className="edit-button" onClick={() => { setEdit(selectedItem.desc, "tag-desc") }}>
                <Edit className="AppIcon" fontSize="30" />
              </div>
            </div>
            <textarea
              className={editType == 'tag-desc' ? "edit2-textarea enabled-textarea" : "edit2-textarea"} name="tag-desc" id=""
              value={editType == "tag-desc" ? editText : selectedItem.desc}
              disabled={!(editType == 'tag-desc')}
              onChange={(e) => setEditText(e.target.value)}></textarea>
            <div className="confirm-button-containers" style={{ display: editType == "tag-desc" ? "flex" : "none" }}>
              <button className="add-btn" onClick={() => { confirmEdit("tags", selectedItem.id, "desc", "tag") }}>Confirm</button>
              <button className="cancel-btn" onClick={() => { setEdit("", "") }} >Cancel</button>
            </div>
          </div>


        </div> : ""}



        {type == 'featuredG' ? <div className="featuredgame-edit-area edit-area">
          <div className="edit-header header5">
            <h3>Featured Game</h3>
            <h4>{selectedItem.name}</h4>
          </div>
          <div className="edit-body">
            <div className="edit2-title">
              <p>Tags</p>
              <div className="edit-button" onClick={() => { setEdit(selectedItem.desc, "fg-tags") }}>
                <Edit className="AppIcon" fontSize="30" />
              </div>
            </div>
            <div className="edit-body">

              <div className="tagSearch">

                <Select
                  isDisabled={editType != 'fg-tags'}
                  value={selectedTags}
                  options={searcHits}
                  isMulti
                  onChange={setselectedTags}
                  styles={customStyles}
                />

              </div>
            </div>

            <div className="confirm-button-containers" style={{ display: editType == "fg-tags" ? "flex" : "none" }}>
              <button className="add-btn" onClick={() => { confirmEditGameTags() }}>Confirm</button>
              <button className="cancel-btn" onClick={() => { setEdit("", "") }} >Cancel</button>
            </div>
          </div>

          <div className="edit-body">


            <div className="edit2-title">
              <div className="edit2-header header2">
                <div className="container-header">
                  <p>Featured Game Poster</p>
                  <div className="edit-button" onClick={() => { setEdit(selectedItem.imageURL, "fg-poster") }}>
                    <Edit className="AppIcon" fontSize="30" />
                  </div>
                </div>
                <label htmlFor="file-upload" className="custom-file-upload" style={{ cursor: editType === 'fg-poster' ? 'pointer' : 'not-allowed', opacity: editType === 'fg-poster' ? 1 : 0.5 }}>
                  Choose Poster
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleFileChange}
                  disabled={editType !== 'fg-poster'}
                  style={{ display: 'none' }}
                />



              </div>


              <img
                src={editType != 'fg-poster' ? selectedItem.imageURL : tempImage}
                alt="Poster Preview"
                className="poster-preview"

              />
              
            </div>

           
            <div className="confirm-button-containers" style={{ display: editType == "fg-poster" ? "flex" : "none" }}>
              <button className="add-btn" onClick={() => { confirmEditPoster(); }}>Confirm</button>
              <button className="cancel-btn" onClick={() => { setEdit("", ""); setPosterData(null); setTempImage(null); }} >Cancel</button>
            </div>
          </div>

          <div className="edit-body">
            <div className="edit2-title">
              <p>Desc</p>
              <div className="edit-button" onClick={() => { setEdit(selectedItem.desc, "fg-desc") }}>
                <Edit className="AppIcon" fontSize="30" />
              </div>
            </div>
            <textarea
              className={editType == 'fg-desc' ? "edit-textarea enabled-textarea" : "edit-textarea"} name="tag-desc" id=""
              value={editType == "fg-desc" ? editText : selectedItem.desc}
              disabled={!(editType == 'fg-desc')}
              onChange={(e) => setEditText(e.target.value)}></textarea>
            <div className="confirm-button-containers" style={{ display: editType == "fg-desc" ? "block" : "none" }}>
              <button onClick={() => { confirmEdit("featuredGames", selectedItem.id, "desc") }}>Confirm</button>
              <button onClick={() => { setEdit("", "") }} >Cancel</button>
            </div>
          </div>


        </div> : ""}



        {type == 'addTag' ?
          <div className="tag-edit-area add-area ">
            <div className="edit-header">
              <h3>Add a New Tag</h3>
              <p>Tag Name</p>
              <input className="input-tag-name" type="Text" placeholder="New tag's name" maxLength={10} onChange={(e) => setNewItem((prevState) => ({ ...prevState, name: e.target.value }))} />
            </div>

            <div className="edit-body">

              <div className="edit-title">
                <p>Category</p>
              </div>
              <div>
                <select className="category-combox" name="" id="" defaultValue={""} onChange={(e) => setNewItem((prevState) => ({ ...prevState, category: e.target.value }))}>
                  <option value="" style={{ color: 'gray' }} disabled>
                    Select an option
                  </option>
                  <option value="General Tags">GeneralTags</option>
                  <option value="Technical Tags">TechnicalTags</option>
                  <option value="Game-Specific Tags">GameSpecificTags</option>
                  <option value="Community Tags">CommunityTags</option>
                  <option value="Platforms">Platforms</option>
                </select>
              </div>

              <div className="edit-title">
                <p>Description</p>
              </div>
              <textarea className="edit-textarea" placeholder="New tag's description" name="new-tag-desc" id="" maxLength={50} onChange={(e) => setNewItem((prevState) => ({ ...prevState, desc: e.target.value }))}></textarea>
              <div className="confirm-button-containers">
                <button className="add-btn" onClick={() => { addNewItem("tags") }}>Confirm</button>
                <button className="cancel-btn" onClick={() => { setEdit("", "") }} >Cancel</button>
              </div>
            </div>
          </div> : ""}



        <div className="featuredgame-edit-area add-area " style={{ display: type == 'addFeaturedGame' ? "block" : "none" }}>
          <div className="edit-header">
            <h3>New Featured Game</h3>
            <p>Game Name</p>
            <input className="input-tag-name" type="Text" placeholder="New Featured Game's Name" maxLength={20} onChange={(e) => setNewItem((prevState) => ({ ...prevState, name: e.target.value }))} />
          </div>

          <div className="edit-body">


            <div className="edit-title">

              <div className="edit-header">
                <p>Featured Game Poster</p>
                <label className="file-btn-label" htmlFor="file-input">Choose File</label>
                <input id="file-input" className="file-btn" type="file" accept="image/png, image/jpeg" onChange={handleFileChange} />
              </div>

              {tempImage ? (
                <img src={tempImage} className="poster-preview" />
              ) : (
                <div className="poster-placeholder"><ImageIcon /></div>
              )}
            </div>

          </div>

          <div className="edit-body">


            <div className="edit-title">
              <p>Tags</p>
            </div>
            <div className="tagSearch">

              <Select

                options={searcHits}
                isMulti
                onChange={handleChange}
                styles={customStyles}
              />

            </div>
          </div>

          <div className="edit-body">

            <div className="edit-title">
              <p>Desc</p>
            </div>
            <textarea className="edit-textarea" placeholder="New tag's description" name="new-tag-desc" id="" maxLength={50} onChange={(e) => setNewItem((prevState) => ({ ...prevState, desc: e.target.value }))}></textarea>
            <div className="confirm-button-containers">
              <button className="add-btn btn2" onClick={() => { addNewItem("featuredGames"); }}>Confirm</button>
              <button className="cancel-btn btn2" onClick={() => { setEdit("", ""); setPosterData(null); setTempImage(null); }} >Cancel</button>
            </div>
          </div>
        </div>

      </div>
    </div>

  )


}

export default TagsAndFeaturedGames
