// Function to populate HTML into live comment cards from an array database
// @parma comments is an array of objects that provide an avatar, name, date & comment details for each entry
displayComment = (comment) => {
   const avatar = document.createElement('div');
   avatar.classList.add('live-comment__avatar--blank');

   const name = document.createElement('h4');
   name.classList.add('live-comment__name');

   const date = document.createElement('h4');
   date.classList.add('live-comment__date');

   const details = document.createElement('p');
   details.classList.add('live-comment__details');

   const like = document.createElement('img');
   like.classList.add('live-comment__icon', 'live-comment__icon--like');
   like.id = comment.id;
   like.src = '/assets/icons/svg/icon-like.svg';
   like.alt = 'like icon';

   const likeCount = document.createElement('h5');
   likeCount.classList.add('live-comment__like-count');
   likeCount.id = comment.id;
   likeCount.innerText = comment.likes;

   const likeBlock = document.createElement('div');
   likeBlock.classList.add('live-comment__likes-container');
   likeBlock.append(likeCount, like);

   const cDelete = document.createElement('img');
   cDelete.classList.add('live-comment__icon', 'live-comment__icon--delete');
   cDelete.src = '/assets/icons/svg/icon-delete.svg';
   cDelete.id = comment.id;
   cDelete.alt = 'delete icon';

   const left = document.createElement('div');
   left.classList.add('live-comment__left');
   left.append(avatar, likeBlock, cDelete);

   const right = document.createElement('div');
   right.classList.add('live-comment__right');
   right.append(name, date, details);

   const liveComment = document.createElement('div');
   liveComment.classList.add('live-comment');
   liveComment.append(left, right);

   const timeDate = new Date(comment.timestamp);
   const timeDateString = `${timeDate.getMonth() + 1}/${timeDate.getDate()}/${timeDate.getFullYear()}`
   const relative = timeDifference(timeDate);

   name.innerText = comment.name;
   date.innerText = relative;
   details.innerText = comment.comment;

   document.querySelector('.conversation__output').append(liveComment);
}
//prepend new comment to top of comments
insertComment = (comment) => {
   const avatar = document.createElement('div');
   avatar.classList.add('live-comment__avatar--blank');

   const name = document.createElement('h4');
   name.classList.add('live-comment__name');

   const date = document.createElement('h4');
   date.classList.add('live-comment__date');

   const details = document.createElement('p');
   details.classList.add('live-comment__details');

   const like = document.createElement('img');
   like.classList.add('live-comment__icon', 'live-comment__icon--like');
   like.id = comment.id;
   like.src = '/assets/icons/svg/icon-like.svg';
   like.alt = 'like icon';

   const likeCount = document.createElement('h5');
   likeCount.classList.add('live-comment__like-count');
   likeCount.id = comment.id;
   likeCount.innerText = comment.likes;

   const likeBlock = document.createElement('div');
   likeBlock.classList.add('live-comment__likes-container');
   likeBlock.append(likeCount, like);

   const cDelete = document.createElement('img');
   cDelete.classList.add('live-comment__icon', 'live-comment__icon--delete');
   cDelete.src = '/assets/icons/svg/icon-delete.svg';
   cDelete.id = comment.id;
   cDelete.alt = 'delete icon';

   const left = document.createElement('div');
   left.classList.add('live-comment__left');
   left.append(avatar, likeBlock, cDelete);

   const right = document.createElement('div');
   right.classList.add('live-comment__right');
   right.append(name, date, details);

   const liveComment = document.createElement('div');
   liveComment.classList.add('live-comment');
   liveComment.append(left, right);

   const timeDate = new Date(comment.timestamp);
   const relative = timeDifference(timeDate);

   name.innerText = comment.name;
   date.innerText = relative;
   details.innerText = comment.comment;

   document.querySelector('.conversation__output').prepend(liveComment);
}
//provides a relative time difference from a time provided through the attributes
timeDifference = (previous) => {
   const current = new Date();
   const msPerMinute = 60 * 1000;
   const msPerHour = msPerMinute * 60;
   const msPerDay = msPerHour * 24;
   const msPerMonth = msPerDay * 30;
   const msPerYear = msPerDay * 365;

   const elapsed = current - previous;

   if (elapsed < msPerHour) {
      return Math.round(elapsed / msPerMinute) + 1 + ' minutes ago';
   }
   else if (elapsed < msPerDay) {
      return Math.round(elapsed / msPerHour) + ' hours ago';
   }
   else if (elapsed < msPerMonth) {
      return Math.round(elapsed / msPerDay) + ' days ago';
   }
   else if (elapsed < msPerYear) {
      return Math.round(elapsed / msPerMonth) - 1 + ' months ago';
   }
   else {
      return Math.round(elapsed / msPerYear) + ' years ago';
   }
}
//function to create an event listener for 'like' clicks. sends put to api and updates html element innerText to current count
listenForLikes = (button) => {
   button.addEventListener('click', (e) => {
      e.preventDefault();
      const addLike = axios.put(`${apiCommentsPage}${e.target.id}/like${apiKey}`);
      addLike
         .then(result => e.path[1].querySelector('.live-comment__like-count').innerText = result.data.likes)
         .catch(error => console.warn(error))
   })
}
//function creating event listener for 'delete' clicks. send delete method to api and update html to reflect new comment section
listenForTrash = (button) => {
   button.addEventListener('click', (e) => {
      e.preventDefault();
      const deleteComment = axios.delete(apiCommentsPage + e.target.id + apiKey);
      deleteComment
         .then(() => e.target.parentNode.parentNode.innerHTML = "")
         .catch(error => console.warn(error))
   })
}
// API requesting COMMENTS, sorts by timestamp
apiCallComments = () => {
   const apiCommentsObj = axios.get(apiCommentsPage + apiKey)
   apiCommentsObj.then((result) => {
      const sorted = result.data.sort((a, b) => (b.timestamp - a.timestamp));
      sorted.forEach(comment => displayComment(comment));
      const likeEl = document.querySelectorAll('.live-comment__icon--like');
      likeEl.forEach((el) => listenForLikes(el));

      const trashEl = document.querySelectorAll('.live-comment__icon--delete');
      trashEl.forEach((el) => listenForTrash(el));
   })
      .catch(error => {
         comments.forEach(comment => displayComment(comment));
         console.warn(error)
      })
}
// Delete old comments
clearComments = () => {
   document.getElementById('output').innerHTML = "";
}

