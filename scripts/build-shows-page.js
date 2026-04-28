createShowTabletHeaders = () => {
   const dateHeader = document.createElement('h4');
   dateHeader.classList.add('show__header--tablet', 'show__header--tablet-first');
   dateHeader.innerText = 'DATE';

   const venueHeader = document.createElement('h4');
   venueHeader.classList.add('show__header--tablet');
   venueHeader.innerText = 'VENUE';

   const locationHeader = document.createElement('h4');
   locationHeader.classList.add('show__header--tablet');
   locationHeader.innerText = 'LOCATION';

   const spaceHolder = document.createElement('div');
   spaceHolder.classList.add('show__tablet-display-holder');

   const tabletBlock = document.createElement('div');
   tabletBlock.classList.add('show__block--tablet');
   tabletBlock.append(dateHeader, venueHeader, locationHeader, spaceHolder);
   return tabletBlock;
}
createShowStructure = () => {
   const showContainer = document.createElement('div');
   showContainer.classList.add('shows-main__container');

   const showTitle = document.createElement('h2');
   showTitle.classList.add('shows-main__title');
   showTitle.innerText = 'Shows';

   showContainer.appendChild(showTitle);
   return [showContainer, showTitle];
}

getShowVenue = (show) => show.place || show.venue || '';

getShowLocation = (show) => show.location || show.city || '';

formatShowDate = (dateValue) => {
   const parsed = new Date(Number(dateValue));
   if (Number.isNaN(parsed.getTime())) {
      return dateValue;
   }
   return parsed.toDateString();
}

createShowField = (label, value, isStrong = false) => {
   const header = document.createElement('h4');
   header.classList.add('show__header');
   header.innerText = label;

   const details = document.createElement('h4');
   details.classList.add('show__details');
   if (isStrong) {
      details.classList.add('show__details--strong');
   }
   details.innerText = value;

   return [header, details];
}

createShowBlock = (show) => {
   const dateValue = formatShowDate(show.date);
   const venueValue = getShowVenue(show);
   const locationValue = getShowLocation(show);

   const [dateHeader, dateInfo] = createShowField('DATE', dateValue, true);
   const [venueHeader, venueInfo] = createShowField('VENUE', venueValue);
   const [locationHeader, locationInfo] = createShowField('LOCATION', locationValue);

   const button = document.createElement('button');
   button.classList.add('show__button');
   button.innerText = "BUY TICKETS";

   const container = document.createElement('div');
   container.classList.add('show__block');
   container.append(dateHeader, dateInfo, venueHeader, venueInfo, locationHeader, locationInfo, button);
   return container;
}

renderShowList = (showsList) => {
   showsList.forEach(show => {
      const newShow = createShowBlock(show);
      showEl[0].append(newShow);
   });
   activeRowListener();
}

clearShows = () => {
   const rows = showEl[0].querySelectorAll('.show__block');
   rows.forEach((row) => row.remove());
}

// event listener to apply active row class on click
activeRowListener = () => {
   const rowsArray = document.querySelectorAll('.show__block');
   let currentRow = null;
   rowsArray.forEach(row => {
      row.addEventListener('click', () => {
         if (currentRow !== null) {
            currentRow.classList.remove('show__block--active')
         }
         row.classList.add('show__block--active');
         currentRow = row;
      })
   })
}

const tabletHeaders = createShowTabletHeaders();

const showEl = createShowStructure();
showEl[0].append(tabletHeaders);

const apiShowObj = axios.get(apiShowPage + apiKey);
apiShowObj.then(result => {
   clearShows();
   renderShowList(result.data);
})
   .catch(error => {
      console.log(error)
      //use exsisting database
      clearShows();
      renderShowList(futureDates);
   });
//attach shows to HTML through DOM
const htmlContainer = document.getElementById('shows');
htmlContainer.append(showEl[1], showEl[0]);
