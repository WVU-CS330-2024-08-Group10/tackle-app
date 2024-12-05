import React, { useState } from 'react';
import Profile, { genericProfile } from '../components/Profile';
import Fishlist from '../components/Fishlist.js';
import { useAuth } from "../components/AuthProvider";

export default function Personal() {
    const [profile, setProfile] = useState(genericProfile);
    const { userName, isLoggedIn, brightness } = useAuth();
    let styles = {};

    if (brightness === 0) {
        styles = {borderColor: "black"};
    } else {
        styles = {borderColor: "white"};
    }

    return(
        <div id="profile">
            <div id="profile-left">
                <img id="profile-pfp" style={styles} src={profile.pfpUrl} alt="Your profile pic"/>
                <p><b>Username:</b> {profile.username}</p>
                <p><b>Nickname:</b> {profile.nickname}</p>
                <p><b>Gender:</b> {profile.gender}</p>

                <Profile profile={profile} setProfile={setProfile}/>
            </div>
            
            <div id="profile-right" style={styles}>
                {isLoggedIn ? (
                    <h1>Welcome back, {userName}!</h1>
                ) : (
                    <h1>Welcome back, {profile.nickname}!</h1>
                )}
                <h3>Fish List ({profile.fishlist.length}):</h3>

                <Fishlist profile={profile} setProfile={setProfile}/>
            </div>
        </div>
    );
}

