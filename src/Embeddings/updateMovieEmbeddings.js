import { generateEmbedding } from "./generateEmbeddings.js";
import { supabase } from "./supabase.js";

const getMovies = () => {
    return supabase.from('AllMoviesData').select("*").is('embedding', null)
}

const addMovieEmbedding = async (movie) => {

    if (movie.overview){
        const embedding = await generateEmbedding(movie.overview)
        await supabase.from('AllMoviesData').update({embedding}).eq('id', movie.id)
    }
}

const processAllMovies = async () => {
    const { data: movies } = await getMovies();
    console.log(movies.length)

    if (!movies?.length){
        return
    }

    await Promise.all(movies.map(addMovieEmbedding));
    processAllMovies();
}

processAllMovies();