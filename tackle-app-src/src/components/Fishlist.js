/**
 * Fishlist.js
 * 
 * This component provides the list of all user's caught fish shown in the profile page,
 * plus the modal form used to add and edit fish.
 */

import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { useAuth } from "./AuthProvider";
import { fishTypes } from "./Map";

/**
 * A fish caught by a user.
 * @typedef {Object} FishCaught
 * @property {string} species - The name of the species of the fish.
 * @property {string} nickname - A nickname given to the fish.
 * @property {number} timeCaught - Unix timestamp of when the fish was caught.
 * @property {string} bodyCaught - The name of the body of water where the fish was caught.
 * @property {number} weight - The weight of the fish, in lbs.
 * @property {number} length - The length of the fish, in inches.
 * @property {number} sex - The sex of the fish. 0 = male, 1 = female, -1 = indeterminate.
 * @property {string} tackled - The name of the bait used to catch the fish.
 */

/**
 * A generic empty fish, added to a user's fishlist before being edited by the user.
 * @type {FishCaught} 
 */
const emptyFish = {
    species: "",
    nickname: "",
    timeCaught: 0,
    bodyCaught: "",
    weight: null,
    length: null,
    sex: -1,
    tackled: ""
}

/**
 * Takes a JS Date object and converts it to a string that can be used as the value of 
 * an html "datetime-local" input field.
 * 
 * @param {Date} date - Date object to convert to string
 * @returns String to be used as the value of a "datetime-local" input field.
 */
function dateToLocalDatetimeString(date) {
    return new Date(date.getTime() + new Date().getTimezoneOffset() * -60 * 1000).toISOString().substring(0, 16);
}

/**
 * Returns obj with property set to val IF val is a positive number. Otherwise, returns obj unchanged.
 * 
 * Used to limit weight and length fields to only positive numbers with only one callback function.
 * @param {string} val - val to check before being set in obj.
 * @param {Object} obj - Object to modify.
 * @param {string} property - String name of the property in obj to modify.
 * @returns obj with property set to val if val was positive number. 
 */
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

/**
 * Fishlist component provides a user's list of fish caught and the modal form to add/edit them.
 * @returns {JSX.Element} Fishlist element, plus fish editing modal.
 */
