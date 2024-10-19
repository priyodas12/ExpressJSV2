
import express from "express";
import path, { dirname } from 'path';
import { fileURLToPath } from "url";

const app = express();

const port = 12340;

//used in ES modules to retrieve the current module's filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//set up static folder
//app.use( express.static( path.join( __dirname, 'public' ) ) );

app.listen( port, () => console.log( `Express Server is up and running on ${ port }` ) );

app.get( "/api/v1/products", ( req, res ) =>
{
    res.send( { id: 100, name: "product test", price: 120.89 } )
} );

app.get( '/api/v1/products/about', ( req, res ) =>
{
	res.sendFile(path.join(__dirname,'public','about.html'));
});