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

// Returns true only if all obj's properties are 0
function objAllZero(obj) {Object.values(obj).every(value => value === 0);}

export default function Profile(props) {

    const profile = props.profile;
    const setProfile = props.setProfile;

    // PROFILE FORM STUFF
    const [renderProfileform, setRenderProfileform] = useState(false);
    const [profileEdit, setProfileEdit] = useState(genericProfile);
    const [profileError, setProfileError] = useState({
        pfp: false,
    });

    function openProfile() {
        setProfileEdit(profile);
        setRenderProfileform(true);
    }
    function submitProfile() {
        setRenderProfileform(false);
        setProfile(profileEdit);
    }
    function cancelProfile() {
        setRenderProfileform(false);
    }
    const checkPfp = (e) => {
        let error = 0;

        let file = e.target.files[0];
        const maxSize = 1 * 1024 * 1024;
        const allowedTypes = ["png", "jpeg", "gif"];
        let fileType = file.type.substring(file.type.indexOf('/') + 1);

        if (!allowedTypes.includes(fileType)) {
            error |= 1;
        }
        if (file.size > maxSize) {
            error |= 2;
        }

        if (error === 0) {
            setProfileEdit({...profileEdit, pfpUrl: URL.createObjectURL(file)});
        }
        setProfileError({...profileError, pfp: error});
    };

    return <>
        <button onClick={openProfile}>Edit profile</button>

        <ReactModal className="modal fishform-modal" overlayClassName="modal-overlay" isOpen={renderProfileform}>
            <form id="profileform">
                <h1>Editing Profile</h1>
                <div>
                    <p>
                        <img id="profileform-pfp-display" src={profileEdit.pfpUrl} alt="Uploaded profile picture"/>
                        <input id="profileform-pfp-input" name="pfp" type="file" onChange={checkPfp}></input>
                    </p>
                    {(profileError.pfp & 1) !== 0 && <p className="error">*File type must be png, jpg, or gif.</p>}
                    {(profileError.pfp & 2) !== 0 && <p className="error">*File size must be under 2 MB.</p>}

                    <p>
                        <label htmlFor="profileNickname">Nickname: </label>
                        <input id="profileNickname" name="profileNickname" value={profileEdit.nickname} onChange={(e) => setProfileEdit({...profileEdit, nickname: e.target.value}) } />
                    </p>
                    <p>
                        <label htmlFor="profileGender">Gender: </label>
                        <input id="profileGender" name="profileGender" value={profileEdit.gender} onChange={(e) => setProfileEdit({...profileEdit, gender: e.target.value}) } />
                    </p>
                </div>
                <p>
                    <button onClick={submitProfile}>Submit</button>
                    <button onClick={cancelProfile}>Cancel</button>
                </p>
            </form>
        </ReactModal>
    </>
}