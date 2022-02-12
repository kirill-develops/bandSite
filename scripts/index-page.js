// Event Listener for Form Submission
const newComment = document.getElementById('newComment');

newComment.addEventListener('submit', (e) => {
    e.preventDefault();
    const newName = event.target.userName.value;
    const newCommentField = event.target.userComment.value;
    const newCommentObject = {
        id: 01,
        date: todayString,
        name: newName,
        avatar: null,
        comment: newCommentField
    };
    newComment.reset();
    comments.unshift(newCommentObject);
    updateComments(comments);
    console.log(comments);
})
//Function that erases all old comments
removeAllChildren = () => {
    const liveComments = document.getElementById('output');
    while (liveComments.firstChild) {
        liveComments.removeChild(liveComments.firstChild);
    }
    console.log(liveComments);
}
//Function to update Live Comments
updateComments = (comments) => {
    removeAllChildren();
    comments.forEach(comment => displayComment(comment));
}

//create function that converts new Date() into string
const today = new Date();
const todayString = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;


// Function to populate HTML into live comment cards from an array database
// @parma comments is an array of objects that provide an avatar, name, date & comment details for each entry
displayComment = (comments) => {
    const liveCommentAvatar = document.createElement('div');
    liveCommentAvatar.classList.add('live-comment__avatar--blank');

    const liveCommentName = document.createElement('h4');
    liveCommentName.classList.add('live-comment__name');

    const liveCommentDate = document.createElement('h4');
    liveCommentDate.classList.add('live-comment__date');
   
    const liveCommentDetails = document.createElement('p');
    liveCommentDetails.classList.add('live-comment__details');

    const liveCommentRight = document.createElement('div');
    liveCommentRight.classList.add('live-comment__right');
    liveCommentRight.append(liveCommentName, liveCommentDate, liveCommentDetails);

    const liveComment = document.createElement('div');
    liveComment.classList.add('live-comment');
    liveComment.append(liveCommentAvatar, liveCommentRight);

    liveCommentName.innerText = comments.name;
    liveCommentDate.innerText = comments.date;
    liveCommentDetails.innerText = comments.comment;

    document.querySelector('.conversation__output').append(liveComment);
}

// Goes through Comment Array and creates comment cards that are appended in to HTML
comments.forEach(comment => displayComment(comment))
