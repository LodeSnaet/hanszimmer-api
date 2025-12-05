// import dotenv from 'dotenv';
//
// dotenv.config();
//
// export const fetchTidalAlbums = async (movieTitle ,countryCode) => {
//     const response = await fetch(`https://openapi.tidal.com/v2/artists/12979?countryCode=${countryCode}&include=albums&&page[cursor]=3nI1Esi`, {
//         headers: {
//             Authorization: `Bearer ${process.env.TIDAL_ACCESS_TOKEN}`,
//             accept: "application/vnd.api+json"
//         }
//     });
//
//     if (!response.ok) {
//         throw new Error(`TIDAL API request failed: ${response.status}`);
//     }
//
//     const data = await response.json();
//
//     const albumTitle = data.included.filter(album => album.attributes.title.includes(movieTitle));
//
//     return await albumTitle;
// };
//

import dotenv from 'dotenv';

dotenv.config();

const TITLE_TEMPLATES_TO_REMOVE = [
    '(original motion picture soundtrack)',
    '(music from the motion picture)',
    'original score',
    '(music from the original motion picture)',
];

const cleanTitle = (title) => {
    let cleanedTitle = title.toLowerCase();

    for (const template of TITLE_TEMPLATES_TO_REMOVE) {
        const escapedTemplate = template.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedTemplate, 'g');
        cleanedTitle = cleanedTitle.replace(regex, '');
    }

    cleanedTitle = cleanedTitle.replace(/[:—–-]/g, ' ');
    cleanedTitle = cleanedTitle.replace(/\s+/g, ' ').trim();

    return cleanedTitle;
};

export const fetchTidalAlbums = async (movieTitle, countryCode) => {
    const response = await fetch(`https://openapi.tidal.com/v2/artists/12979?countryCode=${countryCode}&include=albums&&page[cursor]=3nI1Esi`, {
        headers: {
            Authorization: `Bearer ${process.env.TIDAL_ACCESS_TOKEN}`,
            accept: "application/vnd.api+json"
        }
    });

    if (!response.ok) {
        throw new Error(`TIDAL API request failed: ${response.status}`);
    }

    const data = await response.json();


    const cleanedMovieTitle = cleanTitle(movieTitle);
    console.log(`Searching for cleaned Movie Title: ${cleanedMovieTitle}`);

    const albumTitle = data.included.filter(album => {
        const cleanedAlbumTitle = cleanTitle(album.attributes.title);
        const isMatch = cleanedAlbumTitle.includes(cleanedMovieTitle);

        console.log(`tidalTitle = ${cleanedAlbumTitle} | MovieTitle = ${cleanedMovieTitle} : ${isMatch}`);

        return isMatch;
    });

    return albumTitle;
};