export default function Fishlist() {

    const { profile, setProfile, borderStyle, setLastLocation, lastLocation } = useAuth();

    const [renderFishform, setRenderFishform] = useState(false); 
    const [isFishformEditing, setIsFishformEditing] = useState(false); // indicates whether a fish is being edited (true) or added (false)
    const [fishIndex, setFishIndex] = useState(-1); // index in fishlist of fish being edited
    const [fishEdit, setFishEdit] = useState(emptyFish); // fish in fishform being edited
    const [sortBy, setSortBy] = useState(0);
    const [sortAscending, setSortAscending] = useState(false);
    const [displayModified, setDisplayModified] = useState(false);
    const [randomPlaceholderFish, setRandomPlaceholderFish] = useState("Channel Catfish");

    /**
     * Swaps the fish at a pair of indices in the fish list if the indices are valid.
     * @param {number} index1 - Index of first fish to swap.
     * @param {number} index2 - Index of second fish to swap.
     */
    function swapFish(index1, index2) {
        if (index1 < 0 || index2 < 0 || index1 > profile.fishlist.length - 1 || index2 > profile.fishlist.length - 1) return;
        let fishlistTemp = [...profile.fishlist];
        
        let fishTemp = fishlistTemp[index1];
        fishlistTemp[index1] = fishlistTemp[index2];
        fishlistTemp[index2] = fishTemp;

        setProfile({...profile, fishlist: fishlistTemp});
    }

    /**
     * Copies a fish from fishlist to cache, and opens the fishform to edit it.
     * @param {number} index - Index of fish to edit. 
     */
    function openFish(index) {
        setIsFishformEditing(true);
        setFishIndex(index);
        randomizePlaceholderFish();

        setFishEdit(profile.fishlist[index]);
        setRenderFishform(true);
    }

    /**
     * Creates a new fish in cache to be added to fishlist, and opens the fishform to edit it.
     */
    function addFish() {
        setIsFishformEditing(false);
        setFishIndex(profile.fishlist.length);
        randomizePlaceholderFish();

        let fishTemp = {...emptyFish};
        fishTemp.timeCaught = new Date().getTime();
        fishTemp.bodyCaught = lastLocation;

        setFishEdit(fishTemp);
        setRenderFishform(true);
    }

    /**
     * Replaces the last opened fish in fishlist with fish in cache (or adds fish in cache 
     * it to the end if fish is being added), and closes the fishform.
     */
    function submitFish() {
        setRenderFishform(false);

        let fishTemp = {...fishEdit};
        if (fishTemp.nickname === "") fishTemp.nickname = `Fish #${fishIndex + 1}`;
        if (fishTemp.bodyCaught.trim().length !== 0) setLastLocation(fishTemp.bodyCaught);

        let fishlistTemp = [...profile.fishlist];
        fishlistTemp[fishIndex] = fishTemp;
        setProfile({...profile, fishlist: fishlistTemp});
    }

    /**
     * Closes the fishform without making any changes to the fishlist.
     */
    function cancelFish() {
        setRenderFishform(false);
    }

    /**
     * Removes last opened fish from the fishlist.
     */
    function removeFish() {
        setRenderFishform(false);

        let fishlistTemp = [...profile.fishlist];
        fishlistTemp.splice(fishIndex, 1);
        console.log(fishlistTemp);

        setProfile({...profile, fishlist: fishlistTemp});
    }

    /**
     * Sorts an array of fishCaught depending on what the the user has set the list to 
     * sort by (sortBy variable).
     * 
     * Can sort by:
     * 
     *      0: nothing, show user defined ordering
     *      1: time caught
     *      2: nicknames, alphabetically
     *      3: weight
     *      4: length
     * @param {Array.<FishCaught>} list - list of fishCaught to sort. Usually fishlist.
     * @returns Sorted fishlist.
     */
    function sortFishlist(list) {
        switch (sortBy) {
            case 1: // sort by time
                list.sort((a, b) => a.timeCaught - b.timeCaught);
                break;
            case 2: // sort by nickname alphabetically
                list.sort((a, b) => 0 - a.nickname.localeCompare(b.nickname));
                break;
            case 3: // sort by weight
                list.sort((a, b) => a.weight - b.weight);
                break;
            case 4: // sort by length
                list.sort((a, b) => a.length - b.length);
                break;
            default: // either 0 (no sort) or some faulty value
                // do nothing. :/
        }
        if (sortAscending) list.reverse();
        return list;
    }

    /**
     * Applies whatever sort is selected to the fishlist.
     */
    function applySort() {
        let profileTemp = {...profile};
        sortFishlist(profileTemp.fishlist);

        setProfile(profileTemp);
        cancelSort();
    }

    /**
     * Resets sort options back to default values.
     */
    function cancelSort() {
        setSortBy(0);
        setSortAscending(false);
    }

    /**
     * Randomize what placeholder value is shown in the species input to one of any 
     * from the imported list of species available.
     */
    function randomizePlaceholderFish() {
        const fishTypesArray = Object.keys(fishTypes);
        const randomFish = fishTypes[fishTypesArray[Math.floor(Math.random()*fishTypesArray.length)]]
        setRandomPlaceholderFish(randomFish);
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
                            <div className="fishlist-fish-content">{fish.species.trim().length !== 0 ? fish.species : <em>Unknown</em>}</div> 
                            <div className="fishlist-fish-seperator">--</div> 
                            <div className="fishlist-fish-content">{fish.bodyCaught.trim().length !== 0 ? fish.bodyCaught : <em>Unknown</em>}</div> 
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
                { /* eslint-disable no-useless-escape */ }
                <h1>{isFishformEditing ? `Editing \"${profile.fishlist[fishIndex] !== undefined ? profile.fishlist[fishIndex].nickname : "Null"}\"` : "🏆 Congrats On Your New Catch! 🏆"}</h1>
                { /* eslint-enable no-useless-escape */ }
                <div>
                    <p>
                        <label htmlFor="nickname">Nickname: </label>
                        <input id="fishform-nickname" name="nickname" placeholder={`Fish #${fishIndex + 1}`} value={fishEdit.nickname} onChange={(e) => setFishEdit({...fishEdit, nickname: e.target.value}) } />
                    </p>
                    <p>
                        <label htmlFor="species">Species: </label>
                        <input list="fish-species" id="fishform-species" name="species" placeholder={randomPlaceholderFish} value={fishEdit.species} onChange={(e) => setFishEdit({...fishEdit, species: e.target.value}) } />
                        <datalist id="fish-species">
                            {Object.keys(fishTypes).map(fish => 
                                <option key={fish} value={fishTypes[fish]} />
                            )}
                        </datalist>
                    </p>
                </div>

                <div>
                    <p>
                        <label htmlFor="timeCaught">Time Caught: </label>
                        <input type="datetime-local" id="fishform-timeCaught" name="timeCaught" value={dateToLocalDatetimeString(new Date(fishEdit.timeCaught))} onChange={(e) => setFishEdit({...fishEdit, timeCaught: new Date(e.target.value).getTime()}) }/>
                    </p>

                    <p>
                        <label htmlFor="bodyCaught">Body Caught: </label>
                        <input id="fishform-bodyCaught" name="bodyCaught" placeholder="Kanawha River" value={fishEdit.bodyCaught} onChange={(e) => setFishEdit({...fishEdit, bodyCaught: e.target.value}) }/>
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