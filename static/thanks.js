/* height for featured items */
var featuredContainer = document.getElementById('featured');
var featuredList = document.getElementById('featured-list');
featuredContainer.style.height = (featuredList.offsetHeight) + "px";
featuredList.setAttribute("style","position:absolute; left:50%; bottom: 0; transform: translateX(-50%);")