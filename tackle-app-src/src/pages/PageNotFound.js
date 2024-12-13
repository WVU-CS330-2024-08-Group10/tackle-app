/**
 * PageNotFound.js
 * 
 * This component provides the "page-not-found" page, seen when attempting to 
 * navigate to a page that the router does not recognize.
 */

/**
 * "Page-not-found" page element, seen when attempting to navigate to a page
 * that the router does not recognize.
 * @returns {JSX.Element} "Page-not-found" page element.
 */
export default function PageNotFound(){
    return(
        <h1 className="page-header">Page not found</h1>
    );
}