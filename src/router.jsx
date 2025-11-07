import { createBrowserRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import AppWrapper from './components/AppWrapper.jsx'
import PostView from './views/postView.jsx';
import Login from './views/login.jsx';
import Register from './views/register.jsx';
import Default from './components/defaultLayout.jsx';
import Guest from './components/guestLayout.jsx';
import Home from './views/home.jsx';
import About from './views/about.jsx';
import Profile from './views/profile.jsx';
import PostCreate from './views/postCreate.jsx';
import CreateProfile from './views/createProfile.jsx';
import { PostFeedProvider } from './contexts/postContext.jsx';
import PostEdit from './views/postEdit.jsx';
import AdminPage from './views/AdminPage.jsx';
import TagsAndFeaturedGames from './views/tagAndFeatured.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import AccountView from './views/accountsView.jsx';
import { SearchProvider } from './contexts/searchContext.jsx';
import { AlertProvider } from './contexts/alertContext.jsx';
import LogsView from './views/LogsView.jsx';
// Mock function to check if the user is authenticated

const isAuthenticated = () => {
  ////console.log("BRUH")

  // return localStorage.getItem('USER_CREDS') != null;
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    ////console.log("BRUH")
      ; // Redirect to login if not authenticated
  }
  return children;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: (
    <SearchProvider>
    <AlertProvider>
    <AppWrapper>
      <Guest />
    </AppWrapper>
    </AlertProvider>
    </SearchProvider>),
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'home',
        element: <Home />,
      },
      {
        path: 'profile',
        element: <Profile />, // Example of another protected route
      },
      {
        path: 'about',
        element: <About />,
      },
      {
         path: '/postView',
        element:
            <PostFeedProvider>
              <PostView />
            </PostFeedProvider>
      },
    ]
  },
  
  {
    path: '/dashboard', // Parent route for authenticated users
    element: (
      <SearchProvider>
    <AlertProvider>
    <AppWrapper>
      <Default />
    </AppWrapper>
    </AlertProvider>
    </SearchProvider>
    ),
    children: [
    
      
      {
        path: 'postCreate',
        element: <PostCreate />, // Example of another protected route
      },
      {
        path: 'postEdit',
        element: <PostEdit />, // Example of another protected route
      },
      {
        path: 'Admin',
        element: <AdminPage />, // Example of another protected route
        children:[
          {
            path: 'Panel',
            element: <AdminPanel />, // Example of another protected route
          },
          {
            path: 'ManageTags',
            element: <TagsAndFeaturedGames />, // Example of another protected route
          },
          {
            path: 'ManageLogs',
            element: <LogsView />, // Example of another protected route
          },
          {
            path: 'ManageAccounts',
            element: <AccountView />, // Example of another protected route
          },
        ]
      }, 
      
      {
        path: 'createProfile',
        element: <CreateProfile />, // Example of another protected route
      },

    ]
  }
]);

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
}

export default router;
