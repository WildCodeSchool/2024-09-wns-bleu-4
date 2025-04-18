import "dotenv/config.js";
import app from './app';

app.listen(3000, () => {
    console.log(`Serveur lancé sur http://localhost:3000`);
});
