// NEW COMMENT VARIABLES

let conversationAvatar = document.createElement('img');
conversationAvatar.classList.add('comment__avatar');
conversationAvatar.setAttribute('src', "../assets/images/Mohan-muruge.jpg")

let conversationName = document.createElement('label');
conversationName.classList.add('comment__header');
conversationName.setAttribute("for", "user-name");
conversationName.innerText = "NAME"
console.log(conversationName)

let conversationNameField = document.createElement('input');
conversationNameField.type = 'text'
conversationNameField.id = 'user-name'
conversationNameField.name = 'user-name'
conversationNameField.placeholder = 'Enter your name'
conversationNameField.classList.add('comment__form');
conversationNameField.classList.add('comment__form--name');

let conversationComment = document.createElement('label');
conversationComment.classList.add('comment__header');
conversationComment.setAttribute("for", "user-comment");
conversationComment.innerText = "COMMENT";

let conversationCommentField = document.createElement('input');
conversationCommentField.type = 'text'
conversationCommentField.id = 'user-comment'
conversationCommentField.name = 'user-comment'
conversationCommentField.placeholder = 'Add a new comment'
conversationCommentField.classList.add('comment__form');
conversationCommentField.classList.add('comment__form--comment');

// let conversationButtonText = document.createElement('h4');
// conversationButtonText.classList.add('connent__button--text');

let conversationButton = document.createElement('a');
conversationButton.classList.add('comment__button');
conversationButton.href = "/";
conversationButton.innerText = "COMMENT";

let conversationRight = document.createElement('form');
conversationRight.classList.add('comment__right');
conversationRight.append(conversationName, conversationNameField, conversationComment, conversationCommentField, conversationButton);

let conversationCard = document.createElement('div');
conversationCard.classList.add('comment__card');
conversationCard.append(conversationAvatar, conversationRight);

document.querySelector('.conversation__input').appendChild(conversationCard);

// LIVE COMMENTS VARRIABLES

displayComment = () => {
    let liveCommentAvatar = document.createElement('div');
    liveCommentAvatar.classList.add('live-comment__avatar--blank');

    let liveCommentName = document.createElement('h4');
    liveCommentName.classList.add('live-comment__name');

    let liveCommentDate = document.createElement('h4');
    liveCommentDate.classList.add('live-comment__date');

    let liveCommentDetails = document.createElement('p');
    liveCommentDetails.classList.add('live-comment__details');

    let liveCommentRight = document.createElement('div');
    liveCommentRight.classList.add('live-comment__right');
    liveCommentRight.append(liveCommentName, liveCommentDate, liveCommentDetails);

    let liveComment = document.createElement('div');
    liveComment.classList.add('live-comment');
    liveComment.append(liveCommentAvatar, liveCommentRight);
    console.log(liveComment);

    liveCommentName.innerText = comments[i].name;
    liveCommentDate.innerText = comments[i].date;
    liveCommentDetails.innerText = comments[i].comment;

    document.querySelector('.conversation__output').append(liveComment);
}

for (i = 0; i < comments.length; i++) {
    console.log(new Date(comments[i].date));
    displayComment(comments[i]);
};