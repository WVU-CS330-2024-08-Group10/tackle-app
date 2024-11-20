import React, { useState } from 'react';
import ReactModal from 'react-modal';

export const genericProfile = {
    id: 1,
    username: "JeremyWade_Official",
    nickname: "Jeremy Wade",
    pfpUrl: require('../assets/jeremyPfp.jpg'),
    gender: "male",
    favSpots: [],
    fishlist: [
        {
            species: {
                name: "Catfish"
            },
            nickname: "Big John",
            timeCaught: new Date().getTime(),
            bodyCaught: "Poca River, WV", // REPLACE WITH some sort of location object later
            weight: 51, // lbs?
            length: 22, // inches?
            sex: -1,
            tackled: "Very Good Bait"
        },
        {
            species: {
                name: "Catfinch"
            },
            nickname: "Little John",
            timeCaught: new Date().getTime(),
            bodyCaught: "Kanawha River, WV", // REPLACE WITH some sort of location object later
            weight: 51, // lbs?
            length: 22, // inches?
            sex: -1,
            tackled: "Very Good Bait"
        },
        {
            species: {
                name: "A trout"
            },
            nickname: "slipper",
            timeCaught: new Date().getTime(),
            bodyCaught: "Coal River, WV", // REPLACE WITH some sort of location object later
            weight: 51, // lbs?
            length: 22, // inches?
            sex: -1,
            tackled: "Very Good Bait"
        }
    ]
};

const profileErrorInit = {
    username: 0,
    showUsername: false,
    pfp: 0,
};

export default function Profile(props) {

    const profile = props.profile;
    const setProfile = props.setProfile;

    const [renderProfileform, setRenderProfileform] = useState(false);
    const [profileEdit, setProfileEdit] = useState(genericProfile);
    const [profileError, setProfileError] = useState({...profileErrorInit});

    function openProfile() {
        setProfileEdit(profile);
        setProfileError({...profileErrorInit});
        setRenderProfileform(true);
    }
    function submitProfile() {
        if (profileError.username > 0) {
            return;
        }

        setRenderProfileform(false);
        setProfile(profileEdit);
    }
    function cancelProfile() {
        setRenderProfileform(false);
    }

    const checkUsername = (e) => {
        let error = 0;
        let username = e.target.value;

        // check if meets minimum length
        if (username.length < 4) error |= 1;
        // check if meets maximum length
        if (username.length > 20) error |= 2;
        // check if is alphanumeric, underscore, or dash
        if (!/^[a-zA-Z0-9-_]*$/.test(username)) error |= 4;

        setProfileEdit({...profileEdit, username: username});
        setProfileError({...profileError, username: error});
    }
    function onDeselectUsername() {
        if (profileError.username > 0) {
            setProfileError({...profileError, showUsername: true});
        } else {
            setProfileError({...profileError, showUsername: false});
        }
    }

    const checkPfp = (e) => {
        let error = 0;

        let file = e.target.files[0];
        const maxSize = 1 * 1024 * 1024;
        const allowedTypes = ["png", "jpeg", "gif"];
        let fileType = file.type.substring(file.type.indexOf('/') + 1);

        // check if file is of valid type (image file only)
        if (!allowedTypes.includes(fileType)) error |= 1;
        // check if file is of valid size
        if (file.size > maxSize) error |= 2;

        if (error === 0) {
            setProfileEdit({...profileEdit, pfpUrl: URL.createObjectURL(file)});
        }
        setProfileError({...profileError, pfp: error});
    };

    return <>
        <button onClick={openProfile}>Edit profile</button>

        <ReactModal className="modal form-modal" overlayClassName="modal-overlay" isOpen={renderProfileform}>
                <h1>Editing Profile</h1>
                <div>
                    <p>
                        <img id="profileform-pfp-display" src={profileEdit.pfpUrl} alt="Uploaded profile picture"/>
                        <input id="profileform-pfp-input" name="pfp" type="file" onChange={checkPfp}></input>
                    </p>
                    {(profileError.pfp & 1) !== 0 && <p className="error">*File type must be png, jpg, or gif.</p>}
                    {(profileError.pfp & 2) !== 0 && <p className="error">*File size must be under 2 MB.</p>}
                </div>
                <div>
                    <p>
                        <label htmlFor="profileUsername">Username: </label>
                        <input id="profileform-username" name="profileUsername" value={profileEdit.username} onBlur={onDeselectUsername} onChange={checkUsername} />
                    </p>
                    
                    {profileError.showUsername && <>
                        {(profileError.username & 1) !== 0 && <p className="error">*Username must be at least 4 characters long.</p>}
                        {(profileError.username & 2) !== 0 && <p className="error">*Username must be at most 20 characters long.</p>}
                        {(profileError.username & 4) !== 0 && <p className="error">*Username must consist of letters, numbers, dashes, or underscores.</p>}
                    </>}


                    <p>
                        <label htmlFor="profileNickname">Nickname: </label>
                        <input id="profileform-nickname" name="profileNickname" value={profileEdit.nickname} onChange={(e) => setProfileEdit({...profileEdit, nickname: e.target.value}) } />
                    </p>
                    <p>
                        <label htmlFor="profileGender">Gender: </label>
                        <input id="profileform-gender" name="profileGender" value={profileEdit.gender} onChange={(e) => setProfileEdit({...profileEdit, gender: e.target.value}) } />
                    </p>
                </div>

                <button className="formbutton-submit" onClick={submitProfile}>Submit</button>
                <button className="formbutton-cancel" onClick={cancelProfile}>Cancel</button>

        </ReactModal>
    </>
}