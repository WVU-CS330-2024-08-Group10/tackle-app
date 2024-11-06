import React, { useState } from 'react';

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
                        <button>Edit</button>
                    </div>))}
                </div>
            </div>
            
        </div>
    );
}

