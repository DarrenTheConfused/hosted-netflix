import {
    configureStore, 
    createAsyncThunk, 
    createSlice
} from "@reduxjs/toolkit";
import {TMBD_BASE_URL, API_KEY} from "../utils/constant";


import axios from "axios";


const initialState = {
    movies: [],
    genresLoaded: false,
    genres: [],
};

export const getGenres = createAsyncThunk("netflix/genres", async()=> {
    const {
        data:{genres}
    } = await axios.get(`${TMBD_BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
    return genres
});

const createArrayFromRawData = (array, moviesArray, genres) => {
    array.forEach((movie) => {
        const movieGenres = [];
        movie.genre_ids.forEach((genre) => {
            const name = genres.find(({id})=> id === genre);
            if(name) movieGenres.push(name.name);
        });
        if(movie.backdrop_path) {
            moviesArray.push({
                id: movie.id,
                name: movie?.original_name ? movie.original_name : movie.original_title,
                image: movie.backdrop_path,
                genres: movieGenres.slice(0, 3),
            });
        }
    });
}

const getRawData = async(api, genres, paging) => {
    const moviesArray = [];
    for(let i = 1; moviesArray.length < 60 && i < 10; i++){
        const { data: {results} } = await axios.get(
            `${api}${paging ? `&page=${i}` : ""}`
        );
        createArrayFromRawData(results,moviesArray,genres);
    }
    return moviesArray;
};

export const fetchMovies = createAsyncThunk(
    "netflix/trending", 
    async({type}, thunkApi)=>{
        const {
            netflix:{genres},
        } = thunkApi.getState();
        return getRawData(
            `${TMBD_BASE_URL}/trending/${type}/week?api_key=${API_KEY}`,
            genres,
            true
        );  
    }
    
);

export const fetchDataByGenre = createAsyncThunk(
    "netflix/moviesByGenres", 
    async({genre, type}, thunkApi)=>{
        const {
            netflix:{genres},
        } = thunkApi.getState();
        const data = getRawData(
            `${TMBD_BASE_URL}/discover/${type}?api_key=${API_KEY}&with_genres=${genre}`,
            genres
        );
        console.log(data);
        return data;
    }
);
//POSSSIBLE ERRORRRR ^^^^^^^^^^^^^^^^^^^66

export const getUserLikedMovies = createAsyncThunk("netflix/getLiked", async (email)=> {
    const {
        data:{movies},
    } = await axios.get(`http://localhost:5000/api/user/liked/${email}`)
    return movies;
});

export const removeFromLikedMovies = createAsyncThunk(
    "netflix/deleteLiked", 
    async ({email, movieId})=> {
        const {
            data:{movies},
        } = await axios.put(`http://localhost:5000/api/user/delete`, {
            email, 
            movieId,
        });
        return movies;
    }
);





// return getRawData(`${TMBD_BASE_URL}/discover/${type}?api_key=${API_KEY}&with_genres=${genre}`)


const NetflixSlice = createSlice({
    name: "Netflix",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(getGenres.fulfilled, (state, action) => {
            state.genres = action.payload;
            state.genresLoaded= true;
        });
        builder.addCase(fetchMovies.fulfilled, (state, action) => {
            state.movies = action.payload;
        });
        builder.addCase(getUserLikedMovies.fulfilled, (state, action) => {
            state.movies = action.payload;
        });
        builder.addCase(removeFromLikedMovies.fulfilled, (state, action) => {
            state.movies = action.payload;
        });
    },
});

export const store = configureStore({
    reducer:{
        netflix: NetflixSlice.reducer,
    },
});