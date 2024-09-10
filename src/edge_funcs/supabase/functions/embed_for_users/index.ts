// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const session = new Supabase.ai.Session('gte-small');

// Define a type for embeddings
type Embedding = number[];

Deno.serve(async (req) => {
  try {
    // Extract input array of strings from JSON body
    const { inputs }: { inputs: string[] } = await req.json();
    
    if (!Array.isArray(inputs) || inputs.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid input. Please provide an array of strings." }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate embeddings for each input string
    const embeddingsPromises = inputs.map(async (input) => {
      const result = await session.run(input, { mean_pool: true, normalize: true });
      return result as Embedding; // Explicitly type the result
    });
    const embeddings: Embedding[] = await Promise.all(embeddingsPromises);

    // Check if embeddings are of the same dimension
    const dimension = embeddings[0].length;
    const avgEmbedding: number[] = new Array(dimension).fill(0);

    embeddings.forEach(embedding => {
      for (let i = 0; i < dimension; i++) {
        avgEmbedding[i] += embedding[i];
      }
    });

    // Calculate the mean of the embeddings
    avgEmbedding.forEach((_value, index) => avgEmbedding[index] /= embeddings.length);

    // Return the average embedding
    return new Response(
      JSON.stringify({ averageEmbedding: avgEmbedding }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/embed_for_users' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
