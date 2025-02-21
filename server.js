import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util.js';



// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware for post requests
app.use(bodyParser.json());

// @TODO1 IMPLEMENT A RESTFUL ENDPOINT
// GET /filteredimage?image_url={{URL}}
app.get("/", async (_, res) => {
  res.send("try this path: /filteredimage?image_url={{}}")
});
// endpoint to filter an image from a public url.
// IT SHOULD
//    1
//    1. validate the image_url query
//    2. call filterImageFromURL(image_url) to filter the image
//    3. send the resulting file in the response
//    4. deletes any files on the server on finish of the response
app.get("/filteredimage", async (req, res) => {
  let { image_url } = req.query;
  //    1. validate the image_url query
  if (!image_url) {
    return res.status(400).send("This is not a valid image URL. Please provide a valid image URL.");
  }

  try {

    //    2. call filterImageFromURL(image_url) to filter the image
    const filtered_path = await filterImageFromURL(image_url);
    //    3. send the resulting file in the response
    res.status(200).sendFile(filtered_path, {}, async (err) => {
      if (err) {
        return res.status(422).send("Unable to process the image 1");
      }
      //    4. deletes any files on the server on finish of the response
      await deleteLocalFiles([filtered_path]);
    });
  } catch (err) {
    res.status(422).send(`${err} Unable to process the image 2`);
  }
});
// QUERY PARAMATERS
//    image_url: URL of a publicly accessible image
// RETURNS
//   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

/**************************************************************************** */

//! END @TODO1

// Root Endpoint
// Displays a simple message to the user
app.get("/", async (req, res) => {
  res.send("try GET /filteredimage?image_url={{}}")
});


// Start the Server
app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
  console.log(`press CTRL+C to stop server`);
});
