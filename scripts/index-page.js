//function converts string date value to timestamp
convert2Timestamp = (myDate) => {
    myDate = myDate.split("/");
    var newDate = new Date(myDate[2], myDate[0], myDate[1]-1);
    return newDate;
}


//Function that erases all old comments
removeAllChildren = () => {
    const liveComments = document.getElementById('output');
    while (liveComments.firstChild) {
        liveComments.removeChild(liveComments.firstChild);
    }
}

//Function to update Live Comments
updateComments = (comments) => {
    removeAllChildren();
    comments.forEach(comment => displayComment(comment));
}

//function that converts new Date() into string
getTime = () => {
    const commentTime = new Date();
    // const todayString = `${commentTime.getMonth()}/${commentTime.getDate() + 1}/${commentTime.getFullYear()}`;
    return commentTime;
}

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

    const timeDate = new Date(comments.timestamp);
    const relative = timeDifference(timeDate);

    liveCommentName.innerText = comments.name;
    liveCommentDate.innerText = `${timeDate.getMonth()+1}/${timeDate.getDate()}/${timeDate.getFullYear()}`;
    liveCommentDetails.innerText = comments.comment;

    document.querySelector('.conversation__output').append(liveComment);
}

// Goes through Comment Array and creates comment cards that are appended in to HTML
const apiCommentsObj = axios.get(apiCommentsPage + apiKey)
apiCommentsObj.then(result => {
        result.data.forEach(comment => displayComment(comment));
})
    .catch(error => {
        comments.forEach(comment => displayComment(comment));
    })

//provides a relative time difference from a time provided through the attributes
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
// Event Listener for Form Submission
const newComment = document.getElementById('newComment');
newComment.addEventListener('submit', (e) => {
    e.preventDefault();
    const newName = event.target.userName.value;
    const newNameEl = event.target.userName;
    const newCommentValue = event.target.userComment.value;
    const newCommentEl = event.target.userComment;
    const timestamp = getTime();
    if (newName != "" && newCommentValue != "") {
        newNameEl.classList.remove('comment__form--error');
        newCommentEl.classList.remove('comment__form--error');
        const newCommentObject = {
            id: 01,
            timestamp: timestamp,
            name: newName,
            comment: newCommentValue
        };
        newComment.reset();
        const apiCommentsPost = axios.post(apiCommentsPage + apiKey)
        apiCommentsPost.then(result => {
            console.log(result)
        }).catch(error => {
            comments.unshift(newCommentObject);
            updateComments(comments);
            console.log(comments);
        })
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
//event listener to convert timestamp to relative time
const timeEl = document.querySelectorAll('.live-comment__date');
timeEl.forEach((el, i, node) => {
    el.setAttribute('timeActive', 'false');
    arrayIndex = Array.prototype.slice.call(node);
    el.addEventListener('click', (e) => {
        if (e.target.attributes.timeActive.value == 'true') {
            node.forEach(item => {
                arrayIndexItem = arrayIndex.indexOf(item);
                timestamp = convert2Timestamp(comments[arrayIndexItem].date);
                relative = timeDifference(timestamp);
                item.innerText = `${relative}`;
                item.attributes.timeActive.value = 'false';
            })
            // el.innerText = `${relative}`;
            // e.target.attributes.timeActive.value = 'false';
            return;
        } else if (e.target.attributes.timeActive.value == 'false') {
            node.forEach(item => {
                // arrayIndex = Array.prototype.slice.call(node);
                arrayIndexItem = arrayIndex.indexOf(item);
                item.innerText = `${comments[arrayIndexItem].date}`;
                item.attributes.timeActive.value = 'true';
            })
            // el.innerText = `${comments[i].date}`;
            // e.target.attributes.timeActive.value = 'true';
            return;
        }
    })
})

