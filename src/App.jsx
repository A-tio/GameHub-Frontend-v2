import { useEffect, useState } from "react";
import { subscribeToCollection } from "./mockData";

function App() {
  const [userArray, setUserData] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToCollection('users', (snapshot) => {
      setUserData(snapshot);
    });

    return unsubscribe;
  }, []);

  const rows = userArray.map(user => (
    <li key={user.id}><a href="edit">See this user's posts</a> {user.username}</li>
  ));

  return (
    <div>

      <button>New user</button>
      <ul>
        {rows}

        </ul>

        <div className="post-feed">
          <div className="post-container">

          </div>
        </div>
    </div>
  )
}

export default App;
