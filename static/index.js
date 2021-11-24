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

  let screenshotBase64Data;

  try {
    const screenshotRes = await fetch("/.netlify/functions/take-screenshot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submissionDetails.URL),
    });

    screenshotBase64Data = await screenshotRes.json();
  } catch (e) {
    document.querySelector(".form-error").textContent =
      "This site doesn't seem to be deployed on Netlify so we can't accept your submission 😢";

    console.error(e);
    formButton.disabled = false;
  }

  if (screenshotBase64Data) {
    try {
      const uploadRes = await fetch("/.netlify/functions/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...submissionDetails,
          screenshotBase64: screenshotBase64Data,
        }),
      });

      if (uploadRes.ok) {
        window.location = window.location.href + "thanks";
      } else {
        throw new Error("Something went wrong while uploading your submission");
      }
    } catch (e) {
      document.querySelector(".form-error").textContent =
        "Looks like something went a little bit haywire 🤔. Maybe try again!";
      console.error(e);
      formButton.disabled = false;
    }
  }
};
