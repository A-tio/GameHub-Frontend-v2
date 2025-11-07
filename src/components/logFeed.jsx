import "../styles/logFeed.css";
import { useEffect, useState } from "react";
import { fetchAllEntries } from "../firebaseOperations";
import LoadingScreen from "./loadingScreen";

const LogFeed = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchPosts() {
            setLoading(true);

            // Fetch logs from Firestore
            const fetchLogs = await fetchAllEntries("gamer-hub-logs", "date");
            setLoading(false);

            // Format logs properly
            const logsArray = fetchLogs.map(log => ({
                date: log.date instanceof Date ? log.date.toLocaleString() : new Date(log.date).toLocaleString(),
                message: log.message,
            }));

            setLogs(logsArray);
        }

        fetchPosts();
    }, []);

    return (
        <div className="log-feed-container">
            {loading && <LoadingScreen />}
            <table className="log-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Message</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.length > 0 ? (
                        logs.map((log, index) => (
                            <tr key={index}>
                                <td>{log.date}</td>
                                <td>{log.message}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2" className="no-logs">No logs available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default LogFeed;
