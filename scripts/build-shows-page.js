createShowTabletHeaders = () => {
    const dateHeader = document.createElement('h4');
    dateHeader.classList.add('show__header--tablet','show__header--tablet-first');
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
    return [showContainer,showTitle];
}

createShowBlock = (show) => {
    const dateHeader = document.createElement('h4');
    dateHeader.classList.add('show__header');
    dateHeader.innerText = 'DATE';
    
    const dateInfo = document.createElement('h4');
    dateInfo.classList.add('show__details', 'show__details--strong');
    dateInfo.innerText = show.date;

    const venueHeader = document.createElement('h4');
    venueHeader.classList.add('show__header');
    venueHeader.innerText = 'VENUE';

    const venueInfo = document.createElement('h4');
    venueInfo.classList.add('show__details')
    venueInfo.innerText = show.venue;

    const locationHeader = document.createElement('h4');
    locationHeader.classList.add('show__header');
    locationHeader.innerText = 'LOCATION';

    const locationInfo = document.createElement('h4');
    locationInfo.classList.add('show__details')
    locationInfo.innerText = show.city;

    const button = document.createElement('button');
    button.classList.add('show__button');
    button.innerText = "BUY TICKETS";

    const container = document.createElement('div');
    container.classList.add('show__block');
    container.append(dateHeader, dateInfo, venueHeader, venueInfo, locationHeader, locationInfo, button);
    return container;
}

const tabletHeaders = createShowTabletHeaders();
//append tabletHeaders to shows-main__container
console.log(tabletHeaders)

const showStructure = createShowStructure();
showStructure[0].append(tabletHeaders);
console.log(showStructure[1]);

futureDates.forEach(show => {
    const newshow = createShowBlock(show);
    console.log(newshow)
    showStructure[0].append(newshow);
    console.log(showStructure[0])
});

const htmlContainer = document.getElementById('shows');
htmlContainer.append(showStructure[1], showStructure[0]);