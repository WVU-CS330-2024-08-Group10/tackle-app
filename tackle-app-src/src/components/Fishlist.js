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

// Format date object to the appropriate string for the value of an HTML local-datetime input 
function dateToLocalDatetimeString(date) {
    return new Date(date.getTime() + new Date().getTimezoneOffset() * -60 * 1000).toISOString().substring(0, 16);
}

// Returns obj with property set to val IF val is a number. Otherwise, returns obj unchanged
function getPropIfPositiveNum(val, obj, property) {
    val = val.trim();
    let objTemp = {...obj};

    if (!isNaN(val) && parseFloat(val) >= 0) {
        objTemp[property] = val;
    } else if (val.length === 0) {
        objTemp[property] = null;
    }
    return objTemp;
}

export default function Fishlist(props) {
    
    let fishlistClass = props.className;
    if (fishlistClass === undefined) fishlistClass = "profile-fishlist"; 

    const profile = props.profile;
    const setProfile = props.setProfile;

    const [renderFishform, setRenderFishform] = useState(false); 
    const [isFishformEditing, setIsFishformEditing] = useState(false); // indicates whether a fish is being edited (true) or added (false)
    const [fishIndex, setFishIndex] = useState(-1); // index in fishlist of fish being edited
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

    return <>
        <div className={fishlistClass}>
            {profile.fishlist.map((fish, i) => (<div id="profile-fish" key={`fish-${i}`}>
                <div className="profile-fish-info">
                    <div className="profile-fish-content">{fish.nickname}</div> 
                    <div className="profile-fish-seperator">--</div> 
                    <div className="profile-fish-content">{fish.species.name.trim().length !== 0 ? fish.species.name : <em>Unknown</em>}</div> 
                    <div className="profile-fish-seperator">--</div> 
                    <div className="profile-fish-content">{fish.bodyCaught.trim().length !== 0 ? fish.bodyCaught : <em>Unknown, ST</em>}</div> 
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

        <ReactModal className="modal fishform-modal" overlayClassName="modal-overlay" isOpen={renderFishform}>
            <form id="fishform">
                <h1>{isFishformEditing ? `Editing \"${profile.fishlist[fishIndex] !== undefined ? profile.fishlist[fishIndex].nickname : "Null"}\"` : "Congrats On Your New Catch!"}</h1>
                <div>
                    <p>
                        {/* TODO: make length limit for fish nickname */}
                        <label htmlFor="nickname">Nickname: </label>
                        <input id="nickname" name="nickname" placeholder={`Fish #${fishIndex + 1}`} value={fishEdit.nickname} onChange={(e) => setFishEdit({...fishEdit, nickname: e.target.value}) } />
                    </p>
                    <p>
                        {/* TODO: make species input dropdown of species in location */}
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
                        <input id="weight" name="weight" value={(fishEdit.weight === null) ? "" : fishEdit.weight} onChange={(e) => setFishEdit(getPropIfPositiveNum(e.target.value, fishEdit, "weight")) }/>
                    </p>

                    <p>
                        <label htmlFor="length">Length (in): </label>
                        <input id="length" name="length" value={(fishEdit.length === null) ? "" : fishEdit.length} onChange={(e) => setFishEdit(getPropIfPositiveNum(e.target.value, fishEdit, "length")) }/>
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
    </> 
}