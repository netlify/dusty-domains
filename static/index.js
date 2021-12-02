const submissionForm = document.querySelector('.submit-form');

submissionForm.onsubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(submissionForm);

  // Disable submit button to avoid submitting multiple times
  const formButton = e.submitter;
  formButton.disabled = true;

  const submissionDetails = {
    Name: formData.get('name'),
    Email: formData.get('email'),
    URL: formData.get('url'),
    'Years unused': parseInt(formData.get('site-date')),
  };

  let screenshotBase64Data;

  try {
    const screenshotRes = await fetch('/.netlify/functions/take-screenshot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionDetails.URL),
    });

    screenshotBase64Data = await screenshotRes.json();
  } catch (e) {
    document.querySelector('.form-error').textContent =
      "This site doesn't seem to be deployed on Netlify so we can't accept your submission 😢";

    console.error(e);
    formButton.disabled = false;
  }

  // if we don't get a screenshot, log an error but don't fail
  if (!screenshotBase64Data) {
    screenshotBase64Data = false;
    console.error('unable to generate a screenshot');
  }

  try {
    const uploadRes = await fetch('/.netlify/functions/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...submissionDetails,
        screenshotBase64: screenshotBase64Data,
      }),
    });

    if (uploadRes.ok) {
      const url = new URL(submissionDetails.URL);
      const age = 2021 - submissionDetails['Years unused'];

      window.location = window.location.href + `thanks/${url.host}/${age}`;
    } else {
      throw new Error('Something went wrong while uploading your submission');
    }
  } catch (e) {
    document.querySelector('.form-error').textContent =
      'Looks like something went a little bit haywire 🤔. Maybe try again!';
    console.error(e);
    formButton.disabled = false;
  }
};

/* height for showcase items */
var showcaseContainer = document.getElementById('showcase');
var showcaseList = document.getElementById('showcase-list');
showcaseContainer.style.height = showcaseList.offsetHeight + 150 + 'px';
showcaseList.setAttribute(
  'style',
  'position:absolute; left:50%; bottom: -10px; transform: translateX(-50%);',
);
/* height for featured items */
var featuredContainer = document.getElementById('featured');
var featuredList = document.getElementById('featured-list');
featuredContainer.style.height = featuredList.offsetHeight + 'px';
featuredList.setAttribute(
  'style',
  'position:absolute; left:50%; bottom: 0; transform: translateX(-50%);',
);
