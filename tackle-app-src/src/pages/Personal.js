import React, { useState } from 'react';
import ReactModal from 'react-modal';

const emptyFish = {
    species: {
        name: ""
    },
    nickname: "",
    timeCaught: 0,
    bodyCaught: "",
    weight: null,
    length: null,
    sex: -1,
    tackled: ""
}
const genericProfile = {
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

// Format date object to the appropriate string for the value of an HTML local-datetime input 
function dateToLocalDatetimeString(date) {
    return new Date(date.getTime() + new Date().getTimezoneOffset() * -60 * 1000).toISOString().substring(0, 16);
}

export default function Personal() {
    ReactModal.setAppElement('body');

    const [profile, setProfile] = useState(genericProfile);

    // FISH FORM STUFF
    const [fishIndex, setFishIndex] = useState(-1); // index in fishlist of fish being edited
    const [renderFishform, setRenderFishform] = useState(false); 
    const [isFishformEditing, setIsFishformEditing] = useState(false); // indicates whether a fish is being edited (true) or added (false)
    const [fishEdit, setFishEdit] = useState(emptyFish); // fish in fishform being edited

    function swapFish(index1, index2) {
        if (index1 < 0 || index2 < 0 || index1 > profile.fishlist.length - 1 || index2 > profile.fishlist.length - 1) return;
        let fishlistTemp = [...profile.fishlist];
        
        let fishTemp = fishlistTemp[index1];
        fishlistTemp[index1] = fishlistTemp[index2];
        fishlistTemp[index2] = fishTemp;

        setProfile({...profile, fishlist: fishlistTemp});
    }

    function openFish(index) {
        setIsFishformEditing(true);
        setFishIndex(index);

        setFishEdit(profile.fishlist[index]);
        setRenderFishform(true);
    }

    function addFish() {
        setIsFishformEditing(false);
        setFishIndex(profile.fishlist.length);

        let fishTemp = {...emptyFish};
        fishTemp.timeCaught = new Date().getTime();

        setFishEdit(fishTemp);
        setRenderFishform(true);
    }

    function submitFish() {
        setRenderFishform(false);

        let fishTemp = {...fishEdit};
        if (fishTemp.nickname === "") fishTemp.nickname = `Fish #${fishIndex + 1}`;
        if (fishTemp.species.name === "") fishTemp.species = {name: "Catfish"};
        if (fishTemp.bodyCaught === "") fishTemp.bodyCaught = "Kanawha River, WV";

        let fishlistTemp = [...profile.fishlist];
        fishlistTemp[fishIndex] = fishTemp;
        setProfile({...profile, fishlist: fishlistTemp});
    }

    function cancelFish() {
        setRenderFishform(false);
    }

    function removeFish() {
        setRenderFishform(false);

        let fishlistTemp = [...profile.fishlist];
        fishlistTemp.splice(fishIndex, 1);
        console.log(fishlistTemp);

        setProfile({...profile, fishlist: fishlistTemp});
    }

    // PROFILE FORM STUFF
    const [renderProfileform, setRenderProfileform] = useState(false);
    const [profileEdit, setProfileEdit] = useState(genericProfile);

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


    return(
        <div id="profile"> 
            <div id="profile-left">
                <img id="profile-pfp" src={profile.pfpUrl} alt="Your profile picture"/>
                <p><b>Username:</b> {profile.username}</p>
                <p><b>Nickname:</b> {profile.nickname}</p>
                <p><b>Gender:</b> {profile.gender}</p>

                <button onClick={openProfile}>Edit profile</button>
            </div>
            
            <div id="profile-right">
                <h1>Welcome back, {profile.nickname}!</h1>
                <h3>Fish List ({profile.fishlist.length}):</h3>

                <div id="profile-fishlist">
                    {profile.fishlist.map((fish, i) => (<div id="profile-fish" key={`fish-${i}`}>
                        <div className="profile-fish-info">
                            <div className="profile-fish-content">{fish.nickname}</div> 
                            <div className="profile-fish-seperator">--</div> 
                            <div className="profile-fish-content">{fish.species.name}</div> 
                            <div className="profile-fish-seperator">--</div> 
                            <div className="profile-fish-content">{fish.bodyCaught}</div> 
                            <div className="profile-fish-seperator">--</div> 
                            <div className="profile-fish-content">{new Date(fish.timeCaught).toLocaleString('en-US', {month: 'numeric', day: 'numeric', year: 'numeric', hour: '2-digit', minute:'2-digit'})}</div>
                        </div>
                        <button onClick={() => swapFish(i, i - 1)}>↑</button>
                        <button onClick={() => swapFish(i, i + 1)}>↓</button>
                        <button onClick={() => openFish(i)}>Edit</button>
                    </div>))}
                    {profile.fishlist.length < 1 ? <p>It's... empty. Something fishy is going on here</p>: null}
                </div>

                <button onClick={addFish}>Add Fish</button>
            </div>
            
            {/* TODO: make the fish form and profile form actually look nice! */}

            <ReactModal className="modal fishform-modal" overlayClassName="modal-overlay" isOpen={renderFishform}>
                <form id="fishform">
                    <h1>{isFishformEditing ? `Editing \"${profile.fishlist[fishIndex] !== undefined ? profile.fishlist[fishIndex].nickname : "Null"}\"` : "Congrats On Your New Catch!"}</h1>
                    <div>
                        <p>
                            <label htmlFor="nickname">Nickname: </label>
                            <input id="nickname" name="nickname" placeholder={`Fish #${fishIndex + 1}`} value={fishEdit.nickname} onChange={(e) => setFishEdit({...fishEdit, nickname: e.target.value}) } />
                        </p>
                        <p>
                            <label htmlFor="species">Species: </label>
                            <input id="species" name="species" placeholder="Catfish" value={fishEdit.species.name} onChange={(e) => setFishEdit({...fishEdit, species: {name: e.target.value}}) } />
                        </p>
                    </div>

                    <div>
                        <p>
                            <label htmlFor="timeCaught">Time Caught: </label>
                            <input type="datetime-local" id="timeCaught" name="timeCaught" value={dateToLocalDatetimeString(new Date(fishEdit.timeCaught))} onChange={(e) => setFishEdit({...fishEdit, timeCaught: new Date(e.target.value).getTime()}) }/>
                        </p>

                        <p>
                            <label htmlFor="bodyCaught">Body Caught: </label>
                            <input id="bodyCaught" name="bodyCaught" placeholder="Kanawha River, WV" value={fishEdit.bodyCaught} onChange={(e) => setFishEdit({...fishEdit, bodyCaught: e.target.value}) }/>
                        </p>
                    </div>

                    <div>
                        <p>
                            <label htmlFor="weight">Weight (lbs): </label>
                            <input id="weight" name="weight" value={(fishEdit.weight === null) ? "" : fishEdit.weight} onChange={(e) => setFishEdit({...fishEdit, weight: e.target.value}) }/>
                        </p>

                        <p>
                            <label htmlFor="length">Length (in): </label>
                            <input id="length" name="length" value={(fishEdit.length === null) ? "" : fishEdit.length} onChange={(e) => setFishEdit({...fishEdit, length: e.target.value}) }/>
                        </p>

                        <p>
                            <label htmlFor="tackled">Tackled: </label>
                            <input id="tackled" name="tackled" placeholder="Very Good Bait" value={fishEdit.tackled} onChange={(e) => setFishEdit({...fishEdit, tackled: e.target.value}) }/>
                        </p>
                    </div>
                    
                    <div>
                        <div id="fishform-sex-label">Sex:</div>
                        <div id="fishform-sex-radio">
                            <input type="radio" id="male" name="sex" value="0" checked={fishEdit.sex === 0} onChange={(e) => setFishEdit({...fishEdit, sex: parseInt(e.target.value)}) }/>
                            <label htmlFor="male">Male</label><br />
                            <input type="radio" id="female" name="sex" value="1" checked={fishEdit.sex === 1} onChange={(e) => setFishEdit({...fishEdit, sex: parseInt(e.target.value)}) }/>
                            <label htmlFor="female">Female</label><br />
                            <input type="radio" id="indeterminate" name="sex" value="-1" checked={fishEdit.sex === -1} onChange={(e) => setFishEdit({...fishEdit, sex: parseInt(e.target.value)}) }/>
                            <label htmlFor="indeterminate">Indeterminate</label>
                        </div>
                    </div>

                    <p>
                        <button onClick={submitFish}>Submit :3 XP</button>
                        <button onClick={cancelFish}>Cancel</button>
                        {isFishformEditing ? <button onClick={removeFish}>REMOVE this fish</button> : null}
                    </p>
                </form>
            </ ReactModal>

            <ReactModal className="modal fishform-modal" overlayClassName="modal-overlay" isOpen={renderProfileform}>
                <form id="profileform">
                    <h1>Editing Profile</h1>
                    <div>
                        <p>
                            <img id="profileform-pfp-display" src={profileEdit.pfpUrl} alt="Uploaded profile picture"/>
                            <input id="profileform-pfp-input" name="pfp" type="file" onChange={(e) => setProfileEdit({...profileEdit, pfpUrl: URL.createObjectURL(e.target.files[0])})}></input>
                        </p>

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

        </div>
    );
}

