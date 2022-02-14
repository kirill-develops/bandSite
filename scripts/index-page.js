//function converts string date value to timestamp
convert2Timestamp = (myDate) => {
    myDate = myDate.split("/");
    var newDate = new Date(myDate[2], myDate[0], myDate[1]-1);
    return newDate;
}
// Event Listener for Form Submission
const newComment = document.getElementById('newComment');
newComment.addEventListener('submit', (e) => {
    e.preventDefault();
    const newName = event.target.userName.value;
    const newNameEl = event.target.userName;
    console.log(newName);
    const newCommentValue = event.target.userComment.value;
    const newCommentEl = event.target.userComment;
    console.log(newCommentValue);
    if (newName != "" && newCommentValue != "") {
        newNameEl.classList.remove('comment__form--error');
        newCommentEl.classList.remove('comment__form--error');
        const newCommentObject = {
            id: 01,
            date: todayString,
            name: newName,
            avatar: null,
            comment: newCommentValue
        };
        newComment.reset();
        comments.unshift(newCommentObject);
        updateComments(comments);
        console.log(comments);
    }
    else if (newName != "" && newCommentValue == "") {
        newNameEl.classList.remove('comment__form--error');
        newCommentEl.classList.add('comment__form--error');
    }
    else if (newName == "" && newCommentValue != "") {
        newNameEl.classList.add('comment__form--error');
        newCommentEl.classList.remove('comment__form--error');
    }
    else {
        newNameEl.classList.add('comment__form--error');
        newCommentEl.classList.add('comment__form--error');
    }
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
//function that converts new Date() into string
const commentTime = new Date();
const todayString = `${commentTime.getMonth()}/${commentTime.getDate() + 1}/${commentTime.getFullYear()}`;

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

    const timestamp = convert2Timestamp(comments.date);
    const relative = timeDifference(timestamp);

    liveCommentName.innerText = comments.name;
    liveCommentDate.innerText = relative;
    liveCommentDetails.innerText = comments.comment;

    document.querySelector('.conversation__output').append(liveComment);
}
// Goes through Comment Array and creates comment cards that are appended in to HTML
comments.forEach(comment => displayComment(comment))

//function returning string value of 
function timeDifference(previous) {
    
    const current = new Date();
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;

    const elapsed = current - previous;

    if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ' minutes ago';
    }
    else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + ' hours ago';
    }
    else if (elapsed < msPerMonth) {
        return Math.round(elapsed / msPerDay) + ' days ago';
    }
    else if (elapsed < msPerYear) {
        return Math.round(elapsed / msPerMonth) + ' months ago';
    }
    else {
        return Math.round(elapsed / msPerYear) + ' years ago';
    }
}

//event listener to convert timestamp to relative time DOSNT WORK
//only cycles options once, after the first time element, each element cycled through timestamp,relative,timestamp returns the first time element value cycled.
//ideally set it up so when you click one time, all of them change
//leaving, to play with for sprint 3
const timeEl = document.querySelectorAll('.live-comment__date');
timeEl.forEach((el, i) => {
    el.setAttribute('timeActive', 'false');
    const timestamp = convert2Timestamp(comments[i].date);
    const relative = timeDifference(timestamp);
    el.addEventListener('click', (e) => {
        if (e.target.attributes.timeActive.value == 'true') {
            el.innerText = `${relative}`;
            e.target.attributes.timeActive.value = 'false';
            return;
        } else if (e.target.attributes.timeActive.value == 'false') {
            el.innerText = `${comments[i].date}`;
            e.target.attributes.timeActive.value = 'true';
            return;
        }
    })
})
