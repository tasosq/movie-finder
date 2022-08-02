$(document).ready(function() {

    var debounceTimeout = null

    $('#searchInput').on('input', function() {
        clearTimeout(debounceTimeout)
        debounceTimeout = setTimeout(() => getMovieByTitle(this.value.trim()), 1500)
        
    })

    $('.random').on('click', function() {
        getRandomMovie()
    })
})

function getMovieByTitle(title) {
    if (!title) {
        return
    }

    clearPrevious()
    fetchMoviePoster(title)
}



function fetchMoviePoster(title) {
    let request = new XMLHttpRequest()

    request.open("GET", `https://www.omdbapi.com/?t=${title}&apikey=a8647431`, true)

    request.timeout = 5000
        request.ontimeout = (e) => onApiError()

    request.onreadystatechange = function() {
        if (request.readyState == 4) {
            if (request.status == 200) {
                handleResults(JSON.parse(request.responseText))
            }
            else {
                onApiError()
            }
        }
    }

    request.send()
}

function handleResults(response) {
    if (response.Response == "True") {
        if (response.Poster) {
            buildPoster(response.Poster, response.Plot, response.imdbRating, response.Title)
        }
    } else if (response.Response == "False") {
        notFound()
    }

    
}

function buildPoster(moviePoster, moviePlot, imdbRating, title) {
    
    $(`<img class = "img" src = ${moviePoster}> </img>`).appendTo($(".poster"))
    
    $('.img').on("click", function() {
        
        $('<div class = "review"></div>').appendTo($(".poster"))
        $(`<p class = "title" >${title}</p>`).appendTo($(".review"))
        $(`<p class = "plot" >${moviePlot}</p>`).appendTo($(".review"))
        $(`<p class = "imdbRating" >IMDB Rating: ${imdbRating}</p>`).appendTo($(".review"))
        $('.img').on("click", function() {
            $('.review').empty()
            $('.img').on("click", function(){
                clearPrevious()
            })
            
        })
    
    }
)}

function notFound() {
    clearPrevious()
    $(`<div class = "not-found">Your search criteria don't match any movie.</div>`).appendTo($('body'))
}

function clearPrevious() {
    $(".poster").empty()
    $(".not-found").remove()
}
/**
 * Pseudo-random επιλογέας ταινίας, παίρνοντας random τα 4 τελευταία ψηφία του ID . Ήθελα να πειραματιστώ
 */
let random3DigitNum = Math.floor(Math.random()*999)


function getRandomMovie() {
    let request = new XMLHttpRequest()
    request.open("GET", `https://www.omdbapi.com/?i=tt0034${random3DigitNum}&apikey=a8647431`, true)
    random3DigitNum = Math.floor(Math.random()*999)
    randomPrefix = Math.floor(Math.random()*5)
    clearPrevious()
    request.onreadystatechange = function() {
        if (request.readyState == 4) {
            if (request.status == 200) {
                handleResults(JSON.parse(request.responseText))
            }
            else {
                onApiError()
            }
        }
    }
    clearPrevious()
    request.send()
}

function onApiError() {
    console.log("API Error")
}