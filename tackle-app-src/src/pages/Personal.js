import React, { useState } from 'react';
import Profile, { genericProfile } from '../components/Profile';
import Fishlist from '../components/Fishlist.js';

export default function Personal() {
    const [profile, setProfile] = useState(genericProfile);

    return(
        <div id="profile"> 
            <div id="profile-left">
                <img id="profile-pfp" src={profile.pfpUrl} alt="Your profile picture"/>
                <p><b>Username:</b> {profile.username}</p>
                <p><b>Nickname:</b> {profile.nickname}</p>
                <p><b>Gender:</b> {profile.gender}</p>

                <Profile profile={profile} setProfile={setProfile}/>
            </div>
            
            <div id="profile-right">
                <h1>Welcome back, {profile.nickname}!</h1>
                <h3>Fish List ({profile.fishlist.length}):</h3>

                <Fishlist profile={profile} setProfile={setProfile}/>
            </div>
        </div>
    );
}

