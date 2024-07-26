/* eslint-disable no-undef */
if (navigator.share) { 
    let url = document.location.href; 
    const canonicalElement = document.querySelector('link[rel=canonical]'); 
    if (canonicalElement !== null) { 
    url = canonicalElement.href; 
    } 
    navigator.share({ 
    title: 'Codica', 
    text: 'Codica', 
    url 
    }) 
    .then(() => console.log('Successful sharing the content')) 
    .catch((error) => console.log('Error sharing', error)); 
    } 

    if (navigator.canShare && navigator.canShare({ files: filesArray })) { 
        navigator.share({ 
         files: filesArray, 
        title: 'Codica Team Pictures', 
        text: 'Photos from March 18 to September 19.', 
        }) 
        .then(() => console.log('Share was successful of the files.')) 
        .catch((error) => console.log('Sharing failed', error)); 
        } else { 
        console.log(`Your system doesn't support sharing of the files.`); 
        } 