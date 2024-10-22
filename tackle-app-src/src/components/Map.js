/*
* @component map; The map shows West Virginia, and is the base for the rest of the application.
*/

/*
* @function Map; constructor creates an instance of map that contains a view of the beginning location.
* @param InitialView; a global variable set to the maps default view.
* @param currentLocation; OPTIONAL - if there is a current location then that is where the view will be.
*/

/*
* @function Get View; gets a view if it exists.
* @param view; The view that is being looked for.
* @return Object; contains map HTML and current coordinates.
*/

/*
* @function Set View; sets a newView according to location.
* @param newView; The HTML of the map view.
* @param location; The coordinates of the location being set.
* @return result; returns whether the set was successful.
*/

/*
* @function loadMap; changes the map using the view setter.
* @param view; The HTML of the map view.
* @param location; The coordinates of the location.
* @return result; returns whether the load was successful.
*/

/*
* @function refreshMap; Refreshes map view container whenever loadMap is called or user refreshes.
*/

export default function Map(){
    return(
        <div id="map">Map Component</div>
    );
}