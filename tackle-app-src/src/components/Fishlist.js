import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { useAuth } from "../components/AuthProvider";

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

export default function Fishlist() {

    const { profile, setProfile, borderStyle } = useAuth();

    const [renderFishform, setRenderFishform] = useState(false); 
    const [isFishformEditing, setIsFishformEditing] = useState(false); // indicates whether a fish is being edited (true) or added (false)
    const [fishIndex, setFishIndex] = useState(-1); // index in fishlist of fish being edited
    const [fishEdit, setFishEdit] = useState(emptyFish); // fish in fishform being edited
    const [sortBy, setSortBy] = useState(0);
    const [sortAscending, setSortAscending] = useState(false);
    const [displayModified, setDisplayModified] = useState(false);


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

    function sortFishlist(list) {
        switch (sortBy) {
            case 1:
                list.sort((a, b) => a.timeCaught - b.timeCaught);
                break;
            case 2:
                list.sort((a, b) => 0 - a.nickname.localeCompare(b.nickname));
                break;
            case 3:
                list.sort((a, b) => a.weight - b.weight);
                break;
            case 4:
                list.sort((a, b) => a.length - b.length);
                break;
        }
        if (sortAscending) list.reverse();
        return list;
    }

    function applySort() {
        let profileTemp = {...profile};
        sortFishlist(profileTemp.fishlist);

        setProfile(profileTemp);
        cancelSort();
    }
    function cancelSort() {
        setSortBy(0);
        setSortAscending(false);
    }

    return <>
        <div>
            <div className="fishlist-top">
                <label htmlFor="fishlist-sortby">Sort by: </label>
                <select name="fishlist-sortby" id="fishlist-sortby" value={sortBy} onChange={(e) => setSortBy(parseInt(e.target.value))}>
                    <option value="0">---</option>
                    <option value="1">Time Caught</option>
                    <option value="2">Nickname</option>
                    <option value="3">Weight</option>
                    <option value="4">Length</option>
                </select>
                <input type="checkbox" id="fishlist-sortascending" name="fishlist-sortascending" checked={sortAscending} onChange={() => setSortAscending(!sortAscending)} />
                <label htmlFor="fishlist-sortascending"> Ascending</label>
                <button disabled={sortBy === 0 && !sortAscending} onClick={applySort}>Apply</button>
                <button disabled={sortBy === 0 && !sortAscending} onClick={cancelSort}>Cancel</button>

                <select name="fishlist-displaymodified" id="fishlist-displaymodified" value={displayModified.toString()} onChange={(e) => setDisplayModified(e.target.value === "true")}>
                    <option value="false">Nickname -- Species -- Location -- Time</option>
                    <option value="true">Nickname -- Weight -- Length -- Time</option>
                </select>
            </div>
            <div className="fishlist" style={borderStyle}>
                {sortFishlist(profile.fishlist.map((el, i) => ({...el, index: i}))).map((fish, i) => (<div className="fishlist-fish" key={`fish-${profile.fishlist.length - i}`}>
                    <div className="fishlist-fish-info" style={borderStyle}>
                        <div className="fishlist-fish-index">{(fish.index + 1).toLocaleString('en-US', {minimumIntegerDigits: profile.fishlist.length.toString().length })}.</div>
                        <div className="fishlist-fish-content">{fish.nickname}</div> 
                        <div className="fishlist-fish-seperator">--</div> 
                        {displayModified ? <>
                            <div className="fishlist-fish-content">{fish.weight === null ? <em>????? lbs</em> : `${fish.weight} lbs`}</div> 
                            <div className="fishlist-fish-seperator">--</div> 
                            <div className="fishlist-fish-content">{fish.length === null ? <em>????? in</em> : `${fish.length} in`}</div> 
                        </> : <>
                            <div className="fishlist-fish-content">{fish.species.name.trim().length !== 0 ? fish.species.name : <em>Unknown</em>}</div> 
                            <div className="fishlist-fish-seperator">--</div> 
                            <div className="fishlist-fish-content">{fish.bodyCaught.trim().length !== 0 ? fish.bodyCaught : <em>Unknown, ST</em>}</div> 
                        </>}
                        
                        <div className="fishlist-fish-seperator">--</div> 
                        <div className="fishlist-fish-content">{new Date(fish.timeCaught).toLocaleString('en-US', {month: 'numeric', day: 'numeric', year: 'numeric', hour: '2-digit', minute:'2-digit'})}</div>
                    </div>
                    <button disabled={sortBy !== 0 || sortAscending} onClick={() => swapFish(i, i + 1)}>↑</button>
                    <button disabled={sortBy !== 0 || sortAscending} onClick={() => swapFish(i, i - 1)}>↓</button>
                    <button onClick={() => openFish(fish.index)}>Edit</button>
                </div>)).toReversed()}
                {profile.fishlist.length < 1 && <p>It's... empty. Something fishy is going on here</p>}
            </div>

            <button id="fishlist-addfish" onClick={addFish}>Submit New Catch!</button>
        </div>

        <ReactModal className={(profile.darkmode ? "modal-dark" : "modal-light") + " form-modal"} overlayClassName={profile.darkmode ? "modal-overlay-dark" : "modal-overlay-light"} isOpen={renderFishform}>

                <h1>{isFishformEditing ? `Editing \"${profile.fishlist[fishIndex] !== undefined ? profile.fishlist[fishIndex].nickname : "Null"}\"` : "🏆 Congrats On Your New Catch! 🏆"}</h1>
                <div>
                    <p>
                        <label htmlFor="nickname">Nickname: </label>
                        <input id="fishform-nickname" name="nickname" placeholder={`Fish #${fishIndex + 1}`} value={fishEdit.nickname} onChange={(e) => setFishEdit({...fishEdit, nickname: e.target.value}) } />
                    </p>
                    <p>
                        {/* TODO: make species input dropdown of species in location */}
                        <label htmlFor="species">Species: </label>
                        <input id="fishform-species" name="species" placeholder="Catfish" value={fishEdit.species.name} onChange={(e) => setFishEdit({...fishEdit, species: {name: e.target.value}}) } />
                    </p>
                </div>

                <div>
                    <p>
                        <label htmlFor="timeCaught">Time Caught: </label>
                        <input type="datetime-local" id="fishform-timeCaught" name="timeCaught" value={dateToLocalDatetimeString(new Date(fishEdit.timeCaught))} onChange={(e) => setFishEdit({...fishEdit, timeCaught: new Date(e.target.value).getTime()}) }/>
                    </p>

                    <p>
                        <label htmlFor="bodyCaught">Body Caught: </label>
                        <input id="fishform-bodyCaught" name="bodyCaught" placeholder="Kanawha River, WV" value={fishEdit.bodyCaught} onChange={(e) => setFishEdit({...fishEdit, bodyCaught: e.target.value}) }/>
                    </p>
                </div>

                <div>
                    <p>
                        <label htmlFor="weight">Weight (lbs): </label>
                        <input id="fishform-weight" name="weight" value={(fishEdit.weight === null) ? "" : fishEdit.weight} onChange={(e) => setFishEdit(getPropIfPositiveNum(e.target.value, fishEdit, "weight")) }/>
                    </p>

                    <p>
                        <label htmlFor="length">Length (in): </label>
                        <input id="fishform-length" name="length" value={(fishEdit.length === null) ? "" : fishEdit.length} onChange={(e) => setFishEdit(getPropIfPositiveNum(e.target.value, fishEdit, "length")) }/>
                    </p>

                    <p>
                        <label htmlFor="tackled">Tackled: </label>
                        <input id="fishform-tackled" name="tackled" placeholder="Very Good Bait" value={fishEdit.tackled} onChange={(e) => setFishEdit({...fishEdit, tackled: e.target.value}) }/>
                    </p>
                </div>
                
                <div id="fishform-sex">
                    <div id="fishform-sex-label">Sex:</div>
                    <div id="fishform-sex-radio">
                        <input type="radio" id="fishform-male" name="sex" value="0" checked={fishEdit.sex === 0} onChange={(e) => setFishEdit({...fishEdit, sex: parseInt(e.target.value)}) }/>
                        <label htmlFor="male">Male</label><br />
                        <input type="radio" id="fishform-female" name="sex" value="1" checked={fishEdit.sex === 1} onChange={(e) => setFishEdit({...fishEdit, sex: parseInt(e.target.value)}) }/>
                        <label htmlFor="female">Female</label><br />
                        <input type="radio" id="fishform-indeterminate" name="sex" value="-1" checked={fishEdit.sex === -1} onChange={(e) => setFishEdit({...fishEdit, sex: parseInt(e.target.value)}) }/>
                        <label htmlFor="indeterminate">Indeterminate</label>
                    </div>
                </div>

                <button className="formbutton-submit" onClick={submitFish}>Submit :3 XP</button>
                {isFishformEditing && <button className="formbutton-delete" onClick={removeFish}>REMOVE this fish</button>}
                <button className="formbutton-cancel" onClick={cancelFish}>Cancel</button>
            
        </ ReactModal>
    </> 
}