apiCallComments();
// Event Listener for Form Submission
const newComment = document.getElementById('newComment');
newComment.addEventListener('submit', (e) => {
   e.preventDefault();
   const newName = e.target.userName.value;
   const newNameEl = e.target.userName;
   const newCommentValue = e.target.userComment.value;
   const newCommentEl = e.target.userComment;
   const timestamp = new Date();
   if (newName != "" && newCommentValue != "") {
      newNameEl.classList.remove('comment__form--error');
      newCommentEl.classList.remove('comment__form--error');

      const newCommentObject = {
         id: 01,
         timestamp: timestamp,
         name: newName,
         comment: newCommentValue
      };
      const apiCommentsPost = axios.post(apiCommentsPage + apiKey, {
         'name': newName,
         'comment': newCommentValue
      })
      apiCommentsPost.then(result => {
         clearComments();
         apiCallComments();

         const likeEl = document.querySelectorAll('.live-comment__icon--like');
         likeEl.forEach((el) => listenForLikes(el));

         const trashEl = document.querySelectorAll('.live-comment__icon--delete');
         trashEl.forEach((el, i, node) => listenForTrash(el));
      }).catch(error => {
         comments.unshift(newCommentObject);
         insertComment(newCommentObject);
         console.warn(error);
      })
      newComment.reset();
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