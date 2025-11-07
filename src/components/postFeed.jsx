import PropTypes from "prop-types";
import '../styles/PostFeed.css';
import Post from "./post";
import { useEffect, useState } from "react";
import { fetchAllEntries } from "../firebaseOperations";
import LoadingScreen from "./loadingScreen";
import { UseAuthContext } from "../contexts/authContext";
const PostFeed = (props) => {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false)
    const [matchingPosts, setMatchingPostss] = useState([])
    const { user } = UseAuthContext();

    function addToMatchPost(postId) {
        setMatchingPostss((prevPosts) => {
            if (!prevPosts.includes(postId)) {
                return [...prevPosts, postId]; // Add the postId if not already present
            } 
            
            else {
               
                return prevPosts.filter((id) => id !== postId); // Remove the postId if it exists

            }
        });
    }

    useEffect(() => {

        ////console.log(props.filterText)

        async function fetchPosts() {
            setMatchingPostss([])

            setLoading(true)

            const postArray = [];
            //Fetch all the posts from the database, and sort them according to the dates.
            const fetchedPosts = await fetchAllEntries("posts", 'postDate');
            setLoading(false)

            //To make sure that the component is scalable, the posts can also be filtered 

            function mayBeSubarrays(arr1, arr2) {
                let set1 = new Set(arr1 ?? []);
                let set2 = new Set(arr2 ?? []);
                return ([...set1].every(item => set2.has(item)) || [...set2].every(item => set1.has(item)) || (set2.size === 0 && set1.size !== 0));
            }


            if (props.filter || props.filterText != '') {
                fetchedPosts.forEach(
                    post => {


                        //console.log(postArray)



                        if (!mayBeSubarrays(post.tags, props.tags)) {
                            return
                        }

                        if (post.tags.length < 0) {
                            //console.log('asas')

                            addToMatchPost(post.id)
                        }  

                        // const user =  await getDoc(post.uid);
                        for (const key in post) {
                            ////console.log(key)
                            ////console.log("filter: ", props.filter)
                            const element = post[key];
                            // //console.log('element:')
                            // //console.log(element)


                            if (['username', 'handle', 'username', 'body', 'tags'].includes(key) || props.filter == '') {

                                const elementString = element ? element.toString().toLowerCase() : '';

                                // //console.log('comparing:');
                                // //console.log(elementString);
                                // //console.log(props.filterText);
                                // //console.log(elementString.includes(props.filterText && props.filterText.toLowerCase()));
                                if (elementString.includes(props.filterText && props.filterText.toLowerCase())) {

                                    addToMatchPost(post.id);

                                    if (postArray.some(storedPost => storedPost.id === post.id)) {
                                        //console.log("DUPE ")
                                        return
                                    } else {
                                        addToMatchPost(post.id)

                                    }

                                    postArray.push({
                                        id: post.id,
                                        post: <Post key={post.id} id={post.id} postDeets={{ ...post }} postView={false} />
                                    })

                                } else {
                                    ////console.log('Element String is:', elementString)
                                }

                            }
                        }
                    });
            } else {
                fetchedPosts.forEach(
                    post => {

                        if (!mayBeSubarrays(post.tags, props.tags)) {
                            return
                        }


                        if (post.tags != null || post.tags.length !== 0) {
                            addToMatchPost(post.id)
                        }

                        // const user =  await getDoc(post.uid);

                        if (postArray.some(storedPost => {
                            storedPost.id === post.id
                        })) {
                            return
                        }

                        postArray.push({
                            id: post.id,
                            post: <Post key={post.id} id={post.id} postDeets={{ ...post }} postView={false} />
                        })
                    });
            }
            setPosts(postArray)
        }
        fetchPosts()
        return;
    }, [props])

    useEffect(() => {
        ////console.log(matchingPosts);
    }, [posts])
    //console.log(posts)
    //console.log(matchingPosts)
    return (
        <div className="post-feed-box">
            {loading ? <LoadingScreen /> : <></>}

            {/* After wrapping each entry of the fetched data in their respective post jsx components, 
            they can all be rendered in one instance here  */}
            {props.tags.length !== 0 ?
                <div>
                    {matchingPosts.length} posts found.
                </div>
                : <></>}
            {

                posts.length >= 1 ? posts.map((post) => {

                    // if (matchingPosts.includes(post.id)) {
                        return post.post
                    // } else {
                    //     //console.log('not in matchingPosts...')
                    // }

                }) : <>
                    No posts found.
                </>

            }

        </div>
    );
}

PostFeed.propTypes = {

    filter: PropTypes.string,
    filterText: PropTypes.string,
    tags: PropTypes.array

}


export default PostFeed;


