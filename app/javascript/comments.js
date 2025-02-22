const commentButton = document.getElementById("comment-button");
const reviewButton = document.getElementById("review-button");
const ratingField = document.getElementById("rating-field");
const isReviewField = document.querySelector("input[name='comment[isReview]']");
const ratingInputs = ratingField.querySelectorAll("input");

commentButton.addEventListener("click", () => {
    ratingField.classList.add("hidden");
    isReviewField.value = "false"; // Ensure isReview is false
    ratingInputs.forEach(input => input.disabled = true); // Disable inputs
});

reviewButton.addEventListener("click", () => {
    ratingField.classList.remove("hidden");
    isReviewField.value = "true"; // Ensure isReview is true
    ratingInputs.forEach(input => input.disabled = false); // Enable inputs
});
