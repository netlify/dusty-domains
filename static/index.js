const submissionForm = document.querySelector(".submit-form");

submissionForm.onsubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(submissionForm);

  // Disable submit button to avoid submitting multiple times
  const formButton = e.submitter;
  formButton.disabled = true;

  const submissionDetails = {
    Name: formData.get("name"),
    Email: formData.get("email"),
    URL: formData.get("url"),
    "Years unused": parseInt(formData.get("site-date")),
  };

  try {
    const uploadRes = await fetch("/.netlify/functions/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...submissionDetails,
      }),
    });

    if (uploadRes.ok) {
      const { redirect } = await uploadRes.json();

      const nextURL = new URL(window.location.href);
      nextURL.pathname = redirect;

      window.location = nextURL;
    } else {
      throw new Error("Something went wrong while uploading your submission");
    }
  } catch (e) {
    document.querySelector(".form-error").textContent =
      "Looks like something went a little bit haywire 🤔. Maybe try again!";
    console.error(e);
    formButton.disabled = false;
  }
};

/* height for showcase items */
var showcaseContainer = document.getElementById("showcase");
var showcaseList = document.getElementById("showcase-list");
showcaseContainer.style.height = showcaseList.offsetHeight + 150 + "px";
showcaseList.setAttribute(
  "style",
  "position:absolute; left:50%; bottom: 0; transform: translateX(-50%);"
);
/* height for featured items */
var featuredContainer = document.getElementById("featured");
var featuredList = document.getElementById("featured-list");
featuredContainer.style.height = featuredList.offsetHeight + "px";
featuredList.setAttribute(
  "style",
  "position:absolute; left:50%; bottom: 0; transform: translateX(-50%);"
);

// Async call for thermometer height
(async () => {
  const meter = document.getElementById("progress-bar");

  const req = await fetch("/.netlify/functions/update");
  const { percent } = await req.json();

  meter.style.width = percent || "0%";
  meter.innerText = percent;
})();
