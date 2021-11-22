const submissionForm = document.querySelector(".submit-form");

submissionForm.onsubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(submissionForm);

  const res = await fetch("/.netlify/functions/submissions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Name: formData.get("name"),
      Email: formData.get("email"),
      URL: formData.get("url"),
      "Years unused": parseInt(formData.get("site-date")),
    }),
  });

  const data = await res.json();

  return data;
};
