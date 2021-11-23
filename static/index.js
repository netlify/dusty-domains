const submissionForm = document.querySelector(".submit-form");

submissionForm.onsubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(submissionForm);

  const submissionDetails = {
    Name: formData.get("name"),
    Email: formData.get("email"),
    URL: formData.get("url"),
    "Years unused": parseInt(formData.get("site-date")),
  };

  const screenshotRes = await fetch("/.netlify/functions/take-screenshot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(submissionDetails.URL),
  });

  const screenshotBase64Data = await screenshotRes.json();

  await fetch("/.netlify/functions/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...submissionDetails,
      screenshotBase64: screenshotBase64Data,
    }),
  });
};

/* height for showcase items */
var showcaseContainer = document.getElementById('showcase');
var showcaseList = document.getElementById('showcase-list');
showcaseContainer.style.height = (showcaseList.offsetHeight + 150) + "px";
showcaseList.setAttribute("style","position:absolute; left:50%; bottom: 0; transform: translateX(-50%);")
/* height for featured items */
var featuredContainer = document.getElementById('featured');
var featuredList = document.getElementById('featured-list');
featuredContainer.style.height = (featuredList.offsetHeight) + "px";
featuredList.setAttribute("style","position:absolute; left:50%; bottom: 0; transform: translateX(-50%);")