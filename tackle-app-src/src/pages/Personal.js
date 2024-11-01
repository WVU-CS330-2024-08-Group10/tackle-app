import React, { useState } from 'react';

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
        }
    ]
};

export default function Personal() {
    const [username, setUsername] = useState(genericProfile.username);

    let fishListInit = [];
    for (let i = 0; i < genericProfile.fishList.length; i++) {
        let fish = genericProfile.fishList[i];
        fishListInit.push(<FishListElement fish={fish} key={`fishlist-${i}`}/>);
    }
    const [fishList, setFishList] = useState(fishListInit);
    const [nickname, setNickname] = useState(genericProfile.nickname);
    const [gender, setGender] = useState(genericProfile.gender);

    return(
        <div id="profile"> 
            <div id="profile-left">
                <img id="profile-picture" src={require('../assets/jeremyPfp.jpg')} alt="Your profile picture"/>
                <p><b>Nickname:</b> {nickname}</p>
                <p><b>Gender:</b> {gender}</p>
            </div>
            
            <div id="profile-right">
                <h1>Welcome back, {username}!</h1>
                <h3>Fish List:</h3>

                <div id="profile-fishlist">
                    {fishList}
                </div>
            </div>
            
        </div>
    );
}

function FishListElement(args) {
    let nickname = args.fish.nickname;
    let speciesName = args.fish.species.name;
    let bodyCaught = args.fish.bodyCaught;
    let timeCaught = args.fish.timeCaught;
    let timeCaughtString = timeCaught.toLocaleString('en-US', {month: 'numeric', day: 'numeric', year: 'numeric'});

    return <p>{nickname} -- {speciesName} -- {bodyCaught} -- {timeCaughtString}</p>;
}