import PropTypes from "prop-types";
import '../styles/UserPane.css';
import Select from 'react-select';
import Report from '@mui/icons-material/Flag';

import { useEffect, useState } from "react";
import { laraveLOG, updateEntry, getEntryById } from "../firebaseOperations";
import LoadingScreen from "./loadingScreen";
import { useNavigate } from "react-router-dom";
import { useAlertContext } from '../contexts/alertContext';
import { UseAuthContext } from "../contexts/authContext";
alert

const UserPane = (props) => {

    const {user} = UseAuthContext();
    const [fetchedUser, setFetchedUser] = useState("");
    const [penalizing, setPenalizing] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedDuration, setSelectedDuration] = useState(null);
    const [penaltyloading, setPenaltyLoading] = useState();
    const [calculatedDate, setCalculatedDate] = useState(null);
    const [profilePic, setprofilePic] = useState();
    const navigate = useNavigate();
    const alert = useAlertContext();
    const suspensionDate = fetchedUser?.suspension ? new Date(fetchedUser.suspension) : null;
    const suspended = (fetchedUser?.suspension == null || (suspensionDate && suspensionDate.getTime() <= new Date().getTime()));

    const importAsset = async (fileName) => {
        try {
            if (!fileName || fileName.startsWith('http') || fileName.startsWith('data:')) {
                return fileName ?? null;
            }
            const asset = await import(fileName);
            return asset.default;
        } catch (error) {
            console.error('Error loading asset:', error);
            return null;
        }
    };


    async function getUserDeets(uid) {

        setLoading(true);
        try {
            const docSnap = await getEntryById('users', uid);

            if (!docSnap) {
                setLoading(false);
                return null;
            }
            const {
                username,
                handle,
                profilePic: profilePath,
                dateJoined,
                banned,
                suspension,
            } = docSnap;
            importAsset(profilePath).then(setprofilePic);

            setFetchedUser({
                username,
                id: docSnap.id,
                handle,
                profilePic: profilePath,
                dateJoined,
                banned,
                suspension,
            });
            importAsset(fetchedUser.profilePic).then(setprofilePic)




        } catch (error) {
            console.error(error)
        }

        setLoading(false)

    }

    async function suspend(penaltyDuration) {

        setPenaltyLoading(true);
        try {
            const suspenddAcc = await updateEntry('users', fetchedUser.id, { suspension: penaltyDuration });
            laraveLOG(`Admin user(${user.handle}) ${user.id} has suspended user(${fetchedUser.id}) until: \n  ${penaltyDuration} `)
            ////console.log(suspenddAcc)
            alert.success('Suspended successfully!')

        } catch (error) {
            alert.error('Suspension unsusccessful...')
            console.error(error)

        }

        getUserDeets(props.userDeets.id)
        setPenalizing("")
        setPenaltyLoading(false)
    }



    async function ban(banStatus) {
        setPenaltyLoading(true);
        try {
            const bannedAcc = await updateEntry('users', fetchedUser.id, { banned: banStatus });
            ////console.log(bannedAcc)
            alert.success(`account ${banStatus ? "" : "un"}banned successfully!`)
            laraveLOG(`Admin user(${user.handle}) ${user.id} has banned a user(${fetchedUser.id})`)
        } catch (error) {
            alert.error('Ban unsusccessful...')
            console.error(error)
        }

        getUserDeets(props.userDeets.id)
        setPenalizing("")
        setPenaltyLoading(false)
    }




    const handleDurationChange = (selectedOption) => {
        setSelectedDuration(selectedOption);
        // Calculate the new date
        const currentDate = new Date();
        const newDate = new Date(currentDate);
        newDate.setMinutes(currentDate.getMinutes() + selectedOption.value);

        setCalculatedDate(newDate);
    };


    const durations = [
        { value: 10, label: "10 minutes" },
        { value: 30, label: "30 minutes" },
        { value: 60, label: "1 hour" },
        { value: 120, label: "2 hours" },
        { value: 240, label: "4 hours" },
        { value: 480, label: "8 hours" },
    ];
    useEffect(() => {

        getUserDeets(props.userDeets.id);

    }, [props.userDeets.id])


    if (suspensionDate && suspensionDate.getTime() >= new Date().getTime()) {
        ////console.log(fetchedUser.username, `\n`, `suspended date: ` + suspensionDate)
    }


    function timeLeft() {
        const now = new Date();

        const diffInSeconds = Math.floor((suspensionDate - now) / 1000);

        const intervals = [
            { label: 'second', seconds: 1 },
            { label: 'minute', seconds: 60 },
            { label: 'hour', seconds: 3600 },
            { label: 'day', seconds: 86400 },
            { label: 'month', seconds: 2592000 },
            { label: 'year', seconds: 31536000 }
        ];

        for (let i = intervals.length - 1; i >= 0; i--) {
            const interval = intervals[i];
            const intervalValue = Math.floor(diffInSeconds / interval.seconds);

            if (intervalValue > 0) {
                return `Suspended for ${intervalValue} ${interval.label}${intervalValue > 1 ? 's' : ''}`;
            }
        }

        return '';  // For cases like 0 seconds difference
    }

    const SuspendBox = () =>
        <div className="overlay" >
            <div className="overlay2" >

                {penaltyloading ? <LoadingScreen /> : <></>}

                <div className="report-post-box">


                    {fetchedUser.suspension == null || suspensionDate.getTime() <= new Date().getTime() ? <div>

                        <div className="report-post-header">
                            <Report />
                            <h1>Suspend this account </h1>
                        </div>

                        <h3>Select Duration</h3>
                        <Select className="select-duration"
                            value={selectedDuration}
                            options={durations}
                            onChange={handleDurationChange}
                            placeholder="Select duration"
                        />
                        {calculatedDate && (
                            <div style={{ marginTop: "20px" }}>
                                <h4>This user will be suspended until:</h4>
                                <p>{calculatedDate.toString()}</p>
                            </div>
                        )}
                        <div className="button-row2">
                            <button className="Suspendbtn" disabled={calculatedDate == null} onClick={() => suspend(calculatedDate)}>Suspend</button>
                            <button className="Cancelbtn2" onClick={() => setPenalizing(null)}>Cancel</button>
                        </div>

                    </div> :
                        <div>
                            <div className="report-post-header">
                                <Report />
                                <h1>Unsuspend this account? </h1>
                            </div>

                            <div className="button-row2">
                                <button className="Suspendbtn" onClick={() => suspend(new Date())}>Confirm</button>
                                <button className="Cancelbtn2" onClick={() => setPenalizing(null)}>Cancel</button>
                            </div>

                        </div>


                    }


                </div>

            </div>
        </div>

    const BanBox = () =>
        <div className="overlay" >
            <div className="overlay2" >
                {penaltyloading ? <LoadingScreen /> : <></>}

                <div className="report-post-box">
                    <div className="report-post-header">
                        <Report />
                        <h1> {fetchedUser.banned ? "Unban" : "Ban"} this user? </h1>
                    </div>


                    <div className="button-row2">
                        <button className="Banbtn" onClick={() => { ban(!fetchedUser.banned) }}>{fetchedUser.banned ? "Unban" : "Ban"}</button>
                        <button className="Cancelbtn2" onClick={() => setPenalizing(null)}>Cancel</button>
                    </div>

                </div>

            </div>
        </div>



    return (
        loading ? <LoadingScreen /> : <div className="user-pane-box">

            {penalizing == "ban" ? <BanBox /> : <></>}
            {penalizing == "suspend" ? <SuspendBox /> : <></>}


            <div className="user-pane-header user-pane-child">
                <div className="user-pane-user-box">
                    <div className="profile-image-container icon-profile"

                        onClick={(e) => { e.stopPropagation(); navigate(`/profile?userId=${props.userDeets.id}`) }}
                    >
                        <img src={profilePic ?? ''} alt="" />
                    </div>
                    <div className="username-container" style={{ color: fetchedUser.banned ? "#ef6249" : (!suspended ? "#eccb48" : "white") }}>                        <p><strong>{fetchedUser.username ? fetchedUser.username : "sampleUser"}</strong>
                        <span className="handletext"><br></br>@{fetchedUser.handle ? fetchedUser.handle : "sampleHandle"}</span></p>
                    </div>
                    <div className="user-pane-buttons-box">
                        {suspended ?

                            <>


                                <button className="Suspendbtn" onClick={() => {
                                    if (fetchedUser.banned) {
                                        alert.error("You can't suspend banned users~")
                                        return
                                    }
                                    setPenalizing("suspend")
                                }}>
                                    Suspend
                                </button> </> :
                            <>
                                <p className="suspensiontimer">{timeLeft()} </p>

                                <button className="Suspendbtn" onClick={() => setPenalizing("suspend")}>
                                    Remove Suspension
                                </button></>}
                        {fetchedUser.banned == null || fetchedUser.banned == false ?
                            <button className="Banbtn" onClick={() => setPenalizing("ban")}>
                                Ban
                            </button> :
                            <button className="Banbtn" onClick={() => setPenalizing("ban")}>
                                Unban User
                            </button>}

                    </div>
                </div>

            </div>

        </div>

    );
}

UserPane.propTypes = {

    userDeets: PropTypes.object,
    userRef: PropTypes.object

}


export default UserPane;


