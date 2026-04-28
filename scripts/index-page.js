// Function to populate HTML into live comment cards from an array database
// @parma comments is an array of objects that provide an avatar, name, date & comment details for each entry
const commentsOutput = document.querySelector('.conversation__output');
let generatedCommentId = 0;

getLikeCount = (likes) => {
   const parsedLikes = Number(likes);
   if (Number.isNaN(parsedLikes)) {
      return 0;
   }
   return parsedLikes;
}

getCommentId = (comment) => {
   if (comment.id === undefined || comment.id === null || comment.id === '') {
      generatedCommentId += 1;
      comment.id = `local-${generatedCommentId}`;
   }
   return String(comment.id);
}

isLocalCommentId = (commentId) => String(commentId).startsWith('local-');

findCommentInLocalStore = (commentId) =>
   comments.find((comment) => String(comment.id) === String(commentId));

updateLocalCommentLikes = (commentId) => {
   const localComment = findCommentInLocalStore(commentId);
   if (!localComment) {
      return null;
   }
   localComment.likes = getLikeCount(localComment.likes) + 1;
   return localComment.likes;
}

removeLocalComment = (commentId) => {
   const index = comments.findIndex((comment) => String(comment.id) === String(commentId));
   if (index === -1) {
      return false;
   }
   comments.splice(index, 1);
   return true;
}

createAvatar = (comment) => {
   if (comment.avatar) {
      const avatar = document.createElement('img');
      avatar.classList.add('live-comment__avatar');
      avatar.src = comment.avatar;
      avatar.alt = `${comment.name || 'Commenter'} avatar`;
      avatar.loading = 'lazy';
      return avatar;
   }

   const avatar = document.createElement('div');
   avatar.classList.add('live-comment__avatar--blank');
   return avatar;
}

createCommentText = (tag, className, text = '') => {
   const element = document.createElement(tag);
   element.classList.add(className);
   element.innerText = text;
   return element;
}

createCommentCard = (comment) => {
   const commentId = getCommentId(comment);
   const avatar = createAvatar(comment);

   const name = createCommentText('h4', 'live-comment__name');
   const date = createCommentText('h4', 'live-comment__date');
   const details = createCommentText('p', 'live-comment__details');

   const like = document.createElement('img');
   like.classList.add('live-comment__icon', 'live-comment__icon--like');
   like.id = commentId;
   like.src = './assets/icons/svg/icon-like.svg';
   like.alt = 'like icon';

   const likeCount = document.createElement('h5');
   likeCount.classList.add('live-comment__like-count');
   likeCount.id = commentId;
   likeCount.innerText = getLikeCount(comment.likes);

   const likeBlock = document.createElement('div');
   likeBlock.classList.add('live-comment__likes-container');
   likeBlock.append(likeCount, like);

   const cDelete = document.createElement('img');
   cDelete.classList.add('live-comment__icon', 'live-comment__icon--delete');
   cDelete.src = './assets/icons/svg/icon-delete.svg';
   cDelete.id = commentId;
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

   return liveComment;
}

renderComment = (comment, position = 'append') => {
   const liveComment = createCommentCard(comment);
   if (position === 'prepend') {
      commentsOutput.prepend(liveComment);
   }
   else {
      commentsOutput.append(liveComment);
   }
   attachCommentActionListeners(liveComment);
}

displayComment = (comment) => {
   renderComment(comment, 'append');
}
//prepend new comment to top of comments
insertComment = (comment) => {
   renderComment(comment, 'prepend');
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

updateCommentLikeCounter = (button, likes) => {
   const likesContainer = button.parentNode;
   const likeCounter = likesContainer.querySelector('.live-comment__like-count');
   likeCounter.innerText = getLikeCount(likes);
}

removeCommentElement = (button) => {
   const commentCard = button.closest('.live-comment');
   if (commentCard) {
      commentCard.remove();
   }
}
//function to create an event listener for 'like' clicks. sends put to api and updates html element innerText to current count
listenForLikes = (button) => {
   button.addEventListener('click', (e) => {
      e.preventDefault();
      const commentId = button.id;
      if (isLocalCommentId(commentId)) {
         const updatedLikes = updateLocalCommentLikes(commentId);
         updateCommentLikeCounter(button, updatedLikes);
         return;
      }

      const addLike = axios.put(`${apiCommentsPage}${commentId}/like${apiKey}`);
      addLike
         .then(result => {
            updateCommentLikeCounter(button, result.data.likes);
         })
         .catch(error => {
            const updatedLikes = updateLocalCommentLikes(commentId);
            if (updatedLikes !== null) {
               updateCommentLikeCounter(button, updatedLikes);
            }
            else {
               const likesContainer = button.parentNode;
               const likeCounter = likesContainer.querySelector('.live-comment__like-count');
               const optimisticLikeValue = getLikeCount(likeCounter.innerText) + 1;
               updateCommentLikeCounter(button, optimisticLikeValue);
            }
            console.warn(error)
         })
   })
}
//function creating event listener for 'delete' clicks. send delete method to api and update html to reflect new comment section
listenForTrash = (button) => {
   button.addEventListener('click', (e) => {
      e.preventDefault();
      const commentId = button.id;
      if (isLocalCommentId(commentId)) {
         removeLocalComment(commentId);
         removeCommentElement(button);
         return;
      }

      const deleteComment = axios.delete(apiCommentsPage + commentId + apiKey);
      deleteComment
         .then(() => {
            removeLocalComment(commentId);
            removeCommentElement(button);
         })
         .catch(error => {
            removeLocalComment(commentId);
            removeCommentElement(button);
            console.warn(error)
         })
   })
}

attachCommentActionListeners = (root = document) => {
   const likeEl = root.querySelectorAll('.live-comment__icon--like');
   likeEl.forEach((el) => listenForLikes(el));

   const trashEl = root.querySelectorAll('.live-comment__icon--delete');
   trashEl.forEach((el) => listenForTrash(el));
}

renderCommentList = (commentList) => {
   commentList.forEach(comment => displayComment(comment));
}
// API requesting COMMENTS, sorts by timestamp
apiCallComments = () => {
   const apiCommentsObj = axios.get(apiCommentsPage + apiKey)
   apiCommentsObj.then((result) => {
      clearComments();
      const sorted = result.data.sort((a, b) => (b.timestamp - a.timestamp));
      renderCommentList(sorted);
   })
      .catch(error => {
         clearComments();
         renderCommentList(comments);
         console.warn(error)
      })
}
// Delete old comments
clearComments = () => {
   document.getElementById('output').innerHTML = "";
}

setFieldErrorState = (fieldEl, hasError) => {
   fieldEl.classList.toggle('comment__form--error', hasError);
}

validateNewComment = (nameValue, commentValue) => {
   const hasName = nameValue !== "";
   const hasComment = commentValue !== "";
   return {
      hasName,
      hasComment,
      isValid: hasName && hasComment
   };
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
   const validation = validateNewComment(newName, newCommentValue);
   setFieldErrorState(newNameEl, !validation.hasName);
   setFieldErrorState(newCommentEl, !validation.hasComment);

   if (validation.isValid) {

      const newCommentObject = {
         id: '',
         timestamp: timestamp,
         name: newName,
         comment: newCommentValue,
         likes: 0
      };
      const apiCommentsPost = axios.post(apiCommentsPage + apiKey, {
         'name': newName,
         'comment': newCommentValue
      })
      apiCommentsPost.then(result => {
         clearComments();
         apiCallComments();
      }).catch(error => {
         comments.unshift(newCommentObject);
         insertComment(newCommentObject);
         console.warn(error);
      })
      newComment.reset();
   }
})
