const commentButton = document.getElementById("comment-button")
const reviewButton = document.getElementById("review-button")
const ratingField = document.getElementById("rating-field")

commentButton.addEventListener('click', (event) => {
    ratingField.classList.add('hidden')
})

reviewButton.addEventListener('click', (event) => {
  ratingField.classList.remove('hidden')  
})
