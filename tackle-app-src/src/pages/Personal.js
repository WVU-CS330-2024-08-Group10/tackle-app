import React, { useState } from 'react';
import ReactModal from 'react-modal';

const genericFish = {
    species: {
        name: "Species"
    },
    nickname: "Name",
    timeCaught: new Date(0),
    bodyCaught: "Location",
    weight: 0,
    length: 0,
    sex: 0,
    tackled: "Bait"
}
const genericProfile = {
    id: 1,
    username: "JeremyWade_Official",
    nickname: "Jeremy Wade",
    gender: "male",
    favSpots: [],
    fishList: [
        {
            species: {
                name: "Catfish"
            },
            nickname: "Big John",
            timeCaught: new Date(),
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
            timeCaught: new Date(),
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
            timeCaught: new Date(),
            bodyCaught: "Coal River, WV", // REPLACE WITH some sort of location object later
            weight: 51, // lbs?
            length: 22, // inches?
            sex: -1,
            tackled: "Very Good Bait"
        },
        genericFish,
        genericFish,
        genericFish,
        genericFish,
        genericFish,
        genericFish,
        genericFish,
        genericFish,
        genericFish,
        genericFish,
        genericFish,
    ]
};

export default function Personal() {
    const [username, setUsername] = useState(genericProfile.username);
    const [fishList, setFishList] = useState(genericProfile.fishList);
    const [nickname, setNickname] = useState(genericProfile.nickname);
    const [gender, setGender] = useState(genericProfile.gender);
    const [fishEditing, setFishEditing] = useState(-1); 
    const [renderFishform, setRenderFishform] = useState(false);


    function swapFish(index1, index2) {
        if (index1 < 0 || index2 < 0 || index1 > fishList.length - 1 || index2 > fishList.length - 1) return;
        let fishListTemp = fishList;
        
        let fishTemp = fishListTemp[index1];
        fishListTemp[index1] = fishListTemp[index2];
        fishListTemp[index2] = fishTemp;

        // for some reason, you have to make a new array
        setFishList([...fishListTemp]);
    }

    return(
        <div id="profile"> 
            <div id="profile-left">
                <img id="profile-picture" src={require('../assets/jeremyPfp.jpg')} alt="Your profile picture"/>
                <p><b>Nickname:</b> {nickname}</p>
                <p><b>Gender:</b> {gender}</p>
            </div>
            
            <div id="profile-right">
                <h1>Welcome back, {username}!</h1>
                <h3>Fish List ({fishList.length}):</h3>

                <div id="profile-fishlist">
                    {fishList.map((fish, i) => (<div id="profile-fish" key={`fish-${i}`}>
                        <div className="profile-fish-info">
                            <div className="profile-fish-content">{fish.nickname}</div> 
                            <div className="profile-fish-seperator">--</div> 
                            <div className="profile-fish-content">{fish.species.name}</div> 
                            <div className="profile-fish-seperator">--</div> 
                            <div className="profile-fish-content">{fish.bodyCaught}</div> 
                            <div className="profile-fish-seperator">--</div> 
                            <div className="profile-fish-content">{fish.timeCaught.toLocaleString('en-US', {month: 'numeric', day: 'numeric', year: 'numeric'})}</div>
                        </div>
                        <button onClick={() => swapFish(i, i - 1)}>^</button>
                        <button onClick={() => swapFish(i, i + 1)}>v</button>
                        <button onClick={() => setRenderFishform(!renderFishform)}>Edit</button>
                    </div>))}
                </div>
            </div>
            
            <ReactModal isOpen={renderFishform}>
                <form id="fishform">
                    <h1> Congrats On Your New Catch! </h1>
                    <div>
                        <p>
                            <label htmlFor="nickname">Nickname: </label>
                            <input id="nickname" name="nickname"/>
                        </p>
                    </div>

                    <div>
                        <p>
                            <label htmlFor="timeCaught">Time Caught: </label>
                            <input type="datetime-local" id="timeCaught" name="timeCaught"/>
                        </p>

                        <p>
                            <label htmlFor="bodyCaught">Body Caught: </label>
                            <input id="bodyCaught" name="bodyCaught"/>
                        </p>
                    </div>

                    <div>
                        <p>
                            <label htmlFor="weight">Weight: </label>
                            <input id="weight" name="weight"/>
                        </p>

                        <p>
                            <label htmlFor="length">Length: </label>
                            <input id="length" name="length"/>
                        </p>

                        <p>
                            <label htmlFor="tackled">Tackled: </label>
                            <input id="tackled" name="tackled"/>
                        </p>

                        <p>
                            <div id="fishform-sex-label">Sex:</div>
                            <div id="fishform-sex-radio">
                                <input type="radio" id="male" name="sex" value="male" />
                                <label htmlFor="male">Male</label><br />
                                <input type="radio" id="female" name="sex" value="female" />
                                <label htmlFor="female">Female</label><br />
                                <input type="radio" id="indeterminate" name="sex" value="indeterminate" />
                                <label htmlFor="indeterminate">Indeterminate</label>
                            </div>
                        </p>
                    </div>
                </form>
            </ ReactModal>

        </div>
    );
}

