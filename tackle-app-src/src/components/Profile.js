import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { Link } from 'react-router-dom';
import { useAuth } from "../components/AuthProvider";
const reqs = require('./AccountReqs.json');

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
            weight: 53, // lbs?
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

export default function Profile(props) {

    const profile = props.profile;
    const setProfile = props.setProfile;

    const [renderProfileform, setRenderProfileform] = useState(false);
    const [profileEdit, setProfileEdit] = useState(genericProfile);
    const [errors, setErrors] = useState({...errorsInit});
    const { brightNess } = useAuth();
    let classes = "";
    let overlayClass = "";

    if (brightNess === 0) {
        classes = "modal-light form-modal";
        overlayClass = "modal-overlay-light";
    } else {
        classes = "modal-dark form-modal";
        overlayClass = "modal-overlay-dark";
    }

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

    const checkUsername = (e) => {
        let error = 0;
        let input = e.target.value;

        // check if meets minimum length
        if (input.length < reqs.username.minLength) error |= reqs.error.MIN_LENGTH;
        // check if meets maximum length
        if (input.length > reqs.username.maxLength) error |= reqs.error.MAX_LENGTH;
        // check if is alphanumeric, underscore, or dash
        if (!input.match(reqs.username.regEx)) error |= reqs.error.REGEX;

        setProfileEdit({...profileEdit, username: input});
        setErrors({...errors, username: error});
    }
    function onDeselectUsername() {
        if (errors.username > 0) {
            setErrors({...errors, showUsername: true});
        } else {
            setErrors({...errors, showUsername: false});
        }
    }

    const checkPfp = (e) => {
        let error = 0;

        let file = e.target.files[0];
        let fileType = file.type.substring(file.type.indexOf('/') + 1);

        // check if file is of valid type (image file only)
        if (!reqs.pfp.allowedTypes.includes(fileType)) error |= reqs.error.FILE_TYPE;
        // check if file is of valid size
        if (file.size > reqs.pfp.maxSizeMB * 1024 * 1024) error |= reqs.error.MAX_SIZE;

        if (error === 0) {
            setProfileEdit({...profileEdit, pfpUrl: URL.createObjectURL(file)});
        }
        setErrors({...errors, pfp: error});
    };

    return <>
        <button onClick={openProfile}>Edit profile</button>

        <ReactModal className={classes} overlayClassName={overlayClass} isOpen={renderProfileform}>
                <h1>Editing Profile</h1>
                <div>
                    <p>
                        <img id="profileform-pfp-display" src={profileEdit.pfpUrl} alt="Uploaded profile pic"/>
                        <input id="profileform-pfp-input" name="pfp" type="file" onChange={checkPfp}></input>
                    </p>
                    {(errors.pfp & reqs.error.FILE_TYPE) !== 0 && <p className="error">*File type must be {reqs.pfp.allowedTypes.slice(0,-1).map((str) => `${str}, `)} or {reqs.pfp.allowedTypes.slice(-1)[0]}.</p>}
                    {(errors.pfp & reqs.error.MAX_SIZE) !== 0 && <p className="error">*File size must be under {reqs.pfp.maxSizeMB} MB.</p>}
                </div>
                <div>
                    <p>
                        <label htmlFor="profileUsername">Username: </label>
                        <input id="profileform-username" name="profileUsername" value={profileEdit.username} onBlur={onDeselectUsername} onChange={checkUsername} />
                    </p>
                    
                    {errors.showUsername && <>
                        {(errors.username & reqs.error.MIN_LENGTH) !== 0 && <p className="error">*Username must be at least {reqs.username.minLength} characters long.</p>}
                        {(errors.username & reqs.error.MAX_LENGTH) !== 0 && <p className="error">*Username must be at most {reqs.username.maxLength} characters long.</p>}
                        {(errors.username & reqs.error.REGEX) !== 0 && <p className="error">*Username must consist of letters, numbers, dashes, or underscores.</p>}
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
                <Link className="formbutton-delete" id={`deleteaccount-button`} key={`deleteaccount-button`} to={`/DeleteAccount`}><button>Delete Account</button></Link>
                <button className="formbutton-cancel" onClick={cancelProfile}>Cancel</button>

        </ReactModal>
    </>
}