export const getAnonymousId = () => {
  let anonymousId = localStorage.getItem("resume_anonymous_id");

  if (!anonymousId) {
    anonymousId = crypto.randomUUID();
    localStorage.setItem("resume_anonymous_id", anonymousId);
  }

  return anonymousId;
};
