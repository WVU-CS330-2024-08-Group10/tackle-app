import Profile from '../components/Profile';
import Fishlist from '../components/Fishlist.js';
import { useAuth } from "../components/AuthProvider";

export default function Personal() {
    const { profile, borderStyle } = useAuth();

    return(
        <div id="profile">
            <div id="profile-left">
                <img id="profile-pfp" style={borderStyle} src={profile.pfpURL} alt="Your profile pic"/>
                <p><b>Nickname:</b> {profile.nickname}</p>
                <p><b>Gender:</b> {profile.gender}</p>

                <Profile />
            </div>
            
            <div id="profile-right" style={borderStyle}>
                <h1>Welcome back, {profile.username}!</h1>
                <h3>Fish List ({profile.fishlist.length}):</h3>

                <Fishlist />
            </div>
        </div>
    );
}

