import "../styles/PostPage.css"
import PostFeed from "../components/postFeed";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { UseAuthContext } from "../contexts/authContext";
import Forum_icon from "../assets/images/forum_icon.png";
import Comment_icon from "../assets/images/comment_icon.png";
import Bolt from "../assets/images/bolt_icon.png";
import { fetchAllEntries, } from "../firebaseOperations";
import TrendingFeed from "../components/trendingFeed";
import { useSearchContext } from "../contexts/searchContext";

function Home() {

  const navigate = useNavigate();
  const { user } = UseAuthContext();
  const [tags, setTags] = useState([])
  const { selectedTags, setSelectedTags, searchText } = useSearchContext();

  const scrollContainerRef = useRef(null);
  // useEffect(() => {
  //   ////console.log(tags.length)
  //   if (tags.length > 0) { 
  //     tags.forEach(tag => {
  //       const tagContainer = <div key={tag.name} className="banner-container box ">
  //         <p id={tag.name} key={tag.name}> {tag.name}</p>
  //       </div>

  //       tagSlot.push(tagContainer)
  //     })
  //   }
  //   ////console.log(tagSlot)

  // }, [tags])

  // tryPenetrate();

  const addTag = (tag) => {
    const tagPill = document.getElementById(tag);
    ////console.log(tag);

    setSelectedTags((prevTags) => {
      if (!prevTags.includes(tag)) {
        tagPill.classList.add("active-tag");
        ////console.log(" to search tags, added");
        return [...prevTags, tag]; // Add the tag
      } else {
        tagPill.classList.remove("active-tag");
        ////console.log("spliced");
        return prevTags.filter((t) => t !== tag); // Remove the tag
      }
    });

  }


  useEffect(() => {
    //This method is used to operate the horizontally-scrollable 
    //tag list that appears below the searchbar
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) return; // Ensure it exists

    let isDragging = false;
    let startX, scrollLeft;

    const handleMouseDown = (e) => {
      isDragging = true;
      scrollContainer.classList.add("active");
      startX = e.pageX - scrollContainer.offsetLeft;
      scrollLeft = scrollContainer.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDragging = false;
      scrollContainer.classList.remove("active");
    };

    const handleMouseUp = () => {
      isDragging = false;
      scrollContainer.classList.remove("active");
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - scrollContainer.offsetLeft;
      const walk = (x - startX) * 2; // Adjust scroll speed
      scrollContainer.scrollLeft = scrollLeft - walk;
    };

    // Add event listeners
    scrollContainer.addEventListener("mousedown", handleMouseDown);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);
    scrollContainer.addEventListener("mouseup", handleMouseUp);
    scrollContainer.addEventListener("mousemove", handleMouseMove);



    //Get all the tags from the server 
    async function fetchTags() {
      const tagsArr = []

      const fetchedTags =
        //This function right here is a general one, it just takes
        //the name of the firestore collection and how to sort it. 
        await fetchAllEntries( "tags", 'name');
      fetchedTags.forEach(tag => {

        //Once all the tags have been fetched, stuff them into generated <div>'s into an array 
        const tagContainer = <div id={tag.name} key={tag.name} title={tag.desc} className={`banner-container box ${selectedTags.includes(tag.name) ? "active-tag" : ""}`} 
        
        onClick={() => {

          addTag(tag.name)

        }}>
          <p id={tag.name} key={tag.name}> {tag.name}</p>
        </div>
        tagsArr.push(tagContainer)
      });

      //Once it all gets generated, set it to the array that will be rendered later. 
      setTags(tagsArr);
    }

    fetchTags();
    // Cleanup event listeners on unmount
    return () => {
      scrollContainer.removeEventListener("mousedown", handleMouseDown);
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
      scrollContainer.removeEventListener("mouseup", handleMouseUp);
      scrollContainer.removeEventListener("mousemove", handleMouseMove);
    };

  }, []); // Empty dependency array ensures this runs only once on mount

  // useEffect(() => {
  //   ////console.log("selected tags: ", selectedTags)
  // }, [selectedTags])

  
  useEffect(() => {
    ////console.log("selected tags: ", selectedTags)
  }, [searchText])

  
  return (
    <div className="home">

      <div key={"jomemama"} className="banner-screen" ref={scrollContainerRef} style={{ userSelect: "none" }}>
        {tags}


      </div>
      <div className="content-screen">

        <div className="content-screen2">

          <div className="posts-header box">
            <div className="title-box">
              <img src={Forum_icon} /><h1>Discussions</h1>
            </div>
            <div className="create-post-button-container" style={{ display: user ? "block" : "none" }}>
              <button onClick={() => { navigate("/dashboard/postCreate") }} className="create-post-btn"> <img src={Comment_icon} /> <span></span> Start a Discussion? </button>
            </div>
          </div>

          <div className="posts-screen box">

            {/* This right here is a jsx component that receives filters to house all the posts later. */}
            <PostFeed filter ='' filterText={searchText} tags={selectedTags} />
          </div>
        </div>

        <div className="side-screen box">

          <h3><img src={Bolt} />Trending posts</h3>

          <div className="trending-box">
            {/* Another separate JSX component, it renders a simple list of the trending posts. */}
            <TrendingFeed />
          </div>

        </div>
      </div>

    </div>
  )


}

export default Home
