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

  const screenshotURL = await screenshotRes.json();

  const submissionRes = await fetch("/.netlify/functions/submissions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Name: formData.get("name"),
      Email: formData.get("email"),
      URL: formData.get("url"),
      "Years unused": parseInt(formData.get("site-date")),
      screenshot: screenshotURL,
    }),
  });

  const data = await submissionRes.json();

  return data;
};
