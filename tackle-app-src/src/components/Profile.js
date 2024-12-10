import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { Link } from 'react-router-dom';
import { useAuth } from "../components/AuthProvider";
const reqs = require('./AccountReqs.json');
const defaultPfp = require('../assets/defaultPfp.png');

export const emptyProfile = {
    username: "localUser",
    nickname: "Unregistered User",
    pfpUrl: null,
    pfpFileType: "none",
    gender: "not set",
    darkmode: false,
    favSpots: [],
    fishlist: []
}

// old profile used for examples. depricated
export const genericProfile = {
    username: "JeremyWade_Official",
    nickname: "Jeremy Wade",
    pfpURL: require('../assets/jeremyPfp.jpg'),
    pfpFileType: "none",
    gender: "male",
    darkmode: false,
    favSpots: [],
    fishlist: [
        {
            species: "Catfish",
            nickname: "Big John",
            timeCaught: new Date().getTime(),
            bodyCaught: "Poca River",
            weight: 51, // lbs?
            length: 22, // inches?
            sex: -1,
            tackled: "Very Good Bait"
        },
        {
            species: "Catfinch",
            nickname: "Little John",
            timeCaught: new Date().getTime(),
            bodyCaught: "Kanawha River",
            weight: 53, // lbs?
            length: 22, // inches?
            sex: -1,
            tackled: "Very Good Bait"
        },
        {
            species: "A trout",
            nickname: "slipper",
            timeCaught: new Date().getTime(),
            bodyCaught: "Coal River",
            weight: 52, // lbs?
            length: 22, // inches?
            sex: -1,
            tackled: "Very Good Bait"
        }
    ]
};

const errorsInit = {
    username: 0,
    showUsername: false,
    pfp: 0,
};

export default function Profile() {

    const { profile, setProfile, isLoggedIn, setPfpFile } = useAuth();

    const [renderProfileform, setRenderProfileform] = useState(false);
    const [profileEdit, setProfileEdit] = useState(emptyProfile);
    const [errors, setErrors] = useState({...errorsInit});

    function openProfile() {
        setProfileEdit(profile);
        setErrors({...errorsInit});
        setRenderProfileform(true);
    }
    function submitProfile() {
        if (errors.username > 0) {
            return;
        }

        setRenderProfileform(false);
        setProfile(profileEdit);
    }
    function cancelProfile() {
        setRenderProfileform(false);
    }

    const checkPfp = (e) => {
        let error = 0;

        const file = e.target.files[0];
        let fileType = file.type.substring(file.type.indexOf('/') + 1);

        // check if logged in
        if (!isLoggedIn) error |= reqs.error.NOT_LOGGED_IN;
        // check if file is of valid type (image file only)
        if (!reqs.pfp.allowedTypes.includes(fileType)) error |= reqs.error.FILE_TYPE;
        // check if file is of valid size
        if (file.size > reqs.pfp.maxSizeMB * 1024 * 1024) error |= reqs.error.MAX_SIZE;

        if (error === 0) {
            setPfpFile(file);
            setProfileEdit({...profileEdit, pfpURL: URL.createObjectURL(file), pfpFileType: fileType});
        }
        setErrors({...errors, pfp: error});
    };

    return <>
        <p><button id="edit_button" onClick={openProfile}><i class="material-icons">settings</i>Edit Profile</button></p>
        <ReactModal className={(profile.darkmode ? "modal-dark" : "modal-light") + " form-modal"} overlayClassName={profile.darkmode ? "modal-overlay-dark" : "modal-overlay-light"} isOpen={renderProfileform}>
                <h1>Editing Profile</h1>
                <div>
                    <p>
                        <img id="profileform-pfp-display" src={reqs.pfp.allowedTypes.includes(profileEdit.pfpFileType) ? profileEdit.pfpURL : defaultPfp} alt="Uploaded profile pic"/>
                        <input id="profileform-pfp-input" name="pfp" type="file" onChange={checkPfp}></input>
                    </p>
                    {(errors.pfp & reqs.error.NOT_LOGGED_IN) !== 0 && <p className="error">*Must be logged in to set a profile picture.</p>}
                    {(errors.pfp & reqs.error.FILE_TYPE) !== 0 && <p className="error">*File type must be {reqs.pfp.allowedTypes.slice(0,-1).map((str) => `${str}, `)} or {reqs.pfp.allowedTypes.slice(-1)[0]}.</p>}
                    {(errors.pfp & reqs.error.MAX_SIZE) !== 0 && <p className="error">*File size must be under {reqs.pfp.maxSizeMB} MB.</p>}
                </div>
                <div>

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
                <Link className="formbutton-delete" id={`deleteaccount-button`} key={`deleteaccount-button`} to={`/DeleteAccount`}><button>Delete Account</button></Link>
                <button className="formbutton-cancel" onClick={cancelProfile}>Cancel</button>

        </ReactModal>
    </>
}